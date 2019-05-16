"use strict";

import { arrayify, BytesLike, concat, hexlify, zeroPad } from "@ethersproject/bytes";
import { BigNumber } from "@ethersproject/bignumber";
import * as errors from "@ethersproject/errors";
import { defineReadOnly } from "@ethersproject/properties";
import { toUtf8Bytes, toUtf8String } from "@ethersproject/strings";

import { getAddress } from "@ethersproject-aion/address";

import { AvmParamType } from "./avm-fragments";

export const TagNull = 0x32;

export class Writer {
    protected _data: Uint8Array;

    constructor() {
        this._data = arrayify([ ]);
    }

    get data(): string { return hexlify(this._data); }
    get length(): number { return this._data.length; }

    writeByte(value: number): number {
        return this.writeBytes([ value ]);
    }

    writeBytes(bytes: BytesLike): number {
        this._data = concat([ this._data, bytes ]);
        return arrayify(bytes).length;
    }

    writeLength(length: number): number {
        if (length > 0xffff) { throw new Error("length out of bounds"); }
        return this.writeBytes([ (length >> 16), (length & 0xff) ]);
    }
}

export class Reader {
    protected _data: Uint8Array;
    protected _offset: number;

    constructor(data: BytesLike) {
        defineReadOnly(this, "_data", arrayify(data));
        this._offset = 0;
    }

    get consumed(): number { return this._offset; }

    peekBytes(count: number): Uint8Array {
        let value = this._data.slice(this._offset, this._offset + count);
        if (value.length !== count) {
            throw new Error("out-of-bounds");
        }
        return value;
    }

    peekByte(): number {
        return this.peekBytes(1)[0];
    }

    readBytes(count: number): Uint8Array {
        let value = this.peekBytes(count);
        this._offset += count;
        return value;
    }

    readByte(): number {
        return this.readBytes(1)[0];
    }

    readLength(): number {
        let bytes = this.readBytes(2);
        return (bytes[0] << 8) | bytes[1];
    }
}

export abstract class Coder {

    // The coder byte pattern tag
    readonly tag: number;

    // The fully expanded type, including composite types:
    //   - address, short[][], etc.
    readonly type: string;

    // The localName bound in the signature, in this example it is "baz":
    //   - byte[] baz
    readonly localName: string;

    constructor(type: string, tag: number, localName: string) {
        this.type = type;
        this.tag = tag;
        this.localName = localName;
    }

    _throwError(message: string, value: any): never {
        return errors.throwError(message, errors.INVALID_ARGUMENT, {
            argument: this.localName,
            coder: this,
            value: value
        });
    }

    abstract decodeValue(reader: Reader): any ;
    abstract encodeValue(writer: Writer, value: any): void;

    abstract decode(reader: Reader): any;
    abstract encode(writer: Writer, value: any): void;

}

export abstract class PrimitiveCoder extends Coder {
    decode(reader: Reader): any {
        let tag = reader.readByte();
        if (tag !== this.tag) { this._throwError("invalid tag", tag); }
        return this.decodeValue(reader);
    }

    encode(writer: Writer, value: any): void {
        if (value == null) { this._throwError("cannot be null", value); }
        writer.writeByte(this.tag);
        this.encodeValue(writer, value);
    }
}

export class NumberCoder extends PrimitiveCoder {
    readonly byteCount: number;

    constructor(type: string, byteCount: number, tag: number, localName: string) {
        super(type, tag, localName);
        this.byteCount = byteCount;
    }

    decodeValue(reader: Reader): any {
        let value = BigNumber.from(reader.readBytes(this.byteCount)).fromTwos(this.byteCount * 8);
        if (this.byteCount <= 6) {
            return value.toNumber();
        }
        return value;
    }

    encodeValue(writer: Writer, value: any): void {
        let bytes = zeroPad(arrayify(BigNumber.from(value).toTwos(this.byteCount * 8)), this.byteCount);
        writer.writeBytes(bytes);
    }
}

export class BooleanCoder extends NumberCoder {
    constructor(localName: string) {
        super("boolean", 1, 0x02, localName);
    }

    decodeValue(reader: Reader): any {
        return !!super.decodeValue(reader);
    }

    encodeValue(writer: Writer, value: any): void {
        super.encodeValue(writer, (!value) ? 0x00: 0x01);
    }
}

export class CharCoder extends NumberCoder {
    constructor(localName: string) {
        super("char", 2, 0x03, localName);
    }

    decodeValue(reader: Reader): any {
        return String.fromCharCode(super.decodeValue(reader));
    }

