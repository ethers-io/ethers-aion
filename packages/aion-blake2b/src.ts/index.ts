"use strict";

import _blake2b from "blake2b";

import { arrayify, BytesLike, hexlify } from "@ethersproject/bytes";

export function blake2b(data: BytesLike): string {
    let output = new Uint8Array(32);
    _blake2b(32).update(arrayify(data)).digest(output);
    return hexlify(output);
}
