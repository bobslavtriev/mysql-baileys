interface IAppStateSyncKeyFingerprint {
	rawId?: (number|null);
	currentIndex?: (number|null);
	deviceIndexes?: (number[]|null);
}

interface IAppStateSyncKeyData {
	keyData?: (Uint8Array|null);
	fingerprint?: (IAppStateSyncKeyFingerprint|null);
	timestamp?: (number|null);
}

export interface sqlData {
	constructor: {
		name: 'RowDataPacket';
	};
	[column: string]: any;
	[column: number]: any;
	value?: Array<any>
}

export type LTHashState = {
	version: number
	hash: Buffer
	indexValueMap: {
		[indexMacBase64: string]: {
			valueMac: Uint8Array
		}
	}
}

export type KeyPair = {
	public: Uint8Array
	private: Uint8Array
}

export type SignalDataTypeMap = {
	'pre-key': KeyPair
	'session': Uint8Array
	'sender-key': Uint8Array
	'sender-key-memory': {
		[jid: string]: boolean
	}
	'app-state-sync-key': IAppStateSyncKeyData
	'app-state-sync-version': LTHashState
}

export type MySQLConfig = {
	session?: string
	host?: string
	user?: string
	password?: string
	database?: string
}
