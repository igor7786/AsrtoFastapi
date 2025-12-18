import { persistentAtom } from '@nanostores/persistent';
import type { User } from '@db/types';

export const $nanoUser = persistentAtom<User | null>('user', null, {
  encode: JSON.stringify,
  decode: JSON.parse,
});
