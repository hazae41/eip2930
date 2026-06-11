// deno-lint-ignore-file no-namespace

import { base16 } from "@/libs/base16/mod.ts";
import { RlpItem } from "@hazae41/rlp";

export type RlpUintLike =
  | `0x${string}`
  | bigint
  | number

export namespace RlpUintLike {

  export type From = RlpItem
  export type Into = RlpItem

  export function from(from: From): RlpUintLike {
    return BigInt(`0x0${from.value.toHex()}`)
  }

  export function into(self: RlpUintLike): Into {
    if (typeof self === "string")
      return RlpItem.from(Uint8Array.fromHex(base16.padStart(base16.trimStart(self.slice(2)))))
    if (typeof self === "bigint")
      return RlpItem.from(Uint8Array.fromHex(base16.padStart(base16.trimStart(self.toString(16)))))
    if (typeof self === "number")
      return RlpItem.from(Uint8Array.fromHex(base16.padStart(base16.trimStart(self.toString(16)))))
    throw new Error()
  }

}