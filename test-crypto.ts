import { md4 } from './src/lib/crypto/md4';
import { md5 } from './src/lib/crypto/md5';
import { sha1 } from './src/lib/crypto/sha1';

const testCases = [
  { input: '', md4: '31d6cfe0d16ae931b73c59d7e0c089c0', md5: 'd41d8cd98f00b204e9800998ecf8427e', sha1: 'da39a3ee5e6b4b0d3255bfef95601890afd80709' },
  { input: 'a', md4: 'bde52cb31de33e46245e05fbdbd6fb24', md5: '0cc175b9c0f1b6a831c399e269772661', sha1: '86f7e437faa5a7fce15d1ddcb9eaeaea377667b8' },
  { input: 'abc', md4: 'a448017aaf21d8525fc10ae87aa6729d', md5: '900150983cd24fb0d6963f7d28e17f72', sha1: 'a9993e364706816aba3e25717850c26c9cd0d89d' },
  { input: 'message digest', md4: 'd9130a8164549fe818874806e1c7014b', md5: 'f96b697d7cb7938d525a2f31aaf161d0', sha1: 'c12252ceda8be8994d5fa0290a47231c1d16aae3' },
];

let passed = true;

testCases.forEach(({ input, md4: expectedMd4, md5: expectedMd5, sha1: expectedSha1 }) => {
  const actualMd4 = md4(input);
  const actualMd5 = md5(input);
  const actualSha1 = sha1(input);

  if (actualMd4 !== expectedMd4) {
    console.error(`MD4 failed for "${input}": expected ${expectedMd4}, got ${actualMd4}`);
    passed = false;
  }
  if (actualMd5 !== expectedMd5) {
    console.error(`MD5 failed for "${input}": expected ${expectedMd5}, got ${actualMd5}`);
    passed = false;
  }
  if (actualSha1 !== expectedSha1) {
    console.error(`SHA1 failed for "${input}": expected ${expectedSha1}, got ${actualSha1}`);
    passed = false;
  }
});

if (passed) {
  console.log('All tests passed!');
} else {
  console.error('Some tests failed.');
  process.exit(1);
}
