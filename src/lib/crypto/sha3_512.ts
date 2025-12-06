import { utf8Encode } from './utils';

/**
 * Calculates the SHA3-512 hash of a string.
 */
export function sha3_512(str: string): string {
  const utf8 = utf8Encode(str);
  const bytes: number[] = [];
  for (let i = 0; i < utf8.length; i++) {
    bytes.push(utf8.charCodeAt(i));
  }
  return keccak(bytes, 512);
}

function keccak(message: number[], outputBits: number): string {
  const rate = 1600 - 2 * outputBits;
  const blockSize = rate / 8;
  
  // Padding
  message.push(0x06);
  while (message.length % blockSize !== blockSize - 1) {
    message.push(0x00);
  }
  message.push(0x80);
  
  // Initialize state (25 x 64-bit lanes)
  const state: bigint[] = new Array(25).fill(0n);
  
  // Absorb phase
  for (let blockStart = 0; blockStart < message.length; blockStart += blockSize) {
    for (let i = 0; i < blockSize / 8; i++) {
      let lane = 0n;
      for (let j = 0; j < 8; j++) {
        const byteIndex = blockStart + i * 8 + j;
        if (byteIndex < message.length) {
          lane |= BigInt(message[byteIndex]) << BigInt(j * 8);
        }
      }
      state[i] ^= lane;
    }
    keccakF(state);
  }
  
  // Squeeze phase
  let output = '';
  const outputBytes = outputBits / 8;
  let extracted = 0;
  
  while (extracted < outputBytes) {
    for (let i = 0; i < blockSize / 8 && extracted < outputBytes; i++) {
      for (let j = 0; j < 8 && extracted < outputBytes; j++) {
        const byte = Number((state[i] >> BigInt(j * 8)) & 0xFFn);
        output += ('0' + byte.toString(16)).slice(-2);
        extracted++;
      }
    }
    if (extracted < outputBytes) {
      keccakF(state);
    }
  }
  
  return output;
}

function keccakF(state: bigint[]): void {
  const rounds = 24;
  const RC = [
    0x0000000000000001n, 0x0000000000008082n, 0x800000000000808an, 0x8000000080008000n,
    0x000000000000808bn, 0x0000000080000001n, 0x8000000080008081n, 0x8000000000008009n,
    0x000000000000008an, 0x0000000000000088n, 0x0000000080008009n, 0x000000008000000an,
    0x000000008000808bn, 0x800000000000008bn, 0x8000000000008089n, 0x8000000000008003n,
    0x8000000000008002n, 0x8000000000000080n, 0x000000000000800an, 0x800000008000000an,
    0x8000000080008081n, 0x8000000000008080n, 0x0000000080000001n, 0x8000000080008008n
  ];
  
  const rotations = [
    0, 1, 62, 28, 27,
    36, 44, 6, 55, 20,
    3, 10, 43, 25, 39,
    41, 45, 15, 21, 8,
    18, 2, 61, 56, 14
  ];
  
  for (let round = 0; round < rounds; round++) {
    // Theta
    const C: bigint[] = new Array(5);
    for (let x = 0; x < 5; x++) {
      C[x] = state[x] ^ state[x + 5] ^ state[x + 10] ^ state[x + 15] ^ state[x + 20];
    }
    
    const D: bigint[] = new Array(5);
    for (let x = 0; x < 5; x++) {
      D[x] = C[(x + 4) % 5] ^ rotl64(C[(x + 1) % 5], 1);
    }
    
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        state[x + y * 5] ^= D[x];
      }
    }
    
    // Rho and Pi
    const B: bigint[] = new Array(25);
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        const index = x + y * 5;
        const newX = y;
        const newY = (2 * x + 3 * y) % 5;
        const newIndex = newX + newY * 5;
        B[newIndex] = rotl64(state[index], rotations[index]);
      }
    }
    
    // Chi
    for (let y = 0; y < 5; y++) {
      const temp: bigint[] = new Array(5);
      for (let x = 0; x < 5; x++) {
        temp[x] = B[x + y * 5];
      }
      for (let x = 0; x < 5; x++) {
        state[x + y * 5] = temp[x] ^ ((~temp[(x + 1) % 5]) & temp[(x + 2) % 5]);
      }
    }
    
    // Iota
    state[0] ^= RC[round];
  }
}

function rotl64(x: bigint, n: number): bigint {
  const n64 = BigInt(n) % 64n;
  return ((x << n64) | (x >> (64n - n64))) & 0xFFFFFFFFFFFFFFFFn;
}
