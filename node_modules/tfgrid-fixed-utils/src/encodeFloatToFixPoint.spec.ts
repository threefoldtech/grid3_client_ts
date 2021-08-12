'use strict';

import {hexToU8a, u8aToHex} from '@polkadot/util';

import { encodeFloatToI64F64 } from '.';

describe('encodeFloatToFixPoint', () => {
  it('should encode integer to fixPoint', () => {
    const result = encodeFloatToI64F64(1);
    expect(result).toEqual(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]));
    expect(hexToU8a(u8aToHex(result))).toEqual(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]));
  });
  it('should encode 1.1 to fixPoint', () => {
    const result = encodeFloatToI64F64(1.1);
    expect(result).toEqual(new Uint8Array([0, 160, 153, 153, 153, 153, 153, 25, 1, 0, 0, 0, 0, 0, 0, 0]));
    expect(hexToU8a(u8aToHex(result))).toEqual(new Uint8Array([0, 160, 153, 153, 153, 153, 153, 25, 1, 0, 0, 0, 0, 0, 0, 0]));
  });
  it('should encode 0.1 to fixPoint', () => {
    const result = encodeFloatToI64F64(0.1);
    expect(result).toEqual(new Uint8Array([0, 154, 153, 153, 153, 153, 153, 25, 0, 0, 0, 0, 0, 0, 0, 0]));
    expect(hexToU8a(u8aToHex(result))).toEqual(new Uint8Array([0, 154, 153, 153, 153, 153, 153, 25, 0, 0, 0, 0, 0, 0, 0, 0]));
  });
  it('should encode parseFloat(0.2) to fixPoint', () => {
    // this is the way we receive it form dart side. Implicit handling of the '0.2' as string gave encoding errors
    const result = encodeFloatToI64F64(parseFloat('0.2'));
    expect(result).toEqual(new Uint8Array([0, 52, 51, 51, 51, 51, 51, 51, 0, 0, 0, 0, 0, 0, 0, 0]));
    expect(hexToU8a(u8aToHex(result))).toEqual(new Uint8Array([0, 52, 51, 51, 51, 51, 51, 51, 0, 0, 0, 0, 0, 0, 0, 0]));
  });
});
