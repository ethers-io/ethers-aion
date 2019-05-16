"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __importDefault(require("assert"));
var ethers_1 = require("@ethersproject-aion/ethers");
var testcases_1 = require("@ethersproject-aion/testcases");
describe("ABI coding", function () {
    var tests = testcases_1.loadTests("abi");
    tests.forEach(function (test, index) {
        var types = test.types.join(", ");
        it("test " + index + ": " + types, function () {
            var data = ethers_1.aion.utils.defaultAvmCoder.encode(test.types, test.values);
            assert_1.default.equal(data, test.data, "matches - " + types);
        });
    });
});
