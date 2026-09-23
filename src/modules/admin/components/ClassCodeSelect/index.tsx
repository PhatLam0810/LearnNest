'use client';
import React, { useState } from 'react';
import { Divider, Input, Select, Space } from 'antd';
import { PlusOutlined } from '@components/AppIcon';
import AppButton from '@components/AppButton';

interface ClassOption {
  _id: string;
  name: string;
}

interface ClassCodeSelectProps {
  options: ClassOption[];
  onChange: (value: string) => void;
  onCreate: (name: string) => Promise<void>;
}

const ClassCodeSelect: React.FC<ClassCodeSelectProps> = ({
  options,
  onChange,
  onCreate,
}) => {
  const [newTag, setNewTag] = useState('');

  return (
    <Select
      style={{ width: 300, height: 44 }}
      placeholder="Chọn mã lớp"
      onChange={onChange}
      popupRender={menu => (
        <>
          {menu}
          <Divider style={{ margin: '8px 0' }} />
          <Space style={{ padding: '0 8px 4px' }}>
            <Input
              placeholder="Nhập mã lớp học"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              style={{ width: 140 }}
            />
            <AppButton
              style={{ width: 'auto' }}
              icon={<PlusOutlined />}
              onClick={() => {
                if (!newTag.trim()) return;
                onCreate(newTag.trim()).then(() => setNewTag(''));
              }}>
              Tạo
            </AppButton>
          </Space>
        </>
      )}
      getPopupContainer={triggerNode => triggerNode.parentNode}>
      {options?.map(item => (
        <Select.Option key={item._id} value={item.name}>
          {item.name}
        </Select.Option>
      ))}
    </Select>
  );
};

export default ClassCodeSelect;
