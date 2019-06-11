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
var url_json_rpc_provider_1 = require("./url-json-rpc-provider");
var defaultApiKey = "5d45648e30d54e55bc2d0bdbbb2a60e2";
var NodesmithProvider = /** @class */ (function (_super) {
    __extends(NodesmithProvider, _super);
    function NodesmithProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NodesmithProvider.getApiKey = function (apiKey) {
        return apiKey || defaultApiKey;
    };
    NodesmithProvider.getUrl = function (network, apiKey) {
        switch (network.name) {
            case "mainnet":
                return "https://aion.api.nodesmith.io/v1/mainnet/jsonrpc?apiKey=" + apiKey;
            case "mastery":
                return "https://aion.api.nodesmith.io/v1/mastery/jsonrpc?apiKey=" + apiKey;
            default:
                break;
        }
        return errors.throwArgumentError("unsupported network", "network", network);
    };
    return NodesmithProvider;
}(url_json_rpc_provider_1.UrlJsonRpcProvider));
exports.NodesmithProvider = NodesmithProvider;
