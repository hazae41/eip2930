import { test } from "@hazae41/phobos";
import { EIP2930SignedTransaction, EIP2930UnsignedTransaction } from "./mod.ts";

test("eip2930", () => {
  const utx = EIP2930UnsignedTransaction.from({ chainId: 1n, nonce: 0n, gasPrice: 1000n, gasLimit: 1000n, to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", value: 100n, data: new Uint8Array([1, 2, 3]), accessList: [{ address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", storage: ["0x00", "0x01"] }] } as const)
  const stx = utx.sign(crypto.getRandomValues(new Uint8Array(65)))

  console.log(stx)

  const raw = stx.encode()
  console.log(raw.toHex())

  const stx2 = EIP2930SignedTransaction.decode(raw)
  const utx2 = stx2.unsign()

  console.log(utx2)
})