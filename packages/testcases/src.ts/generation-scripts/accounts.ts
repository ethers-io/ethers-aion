'use strict';

import Web3 from "aion-web3";

import { randomHexString, saveTests } from "..";

let web3 = new Web3(null);


let testcases = [];

for (let i = 0; i < 1024; i++) {
    let entropy = randomHexString('account-' + i, 64);
    let account = web3.eth.accounts.wallet._accounts.create(entropy);
    testcases.push({
        name: ("random-" + i),
        entropy: entropy,
        privateKey: account.privateKey,
        publicKey: ("0x" + account.publicKey.toString("hex")),
        address: Web3.utils.toChecksumAddress(account.address)
    });
}

console.log(testcases);
saveTests("accounts", testcases);
