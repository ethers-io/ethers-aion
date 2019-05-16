import { Formatter as _Formatter } from "@ethersproject/providers/formatter";
import { JsonRpcProvider as _JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers/json-rpc-provider";
import { ConnectionInfo } from "@ethersproject/web";
import { Networkish } from "@ethersproject-aion/networks";
export declare class Formatter extends _Formatter {
    address(value: any): string;
    transaction(value: any): any;
}
export { JsonRpcSigner, ConnectionInfo, Networkish };
export declare class JsonRpcProvider extends _JsonRpcProvider {
    static getFormatter(): Formatter;
}
