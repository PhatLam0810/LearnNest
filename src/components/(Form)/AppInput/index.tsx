import { Input, InputProps } from 'antd';
import React from 'react';
import styles from './styles';
import { dmSans } from '@styles';

type AppInputProps = InputProps & {
  type?: 'Group' | 'Search' | 'Password' | 'TextArea';
};
const AppInput: React.FC<AppInputProps> = ({ type, ...props }) => {
  const InputType = (Input[type] || Input) as typeof Input;
  return (
    <InputType
      {...props}
      multiple
      style={Object.assign(
        {},
        styles.container,
        props.value ? styles.filled : {},
        props.style,
        { fontFamily: dmSans.style.fontFamily }, // Thêm fontFamily vào đây
      )}
    />
  );
};

export default AppInput;
