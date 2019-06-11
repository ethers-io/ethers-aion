"use strict";

import * as errors from "@ethersproject/errors";
import { defineReadOnly } from "@ethersproject/properties";

const _constructorGuard = { };

const validBaseTypes = [
    "Address", "boolean", "byte", "char", "double", "float", "int", "long", "short", "String"
];

function checkType(value: string): string {
    let throwError = () => {
        errors.throwArgumentError("invalid type", "value", value);
    }

    let match = value.match(/^([a-z0-9_]*)(|\[\]|\[\]\[\])$/i);
    if (!match) { throwError(); }
    if (validBaseTypes.indexOf(match[1]) === -1) { throwError(); }

    // Only primitive types allow 2D arrays
    if (match[1] === "Address" || match[1] === "String") {
        if (match[2] === "[][]") { throwError(); }
    }

    return value;
}

export function checkIdentifier(value: string): string {
    if (!value.match(/^[a-z_][a-z0-9_]*$/i)) {
        errors.throwArgumentError("invalid identifier", "value", value);
    }
    return value;
}

export class AvmParamType {
    readonly name: string;
    readonly type: string;

    constructor(constructorGuard: any, name: string, type: string) {
        errors.checkNew(new.target, AvmParamType);
        if (constructorGuard !== _constructorGuard) {
            throw new Error("do not instantiate directly use fromString");
        }

        defineReadOnly(this, "name", checkIdentifier(name));
        defineReadOnly(this, "type", checkType(type));
    }

    format(expanded?: boolean): string {
        if (expanded) { return (this.name + " " + this.type); }
        return this.type;
    }

    static fromString(value: string): AvmParamType {
        // Normalize and split into two components (type and name)
        //  - replace multiple whitespaces with a single space
        //  - remove any whitespace inside "[" and "]"
        //  - remove outside whitespaces
        let comps = value.trim().replace(/\[\s*\]/g, "[]").replace(/\s+/g, " ").split(" ");
        if (comps.length > 2) { errors.throwArgumentError("invalid param type", "value", value); }
        let type = comps[0].trim();
        let name = (comps[1] || "_").trim();
        return new AvmParamType(_constructorGuard, name, type);
    }
}

export class AvmFunctionFragment {
    readonly inputs: Array<AvmParamType>;
    readonly name: string;
    readonly output: string;

    constructor(constructorGuard: any, name: string, inputs: Array<AvmParamType>, output: string) {
        errors.checkNew(new.target, AvmFunctionFragment);
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
        return ((this.output ? this.output: "void") + " " +
                this.name + "(" +
                this.inputs.map(i => i.format(expanded)).join(delim) + ")");
    }

    static fromString(value: string): AvmFunctionFragment {
        // Remove leader/trailing whitespace and remove space from brackets
        value = value.trim().replace(/\s*\[\s*\]/g, "[]");

        // Replace multiple spaces with single space
        value = value.replace(/(\s+)/g, " ");

        // Trim off public and static
        if (value.substring(0, 7) === "public ") { value = value.substring(7); }
        if (value.substring(0, 7) === "static ") { value = value.substring(7); }

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

