"use strict";

import assert from 'assert';

import { aion } from "@ethersproject-aion/ethers";
import { loadTests, TestCase } from "@ethersproject-aion/testcases";

describe("ABI coding", function() {
    let tests: Array<TestCase.ABI> = loadTests("abi");
    tests.forEach((test, index) => {
        let types = test.types.join(", ");
        it("test " + index + ": " + types, function() {
           let data = aion.utils.defaultAvmCoder.encode(test.types, test.values);
           assert.equal(data, test.data, "matches - " + types);
        });
    });
});
