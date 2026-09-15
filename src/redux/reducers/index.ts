// Import only reducers to avoid SSR issues with sagas
import { authReducer } from '~mdAuth/redux/slice';
import { baseQuery } from '../RTKQuery';
import { dashboardReducer } from '~mdDashboard/redux/slice';

const rootReducer = {
  authReducer,
  dashboardReducer,
  [baseQuery.reducerPath]: baseQuery.reducer,
};

export default rootReducer;
