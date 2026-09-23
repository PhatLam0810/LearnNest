import { Button, ButtonProps } from 'antd';
import React from 'react';
import styles from './styles';

type AppButtonProps = ButtonProps;
const AppButton: React.FC<AppButtonProps> = ({
  style,
  disabled,
  ...restProps
}) => {
  const disabledStyle = disabled
    ? {
        opacity: 0.5,
        cursor: 'not-allowed',
        boxShadow: 'none',
      }
    : {};
  return (
    <Button
      disabled={disabled}
      {...restProps}
      style={{ ...styles.container, ...style, ...disabledStyle }}
    />
  );
};

export default AppButton;
