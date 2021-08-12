import {ToFixPointFn, toFixPoint} from './toFixPoint';
import {ParserFixPointFn, parserFixPoint} from './parserFixPoint';
import {EncodeFloatToFixPointFn, encodeFloatToFixPoint} from './encodeFloatToFixPoint';

export * from './toFixPoint';
export * from './parserFixPoint';
export * from './encodeFloatToFixPoint';

export const parseI4F4: ParserFixPointFn = parserFixPoint(4, 4);

export const parseI8F8: ParserFixPointFn = parserFixPoint(8, 8);

export const parseI16F16: ParserFixPointFn = parserFixPoint(16, 16);

export const parseI32F32: ParserFixPointFn = parserFixPoint(32, 32);

export const parseI64F64: ParserFixPointFn = parserFixPoint(64, 64);

export const toI4F4: ToFixPointFn = toFixPoint(4, 4);

export const toI8F8: ToFixPointFn = toFixPoint(8, 8);

export const toI16F16: ToFixPointFn = toFixPoint(16, 16);

export const toI32F32: ToFixPointFn = toFixPoint(32, 32);

export const toI64F64: ToFixPointFn = toFixPoint(64, 64);

export const encodeFloatToI4F4: EncodeFloatToFixPointFn = encodeFloatToFixPoint(4, 4);

export const encodeFloatToI8F8: EncodeFloatToFixPointFn = encodeFloatToFixPoint(8, 8);

export const encodeFloatToI16F16: EncodeFloatToFixPointFn = encodeFloatToFixPoint(16, 16);

export const encodeFloatToI32F32: EncodeFloatToFixPointFn = encodeFloatToFixPoint(32, 32);

export const encodeFloatToI64F64: EncodeFloatToFixPointFn = encodeFloatToFixPoint(64, 64);
