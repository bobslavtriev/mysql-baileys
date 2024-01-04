import { curve } from 'libsignal'
import { randomBytes } from 'crypto'
import { v4 } from 'uuid'

const generateKeyPair = () => {
	const { pubKey, privKey } = curve.generateKeyPair()
	return {
		private: Buffer.from(privKey),
		public: Buffer.from(pubKey.slice(1))
	}
}

const generateSignalPubKey = (pubKey: any) => (
	pubKey.length === 33 ? pubKey : Buffer.concat([Buffer.from([5]), pubKey])
)

const sign = (privateKey: any, buf: Buffer) => (
	curve.calculateSignature(privateKey, buf)
)

const signedKeyPair = (identityKeyPair: any, keyId: any) => {
	const preKey = generateKeyPair()
	const pubKey = generateSignalPubKey(preKey.public)
	const signature = sign(identityKeyPair.private, pubKey)
	return { keyPair: preKey, signature, keyId }
}

export const BufferJSON = {
	replacer: (_: any, value: any) => {
		if(Buffer.isBuffer(value) || value instanceof Uint8Array || value?.type === 'Buffer') {
			return { type: 'Buffer', data: Buffer.from(value?.data || value).toString('base64') }
		}

		return value
	},
	reviver: (_: any, value: any) => {
		if(typeof value === 'object' && !!value && (value.buffer === true || value.type === 'Buffer')) {
			const val = value.data || value.value
			return typeof val === 'string' ? Buffer.from(val, 'base64') : Buffer.from(val || [])
		}

		return value
	}
}

export const initAuthCreds = () => {
	const identityKey = generateKeyPair()
	return {
		noiseKey: generateKeyPair(),
		pairingEphemeralKeyPair: generateKeyPair(),
		signedIdentityKey: identityKey,
		signedPreKey: signedKeyPair(identityKey, 1),
		registrationId: Uint16Array.from(randomBytes(2))[0] & 16383,
		advSecretKey: randomBytes(32).toString('base64'),
		processedHistoryMessages: [],
		nextPreKeyId: 1,
		firstUnuploadedPreKeyId: 1,
		accountSyncCounter: 0,
		accountSettings: {
			unarchiveChats: false
		},
		deviceId: Buffer.from(v4().replace(/-/g, ''), 'hex').toString('base64url'),
		phoneId: v4(),
		identityId: randomBytes(20),
		registered: false,
		backupToken: randomBytes(20),
		registration: {},
		pairingCode: undefined
	}
}
