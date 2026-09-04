// Shim for `@redux` used ONLY by the /design-sync bundle build - see
// .design-sync/NOTES.md "redux/services shim". The real src/redux/index.ts
// bootstraps a full Redux store at import time: redux-saga runs real sagas,
// redux-persist writes to localStorage, and an RTK Query slice
// (redux/RTKQuery) reads `process.env.NEXT_PUBLIC_API_BASE_URL` at module
// scope - a bare (non-typeof-guarded) `process` reference that throws
// outside Next's own build, crashing the WHOLE shared bundle (every preview
// card) before any component even renders. None of that setup is safe or
// meaningful inside an isolated component preview anyway.
//
// This stub is an inert store: dispatch is a no-op, selectors run against
// an empty object (so a component reading a deep field gets `undefined`,
// same as any other missing-data case the floor-card/crash-prevention path
// already tolerates per-component - the goal here is only to stop the
// bundle-wide module-init crash, not to fully emulate app state).
export const store = {
  getState: () => ({}) as any,
  dispatch: (..._args: any[]) => undefined,
  subscribe: (_fn: () => void) => () => {},
};

export const persistor = {
  persist: () => {},
  purge: () => Promise.resolve(),
};

export type RootState = any;
export type AppDispatch = any;

export const useAppDispatch =
  () =>
  (..._args: any[]) =>
    undefined;
export const useAppSelector = (selector: (state: any) => any) => {
  try {
    return selector({});
  } catch {
    return undefined;
  }
};
