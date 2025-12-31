import { hash, verify, type Options } from '@node-rs/argon2';

const opts: Options = {
  memoryCost: 65536, // 64MB RAM
  timeCost: 3, // 3 iterations
  parallelism: 4, // 2 threads
  outputLen: 32,
  algorithm: 2, // Argon2id (recommended)
};

export async function hashPassword(password: string) {
  const result = await hash(password, opts);
  return result;
}

export async function verifyPassword(data: { password: string; hash: string }) {
  const result = await verify(data.hash, data.password, opts);
  return result;
}
