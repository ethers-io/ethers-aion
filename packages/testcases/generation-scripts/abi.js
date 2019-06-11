"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Use require so we can grab raw-JavaScript code
var ABI = require("../thirdparty/ABI").ABI;
var __1 = require("..");
var Types = Object.keys(ABI.TYPES).map(function (key) { return ABI.TYPES[key]; });
function getValue(type, seed) {
    if (type.substring(type.length - 2) === "[]") {
        if (__1.randomNumber(seed + "-null", 0, 10) === 0) {
            return null;
        }
        var result = [];
        var count = __1.randomNumber(seed + "-count", 0, 5);
        for (var i = 0; i < count; i++) {
            result.push(getValue(type.substring(0, type.length - 2), seed + "-sub-" + i));
        }
        return result;
    }
    switch (type) {
        case "byte":
            return (__1.randomNumber(seed + "-value", 0, 0xff) - 0x80);
        case "short":
            return (__1.randomNumber(seed + "-value", 0, 0xffff) - 0x8000);
        case "int":
            return (__1.randomNumber(seed + "-value", 0, 0xffffffff) - 0x80000000);
        case "long":
            // The Aion provided coder does not support the full range
            var sign = (__1.randomNumber(seed + "-sign", 0, 2) === 0) ? 1 : -1;
            //return (randomNumber(seed + "-value", 0, 0x3ffffffffffff) * sign);
            return (__1.randomNumber(seed + "-value", 0, 0x7fffffff) * sign);
        case "boolean":
            return (__1.randomNumber(seed + "-value", 0, 2) === 0) ? false : true;
        case "char":
            // @TODO: Better?
            return String.fromCharCode(__1.randomNumber(seed + "-value", 32, 126));
        case "String":
            if (__1.randomNumber(seed + "-null", 0, 10) === 0) {
                return null;
            }
            // @TODO: Better?
            return "Foobar";
        case "Address":
            if (__1.randomNumber(seed + "-null", 0, 10) === 0) {
                return null;
            }
            return "0xa0" + __1.randomHexString(seed + "-value", 31).substring(2);
        case "float":
        case "double":
            return parseFloat(String(__1.randomNumber(seed + "-value", -100000, 100000) / 100));
    }
}
var Tests = [];
var _loop_1 = function (i) {
    var seed = String('testcase-' + i);
    var count = __1.randomNumber(seed, 1, 10);
    var types = [];
    for (var i_1 = 0; i_1 < count; i_1++) {
        types.push(Types[__1.randomNumber(seed + "-type-" + i_1, 0, Types.length)]);
    }
    var values = types.map(function (type, index) { return getValue(type, seed + "-value-" + index); });
    var data = ABI.encodeToHex(types, values);
    var callBase = ABI.method("testMethod");
    var callCoder = callBase.argTypes.apply(callBase, types);
    var callData = callCoder.encodeToHex.apply(callCoder, values);
    var deployJar = new Uint8Array(Buffer.from("Hello World"));
    var deployBase = ABI.deployJar(deployJar);
    var deployCoder = deployBase.initTypes.apply(deployBase, types);
    var deployData = deployCoder.encodeToHex.apply(deployCoder, values);
    Tests.push({
        data: data,
        callData: callData,
        deployData: deployData,
        types: types,
        values: values
    });
};
for (var i = 0; i < 20000; i++) {
    _loop_1(i);
}
function getComplexity(types) {
    var params = types.join(", ");
    // Count the double-arrays
    var double = params.length;
    params = params.replace(/\[\]\[\]/g, "XXX");
    double -= params.length;
    // Count the single arrays
    var single = params.length;
    params = params.replace(/\[\]/g, "X");
    single -= params.length;
    // Count the length
    return double * (1 << 20) + single * (1 << 10) + types.length;
}
Tests.sort(function (a, b) {
    return getComplexity(a.types) - getComplexity(b.types);
});
__1.saveTests("abi", Tests);
