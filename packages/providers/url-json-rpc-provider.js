"sue strict";
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
var url_json_rpc_provider_1 = require("@ethersproject/providers/url-json-rpc-provider");
var networks_1 = require("@ethersproject-aion/networks");
var formatter_1 = require("./formatter");
var UrlJsonRpcProvider = /** @class */ (function (_super) {
    __extends(UrlJsonRpcProvider, _super);
    function UrlJsonRpcProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UrlJsonRpcProvider.getFormatter = function () {
        return formatter_1.getDefaultFormatter();
    };
    UrlJsonRpcProvider.getNetwork = function (network) {
        return networks_1.getNetwork(network);
    };
    UrlJsonRpcProvider.getUrl = function (network, apiKey) {
        return url_json_rpc_provider_1.UrlJsonRpcProvider.getUrl(network, apiKey);
    };
    return UrlJsonRpcProvider;
}(url_json_rpc_provider_1.UrlJsonRpcProvider));
exports.UrlJsonRpcProvider = UrlJsonRpcProvider;
