# Authentication with MySQL for Baileys
[![npm](https://img.shields.io/npm/v/mysql-baileys?logo=npm&logoColor=red&label=npm&color=red)](https://www.npmjs.com/package/mysql-baileys)
[![github](https://img.shields.io/github/package-json/v/bobslavtriev/mysql-baileys?logo=github&logoColor=blue&color=blue)](https://github.com/bobslavtriev/mysql-baileys)
[![baileys](https://img.shields.io/npm/v/baileys?logo=data:image/png;base64,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&label=baileys&color=rgb(0,165,135))](https://github.com/WhiskeySockets/Baileys)
[![license](https://img.shields.io/npm/l/mysql-baileys?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMTYgMTYiPjxwYXRoIGZpbGw9IiNmZmZmMDIiIGQ9Ik04Ljc1Ljc1VjJoLjk4NWMuMzA0IDAgLjYwMy4wOC44NjcuMjMxbDEuMjkuNzM2cS4wNTguMDMzLjEyNC4wMzNoMi4yMzRhLjc1Ljc1IDAgMCAxIDAgMS41aC0uNDI3bDIuMTExIDQuNjkyYS43NS43NSAwIDAgMS0uMTU0LjgzOGwtLjUzLS41M2wuNTI5LjUzMWwtLjAwMS4wMDJsLS4wMDIuMDAybC0uMDA2LjAwNmwtLjAwNi4wMDVsLS4wMS4wMWwtLjA0NS4wNHEtLjMxNy4yNjUtLjY4Ni40NUMxNC41NTYgMTAuNzggMTMuODggMTEgMTMgMTFhNC41IDQuNSAwIDAgMS0yLjAyMy0uNDU0YTMuNSAzLjUgMCAwIDEtLjY4Ni0uNDVsLS4wNDUtLjA0bC0uMDE2LS4wMTVsLS4wMDYtLjAwNmwtLjAwNC0uMDA0di0uMDAxYS43NS43NSAwIDAgMS0uMTU0LS44MzhMMTIuMTc4IDQuNWgtLjE2MmMtLjMwNSAwLS42MDQtLjA3OS0uODY4LS4yMzFsLTEuMjktLjczNmEuMjUuMjUgMCAwIDAtLjEyNC0uMDMzSDguNzVWMTNoMi41YS43NS43NSAwIDAgMSAwIDEuNWgtNi41YS43NS43NSAwIDAgMSAwLTEuNWgyLjVWMy41aC0uOTg0YS4yNS4yNSAwIDAgMC0uMTI0LjAzM2wtMS4yODkuNzM3Yy0uMjY1LjE1LS41NjQuMjMtLjg2OS4yM2gtLjE2MmwyLjExMiA0LjY5MmEuNzUuNzUgMCAwIDEtLjE1NC44MzhsLS41My0uNTNsLjUyOS41MzFsLS4wMDEuMDAybC0uMDAyLjAwMmwtLjAwNi4wMDZsLS4wMTYuMDE1bC0uMDQ1LjA0cS0uMzE3LjI2NS0uNjg2LjQ1QzQuNTU2IDEwLjc4IDMuODggMTEgMyAxMWE0LjUgNC41IDAgMCAxLTIuMDIzLS40NTRhMy41IDMuNSAwIDAgMS0uNjg2LS40NWwtLjA0NS0uMDRsLS4wMTYtLjAxNWwtLjAwNi0uMDA2bC0uMDA0LS4wMDR2LS4wMDFhLjc1Ljc1IDAgMCAxLS4xNTQtLjgzOEwyLjE3OCA0LjVIMS43NWEuNzUuNzUgMCAwIDEgMC0xLjVoMi4yMzRhLjI1LjI1IDAgMCAwIC4xMjUtLjAzM2wxLjI4OC0uNzM3Yy4yNjUtLjE1LjU2NC0uMjMuODY5LS4yM2guOTg0Vi43NWEuNzUuNzUgMCAwIDEgMS41IDBtMi45NDUgOC40NzdjLjI4NS4xMzUuNzE4LjI3MyAxLjMwNS4yNzNzMS4wMi0uMTM4IDEuMzA1LS4yNzNMMTMgNi4zMjdabS0xMCAwYy4yODUuMTM1LjcxOC4yNzMgMS4zMDUuMjczczEuMDItLjEzOCAxLjMwNS0uMjczTDMgNi4zMjdaIi8+PC9zdmc+&color=rgb(210,210,0))](./LICENSE)
[![CodeFactor](https://www.codefactor.io/repository/github/bobslavtriev/mysql-baileys/badge)](https://www.codefactor.io/repository/github/bobslavtriev/mysql-baileys)
[![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-raw/bobslavtriev/mysql-baileys?logo=circle&logoColor=white)](https://github.com/bobslavtriev/mysql-baileys/issues)

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
Edge Version:
```
npm i github:bobslavtriev/mysql-baileys
```
Stable Version:
```
npm i mysql-baileys
```

### 3. Import code
```ts
const { useMySQLAuthState } = require('mysql-baileys')
```

### 4. Implement code
```ts
const { state, saveCreds, removeCreds } = await useMySQLAuthState({
	session: sessionName, // required
	password: 'Password123#', // required
	database: 'baileys', // required
})
```

### 5. All parameters for useMySQLAuthState()
```ts
type MySQLConfig = {
	/* The hostname of the database you are connecting to. (Default: localhost) */
	host?: string,
	/* The port number to connect to. (Default: 3306) */
	port?: number,
	/* The MySQL user to authenticate as. (Default: root) */
	user?: string,
	/* The password of that MySQL user */
	password: string,
	/* Alias for the MySQL user password. Makes a bit more sense in a multifactor authentication setup (see "password2" and "password3") */
	password1?: string,
	/* 2nd factor authentication password. Mandatory when the authentication policy for the MySQL user account requires an additional authentication method that needs a password. */
	password2?: string,
	/* 3rd factor authentication password. Mandatory when the authentication policy for the MySQL user account requires two additional authentication methods and the last one needs a password. */
	password3?: string,
	/* Name of the database to use for this connection. (Default: base) */
	database: string,
	/* MySql table name. (Default: auth) */
	tableName?: string,
	/* Retry the query at each interval if it fails. (Default: 200ms) */
	retryRequestDelayMs: number,
	/* Maximum attempts if the query fails. (Default: 10) */
	maxtRetries?: number,
	/* Session name to identify the connection, allowing multisessions with mysql. */
	session: string,
	/* The source IP address to use for TCP connection. */
	localAddress?: string,
	/* The path to a unix domain socket to connect to. When used host and port are ignored. */
	socketPath?: string,
	/* Allow connecting to MySQL instances that ask for the old (insecure) authentication method. (Default: false) */
	insecureAuth?: boolean,
	/* If your connection is a server. (Default: false) */
	isServer?: boolean,
	/* Use the config SSL. (Default: disabled) */
	ssl?: string | SslOptions
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
		session: sessionName,
		host: 'localhost',
		port: 3306,
		user: 'bob',
		password: 'Password123#',
		database: 'baileys',
		tableName: 'auth'
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
