import { useContextSelector, Context } from "use-context-selector";

export const createUseContext = <T, O extends object | undefined = undefined>(
  context: Context<T>,
  baseObj?: O,
) => {
  return () =>
    new Proxy(baseObj ?? {}, {
      get: (_, name) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useContextSelector(context, (c: any) => c[name]);
      },
    }) as O extends undefined ? T : T & O;
};
