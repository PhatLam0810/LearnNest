import { adminSaga } from '@/modules/admin/redux/saga';
import { all } from 'redux-saga/effects';
import { authSaga } from '~mdAuth/redux';
import { dashboardSaga } from '~mdDashboard/redux';

export default function* rootSaga() {
  yield all([dashboardSaga(), authSaga(), adminSaga()]);
}
