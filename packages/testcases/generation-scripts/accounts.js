'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var aion_web3_1 = __importDefault(require("aion-web3"));
var __1 = require("..");
var web3 = new aion_web3_1.default(null);
var testcases = [];
for (var i = 0; i < 1024; i++) {
    var entropy = __1.randomHexString('account-' + i, 64);
    var account = web3.eth.accounts.wallet._accounts.create(entropy);
    testcases.push({
        name: ("random-" + i),
        entropy: entropy,
        privateKey: account.privateKey,
        publicKey: ("0x" + account.publicKey.toString("hex")),
        address: aion_web3_1.default.utils.toChecksumAddress(account.address)
    });
}
console.log(testcases);
__1.saveTests("accounts", testcases);
