"use strict";

import { JsonRpcProvider as _JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers/json-rpc-provider";
import { ConnectionInfo } from "@ethersproject/web";

import { getNetwork, Network, Networkish } from "@ethersproject-aion/networks";

import { Formatter, getDefaultFormatter } from "./formatter";

export {
    JsonRpcSigner,

    ConnectionInfo,
    Networkish
};

export class JsonRpcProvider extends _JsonRpcProvider {
    static getFormatter(): Formatter {
        return getDefaultFormatter();
    }

    static getNetwork(network: Networkish): Network {
        return getNetwork(network);
    }
}
