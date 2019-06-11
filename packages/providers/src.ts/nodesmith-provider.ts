"use strict";

import * as errors from "@ethersproject/errors";

import { Network } from "@ethersproject-aion/networks";

import { UrlJsonRpcProvider } from "./url-json-rpc-provider";

const defaultApiKey = "5d45648e30d54e55bc2d0bdbbb2a60e2";

export class NodesmithProvider extends UrlJsonRpcProvider {

    static getApiKey(apiKey: string): string {
        return apiKey || defaultApiKey;
    }

    static getUrl(network: Network, apiKey: string): string {
        switch (network.name) {
            case "mainnet":
                return "https://aion.api.nodesmith.io/v1/mainnet/jsonrpc?apiKey=" + apiKey;
            case "mastery":
                return "https://aion.api.nodesmith.io/v1/mastery/jsonrpc?apiKey=" + apiKey;
            default:
                break;
        }

        return errors.throwArgumentError("unsupported network", "network", network);
    }
}
