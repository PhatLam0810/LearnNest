import { authReducer } from '~mdAuth/redux';
import { baseQuery } from '../RTKQuery';
import { dashboardReducer } from '~mdDashboard/redux';
import { adminReducer } from '@/modules/admin/redux/slice';

const rootReducer = {
  authReducer,
  adminReducer,
  dashboardReducer,
  [baseQuery.reducerPath]: baseQuery.reducer,
};

export default rootReducer;
