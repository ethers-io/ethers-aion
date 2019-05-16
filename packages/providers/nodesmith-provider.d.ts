import { Networkish } from "@ethersproject-aion/networks";
import { JsonRpcProvider } from "./json-rpc-provider";
export declare class NodesmithProvider extends JsonRpcProvider {
    readonly apiKey: string;
    constructor(network?: Networkish, apiKey?: string);
}
