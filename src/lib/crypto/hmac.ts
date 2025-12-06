import { md4, md4_raw } from './md4';
import { md5, md5_raw } from './md5';
import { sha1, sha1_raw } from './sha1';
import { sha256, sha256_raw } from './sha256';
import { utf8Encode } from './utils';

type HashFunction = (message: string) => string;
type HashRawFunction = (binary: string) => string;

function hexToBytes(hex: string): number[] {
  const out: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    out.push(parseInt(hex.substr(i, 2), 16));
  }
  return out;
}

function bytesToRawString(bytes: number[]): string {
  const CHUNK = 0x8000;
  let out = '';
  for (let i = 0; i < bytes.length; i += CHUNK) {
    const slice = bytes.slice(i, i + CHUNK);
    out += String.fromCharCode.apply(null, slice as any);
  }
  return out;
}

export function hmac(
  key: string,
  message: string,
  hash: HashFunction,
  hashRaw: HashRawFunction,
  blockSize: number = 64
): string {
  const keyUtf8 = utf8Encode(key);
  const keyBytes: number[] = [];
  for (let i = 0; i < keyUtf8.length; i++) keyBytes.push(keyUtf8.charCodeAt(i));

  if (keyBytes.length > blockSize) {
    const keyHashHex = hashRaw(keyUtf8);
    const hashed = hexToBytes(keyHashHex);
    keyBytes.length = 0;
    hashed.forEach(b => keyBytes.push(b));
  }

  if (keyBytes.length < blockSize) {
    const diff = blockSize - keyBytes.length;
    for (let i = 0; i < diff; i++) keyBytes.push(0);
  }

  const ipadBytes: number[] = new Array(blockSize);
  const opadBytes: number[] = new Array(blockSize);
  for (let i = 0; i < blockSize; i++) {
    ipadBytes[i] = keyBytes[i] ^ 0x36;
    opadBytes[i] = keyBytes[i] ^ 0x5c;
  }
  const ipadRaw = bytesToRawString(ipadBytes);
  const opadRaw = bytesToRawString(opadBytes);

  const msgRaw = utf8Encode(message);

  const innerHex = hashRaw(ipadRaw + msgRaw);

  const innerBytes = hexToBytes(innerHex);
  const innerRaw = bytesToRawString(innerBytes);

  return hashRaw(opadRaw + innerRaw);
}

export function hmac_md4(key: string, message: string): string {
  return hmac(key, message, md4, md4_raw, 64);
}
export function hmac_md5(key: string, message: string): string {
  return hmac(key, message, md5, md5_raw, 64);
}
export function hmac_sha1(key: string, message: string): string {
  return hmac(key, message, sha1, sha1_raw, 64);
}
export function hmac_sha256(key: string, message: string): string {
  return hmac(key, message, sha256, sha256_raw, 64);
}
