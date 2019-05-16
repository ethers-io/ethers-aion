"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bytes_1 = require("@ethersproject/bytes");
var strings_1 = require("@ethersproject/strings");
var blake2b_1 = require("@ethersproject-aion/blake2b");
function id(text) {
    return blake2b_1.blake2b(strings_1.toUtf8Bytes(text));
}
exports.id = id;
exports.messagePrefix = "\x15Aion Signed Message:\n";
function hashMessage(message) {
    if (typeof (message) === "string") {
        message = strings_1.toUtf8Bytes(message);
    }
    return blake2b_1.blake2b(bytes_1.concat([
        strings_1.toUtf8Bytes(exports.messagePrefix),
        strings_1.toUtf8Bytes(String(message.length)),
        message
    ]));
}
exports.hashMessage = hashMessage;
