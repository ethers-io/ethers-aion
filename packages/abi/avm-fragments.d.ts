export declare function checkIdentifier(value: string): string;
export declare class AvmParamType {
    readonly name: string;
    readonly type: string;
    constructor(constructorGuard: any, name: string, type: string);
    format(expanded?: boolean): string;
    static fromString(value: string): AvmParamType;
}
export declare class AvmFunctionFragment {
    readonly inputs: Array<AvmParamType>;
    readonly name: string;
    readonly output: string;
    constructor(constructorGuard: any, name: string, inputs: Array<AvmParamType>, output: string);
    format(expanded?: boolean): string;
    static fromString(value: string): AvmFunctionFragment;
}
