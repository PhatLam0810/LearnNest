import { Button, ButtonProps } from 'antd';
import React from 'react';
import styles from './styles';

type AppButtonProps = ButtonProps;
const AppButton: React.FC<AppButtonProps> = ({ ...props }) => {
  return <Button {...props} style={styles.container} />;
};

export default AppButton;
