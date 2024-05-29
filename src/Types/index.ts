import { proto } from '@whiskeysockets/baileys'
import { Connection } from 'mysql2/promise'
import type { SslOptions } from 'mysql2/promise'

export type Awaitable<T> = T | Promise<T>

export type MinimalMessage = Pick<proto.IWebMessageInfo, 'key' | 'messageTimestamp'>

export interface sqlData {
	constructor: {
		name: 'RowDataPacket';
	};
	value?: Array<object>
}

export interface sqlConnection extends Connection {
	connection?: {
		_closing?: boolean
	}
}

export type MySQLConfig = {
	session: string
	host: string
	user: string
	port?: number | undefined
	password: string
	database: string
	tableName?: string | undefined
	keepAliveIntervalMs?: number | undefined
	retryRequestDelayMs?: number | undefined
	maxtRetries?: number | undefined
	ssl?: string | SslOptions | undefined
}

export type valueReplacer = {
	data: Array<number>
	type: string
}

export type valueReviver = {
	data: string
	type: string
}

export type KeyPair = {
	public: Uint8Array
	private: Uint8Array
}

export type SignedKeyPair = {
	keyPair: KeyPair
	signature: Uint8Array
	keyId: number
	timestampS?: number
}

export type SignalCreds = {
	readonly signedIdentityKey: KeyPair
	readonly signedPreKey: SignedKeyPair
	readonly registrationId: number
}

export interface Contact {
	id: string
	lid?: string
	name?: string
	notify?: string
	verifiedName?: string
	imgUrl?: string | null
	status?: string
}

export type ProtocolAddress = {
	name: string
	deviceId: number
}

export type SignalIdentity = {
	identifier: ProtocolAddress
	identifierKey: Uint8Array
}

export type AccountSettings = {
	unarchiveChats: boolean
	defaultDisappearingMode?: Pick<proto.IConversation, 'ephemeralExpiration' | 'ephemeralSettingTimestamp'>
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

export type LTHashState = {
	version: number
	hash: Buffer
	indexValueMap: {
		[indexMacBase64: string]: { valueMac: Uint8Array | Buffer }
	}
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

export type SignalKeyStore = {
	get<T extends keyof SignalDataTypeMap>(type: T, ids: string[]): Awaitable<{
		[id: string]: SignalDataTypeMap[T]
	}>
	set(data: SignalDataSet): Awaitable<void>
	clear?(): Awaitable<void>
}

export type AuthenticationCreds = SignalCreds & {
	readonly noiseKey: KeyPair
	readonly pairingEphemeralKeyPair: KeyPair
	advSecretKey: string
	me?: Contact
	account?: proto.IADVSignedDeviceIdentity
	signalIdentities?: SignalIdentity[]
	myAppStateKeyId?: string
	firstUnuploadedPreKeyId: number
	nextPreKeyId: number
	lastAccountSyncTimestamp?: number
	platform?: string
	processedHistoryMessages: MinimalMessage[]
	accountSyncCounter: number
	accountSettings: AccountSettings
	deviceId: string
	phoneId: string
	identityId: Buffer
	registered: boolean
	backupToken: Buffer
	registration: RegistrationOptions
	pairingCode?: string
	lastPropHash?: string
}
