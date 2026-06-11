# EIP-2930

EIP-2930 transactions for the web

```bash
npm install @hazae41/eip2930
```

[**📦 NPM**](https://www.npmjs.com/package/@hazae41/eip2930)

## Features

### Current features
- 100% TypeScript and ESM
- No external dependencies
- Rust-like patterns

## Usage

```tsx
const tx = { 
  chainId: 1n, 
  nonce: 0n, 
  gasPrice: 1000n, 
  gasLimit: 1000n, 
  to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", 
  value: 100n, 
  data: new Uint8Array([1, 2, 3]),
  accessList: [{ address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", storage: ["0x00", "0x01"] }]
} as const

const utx = EIP2930UnsignedTransaction.from(tx)
const stx = utx.sign(key.sign(keccak256(utx.encode()))) // EIP2930SignedTransaction

const raw = stx.encode() // Uint8Array
const hex = `0x${raw.toHex()}` // 0x...

const stx2 = EIP2930SignedTransaction.decode(Uint8Array.fromHex(hex.slice(2)))
const utx2 = stx2.unsign() // EIP2930UnsignedTransaction
```