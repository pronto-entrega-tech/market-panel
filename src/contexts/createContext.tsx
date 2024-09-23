import {
  ReactNode,
  createContext as createContextOrig,
  useContext as useContextOrig,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { fail } from "~/functions/fail";

type Store<T> = {
  value: T;
  subscribe: (l: () => void) => () => boolean;
  notify: () => void;
};

export const createContext = <Value extends object>(useValue: () => Value) => {
  const context = createContextOrig<Store<Value> | undefined>(undefined);

  function Provider({ children }: { children: ReactNode }) {
    const value = useValue();

    const [store] = useState(() => {
      const listeners = new Set<() => void>();
      return {
        value,
        subscribe: (l: () => void) => {
          listeners.add(l);
          return () => listeners.delete(l);
        },
        notify: () => listeners.forEach((l) => l()),
      };
    });

    useEffect(() => {
      if (!Object.is(store.value, value)) {
        store.value = value;
        store.notify();
      }
    }, [store, value]);

    return <context.Provider value={store}>{children}</context.Provider>;
  }

  const useContext = () => {
    const store =
      useContextOrig(context) ?? fail(`Missing provider for ${useValue.name}`);
    return new Proxy({} as Value, {
      get: (_, name) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useSyncExternalStore(
          store.subscribe,
          () => store.value[name as keyof Value],
          () => store.value[name as keyof Value],
        );
      },
    });
  };

  const useContextSelector = <Selected,>(
    selector: (value: Value) => Selected,
  ) => {
    const store =
      useContextOrig(context) ?? fail(`Missing provider for ${useValue.name}`);
    return useSyncExternalStore(
      store.subscribe,
      () => selector(store.value),
      () => selector(store.value),
    );
  };

  return [Provider, useContext, useContextSelector] as const;
};
