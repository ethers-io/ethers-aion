"use strict";

import { AbiCoder as _AbiCoder, CoerceFunc, ConstructorFragment, EventFragment, Fragment, FunctionFragment, JsonFragment, JsonFragmentType, ParamType } from "@ethersproject/abi";
import { Coder, Reader, Writer } from "@ethersproject/abi/coders/abstract-coder";
import { Indexed, Interface as _Interface } from "@ethersproject/abi/interface";
import { hexDataSlice, hexlify } from "@ethersproject/bytes";

import { getAddress } from "@ethersproject-aion/address";

import { AvmCoder, defaultAvmCoder } from "./avm-coder";
import { AvmFunctionFragment, AvmParamType } from "./avm-fragments";
import { AvmInterface } from "./avm-interface";


export class AddressCoder extends Coder {
    constructor(localName: string) {
        super("address", "address", localName, false);
    }

    encode(writer: Writer, value: any): number {
        try {
            // @TODO:
        } catch (error) {
            this._throwError(error.message, value);
        }
        let length = writer.writeBytes(hexDataSlice(value, 0, 16));
        length += writer.writeBytes(hexDataSlice(value, 16));
        return length;
    }

    decode(reader: Reader): any {
        return getAddress(hexlify(reader.readBytes(32)));
    }
}

class Interface extends _Interface {
    _getAbiCoder(): _AbiCoder {
        return defaultAbiCoder;
    }
}

class AbiCoder extends _AbiCoder {
    _getWordSize(): number { return 16; }

    _getCoder(param: ParamType): Coder {
        if (param.type === "address") {
            return new AddressCoder(param.name);
        }

        return super._getCoder(param);
    }
}

const defaultAbiCoder = new AbiCoder();


export {
    ConstructorFragment,
    EventFragment,
    Fragment,
    FunctionFragment,
    ParamType,

    AbiCoder,
    defaultAbiCoder,

    Interface,
    Indexed,

    AvmFunctionFragment,
    AvmParamType,

    AvmCoder,
    defaultAvmCoder,

    AvmInterface,


    /////////////////////////
    // Types

    CoerceFunc,
    JsonFragment,
    JsonFragmentType
};
/*

let address = "0x1234567890123456789012345678901234567890123456789012345678900123";
let string = "Hello World";
console.log(defaultAvmCoder.encode([ "short", "long", "byte", "Address", "String" ], [ 1, 2, 3, address, string]));

console.log(defaultAvmCoder.encode([ "int", "String[]", "boolean" ], [ 5, [ "foo", "Bar" ], false ]));

let iface = AvmInterface.fromString(`
    0.0
    com.thing.Foobar
    void testMethod(int a, String[] b, boolean c)
    void moreComplexity1(float a, long[] b)
    void moreComplexity(float a, long[] b, int[][] c, Address d, double[] e)
`);
console.log("Expected:", "0x21000a746573744d6574686f64050000000531210002210003666f6f2100036261720200");
console.log("Actual:  ", iface.encodeFunctionData("testMethod", [ 5, [ "foo", "Bar" ], false ]));
console.log("Expected:", "0x21000a746573744d6574686f6405000013883231210200");
console.log("Actual:  ", iface.encodeFunctionData("testMethod", [ 5000, null, false ]));
console.log("Expected:", "0x21000a746573744d6574686f6405fffffffb31210003210003666f6f21000362617232210201");
console.log("Actual:  ", iface.encodeFunctionData("testMethod", [ -5, ["foo", "bar", null ], true ]));

console.log("Expected:", "0x21000f6d6f7265436f6d706c65786974793107c11deb85160001ffffffffffffffff");
console.log("Actual:  ", iface.encodeFunctionData(
    "moreComplexity1", [ -9.87, [-1] ]
));
*/
/*
console.log("Expected:", "0x21000e6d6f7265436f6d706c657869747907c11deb85160003ffffffffffffffff0000000000000378ffffffff88ca6c003115000315000200000005000003e8150001fffffc1915000022a090690831c6bc3a3e00fe7ef1364b4b3e2b3afac0984e3a62b8f77c8d4c5ae5180002bff00000000000004014000000000000");
console.log("Actual:  ", iface.encodeFunctionData(
    "moreComplexity", [ -9.87, [-1, 888, -2000000000], [ [5, 1000],[-999],[]], "0xa090690831c6bc3a3e00fe7ef1364b4b3e2b3afac0984e3a62b8f77c8d4c5ae5", [-1.0, 5.0]]
));

let enc = defaultAvmCoder.encode([ "float" ], [ -4.5 ]);
console.log("ENC", enc);
console.log("DEC", defaultAvmCoder.decode([ "float" ], enc));
*/