    encodeValue(writer: Writer, value: any): void {
        if (value.length !== 1) { throw new Error("char must be 1 char long"); }
        super.encodeValue(writer, value.charCodeAt(0));
    }
}

export class FloatCoder extends PrimitiveCoder {
    readonly byteCount: number;

    constructor(type: string, byteCount: number, tag: number, localName: string) {
        super(type, tag, localName);
        this.byteCount = byteCount;
    }

    decodeValue(reader: Reader): any {
        let view = new DataView(reader.readBytes(this.byteCount).buffer);
        if (this.byteCount === 4) {
            return view.getFloat32(0);
        }
        return view.getFloat64(0);
    }

    encodeValue(writer: Writer, value: any): void {
        let buffer = new ArrayBuffer(this.byteCount);
        let view = new DataView(buffer);
        if (this.byteCount === 4) {
            view.setFloat32(0, value);
        } else {
            view.setFloat64(0, value);
        }
        writer.writeBytes(new Uint8Array(buffer, 0, this.byteCount));
    }
}


export abstract class NullableCoder extends Coder {

    decodeNull(reader: Reader): any {
        if (reader.readByte() !== TagNull) { throw new Error("not null"); }
        if (reader.readByte() !== this.tag) { throw new Error("wrong null type"); }
        return null;
    }

    encodeNull(writer: Writer): void {
        writer.writeBytes([ TagNull, this.tag ]);
    }

    /*
    decodeValue(reader: Reader): any {
        return this.decodeValue(reader);
    }

    encodeValue(writer: Writer, value: any): void {
        this.encodeValue(writer, value);
    }
    */

    decode(reader: Reader): any {
        if (reader.peekByte() === TagNull) {
            return this.decodeNull(reader);
        } else {
            if (reader.readByte() !== this.tag) { throw new Error("tag mismatch"); }
            return this.decodeValue(reader);
        }
    }

    encode(writer: Writer, value: any): void {
        if (value == null) {
            this.encodeNull(writer);
        } else {
            writer.writeByte(this.tag);
            this.encodeValue(writer, value);
        }
    }
}

export class PrimitiveArrayCoder extends NullableCoder {
    readonly coder: Coder;

    constructor(coder: Coder) {
        if (coder.tag >= 0x10) { throw new Error("primitive coder requires tag < 0x10"); }
        super(coder.type + "[]", (coder.tag | 0x10), coder.localName);
        defineReadOnly(this, "coder", coder);
    }

    decodeValue(reader: Reader): any {
        let count = reader.readLength();

        let result = [ ];
        for (let i = 0; i < count; i++) {
            result.push(this.coder.decodeValue(reader));
        }
        return result;
    }

    encodeValue(writer: Writer, value: Array<any>): void {
        writer.writeLength(value.length);
        value.forEach((value) => {
            this.coder.encodeValue(writer, value);
        });
    }
}

export class StringCoder extends NullableCoder {
    constructor(localName: string) {
        super("String", 0x21, localName);
    }

    decodeValue(reader: Reader): any {
        let length = reader.readLength();
        return toUtf8String(reader.readBytes(length));
    }

    encodeValue(writer: Writer, value: any): void {
        let bytes = toUtf8Bytes(value);
        writer.writeLength(bytes.length);
        writer.writeBytes(bytes);
    }

}

export class AddressCoder extends NullableCoder {
    constructor(localName: string) {
        super("address", 0x22, localName);
    }

    decodeValue(reader: Reader): any {
        return getAddress(hexlify(reader.readBytes(32)));
    }

    encodeValue(writer: Writer, value: any): void {
        writer.writeBytes(getAddress(value));
    }
}

export class ArrayCoder extends NullableCoder {
    readonly coder: Coder;

    constructor(coder: Coder, localName: string) {
        super(coder.type + "[]", 0x31, localName);
        this.coder = coder;
    }

    decodeNull(reader: Reader): any {
        super.decodeNull(reader);
        let tag = reader.readByte();
        if (tag !== this.coder.tag) { throw new Error("wrong child tag"); }
        return null;
    }

    encodeNull(writer: Writer): void {
        super.encodeNull(writer);
        writer.writeByte(this.coder.tag);
    }

    decodeValue(reader: Reader): any {
        let tag = reader.readByte();
        if (tag !== this.coder.tag) { throw new Error("wrong child tag"); }

        let length = reader.readLength();
        let result = [];
        for (let i = 0; i < length; i++) {
            result.push(this.coder.decode(reader));
        }
        return result;
    }

