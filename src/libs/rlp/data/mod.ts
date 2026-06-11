// deno-lint-ignore-file no-namespace

import { base16 } from "@/libs/base16/mod.ts";
import { RlpItem } from "@hazae41/rlp";

export type RlpDataLike =
  | `0x${string}`
  | Uint8Array

export namespace RlpDataLike {

  export type From = RlpItem
  export type Into = RlpItem

  export function from(from: From): RlpDataLike {
    return `0x${from.value.toHex()}`
  }

  export function into(self: RlpDataLike): Into {
    if (typeof self === "string")
      return RlpItem.from(Uint8Array.fromHex(base16.padStart(self.slice(2))))
    if (self instanceof Uint8Array)
      return RlpItem.from(self)
    throw new Error()
  }

}