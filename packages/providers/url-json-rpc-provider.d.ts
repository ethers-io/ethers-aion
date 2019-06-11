import { UrlJsonRpcProvider as _UrlJsonRpcProvider } from "@ethersproject/providers/url-json-rpc-provider";
import { Network } from "@ethersproject-aion/networks";
import { Formatter } from "./formatter";
export declare class UrlJsonRpcProvider extends _UrlJsonRpcProvider {
    static getFormatter(): Formatter;
    static getUrl(network: Network, apiKey: string): string;
}
