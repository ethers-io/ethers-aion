import { JsonRpcProvider as _JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers/json-rpc-provider";
import { ConnectionInfo } from "@ethersproject/web";
import { Networkish } from "@ethersproject-aion/networks";
import { Formatter } from "./formatter";
export { JsonRpcSigner, ConnectionInfo, Networkish };
export declare class JsonRpcProvider extends _JsonRpcProvider {
    static getFormatter(): Formatter;
}
