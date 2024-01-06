import { curve } from 'libsignal'
import { randomBytes } from 'crypto'
import { v4 } from 'uuid'
import { KeyPair, valueReplacer, valueReviver } from '../Types'

const generateKeyPair = () => {
	const { pubKey, privKey } = curve.generateKeyPair()
	return {
		private: Buffer.from(privKey),
		public: Buffer.from(pubKey.slice(1))
	}
}

const generateSignalPubKey = (pubKey: Uint8Array) => {
	return pubKey.length === 33 ? pubKey : Buffer.concat([Buffer.from([5]), pubKey])
}

const sign = (privateKey: object, buf: Uint8Array) => {
	return curve.calculateSignature(privateKey, buf)
}

const signedKeyPair = (identityKeyPair: KeyPair, keyId: number) => {
	const preKey = generateKeyPair()
	const pubKey = generateSignalPubKey(preKey.public)
	const signature = sign(identityKeyPair.private, pubKey)
	return { keyPair: preKey, signature, keyId }
}

export const BufferJSON = {
	replacer: (_: string, value: valueReplacer) => {
		if(value?.type === 'Buffer' && Array.isArray(value?.data)) {
			return {
				type: 'Buffer',
				data: Buffer.from(value?.data).toString('base64')
			}
		}
		return value
	},
	reviver: (_: string, value: valueReviver) => {
		if(value?.type === 'Buffer') {
			return Buffer.from(value?.data, 'base64')
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
		backupToken: randomBytes(20),
		registered: false,
		registration: {},
		pairingCode: undefined
	}
}
