import { AbiCoder as _AbiCoder, CoerceFunc, ConstructorFragment, EventFragment, Fragment, FunctionFragment, JsonFragment, JsonFragmentType, ParamType } from "@ethersproject/abi";
import { Coder, Reader, Writer } from "@ethersproject/abi/coders/abstract-coder";
import { Indexed, Interface as _Interface } from "@ethersproject/abi/interface";
import { AvmCoder, defaultAvmCoder } from "./avm-coder";
import { AvmFunctionFragment, AvmParamType } from "./avm-fragments";
import { AvmInterface } from "./avm-interface";
export declare class AddressCoder extends Coder {
    constructor(localName: string);
    encode(writer: Writer, value: any): number;
    decode(reader: Reader): any;
}
declare class Interface extends _Interface {
    _getAbiCoder(): _AbiCoder;
}
declare class AbiCoder extends _AbiCoder {
    _getWordSize(): number;
    _getCoder(param: ParamType): Coder;
}
declare const defaultAbiCoder: AbiCoder;
export { ConstructorFragment, EventFragment, Fragment, FunctionFragment, ParamType, AbiCoder, defaultAbiCoder, Interface, Indexed, AvmFunctionFragment, AvmParamType, AvmCoder, defaultAvmCoder, AvmInterface, CoerceFunc, JsonFragment, JsonFragmentType };
