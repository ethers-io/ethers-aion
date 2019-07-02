import { JsonRpcProvider as _JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers/json-rpc-provider";
import { ConnectionInfo } from "@ethersproject/web";
import { Network, Networkish } from "@ethersproject-aion/networks";
import { Formatter } from "./formatter";
export { JsonRpcSigner, ConnectionInfo, Networkish };
export declare class JsonRpcProvider extends _JsonRpcProvider {
    static getFormatter(): Formatter;
    static getNetwork(network: Networkish): Network;
}
