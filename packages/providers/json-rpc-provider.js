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
var formatter_1 = require("@ethersproject/providers/formatter");
var json_rpc_provider_1 = require("@ethersproject/providers/json-rpc-provider");
exports.JsonRpcSigner = json_rpc_provider_1.JsonRpcSigner;
var address_1 = require("@ethersproject-aion/address");
var transactions_1 = require("@ethersproject-aion/transactions");
var Formatter = /** @class */ (function (_super) {
    __extends(Formatter, _super);
    function Formatter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Formatter.prototype.address = function (value) {
        return address_1.getAddress(value);
    };
    Formatter.prototype.transaction = function (value) {
        return transactions_1.parse(value);
    };
    return Formatter;
}(formatter_1.Formatter));
exports.Formatter = Formatter;
var defaultFormatter = null;
var JsonRpcProvider = /** @class */ (function (_super) {
    __extends(JsonRpcProvider, _super);
    function JsonRpcProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JsonRpcProvider.getFormatter = function () {
        if (defaultFormatter == null) {
            defaultFormatter = new Formatter();
        }
        return defaultFormatter;
    };
    return JsonRpcProvider;
}(json_rpc_provider_1.JsonRpcProvider));
exports.JsonRpcProvider = JsonRpcProvider;
