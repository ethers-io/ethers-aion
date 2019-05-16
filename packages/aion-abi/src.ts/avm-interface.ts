"use strict";

import { BytesLike, hexConcat } from "@ethersproject/bytes";
import * as errors from "@ethersproject/errors";
import { defineReadOnly } from "@ethersproject/properties";

import { defaultAvmCoder } from "./avm-coder";
import { AvmFunctionFragment, AvmParamType, checkIdentifier } from "./avm-fragments";

const _constructorGuard = { };

/*

const validBaseTypes = [
    "address", "boolean", "byte", "char", "double", "float", "int", "long", "short", "String"
];

function checkIdentifier(value: string): string {
    if (!value.match(/^[a-z_][a-z0-9_]*$/i)) {
        errors.throwArgumentError("invalid identifier", "value", value);
    }
    return value;
}

function checkType(value: string): string {
    let throwError = () => {
        errors.throwArgumentError("invalid type", "value", value);
    }

    let match = value.match(/^([a-z0-9_]*)(|\[\]|\[\]\[\])$/i);
    if (!match) { throwError(); }
    if (validBaseTypes.indexOf(match[1]) === -1) { throwError(); }

    return value;
}

export class AvmParamType {
    readonly name: string;
    readonly type: string;

    constructor(constructorGuard: any, name: string, type: string) {
        errors.
        checkNew(this, AvmParamType);
        if (constructorGuard !== _constructorGuard) {
            throw new Error("do not instantiate directly use fromString");
        }

        defineReadOnly(this, "name", checkIdentifier(name));
        defineReadOnly(this, "type", checkType(type));
    }

    format(expanded?: boolean): string {
        if (expanded) { return (this.name + " " this.type); }
        return this.type;
    }

    static fromString(value: string): AvmParamType {
        let comps = value.trim().replace(/\[\s*\]/g, "[]").replace(/\s+/g, " ").split(" ");
        if (comps.length !== 2) { errors.throwArgumentError("invalid param type", "value", value); }
        return new AvmParamType(_constructorGuard, comps[1].trim(), comps[0].trim());
    }
}

export class AvmFunctionFragment {
    readonly inputs: Array<AvmParamType>;
    readonly name: string;
    readonly output: string;

    constructor(constructorGuard: any, name: string, inputs: Array<AvmParamType>, output: string) {
        errors.checkNew(this, AvmFunctionFragment);
        if (constructorGuard !== _constructorGuard) {
            throw new Error("do not instantiate directly use fromString");
        }

        checkIdentifier(name);
        defineReadOnly(this, "name", checkIdentifier(name));

        defineReadOnly(this, "inputs", inputs.slice());
        Object.freeze(this.inputs);

        defineReadOnly(this, "output", output);
    }

    format(expanded?: boolean): string {
        let delim = (expanded ? ", ": ",");
        return (this.output + " " +
                this.name + "(" +
                this.inputs.map(i => i.format(expanded)).join(delim) + ")");
    }

    static fromString(value: string): AvmFunctionFragment {
        // Remove leader/trailing whitespace and remove space from brackets
        value = value.trim().replace(/\s*\[\s*\]/g, "[]");
        console.log(value);

        let match = value.match(/^([a-z0-9_\]\[]+)\s+([a-z_][a-z0-9_]*)\s*\(([^)]*)\)\s*$/i);
        if (!match) {
            errors.throwArgumentError("invalid abi fragment", "value", value);
        }

        let output = match[1].trim();
        if (output === "void") {
            output = null;
        } else {
            output = (new AvmParamType(_constructorGuard, "_", match[1].trim())).type;
        }
        let name = match[2].trim();
        let inputs: Array<AvmParamType> = [ ];
        if (match[3].trim() !== "") {
            inputs = match[3].split(",").map((input) => AvmParamType.fromString(input));
        }

        return new AvmFunctionFragment(_constructorGuard, name.trim(), inputs, output);
    }
}
*/

export class AvmInterface {
    readonly version: string;
    readonly name: string;
    readonly functions: { [ signature: string ]: AvmFunctionFragment };

    constructor(constructorGuard: any, version: string, name: string, functions: Array<AvmFunctionFragment>) {
        errors.checkNew(new.target, AvmInterface);

        if (constructorGuard !== _constructorGuard) {
            throw new Error("do not instantiate directly use fromString");
        }

        if (version !== "0.0") { errors.throwArgumentError("unsupported version", "version", version); }
        defineReadOnly(this, "version", version);

        name = name.split(".").map((comp) => checkIdentifier(comp.trim())).join(".");
        defineReadOnly(this, "name", name);

        let funcs: { [ signature: string ]: AvmFunctionFragment } = { };
        let unique: { [ signature: string ]: Array<AvmFunctionFragment> } = { }

        // Add each function by signature, and track non-overloaded functions
        functions.forEach((func) => {
             if (!unique[func.name]) { unique[func.name] = [ ]; }
             unique[func.name].push(func);
             funcs[func.format()] = func;
        });

        // Add bare names for non-overloaded functions
        Object.values(unique).forEach((funcList) => {
            let func = funcList[0];
            if (funcList.length !== 1) {
                 errors.warn("duplicate definition for " + func.name + "; skipping bare name");
                 return;
            }
            funcs[func.name] = func;
        });

        Object.freeze(funcs);

        defineReadOnly(this, "functions", funcs);
    }

    getFunction(nameOrSignature: string): AvmFunctionFragment {
        if (nameOrSignature.indexOf("(") === -1) {
            return this.functions[nameOrSignature];
        }

        return this.functions[AvmFunctionFragment.fromString(nameOrSignature).format()];
    }

    _encodeParams(params: Array<AvmParamType>, values: Array<any>): string {
        return defaultAvmCoder.encode( params, values);
    }

    //encodeDeploy(): string {
    //    return null;
    //}

    encodeFunctionData(functionFragment: string | AvmFunctionFragment, values: Array<any>): string {
        if (typeof(functionFragment) === "string") {
            functionFragment = this.getFunction(functionFragment);
        }

        return hexConcat([
            defaultAvmCoder.encode([ "String" ], [ functionFragment.name ]),
            this._encodeParams(functionFragment.inputs, values)
        ]);
    }

    decodeFunctionResult(functionFragment: string | AvmFunctionFragment, data: BytesLike): any {
        if (typeof(functionFragment) === "string") {
            functionFragment = this.getFunction(functionFragment);
        }

        return defaultAvmCoder.decode( [ functionFragment.output ], data);
    }

    //parseTransaction(tx: { data: string, value?: BigNumberish }): TransactionDescription {
    //}

    static fromString(abi: string | Array<string>): AvmInterface {

        if (typeof(abi) === "string") {
            abi = abi.split("\n");
        }

        let version: string = null;
        let name: string = null;
        let functions: Array<AvmFunctionFragment> = [];

        abi.forEach((line) => {
            line = line.trim();
            if (line === "") { return; }
            if (line.match(/^([0-9.]+)$/)) {
                version = line;
                return;
            }
            if (line.match(/^[a-z0-9_. ]*$/i)) {
                name = line;
                return;
            }
            functions.push(AvmFunctionFragment.fromString(line));
        });

        if (!version) {
            throw new Error("no interface version");
        }

        if (!name) {
            throw new Error("no interface name");
        }

        return new AvmInterface(_constructorGuard, version, name, functions);;
    }
}

