"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var blake2b_1 = __importDefault(require("blake2b"));
var bytes_1 = require("@ethersproject/bytes");
function blake2b(data) {
    var output = new Uint8Array(32);
    blake2b_1.default(32).update(bytes_1.arrayify(data)).digest(output);
    return bytes_1.hexlify(output);
}
exports.blake2b = blake2b;
