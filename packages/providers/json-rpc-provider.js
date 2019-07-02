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
var json_rpc_provider_1 = require("@ethersproject/providers/json-rpc-provider");
exports.JsonRpcSigner = json_rpc_provider_1.JsonRpcSigner;
var networks_1 = require("@ethersproject-aion/networks");
var formatter_1 = require("./formatter");
var JsonRpcProvider = /** @class */ (function (_super) {
    __extends(JsonRpcProvider, _super);
    function JsonRpcProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JsonRpcProvider.getFormatter = function () {
        return formatter_1.getDefaultFormatter();
    };
    JsonRpcProvider.getNetwork = function (network) {
        return networks_1.getNetwork(network);
    };
    return JsonRpcProvider;
}(json_rpc_provider_1.JsonRpcProvider));
exports.JsonRpcProvider = JsonRpcProvider;
