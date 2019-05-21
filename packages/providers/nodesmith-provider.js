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
var networks_1 = require("@ethersproject-aion/networks");
var json_rpc_provider_1 = require("./json-rpc-provider");
var defaultApiKey = "5d45648e30d54e55bc2d0bdbbb2a60e2";
var NodesmithProvider = /** @class */ (function (_super) {
    __extends(NodesmithProvider, _super);
    function NodesmithProvider(network, apiKey) {
        var _newTarget = this.constructor;
        var _this = this;
        errors.checkNew(_newTarget, NodesmithProvider);
        if (apiKey == null) {
            apiKey = defaultApiKey;
        }
        network = networks_1.getNetwork((network == null) ? "mainnet" : network);
        var host = null;
        switch (network.name) {
            case "mainnet":
                host = "aion.api.nodesmith.io/v1/mainnet/jsonrpc";
                break;
            case "mastery":
                host = "aion.api.nodesmith.io/v1/mastery/jsonrpc";
                break;
            default:
                throw new Error("unsupported network");
        }
        _this = _super.call(this, "https:/" + "/" + host + (apiKey ? ("?apiKey=" + apiKey) : "")) || this;
        properties_1.defineReadOnly(_this, "apiKey", apiKey);
        return _this;
    }
    return NodesmithProvider;
}(json_rpc_provider_1.JsonRpcProvider));
exports.NodesmithProvider = NodesmithProvider;
