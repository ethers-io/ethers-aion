import { BytesLike } from "@ethersproject/bytes";
import { AvmFunctionFragment, AvmParamType } from "./avm-fragments";
export declare class AvmInterface {
    readonly version: string;
    readonly name: string;
    readonly functions: {
        [signature: string]: AvmFunctionFragment;
    };
    constructor(constructorGuard: any, version: string, name: string, functions: Array<AvmFunctionFragment>);
    getFunction(nameOrSignature: string): AvmFunctionFragment;
    _encodeParams(params: Array<AvmParamType>, values: Array<any>): string;
    encodeFunctionData(functionFragment: string | AvmFunctionFragment, values: Array<any>): string;
    decodeFunctionResult(functionFragment: string | AvmFunctionFragment, data: BytesLike): any;
    static fromString(abi: string | Array<string>): AvmInterface;
}
