# @encointer/util

Utilities for [Encointer](https://encointer.org/) App and Explorer. Contains methods to work with [substrate](https://github.com/paritytech/substrate)-based Encointer node.

## Installation

```
yarn add @encointer/util
```

## Fixed-point numbers

Package contains parser from fixed-point number representation created with [substrate-fixed](https://github.com/encointer/substrate-fixed) crate into floating-point Number. Conversion from floating-point to fixed-point also supported. Several bit-length for decimal and fractional parts supported out of the box: 4, 8, 16, 32, 64.

### Usage

To decode number with 64 bits of decimal part and 64 bits of fractional part use `parseI64F64`.
To encode number as fixed point with 4 bits for decimal and fractional use functions `toI16F16` (returns fixed-point as [BigNum](https://github.com/indutny/bn.js/)) and `encodeFloatToI4F4` (returns Uint8Array).

```js
import { parseI32F32, toI16F16 } from '@encointer/util'
import BN from 'bn.js'

/// Got fixed-point encoded number
const balanceFixPoint = new BN('110000000000000000000000000000001', 2)
console.log(balanceFixPoint)          // -> <BN: 180000001>

/// Parse to Number
const balance = parseI32F32(balanceFixPoint)
console.log(balance)                  // -> 1.5000000002328306

/// Convert to smaller word size
const balance32bit = toI16F16(balance)
console.log(balance32bit)             // -> <BN: 18000>
console.log(balance32bit.toString(2)) // -> 11000000000000000
```

### Various bit-length support

Function `parserFixPoint` used to produce function converting fixed-point to Number. For example to decode decimal 2 bits and fractional 6 bits use this function to create new parser.

Parameters:
upper: 0..128 - number of bits in decimal part
lower: 0..128 - number of bits in fractional part

Produced function parameters:
raw: substrate_fixed::types::I<upper>F<lower> as I<upper+lower>
precision: 0..lower number bits in fractional part to process


```js
const parseI2F6 = parserFixPoint(2, 6);
```