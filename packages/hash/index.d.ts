import { Bytes } from "@ethersproject/bytes";
export declare function id(text: string): string;
export declare const messagePrefix = "\u0015Aion Signed Message:\n";
export declare function hashMessage(message: Bytes | string): string;
