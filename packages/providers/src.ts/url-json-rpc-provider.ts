"sue strict";

import { UrlJsonRpcProvider as _UrlJsonRpcProvider } from "@ethersproject/providers/url-json-rpc-provider";

import { getNetwork, Network, Networkish } from "@ethersproject-aion/networks";

import { Formatter, getDefaultFormatter } from "./formatter";

export class UrlJsonRpcProvider extends _UrlJsonRpcProvider {
    static getFormatter(): Formatter {
        return getDefaultFormatter();
    }

    static getNetwork(network: Networkish): Network {
        return getNetwork(network);
    }

    static getUrl(network: Network, apiKey: string): string {
        return _UrlJsonRpcProvider.getUrl(network, apiKey);
    }
}
