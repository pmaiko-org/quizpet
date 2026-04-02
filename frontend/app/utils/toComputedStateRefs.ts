import { computed, type ComputedRef, type Ref } from "vue";

type DeepReadonly<T> = T extends (...args: any[]) => any
  ? T
  : T extends readonly any[]
    ? ReadonlyArray<DeepReadonly<T[number]>>
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

type ToComputedRefs<T extends object> = {
  [K in keyof T]: ComputedRef<DeepReadonly<T[K]>>;
};

export const toComputedStateRefs = <T extends object>(
  state: Ref<T>
): ToComputedRefs<T> =>
  Object.fromEntries(
    Object.keys(state.value).map(key => [
      key,
      computed(() => state.value[key as keyof T] as DeepReadonly<T[keyof T]>),
    ])
  ) as ToComputedRefs<T>;
