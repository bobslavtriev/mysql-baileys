import { createConnection } from 'mysql2/promise'
import { proto } from '@whiskeysockets/baileys'
import { BufferJSON, initAuthCreds } from '../Utils'
import { MySQLConfig, sqlData, sqlConnection, AuthenticationCreds } from '../Types'

/**
 * Stores the full authentication state in mysql
 * Far more efficient than file
 * @param {string} host - MySql host, by default localhost
 * @param {string} user - MySql user, by default root
 * @param {string} password - MySql password
 * @param {string} database - MySql database name
 * @param {string} session - Session name to identify the connection, allowing multisessions with mysql
 */

let conn: sqlConnection

async function connection(config: MySQLConfig, force: true | false = false){
	const ended = !!conn?.connection?._closing
	const newConnection = conn === undefined

	if (newConnection || ended || force){
		conn = await createConnection({
			host: config?.host || 'localhost',
			user: config?.user || 'root',
			password: config?.password || 'Password123#',
			database: config?.database || 'base'
		}).catch((e) => {
			throw e
		})

		if (newConnection) {
			await conn.execute('CREATE TABLE IF NOT EXISTS `auth` (`session` varchar(50) NOT NULL, `id` varchar(70) NOT NULL, `value` json DEFAULT NULL, UNIQUE KEY `idxunique` (`session`,`id`), KEY `idxsession` (`session`), KEY `idxid` (`id`)) ENGINE=MyISAM;')

			setInterval(async () => {
				if (!conn?.connection?._closing){
					await conn.ping()
				}
			}, 60_000)
		}
	}

	return conn
}

export const useMySQLAuthState = async(config: MySQLConfig): Promise<{ state: object, saveCreds: () => Promise<void>, removeCreds: () => Promise<void> }> => {
	if (typeof config.session !== 'string'){
		throw new Error('Session name must be a string')
	}

	let sqlConn = await connection(config)

	const session = config?.session

	const query = async (sql: string, values: Array<string>) => {
		await sqlConn.ping().catch(async () => {
			sqlConn = await connection(config, true)
		})
		const [rows] = await sqlConn.query(sql, values)
		return rows as sqlData
	}

	const readData = async (id: string) => {
		const data = await query(`SELECT value FROM auth WHERE id = ? AND session = ?`, [id, session])
		if(!data[0]?.value){
			return null
		}
		const creds = JSON.stringify(data[0].value)
		const credsParsed = JSON.parse(creds, BufferJSON.reviver)
		return credsParsed
	}

	const writeData = async (id: string, value: object) => {
		const valueFixed = JSON.stringify(value, BufferJSON.replacer)
		await query(`INSERT INTO auth (value, id, session) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = ?`, [valueFixed, id, session, valueFixed])
	}

	const removeData = async (id: string) => {
		await query(`DELETE FROM auth WHERE id = ? AND session = ?`, [id, session])
	}

	const removeAll = async () => {
		await query(`DELETE FROM auth WHERE session = ?`, [session])
	}

	const creds: AuthenticationCreds = await readData('creds') || initAuthCreds()

	return {
		state: {
			creds,
			keys: {
				get: async (type: string, ids: Array<string>) => {
					const data = { }
					for(const id of ids){
						let value = await readData(`${type}-${id}`)
						if(type === 'app-state-sync-key' && value) {
							value = proto.Message.AppStateSyncKeyData.fromObject(value)
						}
						data[id] = value
					}
					return data
				},
				set: async (data: Array<object>) => {
					for(const category in data) {
						for(const id in data[category]) {
							const value = data[category][id];
							const name = `${category}-${id}`
							if (value){
								await writeData(name, value)
							} else {
								await removeData(name)
							}
						}
					}
				}
			}
		},
		saveCreds: async () => {
			await writeData('creds', creds)
		},
		removeCreds: async () => {
			await removeAll()
		}
	}
}
