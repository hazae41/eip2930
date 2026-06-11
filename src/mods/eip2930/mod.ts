// deno-lint-ignore-file no-namespace

import { RlpDataLike } from "@/libs/rlp/data/mod.ts";
import { RlpUintLike } from "@/libs/rlp/uint/mod.ts";
import { Readable, Writable } from "@hazae41/binary";
import { EIP2718TypedTransactionEnvelope } from "@hazae41/eip2718";
import { Rlp, RlpItem, RlpList } from "@hazae41/rlp";

export interface EIP2930AccessItem {
  readonly address: RlpDataLike
  readonly storage: RlpDataLike[]
}

export namespace EIP2930AccessItem {

  export function from(rlp: Rlp): EIP2930AccessItem {
    const list = RlpList.as(rlp)

    const address = RlpDataLike.from(RlpItem.as(list.value[0]))
    const storage = RlpList.as(list.value[1]).value.map(item => RlpDataLike.from(RlpItem.as(item)))

    return { address, storage }
  }

  export function into(self: EIP2930AccessItem): Rlp {
    const address = RlpDataLike.into(self.address)
    const storage = RlpList.from(self.storage.map(RlpDataLike.into))

    return RlpList.from([address, storage])
  }

}

export interface EIP2930UnsignedTransactionInit {
  readonly chainId: RlpUintLike

  readonly nonce: RlpUintLike

  readonly gasPrice: RlpUintLike
  readonly gasLimit: RlpUintLike

  readonly to?: RlpDataLike
  readonly value: RlpUintLike
  readonly data?: RlpDataLike

  readonly accessList?: EIP2930AccessItem[]
}

export class EIP2930UnsignedTransaction {

  constructor(
    readonly chainId: RlpUintLike,
    readonly nonce: RlpUintLike,
    readonly gasPrice: RlpUintLike,
    readonly gasLimit: RlpUintLike,
    readonly to: RlpDataLike = new Uint8Array(),
    readonly value: RlpUintLike,
    readonly data: RlpDataLike = new Uint8Array(),
    readonly accessList: EIP2930AccessItem[] = [],
  ) { }

  static from(init: EIP2930UnsignedTransactionInit): EIP2930UnsignedTransaction {
    const { chainId, nonce, gasPrice, gasLimit, to, value, data, accessList } = init
    return new EIP2930UnsignedTransaction(chainId, nonce, gasPrice, gasLimit, to, value, data, accessList)
  }

  static decode(bytes: Uint8Array): EIP2930UnsignedTransaction {
    const envelope = Readable.readFromBytes(EIP2718TypedTransactionEnvelope, bytes)

    if (envelope.type !== 0x01)
      throw new Error()

    const list = RlpList.as(envelope.data)

    const chainId = RlpUintLike.from(RlpItem.as(list.value[0]))

    const nonce = RlpUintLike.from(RlpItem.as(list.value[1]))

    const gasPrice = RlpUintLike.from(RlpItem.as(list.value[2]))
    const gasLimit = RlpUintLike.from(RlpItem.as(list.value[3]))

    const to = RlpDataLike.from(RlpItem.as(list.value[4]))
    const value = RlpUintLike.from(RlpItem.as(list.value[5]))
    const data = RlpDataLike.from(RlpItem.as(list.value[6]))

    const accessList = RlpList.as(list.value[7]).value.map(EIP2930AccessItem.from)

    return new EIP2930UnsignedTransaction(chainId, nonce, gasPrice, gasLimit, to, value, data, accessList)
  }

  encode(): Uint8Array {
    const chainId = RlpUintLike.into(this.chainId)

    const nonce = RlpUintLike.into(this.nonce)

    const gasPrice = RlpUintLike.into(this.gasPrice)
    const gasLimit = RlpUintLike.into(this.gasLimit)

    const to = RlpDataLike.into(this.to)
    const value = RlpUintLike.into(this.value)
    const data = RlpDataLike.into(this.data)

    const accessList = RlpList.from(this.accessList.map(EIP2930AccessItem.into))

    const list = RlpList.from([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList])

    return Writable.writeToBytes(new EIP2718TypedTransactionEnvelope(0x01, list))
  }

