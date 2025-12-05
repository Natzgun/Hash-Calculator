import { md4 } from './md4';
import { md5 } from './md5';
import { sha1 } from './sha1';
import { sha256 } from './sha256';

// si
type HashFunction = (message: string) => string;

export function hmac(
  key: string, 
  message: string, 
  hashFunc: HashFunction = sha256, 
  blockSize: number = 64
): string {
  let keyBytes = key;
  
  if (key.length > blockSize) {
    keyBytes = hexToBytes(hashFunc(key));
  }
  
  while (keyBytes.length < blockSize) {
    keyBytes += '\x00';
  }
  
  const ipad = new Array(blockSize);
  const opad = new Array(blockSize);
  
  for (let i = 0; i < blockSize; i++) {
    const keyByte = i < keyBytes.length ? keyBytes.charCodeAt(i) : 0;
    ipad[i] = keyByte ^ 0x36; // 54
    opad[i] = keyByte ^ 0x5C; // 92
  }
  
  const ipadStr = String.fromCharCode.apply(null, ipad);
  const opadStr = String.fromCharCode.apply(null, opad);
  
  const innerHash = hashFunc(ipadStr + message);
  
  const innerHashBytes = hexToBytes(innerHash);
  const outerHash = hashFunc(opadStr + innerHashBytes);
  
  return outerHash;
}

function hexToBytes(hex: string): string {
  const bytes: string[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(String.fromCharCode(parseInt(hex.substring(i, 2), 16)));
  }
  return bytes.join('');
}

// Many uses for HMAC
export function hmac_md4(key: string, message: string): string {
  return hmac(key, message, md4, 64);
}

export function hmac_md5(key: string, message: string): string {
  return hmac(key, message, md5, 64);
}

export function hmac_sha1(key: string, message: string): string {
  return hmac(key, message, sha1, 64);
}

// export function hmac_sha256(key: string, message: string): string {
//   return hmac(key, message, sha256, 64);
// }