"use strict";

import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { arrayify, BytesLike, hexDataLength, hexDataSlice, hexlify, hexZeroPad, stripZeros, } from "@ethersproject/bytes";
import { Zero } from "@ethersproject/constants";
import * as errors from "@ethersproject/errors";
import { checkProperties, shallowCopy } from "@ethersproject/properties";
import * as RLP from "@ethersproject/rlp";

import { getAddress } from "@ethersproject-aion/address";
import { blake2b } from "@ethersproject-aion/blake2b";
//import { hashMessage } from "@ethersproject-aion/hash";
import { computePublicKey, recoverPublicKey } from "@ethersproject-aion/signing-key";

///////////////////////////////
// Exported Types

export type UnsignedTransaction = {
    to?: string;
    nonce?: number;

    gasLimit?: BigNumberish;
    gasPrice?: BigNumberish;

    data?: BytesLike;
    value?: BigNumberish;

    timestamp?: BigNumberish;
    type?: number;
}

export interface Transaction {
    hash?: string;

    to?: string;
    from?: string;
    nonce: number;

    gasLimit: BigNumber;
    gasPrice: BigNumber;

    data: string;
    value: BigNumber;
    type: number;
    timestamp: BigNumber;

    signature?: string;
}

///////////////////////////////

// See: https://github.com/aionnetwork/aion_rlp.js/blob/master/index.js
//const JAVA_LONG_MAX = bigNumberify("0x7fffffffffffffff");
//const IntegerMask = bigNumberify("0xffffffff");

function encodeLong(value: BigNumberish): string {
    let hex = hexlify(value);
    let length = hexDataLength(hex);
    if (length > 8) {
        errors.throwError("invalid Aion long - too long", errors.INVALID_ARGUMENT, {
            argument: value,
            value: value
        });
    }
    if (length > 4) { hex = hexZeroPad(hex, 8); }
    return hex;
}

function decodeLong(value: BytesLike): BigNumber {
    return BigNumber.from(value);
}
/*
[ 0, 1, 2, 3, 128, 255, 256, 257, 1000, 0xffffff, 0x987654321, "0x1234567890123456" ].forEach((t) => {
    console.log(
        t,
        encodeLong(t),
        AionLong.aionEncodeLong({ buf: arrayify(hexlify(t)) }),
        decodeLong(encodeLong(t)).toString(),
        decodeLong(encodeLong(t))
    );
});
*/
function handleAddress(value: string): string {
    if (value === "0x") { return null; }
    return getAddress(value);
}

function handleNumber(value: string): BigNumber {
    if (value === "0x") { return Zero; }
    return BigNumber.from(value);
}

function handleLong(value: string): BigNumber {
    if (value === "0x") { return Zero; }
    return decodeLong(value);
}

const transactionFields = [
    { name: "nonce",     maxLength: 32 },
    { name: "to",           length: 32 },
    { name: "value",     maxLength: 32 },
    { name: "data" },
    { name: "timestamp", maxLength: 32 },
    { name: "gasLimit",  isLong: true },
    { name: "gasPrice",  isLong: true },
    { name: "type",      isLong: true }
];

const allowedTransactionKeys: { [ key: string ]: boolean } = {
    data: true, gasLimit: true, gasPrice:true, nonce: true, timestamp: true, to: true, type: true, value: true
}

export function computeAddress(key: BytesLike): string {
    let publicKey = computePublicKey(key);
    return getAddress("0xa0" + hexDataSlice(blake2b(publicKey), 1).substring(2));
}

export function recoverAddress(digest: BytesLike, signature: BytesLike): string {
    return computeAddress(recoverPublicKey(arrayify(digest), signature));
}
// @TODO:
//export function verifyMessage(message: Bytes | string, signature: BytesLike | Signature): string {
//    return recoverAddress(hashMessage(message), signature);
//}

export function serialize(transaction: UnsignedTransaction, signature?: BytesLike): string {
    checkProperties(transaction, allowedTransactionKeys);

    transaction = shallowCopy(transaction);
    if (transaction.type == null) { transaction.type = 1; }
    if (transaction.timestamp == null) { transaction.timestamp = Math.floor(Date.now() * 1000); }

    let raw: Array<string | Uint8Array> = [];

    transactionFields.forEach(function(fieldInfo) {
        let value = (<any>transaction)[fieldInfo.name] || ([]);
        value = arrayify(hexlify(value));

        // Fixed-width field
        if (fieldInfo.length && value.length !== fieldInfo.length && value.length > 0) {
            errors.throwError("invalid length for " + fieldInfo.name, errors.INVALID_ARGUMENT, { arg: ("transaction" + fieldInfo.name), value: value });
        }

        // Aion Long
        if (fieldInfo.isLong) {
            value = arrayify(encodeLong(value));

        // Variable-width (with a maximum)
        } else if (fieldInfo.maxLength) {
            value = stripZeros(value);
            if (value.length > fieldInfo.maxLength) {
                errors.throwError("invalid length for " + fieldInfo.name, errors.INVALID_ARGUMENT, { arg: ("transaction" + fieldInfo.name), value: value });
            }
        }

        raw.push(hexlify(value));
    });

    // Requesting an unsigned transation
    if (!signature) {
        return RLP.encode(raw);
    }

    //raw.push(stripZeros(signature);
    console.log("SIG", signature);
    raw.push(arrayify(signature));

    return RLP.encode(raw);
}

export function parse(rawTransaction: BytesLike): Transaction {
    let transaction = RLP.decode(rawTransaction);
    if (transaction.length !== 8 && transaction.length !== 9) {
        errors.throwError("invalid raw transaction", errors.INVALID_ARGUMENT, { arg: "rawTransactin", value: rawTransaction });
    }
    console.log(transaction);

    let tx: Transaction = {
        nonce:     handleNumber(transaction[0]).toNumber(),
        to:        handleAddress(transaction[1]),
        value:     handleNumber(transaction[2]),
        data:      transaction[3],
        timestamp: handleNumber(transaction[4]),
        gasLimit:  handleLong(transaction[5]),
        gasPrice:  handleLong(transaction[6]),
        type:      handleLong(transaction[7]).toNumber()
    };

    // Legacy unsigned transaction
    if (transaction.length === 8) { return tx; }

    tx.signature = hexZeroPad(hexDataSlice(transaction[8], 32), 64);

    tx.from = computeAddress(hexDataSlice(tx.signature, 0, 32));

    // @TODO: Should this verify the from address? using the signature? We do for
    //        Ethereum mostly because we *have* to to compute the from

    tx.hash = blake2b(rawTransaction);

    return tx;
}

