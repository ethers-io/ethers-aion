"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var abi_1 = require("@ethersproject/abi");
exports.ConstructorFragment = abi_1.ConstructorFragment;
exports.EventFragment = abi_1.EventFragment;
exports.Fragment = abi_1.Fragment;
exports.FunctionFragment = abi_1.FunctionFragment;
exports.ParamType = abi_1.ParamType;
var abstract_coder_1 = require("@ethersproject/abi/coders/abstract-coder");
var interface_1 = require("@ethersproject/abi/interface");
exports.Indexed = interface_1.Indexed;
var bytes_1 = require("@ethersproject/bytes");
var address_1 = require("@ethersproject-aion/address");
var avm_coder_1 = require("./avm-coder");
exports.AvmCoder = avm_coder_1.AvmCoder;
exports.defaultAvmCoder = avm_coder_1.defaultAvmCoder;
var avm_fragments_1 = require("./avm-fragments");
exports.AvmFunctionFragment = avm_fragments_1.AvmFunctionFragment;
exports.AvmParamType = avm_fragments_1.AvmParamType;
var avm_interface_1 = require("./avm-interface");
exports.AvmInterface = avm_interface_1.AvmInterface;
var AddressCoder = /** @class */ (function (_super) {
    __extends(AddressCoder, _super);
    function AddressCoder(localName) {
        return _super.call(this, "address", "address", localName, false) || this;
    }
    AddressCoder.prototype.encode = function (writer, value) {
        try {
            // @TODO:
        }
        catch (error) {
            this._throwError(error.message, value);
        }
        var length = writer.writeBytes(bytes_1.hexDataSlice(value, 0, 16));
        length += writer.writeBytes(bytes_1.hexDataSlice(value, 16));
        return length;
    };
    AddressCoder.prototype.decode = function (reader) {
        return address_1.getAddress(bytes_1.hexlify(reader.readBytes(32)));
    };
    return AddressCoder;
}(abstract_coder_1.Coder));
exports.AddressCoder = AddressCoder;
var Interface = /** @class */ (function (_super) {
    __extends(Interface, _super);
    function Interface() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Interface.prototype._getAbiCoder = function () {
        return defaultAbiCoder;
    };
    return Interface;
}(interface_1.Interface));
exports.Interface = Interface;
var AbiCoder = /** @class */ (function (_super) {
    __extends(AbiCoder, _super);
    function AbiCoder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbiCoder.prototype._getWordSize = function () { return 16; };
    AbiCoder.prototype._getCoder = function (param) {
        if (param.type === "address") {
            return new AddressCoder(param.name);
        }
        return _super.prototype._getCoder.call(this, param);
    };
    return AbiCoder;
}(abi_1.AbiCoder));
exports.AbiCoder = AbiCoder;
var defaultAbiCoder = new AbiCoder();
exports.defaultAbiCoder = defaultAbiCoder;
