import type { esMX } from "./es-MX";

type DeepWiden<T> =
  T extends (...args: infer Args) => infer Return
    ? (...args: Args) => Return
    : T extends string
      ? string
      : T extends number
        ? number
        : T extends boolean
          ? boolean
          : T extends readonly (infer Item)[]
            ? readonly DeepWiden<Item>[]
            : T extends object
              ? { readonly [Key in keyof T]: DeepWiden<T[Key]> }
              : T;

export type TranslationStrings = DeepWiden<typeof esMX>;
