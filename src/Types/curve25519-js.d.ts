declare module 'curve25519-js' {
	export function generateKeyPair(seed: Uint8Array, arg1?: number, arg2?: number): { public: Uint8Array; private: Uint8Array };
	export function sign(privateKey: Uint8Array, message: Uint8Array): Uint8Array;
	export function verify(publicKey: Uint8Array, message: Uint8Array, sig: Uint8Array): boolean;
}
