"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var bytes_1 = require("@ethersproject/bytes");
var errors = __importStar(require("@ethersproject/errors"));
var rlp_1 = require("@ethersproject/rlp");
var strings_1 = require("@ethersproject/strings");
var blake2b_1 = require("@ethersproject-aion/blake2b");
function getAddress(address) {
    if (!bytes_1.isHexString(address, 32)) {
        errors.throwError("invalid address", errors.INVALID_ARGUMENT, { arg: "address", value: address });
    }
    var hashed = bytes_1.arrayify(blake2b_1.blake2b(address));
    var nibbles = strings_1.toUtf8Bytes(address.toLowerCase().substring(2));
    for (var i = 0; i < 64; i++) {
        // Letter and should be uppercase
        if (nibbles[i] >= 97 && (hashed[i >> 3] & (1 << (i & 7)))) {
            nibbles[i] -= 0x20;
        }
    }
    return "0x" + strings_1.toUtf8String(nibbles);
}
exports.getAddress = getAddress;
function getContractAddress(transaction) {
    if (!transaction.from) {
        throw new Error("missing from address");
    }
    var nonce = transaction.nonce;
    return getAddress("0xa0" + blake2b_1.blake2b(rlp_1.encode([
        getAddress(transaction.from),
        bytes_1.stripZeros(bytes_1.hexlify(nonce))
    ])).substring(4));
}
exports.getContractAddress = getContractAddress;
