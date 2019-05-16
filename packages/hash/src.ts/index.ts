"use strict";

import { Bytes, concat } from "@ethersproject/bytes";
import { toUtf8Bytes } from "@ethersproject/strings";

import { blake2b } from "@ethersproject-aion/blake2b";

export function id(text: string): string {
    return blake2b(toUtf8Bytes(text));
}

export const messagePrefix = "\x15Aion Signed Message:\n";

export function hashMessage(message: Bytes | string): string {
    if (typeof(message) === "string") { message = toUtf8Bytes(message); }
    return blake2b(concat([
        toUtf8Bytes(messagePrefix),
        toUtf8Bytes(String(message.length)),
        message
    ]));
}
