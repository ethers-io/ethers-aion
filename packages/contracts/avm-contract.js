"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_provider_1 = require("@ethersproject/abstract-provider");
var abstract_signer_1 = require("@ethersproject/abstract-signer");
//import { BigNumber } from "@ethersproject/bignumber";
var bytes_1 = require("@ethersproject/bytes");
var properties_1 = require("@ethersproject/properties");
var abi_1 = require("@ethersproject-aion/abi");
function prepareTransaction(contract, functionName) {
    var method = contract.interface.getFunction(functionName);
    return function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        var tx = {
            to: contract.address,
            data: contract.interface.encodeFunctionData(method, values)
        };
        return properties_1.resolveProperties(tx);
    };
}
function runMethod(contract, functionName, options) {
    var method = contract.interface.getFunction(functionName);
    return function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        return prepareTransaction(contract, functionName).apply(void 0, values).then(function (tx) {
            // AVM code requires this
            if (tx.gasLimit == null) {
                tx.gasLimit = 2000000;
            }
            tx.value = 0;
            if (options.callStatic) {
                return (contract.signer || contract.provider).call(tx).then(function (data) {
                    return contract.interface.decodeFunctionResult(method, data);
                });
            }
            return contract.signer.sendTransaction(tx);
        });
    };
}
var AvmContract = /** @class */ (function () {
    function AvmContract(address, contractInterface, signerOrProvider) {
        var _this = this;
        properties_1.defineReadOnly(this, "address", address);
        if (typeof (contractInterface) === "string") {
            contractInterface = abi_1.AvmInterface.fromString(contractInterface);
        }
        properties_1.defineReadOnly(this, "interface", contractInterface);
        if (properties_1.isNamedInstance(abstract_signer_1.Signer, signerOrProvider)) {
            properties_1.defineReadOnly(this, "signer", signerOrProvider);
            properties_1.defineReadOnly(this, "provider", signerOrProvider.provider || null);
        }
        else if (properties_1.isNamedInstance(abstract_provider_1.Provider, signerOrProvider)) {
            properties_1.defineReadOnly(this, "signer", null);
            properties_1.defineReadOnly(this, "provider", signerOrProvider);
        }
        else {
            properties_1.defineReadOnly(this, "signer", null);
            properties_1.defineReadOnly(this, "provider", null);
        }
        properties_1.defineReadOnly(this, "transaction", {});
        properties_1.defineReadOnly(this, "readonly", {});
        //defineReadOnly(this, "estimate", { });
        properties_1.defineReadOnly(this, "populateTransaction", {});
        Object.keys(this.interface.functions).forEach(function (name) {
            var func = _this.interface.getFunction(name);
            console.log(_this.transaction, name, func);
            if (_this.transaction[name] == null) {
                properties_1.defineReadOnly(_this.transaction, name, runMethod(_this, name, {}));
            }
            if (_this.readonly[name] == null) {
                properties_1.defineReadOnly(_this.readonly, name, runMethod(_this, name, { callStatic: true }));
            }
            if (_this.populateTransaction[name] == null) {
                properties_1.defineReadOnly(_this.populateTransaction, name, prepareTransaction(_this, name));
            }
        });
    }
    AvmContract.prototype.connect = function (signerOrProvider) {
        return new AvmContract(this.address, this.interface, signerOrProvider);
    };
    return AvmContract;
}());
exports.AvmContract = AvmContract;
var AvmContractFactory = /** @class */ (function () {
    function AvmContractFactory(contractInterface, bytecode, signer) {
        if (typeof (contractInterface) === "string") {
            contractInterface = abi_1.AvmInterface.fromString(contractInterface);
        }
        properties_1.defineReadOnly(this, "interface", contractInterface);
        properties_1.defineReadOnly(this, "bytecode", bytes_1.hexlify(bytecode));
        properties_1.defineReadOnly(this, "signer", signer || null);
    }
    AvmContractFactory.prototype.connect = function (signer) {
        return new AvmContractFactory(this.interface, this.bytecode, signer);
    };
    AvmContractFactory.prototype.attach = function (address) {
        return new AvmContract(address, this.interface, this.signer);
    };
    AvmContractFactory.prototype.getDeployTransaction = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        throw new Error("deployment not supported yet; no ABI definition for constructors");
        return null;
    };
    AvmContractFactory.prototype.deploy = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.signer.sendTransaction(this.getDeployTransaction.apply(this, args));
        return null;
    };
    return AvmContractFactory;
}());
exports.AvmContractFactory = AvmContractFactory;
