"use strict";

import * as errors from "@ethersproject/errors";
import { defineReadOnly } from "@ethersproject/properties";

import { getNetwork, Networkish } from "@ethersproject-aion/networks";

import { JsonRpcProvider } from "./json-rpc-provider";

const defaultApiKey = "5d45648e30d54e55bc2d0bdbbb2a60e2";

export class NodesmithProvider extends JsonRpcProvider {
    readonly apiKey: string;

    constructor(network?: Networkish, apiKey?: string) {
        errors.checkNew(new.target, NodesmithProvider);

        if (apiKey == null) { apiKey = defaultApiKey; }

        network = getNetwork((network == null) ? "mainnet": network);

        let host = null;
        switch (network.name) {
            case "mainnet":
                host = "aion.api.nodesmith.io/v1/mainnet/jsonrpc";
                break;
            case "mastery":
                host = "aion.api.nodesmith.io/v1/testnet/jsonrpc";
                break;
            case "avmtestnet":
                host = "aion.api.nodesmith.io/v1/avmtestnet/jsonrpc";
                break;
            default:
               throw new Error("unsupported network");
        }

        super("https:/" + "/" + host + (apiKey ? ("?apiKey=" + apiKey): ""));

        defineReadOnly(this, "apiKey", apiKey);
    }
}
