import { BytesLike } from "@ethersproject/bytes";
export declare class SigningKey {
    readonly curve: string;
    readonly privateKey: string;
    readonly publicKey: string;
    readonly address: string;
    constructor(privateKey: BytesLike);
    signDigest(digest: BytesLike): string;
    computeSharedSecret(otherKey: BytesLike): string;
    static fromSeed(seed: BytesLike): SigningKey;
}
export declare function recoverPublicKey(digest: BytesLike, signature: BytesLike): string;
export declare function computePublicKey(key: BytesLike): string;
