import { Network } from "@ethersproject/networks/types";
export { Network };
export declare type Networkish = Network | string;
export declare function getNetwork(network: Networkish): Network;
