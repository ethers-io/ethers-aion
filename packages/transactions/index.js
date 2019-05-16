"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_1 = require("@ethersproject/bignumber");
var bytes_1 = require("@ethersproject/bytes");
var constants_1 = require("@ethersproject/constants");
var errors = __importStar(require("@ethersproject/errors"));
var properties_1 = require("@ethersproject/properties");
var RLP = __importStar(require("@ethersproject/rlp"));
var address_1 = require("@ethersproject-aion/address");
var blake2b_1 = require("@ethersproject-aion/blake2b");
//import { hashMessage } from "@ethersproject-aion/hash";
var signing_key_1 = require("@ethersproject-aion/signing-key");
///////////////////////////////
// See: https://github.com/aionnetwork/aion_rlp.js/blob/master/index.js
//const JAVA_LONG_MAX = bigNumberify("0x7fffffffffffffff");
//const IntegerMask = bigNumberify("0xffffffff");
function encodeLong(value) {
    var hex = bytes_1.hexlify(value);
    var length = bytes_1.hexDataLength(hex);
    if (length > 8) {
        errors.throwError("invalid Aion long - too long", errors.INVALID_ARGUMENT, {
            argument: value,
            value: value
        });
    }
    if (length > 4) {
        hex = bytes_1.hexZeroPad(hex, 8);
    }
    return hex;
}
function decodeLong(value) {
    return bignumber_1.BigNumber.from(value);
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
function handleAddress(value) {
    if (value === "0x") {
        return null;
    }
    return address_1.getAddress(value);
}
function handleNumber(value) {
    if (value === "0x") {
        return constants_1.Zero;
    }
    return bignumber_1.BigNumber.from(value);
}
function handleLong(value) {
    if (value === "0x") {
        return constants_1.Zero;
    }
    return decodeLong(value);
}
var transactionFields = [
    { name: "nonce", maxLength: 32 },
    { name: "to", length: 32 },
    { name: "value", maxLength: 32 },
    { name: "data" },
    { name: "timestamp", maxLength: 32 },
    { name: "gasLimit", isLong: true },
    { name: "gasPrice", isLong: true },
    { name: "type", isLong: true }
];
var allowedTransactionKeys = {
    data: true, gasLimit: true, gasPrice: true, nonce: true, timestamp: true, to: true, type: true, value: true
};
function computeAddress(key) {
    var publicKey = signing_key_1.computePublicKey(key);
    return address_1.getAddress("0xa0" + bytes_1.hexDataSlice(blake2b_1.blake2b(publicKey), 1).substring(2));
}
exports.computeAddress = computeAddress;
function recoverAddress(digest, signature) {
    return computeAddress(signing_key_1.recoverPublicKey(bytes_1.arrayify(digest), signature));
}
exports.recoverAddress = recoverAddress;
// @TODO:
//export function verifyMessage(message: Bytes | string, signature: BytesLike | Signature): string {
//    return recoverAddress(hashMessage(message), signature);
//}
function serialize(transaction, signature) {
    properties_1.checkProperties(transaction, allowedTransactionKeys);
    transaction = properties_1.shallowCopy(transaction);
    if (transaction.type == null) {
        transaction.type = 1;
    }
    if (transaction.timestamp == null) {
        transaction.timestamp = Math.floor(Date.now() * 1000);
    }
    var raw = [];
    transactionFields.forEach(function (fieldInfo) {
        var value = transaction[fieldInfo.name] || ([]);
        value = bytes_1.arrayify(bytes_1.hexlify(value));
        // Fixed-width field
        if (fieldInfo.length && value.length !== fieldInfo.length && value.length > 0) {
            errors.throwError("invalid length for " + fieldInfo.name, errors.INVALID_ARGUMENT, { arg: ("transaction" + fieldInfo.name), value: value });
        }
        // Aion Long
        if (fieldInfo.isLong) {
            value = bytes_1.arrayify(encodeLong(value));
            // Variable-width (with a maximum)
        }
        else if (fieldInfo.maxLength) {
            value = bytes_1.stripZeros(value);
            if (value.length > fieldInfo.maxLength) {
                errors.throwError("invalid length for " + fieldInfo.name, errors.INVALID_ARGUMENT, { arg: ("transaction" + fieldInfo.name), value: value });
            }
        }
        raw.push(bytes_1.hexlify(value));
    });
    // Requesting an unsigned transation
    if (!signature) {
        return RLP.encode(raw);
    }
    //raw.push(stripZeros(signature);
    console.log("SIG", signature);
    raw.push(bytes_1.arrayify(signature));
    return RLP.encode(raw);
}
exports.serialize = serialize;
function parse(rawTransaction) {
    var transaction = RLP.decode(rawTransaction);
    if (transaction.length !== 8 && transaction.length !== 9) {
        errors.throwError("invalid raw transaction", errors.INVALID_ARGUMENT, { arg: "rawTransactin", value: rawTransaction });
    }
    console.log(transaction);
    var tx = {
        nonce: handleNumber(transaction[0]).toNumber(),
        to: handleAddress(transaction[1]),
        value: handleNumber(transaction[2]),
        data: transaction[3],
        timestamp: handleNumber(transaction[4]),
        gasLimit: handleLong(transaction[5]),
        gasPrice: handleLong(transaction[6]),
        type: handleLong(transaction[7]).toNumber()
    };
    // Legacy unsigned transaction
    if (transaction.length === 8) {
        return tx;
    }
    tx.signature = bytes_1.hexZeroPad(bytes_1.hexDataSlice(transaction[8], 32), 64);
    tx.from = computeAddress(bytes_1.hexDataSlice(tx.signature, 0, 32));
    // @TODO: Should this verify the from address? using the signature? We do for
    //        Ethereum mostly because we *have* to to compute the from
    tx.hash = blake2b_1.blake2b(rawTransaction);
    return tx;
}
exports.parse = parse;
