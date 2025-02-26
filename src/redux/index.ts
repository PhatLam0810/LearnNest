import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { persistStore } from 'redux-persist';
import rootSaga from './sagas';
import rootReducer from './reducers';
import { baseQuery } from './RTKQuery';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { storage } from './storage';
import { dashboardQuery } from '~mdDashboard/redux';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(sagaMiddleware)
      .concat(dashboardQuery.middleware),
});

export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export { storage };
