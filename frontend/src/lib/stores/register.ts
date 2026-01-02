import { atom } from 'nanostores';
import { type OutputRegisterSchema } from '@/lib/types-schemas-validator/orpc-schemas-types/auth.login.register';

export const isOpen = atom<boolean>(false);
export const isPending = atom<boolean>(false);
export const isError = atom<string>('');

export const isUser = atom<OutputRegisterSchema | null>(null);
