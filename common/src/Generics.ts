export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : DeepPartial<T[P]>
};

export interface AnyObject {
  [x: string]: any;
}

export type AnyArray = any[];

/**
 * Creates a sub-interface of Base, based on the Condition provided
 */
export type SubType<Base, Condition> = Pick<Base, {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never
}[keyof Base]>;

/**
 * Duck-typing for typescript
 */
export function isDuck<A extends AnyObject>(obj: AnyObject, key: keyof A | Array<keyof A>): obj is A {
  const keys = Array.isArray(key) ? key : [key];
  return keys.every((k) => obj.hasOwnProperty(k));
}
