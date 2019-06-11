"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var bytes_1 = require("@ethersproject/bytes");
var errors = __importStar(require("@ethersproject/errors"));
var properties_1 = require("@ethersproject/properties");
var avm_coder_1 = require("./avm-coder");
var avm_fragments_1 = require("./avm-fragments");
var _constructorGuard = {};
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
var AvmInterface = /** @class */ (function () {
    function AvmInterface(constructorGuard, version, name, functions) {
        var _newTarget = this.constructor;
        errors.checkNew(_newTarget, AvmInterface);
        if (constructorGuard !== _constructorGuard) {
            throw new Error("do not instantiate directly use fromString");
        }
        if (version !== "0.0") {
            errors.throwArgumentError("unsupported version", "version", version);
        }
        properties_1.defineReadOnly(this, "version", version);
        name = name.split(".").map(function (comp) { return avm_fragments_1.checkIdentifier(comp.trim()); }).join(".");
        properties_1.defineReadOnly(this, "name", name);
        var funcs = {};
        var unique = {};
        // Add each function by signature, and track non-overloaded functions
        functions.forEach(function (func) {
            if (!unique[func.name]) {
                unique[func.name] = [];
            }
            unique[func.name].push(func);
            funcs[func.format()] = func;
        });
        // Add bare names for non-overloaded functions
        for (var key in unique) {
            var funcList = unique[key];
            var func = funcList[0];
            if (funcList.length !== 1) {
                errors.warn("duplicate definition for " + func.name + "; skipping bare name");
                return;
            }
            funcs[func.name] = func;
        }
        Object.freeze(funcs);
        properties_1.defineReadOnly(this, "functions", funcs);
    }
    AvmInterface.prototype.getFunction = function (nameOrSignature) {
        if (nameOrSignature.indexOf("(") === -1) {
            return this.functions[nameOrSignature];
        }
        return this.functions[avm_fragments_1.AvmFunctionFragment.fromString(nameOrSignature).format()];
    };
    AvmInterface.prototype._encodeParams = function (params, values) {
        return avm_coder_1.defaultAvmCoder.encode(params, values);
    };
    //encodeDeploy(): string {
    //    return null;
    //}
    AvmInterface.prototype.encodeFunctionData = function (functionFragment, values) {
        if (typeof (functionFragment) === "string") {
            functionFragment = this.getFunction(functionFragment);
        }
        return bytes_1.hexConcat([
            avm_coder_1.defaultAvmCoder.encode(["String"], [functionFragment.name]),
            this._encodeParams(functionFragment.inputs, values)
        ]);
    };
    AvmInterface.prototype.decodeFunctionResult = function (functionFragment, data) {
        if (typeof (functionFragment) === "string") {
            functionFragment = this.getFunction(functionFragment);
        }
        return avm_coder_1.defaultAvmCoder.decode([functionFragment.output], data);
    };
    //parseTransaction(tx: { data: string, value?: BigNumberish }): TransactionDescription {
    //}
    AvmInterface.fromString = function (abi) {
        if (typeof (abi) === "string") {
            abi = abi.split("\n");
        }
        var version = null;
        var name = null;
        var functions = [];
        abi.forEach(function (line) {
            line = line.trim();
            if (line === "") {
                return;
            }
            if (line.match(/^([0-9.]+)$/)) {
                version = line;
                return;
            }
            if (line.match(/^[a-z0-9_. ]*$/i)) {
                name = line;
                return;
            }
            functions.push(avm_fragments_1.AvmFunctionFragment.fromString(line));
        });
        if (!version) {
            throw new Error("no interface version");
        }
        if (!name) {
            throw new Error("no interface name");
        }
        return new AvmInterface(_constructorGuard, version, name, functions);
        ;
    };
    return AvmInterface;
}());
exports.AvmInterface = AvmInterface;