  sign(signature: Uint8Array): EIP2930SignedTransaction {
    const { chainId, nonce, gasPrice, gasLimit, to, value, data, accessList } = this

    const r = signature.slice(0, 32)
    const s = signature.slice(32, 64)

    const yParity = signature[64]

    return new EIP2930SignedTransaction(chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, yParity, r, s)
  }

}

export interface EIP2930SignedTransactionInit {
  readonly chainId: RlpUintLike

  readonly nonce: RlpUintLike

  readonly gasPrice: RlpUintLike
  readonly gasLimit: RlpUintLike

  readonly to?: RlpDataLike
  readonly value: RlpUintLike
  readonly data?: RlpDataLike

  readonly accessList?: EIP2930AccessItem[]

  readonly yParity: RlpUintLike

  readonly r: RlpDataLike
  readonly s: RlpDataLike
}

export class EIP2930SignedTransaction {

  constructor(
    readonly chainId: RlpUintLike,
    readonly nonce: RlpUintLike,
    readonly gasPrice: RlpUintLike,
    readonly gasLimit: RlpUintLike,
    readonly to: RlpDataLike = new Uint8Array(),
    readonly value: RlpUintLike,
    readonly data: RlpDataLike = new Uint8Array(),
    readonly accessList: EIP2930AccessItem[] = [],
    readonly yParity: RlpUintLike,
    readonly r: RlpDataLike,
    readonly s: RlpDataLike,
  ) { }

  static from(init: EIP2930SignedTransaction): EIP2930SignedTransaction {
    const { chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, yParity, r, s } = init
    return new EIP2930SignedTransaction(chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, yParity, r, s)
  }

  static decode(bytes: Uint8Array): EIP2930SignedTransaction {
    const envelope = Readable.readFromBytes(EIP2718TypedTransactionEnvelope, bytes)

    if (envelope.type !== 0x01)
      throw new Error()

    const list = RlpList.as(envelope.data)

    const chainId = RlpUintLike.from(RlpItem.as(list.value[0]))
    const nonce = RlpUintLike.from(RlpItem.as(list.value[1]))

    const gasPrice = RlpUintLike.from(RlpItem.as(list.value[2]))
    const gasLimit = RlpUintLike.from(RlpItem.as(list.value[3]))

    const to = RlpDataLike.from(RlpItem.as(list.value[4]))
    const value = RlpUintLike.from(RlpItem.as(list.value[5]))
    const data = RlpDataLike.from(RlpItem.as(list.value[6]))

    const accessList = RlpList.as(list.value[7]).value.map(EIP2930AccessItem.from)

    const yParity = RlpUintLike.from(RlpItem.as(list.value[8]))

    const r = RlpDataLike.from(RlpItem.as(list.value[9]))
    const s = RlpDataLike.from(RlpItem.as(list.value[10]))

    return new EIP2930SignedTransaction(chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, yParity, r, s)
  }

  encode(): Uint8Array {
    const chainId = RlpUintLike.into(this.chainId)
    const nonce = RlpUintLike.into(this.nonce)

    const gasPrice = RlpUintLike.into(this.gasPrice)
    const gasLimit = RlpUintLike.into(this.gasLimit)

    const to = RlpDataLike.into(this.to)
    const value = RlpUintLike.into(this.value)
    const data = RlpDataLike.into(this.data)

    const accessList = RlpList.from(this.accessList.map(EIP2930AccessItem.into))

    const yParity = RlpUintLike.into(this.yParity)

    const r = RlpDataLike.into(this.r)
    const s = RlpDataLike.into(this.s)

    const list = RlpList.from([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, yParity, r, s])

    return Writable.writeToBytes(new EIP2718TypedTransactionEnvelope(0x01, list))
  }

  unsign(): EIP2930UnsignedTransaction {
    const { chainId, nonce, gasPrice, gasLimit, to, value, data, accessList } = this
    return new EIP2930UnsignedTransaction(chainId, nonce, gasPrice, gasLimit, to, value, data, accessList)
  }

}