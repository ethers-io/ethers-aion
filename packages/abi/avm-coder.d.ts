import { BytesLike } from "@ethersproject/bytes";
import { AvmParamType } from "./avm-fragments";
export declare const TagNull = 50;
export declare class Writer {
    protected _data: Uint8Array;
    constructor();
    readonly data: string;
    readonly length: number;
    writeByte(value: number): number;
    writeBytes(bytes: BytesLike): number;
    writeLength(length: number): number;
}
export declare class Reader {
    protected _data: Uint8Array;
    protected _offset: number;
    constructor(data: BytesLike);
    readonly consumed: number;
    peekBytes(count: number): Uint8Array;
    peekByte(): number;
    readBytes(count: number): Uint8Array;
    readByte(): number;
    readLength(): number;
}
export declare abstract class Coder {
    readonly tag: number;
    readonly type: string;
    readonly localName: string;
    constructor(type: string, tag: number, localName: string);
    _throwError(message: string, value: any): never;
    abstract decodeValue(reader: Reader): any;
    abstract encodeValue(writer: Writer, value: any): void;
    abstract decode(reader: Reader): any;
    abstract encode(writer: Writer, value: any): void;
}
export declare abstract class PrimitiveCoder extends Coder {
    decode(reader: Reader): any;
    encode(writer: Writer, value: any): void;
}
export declare class NumberCoder extends PrimitiveCoder {
    readonly byteCount: number;
    constructor(type: string, byteCount: number, tag: number, localName: string);
    decodeValue(reader: Reader): any;
    encodeValue(writer: Writer, value: any): void;
}
export declare class BooleanCoder extends NumberCoder {
    constructor(localName: string);
    decodeValue(reader: Reader): any;
    encodeValue(writer: Writer, value: any): void;
}
export declare class CharCoder extends NumberCoder {
    constructor(localName: string);
    decodeValue(reader: Reader): any;
    encodeValue(writer: Writer, value: any): void;
}
export declare class FloatCoder extends PrimitiveCoder {
    readonly byteCount: number;
    constructor(type: string, byteCount: number, tag: number, localName: string);
    decodeValue(reader: Reader): any;
    encodeValue(writer: Writer, value: any): void;
}
export declare abstract class NullableCoder extends Coder {
    decodeNull(reader: Reader): any;
    encodeNull(writer: Writer): void;
    decode(reader: Reader): any;
    encode(writer: Writer, value: any): void;
}
export declare class PrimitiveArrayCoder extends NullableCoder {
    readonly coder: Coder;
    constructor(coder: Coder);
    decodeValue(reader: Reader): any;
    encodeValue(writer: Writer, value: Array<any>): void;
}
export declare class StringCoder extends NullableCoder {
    constructor(localName: string);
    decodeValue(reader: Reader): any;
    encodeValue(writer: Writer, value: any): void;
}
export declare class AddressCoder extends NullableCoder {
    constructor(localName: string);
    decodeValue(reader: Reader): any;
    encodeValue(writer: Writer, value: any): void;
}
export declare class ArrayCoder extends NullableCoder {
    readonly coder: Coder;
    constructor(coder: Coder, localName: string);
    decodeNull(reader: Reader): any;
    encodeNull(writer: Writer): void;
    decodeValue(reader: Reader): any;
    encodeValue(writer: Writer, value: Array<any>): void;
}
export declare class AvmCoder {
    constructor();
    _getCoder(param: string | AvmParamType): Coder;
    _getReader(data: Uint8Array): Reader;
    _getWriter(): Writer;
    encode(types: Array<string | AvmParamType>, values: Array<any>): string;
    decode(types: Array<string>, data: BytesLike): any;
}
export declare const defaultAvmCoder: AvmCoder;
