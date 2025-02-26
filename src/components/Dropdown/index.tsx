'use client';

import { JSX } from 'react';
import './style.css';
import { ConfigProvider, Dropdown, DropdownProps } from 'antd';

const MyDropdown = (props: DropdownProps): JSX.Element => (
  <ConfigProvider
    theme={{
      token: {
        colorBgElevated: '#F6F7FA',
        colorText: '#1b1b1b',
        borderRadiusLG: 8,
        paddingXXS: 16,
        controlPaddingHorizontal: 0,
        controlItemBgHover: '#b2bbc7',
      },
    }}>
    <Dropdown {...props} />
  </ConfigProvider>
);
export default MyDropdown;
