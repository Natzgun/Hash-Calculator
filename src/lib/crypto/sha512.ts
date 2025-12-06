import { utf8Encode } from './utils';

/**
 * Calculates the SHA-512 hash of a string.
 */
export function sha512(str: string): string {
  const utf8 = utf8Encode(str);
  const bytes: number[] = [];
  for (let i = 0; i < utf8.length; i++) {
    bytes.push(utf8.charCodeAt(i));
  }
  return hashSHA512(bytes);
}

function hashSHA512(message: number[]): string {
  // SHA-512 constants
  const K = [
    0x428a2f98d728ae22n, 0x7137449123ef65cdn, 0xb5c0fbcfec4d3b2fn, 0xe9b5dba58189dbbcn,
    0x3956c25bf348b538n, 0x59f111f1b605d019n, 0x923f82a4af194f9bn, 0xab1c5ed5da6d8118n,
    0xd807aa98a3030242n, 0x12835b0145706fben, 0x243185be4ee4b28cn, 0x550c7dc3d5ffb4e2n,
    0x72be5d74f27b896fn, 0x80deb1fe3b1696b1n, 0x9bdc06a725c71235n, 0xc19bf174cf692694n,
    0xe49b69c19ef14ad2n, 0xefbe4786384f25e3n, 0x0fc19dc68b8cd5b5n, 0x240ca1cc77ac9c65n,
    0x2de92c6f592b0275n, 0x4a7484aa6ea6e483n, 0x5cb0a9dcbd41fbd4n, 0x76f988da831153b5n,
    0x983e5152ee66dfabn, 0xa831c66d2db43210n, 0xb00327c898fb213fn, 0xbf597fc7beef0ee4n,
    0xc6e00bf33da88fc2n, 0xd5a79147930aa725n, 0x06ca6351e003826fn, 0x142929670a0e6e70n,
    0x27b70a8546d22ffcn, 0x2e1b21385c26c926n, 0x4d2c6dfc5ac42aedn, 0x53380d139d95b3dfn,
    0x650a73548baf63den, 0x766a0abb3c77b2a8n, 0x81c2c92e47edaee6n, 0x92722c851482353bn,
    0xa2bfe8a14cf10364n, 0xa81a664bbc423001n, 0xc24b8b70d0f89791n, 0xc76c51a30654be30n,
    0xd192e819d6ef5218n, 0xd69906245565a910n, 0xf40e35855771202an, 0x106aa07032bbd1b8n,
    0x19a4c116b8d2d0c8n, 0x1e376c085141ab53n, 0x2748774cdf8eeb99n, 0x34b0bcb5e19b48a8n,
    0x391c0cb3c5c95a63n, 0x4ed8aa4ae3418acbn, 0x5b9cca4f7763e373n, 0x682e6ff3d6b2b8a3n,
    0x748f82ee5defb2fcn, 0x78a5636f43172f60n, 0x84c87814a1f0ab72n, 0x8cc702081a6439ecn,
    0x90befffa23631e28n, 0xa4506cebde82bde9n, 0xbef9a3f7b2c67915n, 0xc67178f2e372532bn,
    0xca273eceea26619cn, 0xd186b8c721c0c207n, 0xeada7dd6cde0eb1en, 0xf57d4f7fee6ed178n,
    0x06f067aa72176fban, 0x0a637dc5a2c898a6n, 0x113f9804bef90daen, 0x1b710b35131c471bn,
    0x28db77f523047d84n, 0x32caab7b40c72493n, 0x3c9ebe0a15c9bebcn, 0x431d67c49c100d4cn,
    0x4cc5d4becb3e42b6n, 0x597f299cfc657e2an, 0x5fcb6fab3ad6faecn, 0x6c44198c4a475817n
  ];

  // Initial hash values
  let H0 = 0x6a09e667f3bcc908n;
  let H1 = 0xbb67ae8584caa73bn;
  let H2 = 0x3c6ef372fe94f82bn;
  let H3 = 0xa54ff53a5f1d36f1n;
  let H4 = 0x510e527fade682d1n;
  let H5 = 0x9b05688c2b3e6c1fn;
  let H6 = 0x1f83d9abfb41bd6bn;
  let H7 = 0x5be0cd19137e2179n;

  // Pre-processing: adding padding bits
  const msgLen = message.length;
  const bitLen = BigInt(msgLen * 8);
  
  message.push(0x80);
  
  // Pad with zeros until length ≡ 896 (mod 1024)
  while ((message.length % 128) !== 112) {
    message.push(0x00);
  }
  
  // Append length as 128-bit big-endian integer
  for (let i = 15; i >= 8; i--) {
    message.push(0x00);
  }
  for (let i = 7; i >= 0; i--) {
    message.push(Number((bitLen >> BigInt(i * 8)) & 0xFFn));
  }

  // Process message in 1024-bit chunks
  for (let chunk = 0; chunk < message.length; chunk += 128) {
    const W: bigint[] = new Array(80);
    
    // Break chunk into sixteen 64-bit big-endian words
    for (let i = 0; i < 16; i++) {
      W[i] = 0n;
      for (let j = 0; j < 8; j++) {
        W[i] = (W[i] << 8n) | BigInt(message[chunk + i * 8 + j]);
      }
    }
    
    // Extend the first 16 words into the remaining 64 words
    for (let i = 16; i < 80; i++) {
      const s0 = rotr64(W[i - 15], 1n) ^ rotr64(W[i - 15], 8n) ^ (W[i - 15] >> 7n);
      const s1 = rotr64(W[i - 2], 19n) ^ rotr64(W[i - 2], 61n) ^ (W[i - 2] >> 6n);
      W[i] = (W[i - 16] + s0 + W[i - 7] + s1) & 0xFFFFFFFFFFFFFFFFn;
    }
    
    // Initialize working variables
    let a = H0, b = H1, c = H2, d = H3;
    let e = H4, f = H5, g = H6, h = H7;
    
    // Main loop
    for (let i = 0; i < 80; i++) {
      const S1 = rotr64(e, 14n) ^ rotr64(e, 18n) ^ rotr64(e, 41n);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[i] + W[i]) & 0xFFFFFFFFFFFFFFFFn;
      const S0 = rotr64(a, 28n) ^ rotr64(a, 34n) ^ rotr64(a, 39n);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) & 0xFFFFFFFFFFFFFFFFn;
      
      h = g;
      g = f;
      f = e;
      e = (d + temp1) & 0xFFFFFFFFFFFFFFFFn;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) & 0xFFFFFFFFFFFFFFFFn;
    }
    
    // Add the compressed chunk to the current hash value
    H0 = (H0 + a) & 0xFFFFFFFFFFFFFFFFn;
    H1 = (H1 + b) & 0xFFFFFFFFFFFFFFFFn;
    H2 = (H2 + c) & 0xFFFFFFFFFFFFFFFFn;
    H3 = (H3 + d) & 0xFFFFFFFFFFFFFFFFn;
    H4 = (H4 + e) & 0xFFFFFFFFFFFFFFFFn;
    H5 = (H5 + f) & 0xFFFFFFFFFFFFFFFFn;
    H6 = (H6 + g) & 0xFFFFFFFFFFFFFFFFn;
    H7 = (H7 + h) & 0xFFFFFFFFFFFFFFFFn;
  }

  // Produce the final hash value
  return (
    toHex(H0) + toHex(H1) + toHex(H2) + toHex(H3) +
    toHex(H4) + toHex(H5) + toHex(H6) + toHex(H7)
  );
}

function rotr64(x: bigint, n: bigint): bigint {
  return ((x >> n) | (x << (64n - n))) & 0xFFFFFFFFFFFFFFFFn;
}

function toHex(n: bigint): string {
  return n.toString(16).padStart(16, '0');
}
