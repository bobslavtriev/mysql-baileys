import { proto } from '@whiskeysockets/baileys'
import { Connection } from 'mysql2/promise'

export type MinimalMessage = Pick<proto.IWebMessageInfo, 'key' | 'messageTimestamp'>

export interface sqlData {
	constructor: {
		name: 'RowDataPacket';
	};
	value?: Array<object>
}

export interface sqlConnection extends Connection {
	connection?: {
		_closing?: boolean | undefined
	}
}

export type MySQLConfig = {
	session: string
	host: string
	user: string
	password: string
	database: string
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
	pairingCode: string | undefined
}
