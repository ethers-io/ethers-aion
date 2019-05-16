'use strict';

import assert from 'assert';

import { aion } from "@ethersproject-aion/ethers";
import { loadTests } from "@ethersproject-aion/testcases";


type TestCase = {
    name: string;
    address: string;
    privateKey: string;
    publicKey: string;
    entropy: string;
};
/*
describe('Private key generation', function() {
    let tests: Array<TestCase> = loadTests('accounts');
    tests.forEach((test) => {
        if (!test.privateKey) { return; }
        it(('correctly converts private key - ' + test.name), function() {
            let wallet = new aion.Wallet(test.privateKey);
            assert.equal(wallet.address.toLowerCase(), test.address.toLowerCase(),
                'correctly computes privateKey - ' + test.privateKey);
        });
    });
});
*/
describe('Checksum address generation', function() {
    let tests: Array<TestCase> = loadTests('accounts');
    tests.forEach((test) => {
        it(('correctly transforms address - ' + test.name), function() {
            assert.equal(aion.utils.getAddress(test.address), test.address,
                'correctly computes checksum address from address');
            assert.equal(aion.utils.getAddress(test.address.toLowerCase()), test.address,
                'correctly computes checksum address from address');
        });
    });
});

describe("Wallet from Private Keys", function() {
    let tests: Array<TestCase> = loadTests('accounts');
    tests.forEach((test) => {
        it(('creates a wallet - ' + test.name), function() {
            let wallet = new aion.Wallet(test.privateKey);
            assert.equal(wallet.publicKey, test.publicKey,
                'correctly computes public key');
            assert.equal(wallet.address, test.address,
                'correctly computes checksum address from address');
        });
    });
});
