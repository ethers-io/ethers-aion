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
var contracts_1 = require("@ethersproject/contracts");
var address_1 = require("@ethersproject-aion/address");
var abi_1 = require("@ethersproject-aion/abi");
var avm_contract_1 = require("./avm-contract");
exports.AvmContract = avm_contract_1.AvmContract;
exports.AvmContractFactory = avm_contract_1.AvmContractFactory;
var Contract = /** @class */ (function (_super) {
    __extends(Contract, _super);
    function Contract() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Contract.getInterface = function (contractInterface) {
        if (abi_1.Interface.isInterface(contractInterface)) {
            return contractInterface;
        }
        return new abi_1.Interface(contractInterface);
    };
    return Contract;
}(contracts_1.Contract));
exports.Contract = Contract;
var ContractFactory = /** @class */ (function (_super) {
    __extends(ContractFactory, _super);
    function ContractFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContractFactory.getInterface = function (contractInterface) {
        return Contract.getInterface(contractInterface);
    };
    ContractFactory.getContractAddress = function (tx) {
        return address_1.getContractAddress(tx);
    };
    ContractFactory.getContract = function (address, contractInterface, signer) {
        return new Contract(address, contractInterface, signer);
    };
    return ContractFactory;
}(contracts_1.ContractFactory));
exports.ContractFactory = ContractFactory;
