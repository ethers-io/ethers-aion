'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __importDefault(require("assert"));
var ethers_1 = require("@ethersproject-aion/ethers");
var testcases_1 = require("@ethersproject-aion/testcases");
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
describe('Checksum address generation', function () {
    var tests = testcases_1.loadTests('accounts');
    tests.forEach(function (test) {
        it(('correctly transforms address - ' + test.name), function () {
            assert_1.default.equal(ethers_1.aion.utils.getAddress(test.address), test.address, 'correctly computes checksum address from address');
            assert_1.default.equal(ethers_1.aion.utils.getAddress(test.address.toLowerCase()), test.address, 'correctly computes checksum address from address');
        });
    });
});
describe("Wallet from Private Keys", function () {
    var tests = testcases_1.loadTests('accounts');
    tests.forEach(function (test) {
        it(('creates a wallet - ' + test.name), function () {
            var wallet = new ethers_1.aion.Wallet(test.privateKey);
            assert_1.default.equal(wallet.publicKey, test.publicKey, 'correctly computes public key');
            assert_1.default.equal(wallet.address, test.address, 'correctly computes checksum address from address');
        });
    });
});
