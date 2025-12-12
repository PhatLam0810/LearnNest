import { Button, ButtonProps } from 'antd';
import React from 'react';
import styles from './styles';

type AppButtonProps = ButtonProps;
const AppButton: React.FC<AppButtonProps> = ({ style, ...restProps }) => {
  return <Button {...restProps} style={{ ...styles.container, ...style }} />;
};

export default AppButton;
