import { createConnection } from 'mysql2/promise'
import { proto } from '@whiskeysockets/baileys'
import { BufferJSON, initAuthCreds } from '../Utils'
import { MySQLConfig, sqlData, sqlConnection, AuthenticationCreds, AuthenticationState } from '../Types'

/**
 * Stores the full authentication state in mysql
 * Far more efficient than file
 * @param {string} host - MySql host, by default localhost
 * @param {string} port - MySql port, by default 3306
 * @param {string} user - MySql user, by default root
 * @param {string} password - MySql password
 * @param {string} database - MySql database name
 * @param {string} tableName - MySql table name, by default auth
 * @param {string} keepAliveIntervalMs - Always keep active, by default 30s
 * @param {string} retryRequestDelayMs - Retry the query at each interval if it fails, by default 200ms
 * @param {string} maxtRetries - Maximum attempts if the query fails, by default 10
 * @param {string} session - Session name to identify the connection, allowing multisessions with mysql
 */

let conn: sqlConnection
let pending: boolean | undefined
let taskKeepAlive: NodeJS.Timeout | undefined
const DEFAULT_TABLE_NAME = 'auth';

async function connection(config: MySQLConfig, force: true | false = false){
	const ended = !!conn?.connection?._closing
	const newConnection = conn === undefined
	const tableName = config?.tableName || DEFAULT_TABLE_NAME

	if (newConnection || ended || force){
		pending = true

		conn = await createConnection({
			host: config?.host || 'localhost',
			port: config?.port || 3306,
			user: config?.user || 'root',
			password: config.password || 'Password123#',
			database: config.database || 'base',
			ssl: config?.ssl
		}).catch((e) => {
			throw e
		})

		if (newConnection) {
			await conn.execute('CREATE TABLE IF NOT EXISTS `' + tableName + '` (`session` varchar(50) NOT NULL, `id` varchar(70) NOT NULL, `value` json DEFAULT NULL, UNIQUE KEY `idxunique` (`session`,`id`), KEY `idxsession` (`session`), KEY `idxid` (`id`)) ENGINE=MyISAM;')
		}

		pending = false
	}

	return conn
}

export const useMySQLAuthState = async(config: MySQLConfig): Promise<{ state: AuthenticationState, saveCreds: () => Promise<void>, clear: () => Promise<void>, removeCreds: () => Promise<void> }> => {
	if (typeof config?.session !== 'string'){
		throw new Error('session name must be a string')
	}

	let sqlConn = await connection(config)

	const keepAliveIntervalMs = config?.keepAliveIntervalMs || 30_000
	const retryRequestDelayMs = config?.retryRequestDelayMs || 200
	const maxtRetries = config?.maxtRetries || 10

	const reconnect = async () => {
		if (!pending){
			sqlConn = await connection(config, true)
		}
	}

	if (taskKeepAlive){
		clearInterval(taskKeepAlive)
	}

	taskKeepAlive = setInterval(async () => {
		await conn.ping().catch(async () => await reconnect())
		if (conn?.connection?._closing){
			await reconnect()
		}
	}, keepAliveIntervalMs)

	const session = config.session

	const tableName = config?.tableName || DEFAULT_TABLE_NAME

	const query = async (sql: string, values: Array<string>) => {
		for (let x = 0; x < maxtRetries; x++){
			try {
				const [rows] = await sqlConn.query(sql, values)
				return rows as sqlData
			} catch(e){
				await new Promise(r => setTimeout(r, retryRequestDelayMs))
			}
		}
		return [] as sqlData 
	}

	const readData = async (id: string) => {
		const data = await query(`SELECT value FROM ${tableName} WHERE id = ? AND session = ?`, [id, session])
		if(!data[0]?.value){
			return null
		}
		const creds = typeof data[0].value === 'object' ? JSON.stringify(data[0].value) : data[0].value
		const credsParsed = JSON.parse(creds, BufferJSON.reviver)
		return credsParsed
	}

	const writeData = async (id: string, value: object) => {
		const valueFixed = JSON.stringify(value, BufferJSON.replacer)
		await query(`INSERT INTO ${tableName} (value, id, session) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = ?`, [valueFixed, id, session, valueFixed])
	}

	const removeData = async (id: string) => {
		await query(`DELETE FROM ${tableName} WHERE id = ? AND session = ?`, [id, session])
	}

	const clearAll = async () => {
		await query(`DELETE FROM ${tableName} WHERE id != 'creds' AND session = ?`, [session])
	}

	const removeAll = async () => {
		await query(`DELETE FROM ${tableName} WHERE session = ?`, [session])
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
		clear: async () => {
			await clearAll()
		},
		removeCreds: async () => {
			await removeAll()
		}
	}
}
