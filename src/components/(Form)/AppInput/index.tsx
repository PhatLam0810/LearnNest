import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
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
  const passwordProps =
    type === 'Password'
      ? {
          iconRender: (visible: boolean) => (
            <button
              type="button"
              aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              aria-pressed={visible}
              style={{
                background: 'none',
                border: 0,
                padding: 0,
                color: 'inherit',
                cursor: 'pointer',
              }}>
              {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </button>
          ),
        }
      : {};
  return (
    <InputType
      {...passwordProps}
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
