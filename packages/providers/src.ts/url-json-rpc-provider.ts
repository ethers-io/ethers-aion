"sue strict";

import { UrlJsonRpcProvider as _UrlJsonRpcProvider } from "@ethersproject/providers/url-json-rpc-provider";

import { Network } from "@ethersproject-aion/networks";

import { Formatter, getDefaultFormatter } from "./formatter";

export class UrlJsonRpcProvider extends _UrlJsonRpcProvider {
    static getFormatter(): Formatter {
        return getDefaultFormatter();
    }

    static getUrl(network: Network, apiKey: string): string {
        return _UrlJsonRpcProvider.getUrl(network, apiKey);
    }
}
