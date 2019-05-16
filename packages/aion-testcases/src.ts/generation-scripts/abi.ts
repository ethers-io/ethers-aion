"use strict";

// Use require so we can grab raw-JavaScript code
const { ABI } = require("../thirdparty/ABI");

import { randomHexString, randomNumber, saveTests, TestCase } from "..";

const Types: Array<string> = Object.values(ABI.TYPES);

function getValue(type: string, seed: string): any {
    if (type.substring(type.length - 2) === "[]") {
        if (randomNumber(seed + "-null", 0, 10) === 0) { return null; }

        let result: Array<any> = [];

        let count = randomNumber(seed + "-count", 0, 5);
        for (let i = 0; i < count; i++) {
            result.push(getValue(type.substring(0, type.length - 2), seed + "-sub-" + i));
        }

        return result;
    }

    switch (type) {
        case "byte":
            return (randomNumber(seed + "-value", 0, 0xff) - 0x80);
        case "short":
            return (randomNumber(seed + "-value", 0, 0xffff) - 0x8000);
        case "int":
            return (randomNumber(seed + "-value", 0, 0xffffffff) - 0x80000000);
        case "long":
            // The Aion provided coder does not support the full range
            let sign = (randomNumber(seed + "-sign", 0, 2) === 0) ? 1: -1;
            //return (randomNumber(seed + "-value", 0, 0x3ffffffffffff) * sign);
            return (randomNumber(seed + "-value", 0, 0x7fffffff) * sign);
        case "boolean":
            return (randomNumber(seed + "-value", 0, 2) === 0) ? false: true;
        case "char":
            // @TODO: Better?
            return String.fromCharCode(randomNumber(seed + "-value", 32, 126));
        case "String":
            if (randomNumber(seed + "-null", 0, 10) === 0) { return null; }
            // @TODO: Better?
            return "Foobar";
        case "Address":
            if (randomNumber(seed + "-null", 0, 10) === 0) { return null; }
            return "0xa0" + randomHexString(seed + "-value", 31).substring(2);
        case "float":
        case "double":
            return parseFloat(String(randomNumber(seed + "-value", -100000, 100000) / 100));
    }
}

let Tests: Array<TestCase.ABI> = [ ];

for (let i = 0; i < 20000; i++) {
    let seed = String('testcase-' + i);

    let count = randomNumber(seed, 1, 10);
    let types: Array<string> = [];
    for (let i = 0; i < count; i++) {
        types.push(Types[randomNumber(seed + "-type-" + i, 0, Types.length)]);
    }

    let values: Array<any> = types.map((type, index) => getValue(type, seed + "-value-" + index));

    let data = ABI.encodeToHex(types, values);

    let callBase = ABI.method("testMethod");
    let callCoder = callBase.argTypes.apply(callBase, types);
    let callData = callCoder.encodeToHex.apply(callCoder, values);

    let deployJar = new Uint8Array(Buffer.from("Hello World"));
    let deployBase = ABI.deployJar(deployJar);
    let deployCoder = deployBase.initTypes.apply(deployBase, types);
    let deployData = deployCoder.encodeToHex.apply(deployCoder, values);

    Tests.push({
        data: data,
        callData: callData,
        deployData: deployData,
        types: types,
        values: values
    });
}

function getComplexity(types: Array<string>): number {
    let params = types.join(", ");

    // Count the double-arrays
    let double = params.length;
    params = params.replace(/\[\]\[\]/g, "XXX");
    double -= params.length;

    // Count the single arrays
    let single = params.length;
    params = params.replace(/\[\]/g, "X");
    single -= params.length;

    // Count the length
    return double * (1 << 20) + single * (1 << 10) + types.length;
}

Tests.sort((a, b) => {
    return getComplexity(a.types) - getComplexity(b.types);
});

saveTests("abi", Tests);
