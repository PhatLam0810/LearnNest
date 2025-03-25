import { store } from '@/redux';
import { setIsShowLoading } from '~mdAuth/redux';

export const showAppLoading = () => {
  store.dispatch(setIsShowLoading(true));
};

export const hideAppLoading = () => {
  store.dispatch(setIsShowLoading(false));
};
