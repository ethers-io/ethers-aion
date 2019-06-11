import { Formatter as _Formatter } from "@ethersproject/providers/formatter";
export declare class Formatter extends _Formatter {
    address(value: any): string;
    transaction(value: any): any;
}
export declare function getDefaultFormatter(): Formatter;
