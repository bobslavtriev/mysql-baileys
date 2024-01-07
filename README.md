# Authentication with MySQL for Baileys

## Usage
### 1. Create table in MySQL (optional)
If you want with your specifications, if you don't create it, the code will automatically create
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

### 2. Install mysql-baileys
Edge version:
```
npm i github:bobslavtriev/mysql-baileys
```

### 3. Import code
```ts
const { useMySQLAuthState } = require('mysql-baileys')
```

### 4. Implement code
```ts
const { state, saveCreds, removeCreds } = await useMySQLAuthState({
	session: sessionName, // required
	host: 'localhost', // optional
	user: 'root', // optional
	password: 'Password123#', // required
	database: 'baileys' // required
})
```

# Complete code for use
```ts
const { makeWASocket, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = require('@whiskeysockets/Baileys')
const { useMySQLAuthState } = require('mysql-baileys')

async function startSock(sessionName){
	const { error, version } = await fetchLatestBaileysVersion()

	if (error){
		console.log(`Session: ${sessionName} | No connection, check your internet.`)
		return startSock(sessionName)
	}

	const { state, saveCreds, removeCreds } = await useMySQLAuthState({
		session: sessionName, // required
		host: 'localhost', // optional
		user: 'root', // optional
		password: 'Password123#', // required
		database: 'baileys' // required
	})

	const sock = makeWASocket({
		auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys, logger),
		},
		version: version,
		defaultQueryTimeoutMs: undefined
	})

	sock.ev.on('creds.update', saveCreds)

	sock.ev.on('connection.update', async({ connection, lastDisconnect }) => {
		// your code here
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
