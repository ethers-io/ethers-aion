"use strict";

import * as nacl from "tweetnacl";

import { arrayify, BytesLike, concat, hexlify } from "@ethersproject/bytes";
import * as errors from "@ethersproject/errors";
import { defineReadOnly } from "@ethersproject/properties";

export class SigningKey {

    readonly curve: string;

    readonly privateKey: string;
    readonly publicKey: string;

    readonly address: string;

    constructor(privateKey: BytesLike) {
        defineReadOnly(this, "curve", "ed25519");
        defineReadOnly(this, "privateKey", hexlify(privateKey));
        defineReadOnly(this, "publicKey", computePublicKey(this.privateKey));
    }

    signDigest(digest: BytesLike): string {
        let signature = nacl.sign.detached(arrayify(digest), arrayify(this.privateKey));
        return hexlify(concat([ this.publicKey, signature ]));
    }

    computeSharedSecret(otherKey: BytesLike): string {
        return errors.throwError("not implemented", errors.NOT_IMPLEMENTED, { });
    }

    static fromSeed(seed: BytesLike): SigningKey {
        return new SigningKey(nacl.sign.keyPair.fromSeed(arrayify(seed)).secretKey);
    }
}

export function recoverPublicKey(digest: BytesLike, signature: BytesLike): string {
    let bytes = arrayify(signature);
    let publicKey = bytes.slice(0, 32);
    let sig = bytes.slice(32);
    if (!nacl.sign.detached.verify(arrayify(digest), sig, publicKey)) {
        return null;
    }
    return hexlify(publicKey);
}

export function computePublicKey(key: BytesLike): string {
    let bytes = arrayify(key);

    if (bytes.length === 64) {
        return hexlify(nacl.sign.keyPair.fromSecretKey(bytes).publicKey);
    } else if (bytes.length === 32) {
        return hexlify(bytes);
    }

    return errors.throwError("invalid public or private key", errors.INVALID_ARGUMENT, {
        argument: "key",
        value: "[REDACTED]"
    });
}
