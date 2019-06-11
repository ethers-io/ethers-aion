"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var errors = __importStar(require("@ethersproject/errors"));
var properties_1 = require("@ethersproject/properties");
var _constructorGuard = {};
var validBaseTypes = [
    "Address", "boolean", "byte", "char", "double", "float", "int", "long", "short", "String"
];
function checkType(value) {
    var throwError = function () {
        errors.throwArgumentError("invalid type", "value", value);
    };
    var match = value.match(/^([a-z0-9_]*)(|\[\]|\[\]\[\])$/i);
    if (!match) {
        throwError();
    }
    if (validBaseTypes.indexOf(match[1]) === -1) {
        throwError();
    }
    // Only primitive types allow 2D arrays
    if (match[1] === "Address" || match[1] === "String") {
        if (match[2] === "[][]") {
            throwError();
        }
    }
    return value;
}
function checkIdentifier(value) {
    if (!value.match(/^[a-z_][a-z0-9_]*$/i)) {
        errors.throwArgumentError("invalid identifier", "value", value);
    }
    return value;
}
exports.checkIdentifier = checkIdentifier;
var AvmParamType = /** @class */ (function () {
    function AvmParamType(constructorGuard, name, type) {
        var _newTarget = this.constructor;
        errors.checkNew(_newTarget, AvmParamType);
        if (constructorGuard !== _constructorGuard) {
            throw new Error("do not instantiate directly use fromString");
        }
        properties_1.defineReadOnly(this, "name", checkIdentifier(name));
        properties_1.defineReadOnly(this, "type", checkType(type));
    }
    AvmParamType.prototype.format = function (expanded) {
        if (expanded) {
            return (this.name + " " + this.type);
        }
        return this.type;
    };
    AvmParamType.fromString = function (value) {
        // Normalize and split into two components (type and name)
        //  - replace multiple whitespaces with a single space
        //  - remove any whitespace inside "[" and "]"
        //  - remove outside whitespaces
        var comps = value.trim().replace(/\[\s*\]/g, "[]").replace(/\s+/g, " ").split(" ");
        if (comps.length > 2) {
            errors.throwArgumentError("invalid param type", "value", value);
        }
        var type = comps[0].trim();
        var name = (comps[1] || "_").trim();
        return new AvmParamType(_constructorGuard, name, type);
    };
    return AvmParamType;
}());
exports.AvmParamType = AvmParamType;
var AvmFunctionFragment = /** @class */ (function () {
    function AvmFunctionFragment(constructorGuard, name, inputs, output) {
        var _newTarget = this.constructor;
        errors.checkNew(_newTarget, AvmFunctionFragment);
        if (constructorGuard !== _constructorGuard) {
            throw new Error("do not instantiate directly use fromString");
        }
        checkIdentifier(name);
        properties_1.defineReadOnly(this, "name", checkIdentifier(name));
        properties_1.defineReadOnly(this, "inputs", inputs.slice());
        Object.freeze(this.inputs);
        properties_1.defineReadOnly(this, "output", output);
    }
    AvmFunctionFragment.prototype.format = function (expanded) {
        var delim = (expanded ? ", " : ",");
        return ((this.output ? this.output : "void") + " " +
            this.name + "(" +
            this.inputs.map(function (i) { return i.format(expanded); }).join(delim) + ")");
    };
    AvmFunctionFragment.fromString = function (value) {
        // Remove leader/trailing whitespace and remove space from brackets
        value = value.trim().replace(/\s*\[\s*\]/g, "[]");
        // Replace multiple spaces with single space
        value = value.replace(/(\s+)/g, " ");
        // Trim off public and static
        if (value.substring(0, 7) === "public ") {
            value = value.substring(7);
        }
        if (value.substring(0, 7) === "static ") {
            value = value.substring(7);
        }
        var match = value.match(/^([a-z0-9_\]\[]+)\s+([a-z_][a-z0-9_]*)\s*\(([^)]*)\)\s*$/i);
        if (!match) {
            errors.throwArgumentError("invalid abi fragment", "value", value);
        }
        var output = match[1].trim();
        if (output === "void") {
            output = null;
        }
        else {
            output = (new AvmParamType(_constructorGuard, "_", match[1].trim())).type;
        }
        var name = match[2].trim();
        var inputs = [];
        if (match[3].trim() !== "") {
            inputs = match[3].split(",").map(function (input) { return AvmParamType.fromString(input); });
        }
        return new AvmFunctionFragment(_constructorGuard, name.trim(), inputs, output);
    };
    return AvmFunctionFragment;
}());
exports.AvmFunctionFragment = AvmFunctionFragment;
