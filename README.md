# Authentication with MySQL for Baileys

### Usage
1. Create table in MySQL
```sql
CREATE TABLE `auth` (
	`session` varchar(50) NOT NULL,
	`id` varchar(100) NOT NULL,
	`value` json DEFAULT NULL,
	UNIQUE KEY `idxunique` (`session`,`id`),
	KEY `idxsession` (`session`),
	KEY `idxid` (`id`)
) ENGINE=MyISAM
```

2. Install auth-mysql
```
npm i auth-mysql
```

2. Import code
```ts
const { useMySQLAuthState } = require('auth-mysql')
```

3. Implement code
```ts
const { state, saveCreds, removeCreds } = await useMySQLAuthState({
	session: sessionName || '1',
	host: 'localhost',
	user: 'root',
	password: 'Password123#',
	database: 'auth'
})
```

# Complete code for use
```ts
const {
	makeWASocket,
	makeCacheableSignalKeyStore,
	isJidBroadcast,
	fetchLatestBaileysVersion,
	DisconnectReason
} = require('@whiskeysockets/Baileys')
const { useMySQLAuthState } = require('auth-mysql')
const pino = require('pino')

const logger = pino({
	level: 40
})

async function startSock(sessionName){
	const { version, error, isLatest } = await fetchLatestBaileysVersion()

	//This is important, so as not to try to create a MySQL connection with unstable internet or without internet, otherwise it gives the error: "Many connections"
	if (error){
		connectToWhatsApp(sessionName)
		return
	}

	const { state, saveCreds, removeCreds } = await useMySQLAuthState({
		session: sessionName || '1',
		host: 'localhost',
		user: 'root',
		password: 'Password123#',
		database: 'auth'
	})

	const sock = makeWASocket({
		auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys, logger),
		},
		browser: ['Windows', 'DESKTOP', '2.2344.5.0'],
		version: version,
		qrTimeout: 45_000,
		defaultQueryTimeoutMs: undefined, // important
		markOnlineOnConnect: true,
		logger: logger,
		shouldIgnoreJid: (jid) => {
			return !jid || isJidBroadcast(jid)
		}
	})

	sock.ev.on('creds.update', saveCreds)

	sock.ev.on('connection.update', async({ connection, lastDisconnect }) => {
		const status = lastDisconnect?.error?.output?.statusCode

		if (connection === 'close'){
			const reason = Object.entries(DisconnectReason).find(i => i[1] === status)?.[0] || 'unknown'

			console.log(`Closed connection, status: ${reason} (${status})`)

			if (status === 403 || status === 401){
				sock = null
				removeCreds()
			} else {
				startSock(session)
			}
		} else if (connection === 'open'){
			console.log(`WhatsApp on-line!`)
		}
	})

	sock.ev.on('messages.upsert', async({ messages, type }) => {
		// your code here
	})
}

startSock('session1')
```

### If you want to start other sessions in the same code, use this:
```ts
startSock('session1')
startSock('session2')
startSock('session3')
startSock('session4')
```
