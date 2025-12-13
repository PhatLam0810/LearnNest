// Import sagas directly to avoid SSR issues
import { adminSaga } from '@/modules/admin/redux/saga';
import * as effects from 'redux-saga/effects';
import { authSaga } from '~mdAuth/redux/saga';
import { dashboardSaga } from '~mdDashboard/redux/saga';

export default function* rootSaga() {
  yield effects.all([dashboardSaga(), authSaga(), adminSaga()]);
}
