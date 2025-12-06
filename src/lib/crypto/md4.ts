import { rotl, strToBin, binToHex, utf8Encode } from './utils';

/**
 * Calculates the MD4 hash of a string.
 */
export function md4(str: string): string {
  str = utf8Encode(str);
  return binToHex(core_md4(strToBin(str), str.length * 8));
}

function core_md4(x: number[], len: number): number[] {
  /* append padding */
  x[len >> 5] |= 0x80 << (len % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;
  x[(((len + 64) >>> 9) << 4) + 15] = 0;

  for (let i = 0; i < x.length; i++) {
    if (x[i] === undefined) x[i] = 0;
  }

  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (let i = 0; i < x.length; i += 16) {
    const olda = a;
    const oldb = b;
    const oldc = c;
    const oldd = d;

    /* Round 1 */
    a = ff(a, b, c, d, x[i + 0], 3);
    d = ff(d, a, b, c, x[i + 1], 7);
    c = ff(c, d, a, b, x[i + 2], 11);
    b = ff(b, c, d, a, x[i + 3], 19);
    a = ff(a, b, c, d, x[i + 4], 3);
    d = ff(d, a, b, c, x[i + 5], 7);
    c = ff(c, d, a, b, x[i + 6], 11);
    b = ff(b, c, d, a, x[i + 7], 19);
    a = ff(a, b, c, d, x[i + 8], 3);
    d = ff(d, a, b, c, x[i + 9], 7);
    c = ff(c, d, a, b, x[i + 10], 11);
    b = ff(b, c, d, a, x[i + 11], 19);
    a = ff(a, b, c, d, x[i + 12], 3);
    d = ff(d, a, b, c, x[i + 13], 7);
    c = ff(c, d, a, b, x[i + 14], 11);
    b = ff(b, c, d, a, x[i + 15], 19);

    /* Round 2 */
    a = gg(a, b, c, d, x[i + 0], 3);
    d = gg(d, a, b, c, x[i + 4], 5);
    c = gg(c, d, a, b, x[i + 8], 9);
    b = gg(b, c, d, a, x[i + 12], 13);
    a = gg(a, b, c, d, x[i + 1], 3);
    d = gg(d, a, b, c, x[i + 5], 5);
    c = gg(c, d, a, b, x[i + 9], 9);
    b = gg(b, c, d, a, x[i + 13], 13);
    a = gg(a, b, c, d, x[i + 2], 3);
    d = gg(d, a, b, c, x[i + 6], 5);
    c = gg(c, d, a, b, x[i + 10], 9);
    b = gg(b, c, d, a, x[i + 14], 13);
    a = gg(a, b, c, d, x[i + 3], 3);
    d = gg(d, a, b, c, x[i + 7], 5);
    c = gg(c, d, a, b, x[i + 11], 9);
    b = gg(b, c, d, a, x[i + 15], 13);

    /* Round 3 */
    a = hh(a, b, c, d, x[i + 0], 3);
    d = hh(d, a, b, c, x[i + 8], 9);
    c = hh(c, d, a, b, x[i + 4], 11);
    b = hh(b, c, d, a, x[i + 12], 15);
    a = hh(a, b, c, d, x[i + 2], 3);
    d = hh(d, a, b, c, x[i + 10], 9);
    c = hh(c, d, a, b, x[i + 6], 11);
    b = hh(b, c, d, a, x[i + 14], 15);
    a = hh(a, b, c, d, x[i + 1], 3);
    d = hh(d, a, b, c, x[i + 9], 9);
    c = hh(c, d, a, b, x[i + 5], 11);
    b = hh(b, c, d, a, x[i + 13], 15);
    a = hh(a, b, c, d, x[i + 3], 3);
    d = hh(d, a, b, c, x[i + 11], 9);
    c = hh(c, d, a, b, x[i + 7], 11);
    b = hh(b, c, d, a, x[i + 15], 15);

    a = (a + olda) | 0;
    b = (b + oldb) | 0;
    c = (c + oldc) | 0;
    d = (d + oldd) | 0;
  }
  return [a, b, c, d];
}

function cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
  return rotl((a + q + x + t) | 0, s);
}

function ff(a: number, b: number, c: number, d: number, x: number, s: number): number {
  return rotl((a + ((b & c) | ((~b) & d)) + x) | 0, s);
}

function gg(a: number, b: number, c: number, d: number, x: number, s: number): number {
  return rotl((a + ((b & c) | (b & d) | (c & d)) + x + 1518500249) | 0, s);
}

function hh(a: number, b: number, c: number, d: number, x: number, s: number): number {
  return rotl((a + (b ^ c ^ d) + x + 1859775393) | 0, s);
}

// Al final de md4.ts, añadir:
export function md4_raw(binaryStr: string): string {
  // binaryStr: cada carácter ya es un byte (0..255), no aplicar utf8Encode
  return binToHex(core_md4(strToBin(binaryStr), binaryStr.length * 8));
}

