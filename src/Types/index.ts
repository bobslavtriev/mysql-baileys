import { Connection } from 'mysql2/promise'

type Awaitable<T> = T | Promise<T>

type Contact = {
	id: string
	lid?: string
	name?: string
	notify?: string
	verifiedName?: string
	imgUrl?: string | null
	status?: string
}

type Account = {
	details?: Uint8Array | null
	accountSignatureKey?: Uint8Array | null
	accountSignature?: Uint8Array | null
	deviceSignature?: Uint8Array | null
}

type SignedKeyPair = {
	keyPair: KeyPair
	signature: Uint8Array
	keyId: number
	timestampS?: number
}

type ProtocolAddress = {
	name: string
	deviceId: number
}

type SignalIdentity = {
	identifier: ProtocolAddress
	identifierKey: Uint8Array
}

type LTHashState = {
	version: number
	hash: Buffer
	indexValueMap: {
		[indexMacBase64: string]: { valueMac: Uint8Array | Buffer }
	}
}

type SignalCreds = {
	readonly signedIdentityKey: KeyPair
	readonly signedPreKey: SignedKeyPair
	readonly registrationId: number
}

type AccountSettings = {
	unarchiveChats: boolean
	defaultDisappearingMode?: Pick<any, 'ephemeralExpiration' | 'ephemeralSettingTimestamp'>
}

type SignalKeyStore = {
	get<T extends keyof SignalDataTypeMap>(type: T, ids: string[]): Awaitable<{
		[id: string]: SignalDataTypeMap[T]
	}>
	set(data: SignalDataSet): Awaitable<void>
	clear?(): Awaitable<void>
}

interface RegistrationOptions {
	phoneNumber?: string
	phoneNumberCountryCode: string
	phoneNumberNationalNumber: string
	phoneNumberMobileCountryCode: string
	phoneNumberMobileNetworkCode: string
	method?: 'sms' | 'voice' | 'captcha'
	captcha?: string
}

export type SslOptions = {
	pfx?: string
	key?: string | string[] | Buffer | Buffer[]
	passphrase?: string
	cert?: string | string[] | Buffer | Buffer[]
	ca?: string | string[] | Buffer | Buffer[]
	crl?: string | string[]
	ciphers?: string
	rejectUnauthorized?: boolean
	minVersion?: string
	maxVersion?: string
	verifyIdentity?: boolean
}

export type Fingerprint = {
	rawId: number
	currentIndex: number
	deviceIndexes: number[]
}

export type AppDataSync = {
	keyData: Uint8Array
	fingerprint: Fingerprint
	timestamp: Long | number
}

export type SignalDataTypeMap = {
	session: Uint8Array
	'pre-key': KeyPair
	'sender-key': Uint8Array
	'app-state-sync-key': AppDataSync
	'app-state-sync-version': LTHashState
	'sender-key-memory': {
		[jid: string]: boolean
	}
}

export type SignalDataSet = {
	[T in keyof SignalDataTypeMap]?: {
		[id: string]: SignalDataTypeMap[T] | null
	}
}

export type KeyPair = {
	public: Uint8Array
	private: Uint8Array
}

export type sqlData = {
	constructor: {
		name: 'RowDataPacket'
	}
	value?: object[]
}

export interface sqlConnection extends Connection {
	connection?: {
		_closing?: boolean
	}
}

export type MySQLConfig = {
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
	retryRequestDelayMs?: number,
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

export type valueReplacer = {
	data: number[]
	type: string
}

export type valueReviver = {
	data: string
	type: string
}

export type AuthenticationState = {
	creds: AuthenticationCreds
	keys: SignalKeyStore
}

export type AuthenticationCreds = SignalCreds & {
	readonly noiseKey: KeyPair
	readonly pairingEphemeralKeyPair: KeyPair
	advSecretKey: string
	me?: Contact
	account?: Account
	signalIdentities?: SignalIdentity[]
	myAppStateKeyId?: string
	firstUnuploadedPreKeyId: number
	nextPreKeyId: number
	lastAccountSyncTimestamp?: number
	platform?: string
	processedHistoryMessages: Pick<any, 'key' | 'messageTimestamp'>[]
	accountSyncCounter: number
	accountSettings: AccountSettings
	deviceId: string
	phoneId: string
	identityId: Buffer
	registered: boolean
	backupToken: Buffer
	registration: RegistrationOptions
	pairingCode: string | undefined
	lastPropHash: string | undefined
	routingInfo: Buffer | undefined
}
