export declare class ParamType {
    readonly name: string;
    readonly type: string;
    constructor(constructorGuard: any, name: string, type: string);
    static fromString(value: string): ParamType;
}
export declare class FunctionFragment {
    readonly inputs: Array<ParamType>;
    readonly name: string;
    readonly output: string;
    constructor(constructorGuard: any, name: string, inputs: Array<ParamType>, output: string);
    static fromString(value: string): FunctionFragment;
}
export declare class Interface {
    readonly version: string;
    readonly name: string;
    readonly functions: Array<FunctionFragment>;
    constructor(constructorGuard: any, version: string, name: string, functions: Array<FunctionFragment>);
    static fromString(abi: string | Array<string>): Interface;
}
