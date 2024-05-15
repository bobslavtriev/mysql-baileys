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
	database: 'baileys', // required
	tableName: 'auth' // optional
})
```

### 5. All parameters for useMySQLAuthState()
```ts
type MySQLConfig = {
	/* Session name to identify the connection, allowing multisessions with mysql */
	session: string
	/* MySql host, by default localhost */
	host: string
	/* MySql user, by default root */
	user: string
	/* MySql password */
	password: string
	/* MySql database name */
	database: string
	/* MySql table name, by default auth */
	tableName: string | undefined
	/* Always keep active, by default 30s */
	keepAliveIntervalMs: number | undefined
	/* Retry the query at each interval if it fails, by default 200ms */
	retryRequestDelayMs: number | undefined
	/* Maximum attempts if the query fails, by default 10 */
	maxtRetries: number | undefined
	/* MySql SSL config */
	ssl?: any
}
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
		database: 'baileys', // required
		tableName: 'auth' // optional
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
