import * as curveJs from 'curve25519-js'
import { randomBytes, generateKeyPairSync } from 'crypto'
import { KeyPair, valueReviver, AppDataSync, Fingerprint } from '../Types'

export const generateKeyPair = (): KeyPair => {
	try {
		const { publicKey, privateKey } = generateKeyPairSync('x25519')

		const pubBuffer = Buffer.from(publicKey.export({
			format: 'der',
			type: 'spki'
		}))

		const privBuffer = Buffer.from(privateKey.export({
			format: 'der',
			type: 'pkcs8'
		}))

		return {
			public: pubBuffer.slice(12, 44),
			private: privBuffer.slice(16, 48)
		}
	} catch(e) {
		const keyPair = curveJs.generateKeyPair(randomBytes(32))
		return {
			public: Buffer.from(keyPair.public),
			private: Buffer.from(keyPair.private)
		}
	}
}

const calculateSignature = (privKey: Uint8Array | Buffer, message: Uint8Array | Buffer) => {
	return Buffer.from(curveJs.sign(privKey, message))
}

const generateSignalPubKey = (pubKey: Uint8Array | Buffer) => {
	return pubKey.length === 33 ? pubKey : Buffer.concat([Buffer.from([5]), pubKey])
}

const signedKeyPair = (identityKeyPair: KeyPair, keyId: number) => {
	const preKey = generateKeyPair()
	const pubKey = generateSignalPubKey(preKey.public)
	const signature = calculateSignature(identityKeyPair.private, pubKey)
	return { keyPair: preKey, signature, keyId }
}

const allocate = (str: string) => {
	let p = str.length

	if (!p){
		return new Uint8Array(1)
	}

	let n = 0

	while (--p % 4 > 1 && str.charAt(p) === "="){
		++n
	}

	return new Uint8Array(Math.ceil(str.length * 3) / 4 - n).fill(0)
}

const parseTimestamp = (timestamp: string | number | Long) => {
	if (typeof timestamp === 'string') {
		return parseInt(timestamp, 10)
	}

	if (typeof timestamp === "number") {
		return timestamp
	}

	return timestamp
}

export const fromObject = (args: AppDataSync) => {
	const f: Fingerprint = {
		...args.fingerprint,
		deviceIndexes: Array.isArray(args.fingerprint.deviceIndexes) ? args.fingerprint.deviceIndexes : []
	}

	const message = {
		keyData: Array.isArray(args.keyData) ? args.keyData : new Uint8Array(),
		fingerprint: {
			rawId: f.rawId || 0,
			currentIndex: f.rawId || 0,
			deviceIndexes: f.deviceIndexes
		},
		timestamp: parseTimestamp(args.timestamp)
	}

	if (typeof args.keyData === "string") {
		message.keyData = allocate(args.keyData)
	}

	return message
}

export const BufferJSON = {
	replacer: (_: string, value: any) => {
		if (Buffer.isBuffer(value) || value instanceof Uint8Array || value?.type === 'Buffer') {
			const val = value?.data || value;
			return {
				type: 'Buffer',
				data: Buffer.from(val).toString('base64')
			}
		}
		return value;
	},
	reviver: (_: string, value: valueReviver) => {
		if (typeof value === 'object' && !!value && (value.buffer === true || value.type === 'Buffer')) {
			const val = value.data || value.value;
			if (typeof val === 'string') {
				return Buffer.from(val, 'base64');
			}
			return Buffer.from(val || []);
		}
		return value;
	}
};

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
		registered: false,
		accountSettings: {
			unarchiveChats: false
		}
	}
}
