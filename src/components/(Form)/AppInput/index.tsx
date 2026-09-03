import { Input, InputProps } from 'antd';
import type { TextAreaProps } from 'antd/es/input';
import React from 'react';
import styles from './styles';
import { lexend } from '@styles';

type AppInputProps = InputProps & {
  type?: 'Group' | 'Search' | 'Password' | 'TextArea';
  // Chỉ có ý nghĩa khi type="TextArea" (Input.TextArea) - antd không gộp
  // field này vào InputProps chung.
  autoSize?: TextAreaProps['autoSize'];
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
        { fontFamily: lexend.style.fontFamily }, // Thêm fontFamily vào đây
      )}
    />
  );
};

export default AppInput;
