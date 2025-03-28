import { useAppSelector } from '@redux';
import { Spin } from 'antd';
import { View } from 'react-native-web';

const LoadingScreen = () => {
  const { isLoading } = useAppSelector(state => state.authReducer);
  return (
    <View>
      <Spin size="large" fullscreen spinning={isLoading}></Spin>
    </View>
  );
};

export default LoadingScreen;
