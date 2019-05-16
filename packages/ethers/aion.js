"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_signer_1 = require("@ethersproject/abstract-signer");
exports.Signer = abstract_signer_1.Signer;
exports.VoidSigner = abstract_signer_1.VoidSigner;
var constants = __importStar(require("@ethersproject/constants"));
exports.constants = constants;
var errors = __importStar(require("@ethersproject/errors"));
exports.errors = errors;
var wordlists = __importStar(require("@ethersproject/wordlists"));
exports.wordlists = wordlists;
var contracts_1 = require("@ethersproject-aion/contracts");
exports.AvmContract = contracts_1.AvmContract;
exports.AvmContractFactory = contracts_1.AvmContractFactory;
exports.Contract = contracts_1.Contract;
exports.ContractFactory = contracts_1.ContractFactory;
var providers = __importStar(require("@ethersproject-aion/providers"));
exports.providers = providers;
var wallet_1 = require("@ethersproject-aion/wallet");
exports.Wallet = wallet_1.Wallet;
var utils = __importStar(require("./utils"));
exports.utils = utils;
////////////////////////
// Helper Functions
function getDefaultProvider(network) {
    if (network == null) {
        network = "mainnet";
    }
    var n = utils.getNetwork(network);
    if (!n || !n._defaultProvider) {
        errors.throwError("unsupported getDefaultProvider network", errors.UNSUPPORTED_OPERATION, {
            operation: "getDefaultProvider",
            network: network
        });
    }
    return n._defaultProvider(providers);
}
exports.getDefaultProvider = getDefaultProvider;
