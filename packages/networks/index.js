"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var properties_1 = require("@ethersproject/properties");
function aionDefaultProvider(network) {
    return function (providers) {
        if (providers.NodesmithProvider) {
            // @TODO: What is a safe way to get a new API key?
            return new providers.NodesmithProvider(network, "8c8a6aa3afe0444e922dd93443e1a1f0");
        }
        return null;
    };
}
var testnet = {
    name: "mastery",
    chainId: -1,
    _defaultProvider: aionDefaultProvider("testnet")
};
var networks = {
    mainnet: {
        name: "mainnet",
        chainId: -1,
        _defaultProvider: aionDefaultProvider("mainnet")
    },
    testnet: testnet,
    mastery: testnet,
    avmtestnet: {
        name: "avmtestnet",
        chainId: -1,
        _defaultProvider: aionDefaultProvider("avmtestnet")
    }
};
function getNetwork(network) {
    if (network == null) {
        return null;
    }
    if (typeof (network) === "string") {
        return properties_1.shallowCopy(networks[network] || {});
    }
    var standard = networks[network.name];
    if (!standard) {
        return network;
    }
    return properties_1.shallowCopy(standard);
}
exports.getNetwork = getNetwork;
