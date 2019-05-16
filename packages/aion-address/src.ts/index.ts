"use strict";

import { arrayify, isHexString, stripZeros, hexlify } from "@ethersproject/bytes";
import { BigNumberish } from "@ethersproject/bignumber";
import * as errors from "@ethersproject/errors";
import { encode } from "@ethersproject/rlp";
import { toUtf8Bytes, toUtf8String } from "@ethersproject/strings";

import { blake2b } from "@ethersproject-aion/blake2b";

export function getAddress(address: string): string {
    if (!isHexString(address, 32)) {
        errors.throwError("invalid address", errors.INVALID_ARGUMENT, { arg: "address", value: address });
    }

    let hashed = arrayify(blake2b(address));

    let nibbles = toUtf8Bytes(address.toLowerCase().substring(2));
    for (let i = 0; i < 64; i++) {
        // Letter and should be uppercase
        if (nibbles[i] >= 97 && (hashed[i >> 3] & (1 << (i & 7)))) {
            nibbles[i] -= 0x20;
        }
    }

    return "0x" + toUtf8String(nibbles);
}

export function getContractAddress(transaction: { from: string, nonce: BigNumberish }) {
    if (!transaction.from) { throw new Error("missing from address"); }
    let nonce = transaction.nonce;

    return getAddress("0xa0" + blake2b(encode([
        getAddress(transaction.from),
        stripZeros(hexlify(nonce))
    ])).substring(4));
}
