export const createEvents = <T = void>() => {
  const set = new Set<(value: T) => void>();

  return {
    on(update: (value: T) => void) {
      set.add(update);

      return () => {
        set.delete(update);
      };
    },
    emit(value: T) {
      set.forEach((update) => {
        try {
          update(value);
        } catch (error) {
          console.error(error);
        }
      });
    },
  };
};

export const events = {
  unauthorized: createEvents(),
  accessTokenUpdated: createEvents<string>(),
};
