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
	phoneNumberCountryCode?: string
	phoneNumberNationalNumber?: string
	phoneNumberMobileCountryCode?: string
	phoneNumberMobileNetworkCode?: string
	method?: 'sms' | 'voice' | 'captcha'
	captcha?: string
}

export type SslOptions = {
	pfx?: string;
	key?: string | string[] | Buffer | Buffer[];
	passphrase?: string;
	cert?: string | string[] | Buffer | Buffer[];
	ca?: string | string[] | Buffer | Buffer[];
	crl?: string | string[];
	ciphers?: string;
	rejectUnauthorized?: boolean;
	minVersion?: string;
	maxVersion?: string;
	verifyIdentity?: boolean;
}

export type Fingerprint = {
	rawId: number
	currentIndex: number
	deviceIndexes: number[]
}

export type Bits = {
	low: number
	high: number
	unsigned: boolean
}

export type AppDataSync = {
	keyData: Uint8Array
	fingerprint: Fingerprint
	timestamp: Bits | number
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
		name: 'RowDataPacket';
	};
	value?: object[]
}

export interface sqlConnection extends Connection {
	connection?: {
		_closing?: boolean
	}
}

export type MySQLConfig = {
	session: string
	host?: string
	port?: number
	database: string
	tableName?: string
	user?: string
	password?: string
	password1?: string
	password2?: string
	password3?: string
	retryRequestDelayMs?: number
	maxtRetries?: number
	ssl?: string | SslOptions
	localAddress?: string;
	socketPath?: string;
	insecureAuth?: boolean
	isServer?: boolean
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
