/**
 * Rotates a 32-bit integer left by n bits.
 */
export function rotl(x: number, n: number): number {
  return (x << n) | (x >>> (32 - n));
}

/**
 * Converts a string to an array of little-endian 32-bit words.
 * Characters > 255 have their high-byte silently ignored.
 */
export function strToBin(str: string): number[] {
  const bin: number[] = [];
  const mask = (1 << 8) - 1;
  for (let i = 0; i < str.length * 8; i += 8) {
    bin[i >> 5] |= (str.charCodeAt(i / 8) & mask) << (i % 32);
  }
  return bin;
}

/**
 * Converts an array of little-endian 32-bit words to a hex string.
 */
export function binToHex(binArray: number[]): string {
  const hexTab = "0123456789abcdef";
  let str = "";
  for (let i = 0; i < binArray.length * 4; i++) {
    str +=
      hexTab.charAt((binArray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xf) +
      hexTab.charAt((binArray[i >> 2] >> ((i % 4) * 8)) & 0xf);
  }
  return str;
}

/**
 * Converts a string to UTF-8 encoded binary string.
 * This is important because JS strings are UTF-16.
 */
export function utf8Encode(str: string): string {
    str = str.replace(/\r\n/g, "\n");
    let utftext = "";

    for (let n = 0; n < str.length; n++) {
        const c = str.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }
    }
    return utftext;
}