    encodeValue(writer: Writer, value: Array<any>): void {
        writer.writeByte(this.coder.tag);
        writer.writeLength(value.length);
        value.forEach((value) => {
            this.coder.encode(writer, value);
        });
    }
}

//const stringCoder = new StringCoder("_");

export class AvmCoder {

    constructor() {
        errors.checkNew(new.target, AvmCoder);
    }

    _getCoder(param: string | AvmParamType): Coder {
        if (typeof(param) !== "string") {
            param = param.type;
        }
        // @TODO: nomalize the param; remove spaces, etc

        let comps = param.trim().split(" ").map((comp) => comp.trim());

        param = comps[0];
        let localName = comps[1] || null;

        if (param.substring(param.length - 2) === "[]") {
            let subcoder = this._getCoder(param.substring(0, param.length - 2))
            if (subcoder.tag <= 0x10) {
                return new PrimitiveArrayCoder(subcoder);
            }
            return new ArrayCoder(subcoder, localName);
        }

        switch (param) {
            case "byte":
                return new NumberCoder("byte", 1, 0x01, localName);
            case "short":
                return new NumberCoder("short", 2, 0x04, localName);
            case "int":
                return new NumberCoder("byte", 4, 0x05, localName);
            case "long":
                return new NumberCoder("long", 8, 0x06, localName);

            case "boolean":
                return new BooleanCoder(localName);

            case "char":
                return new CharCoder(localName);

            case "String":
                return new StringCoder(localName);

            case "Address":
                return new AddressCoder(localName);

            case "float":
                return new FloatCoder("float", 4, 0x07, localName);

            case "double":
                return new FloatCoder("double", 8, 0x08, localName);
        }
        throw new Error("unknown - " + param);
    }

    _getReader(data: Uint8Array): Reader {
        return new Reader(data);
    }

    _getWriter(): Writer {
        return new Writer();
    }

    encode(types: Array<string | AvmParamType>, values: Array<any>): string {
        if (types.length !== values.length) {
            errors.throwError("types/values length mismatch", errors.INVALID_ARGUMENT, {
                count: { types: types.length, values: values.length },
                value: { types: types, values: values }
            });
        }

        let coders = types.map((type) => this._getCoder(type));

        let writer = this._getWriter();
        coders.forEach((coder, index) => {
            coder.encode(writer, values[index]);
        });
        //console.log(coders);
        return writer.data;
    }

    // @TODO: Move this to AVMContract
    /*
    encodeCall(method: string, types: Array<string>, values: Array<any>): string {
        let sigWriter = this._getWriter();
        stringCoder.encode(sigWriter, method);
        return hexlify(concat([
            sigWriter.data,
            this.encode(types, values)
        ]));
    }
    */

    decode(types: Array<string>, data: BytesLike): any {

        let reader = this._getReader(arrayify(data));

        let coders: Array<Coder> = types.map((type) => this._getCoder(type));
        let result: Array<any> = [];
        coders.forEach((coder) => {
           result.push(coder.decode(reader));
        });
        return result;
    }

}

export const defaultAvmCoder: AvmCoder = new AvmCoder();

/*
let address = "0x1234567890123456789012345678901234567890123456789012345678900123";
let string = "Hello World";
console.log(defaultAvmCoder.encode([ "short", "long", "byte", "Address", "String" ], [ 1, 2, 3, address, string]));

console.log(defaultAvmCoder.encode([ "int", "String[]", "boolean" ], [ 5, [ "foo", "Bar" ], false  ]));
*/
/*
console.log(defaultAvmCoder.encodeCall("testMethod", [ "int", "String[]", "boolean" ], [ 5, [ "foo", "Bar" ], false ]));
console.log(defaultAvmCoder.encodeCall("testMethod", [ "int", "String[]", "boolean" ], [ 5000, null, false ]));
console.log(defaultAvmCoder.encodeCall("testMethod", [ "int", "String[]", "boolean" ], [ -5, ["foo", "bar", null], true ]));
*/
/*
console.log(defaultAvmCoder.encodeCall(
    "moreComplexity",
    [ "float", "long[]", "int[][]", "Address", "double[]" ],
    [ -9.87, [-1, 888, -2000000000], [[5, 1000],[-999],[] ]]
));
*/
/*
let enc = defaultAvmCoder.encode([ "float" ], [ -4.5 ]);
console.log("ENC", enc);
console.log("DEC", defaultAvmCoder.decode([ "float" ], enc));
*/
