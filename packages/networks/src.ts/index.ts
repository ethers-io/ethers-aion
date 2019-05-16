"use strict";

import { shallowCopy } from "@ethersproject/properties";
import { Network } from "@ethersproject/networks/types";

export {
    Network
};

export type Networkish = Network | string;

function aionDefaultProvider(network: string): (providers: any) => any {
    return function(providers: any): any {
        if (providers.NodesmithProvider) {
            // @TODO: What is a safe way to get a new API key?
            return new providers.NodesmithProvider(network, "8c8a6aa3afe0444e922dd93443e1a1f0");
        }

        return null;
    }
}

const testnet = {
    name: "mastery",
    chainId: -1,
    _defaultProvider: aionDefaultProvider("testnet")
};

const networks: { [ name: string ]: Network } = {
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
}

export function getNetwork(network: Networkish): Network {
    if (network == null) { return null; }

    if (typeof(network) === "string") {
        return shallowCopy(networks[network] || { });
    }

    let standard = networks[network.name];

    if (!standard) { return network; }

    return shallowCopy(standard);
}
