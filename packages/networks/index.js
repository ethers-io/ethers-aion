"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var properties_1 = require("@ethersproject/properties");
function aionDefaultProvider(network) {
    return function (providers) {
        if (providers.NodesmithProvider) {
            return new providers.NodesmithProvider(network);
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
