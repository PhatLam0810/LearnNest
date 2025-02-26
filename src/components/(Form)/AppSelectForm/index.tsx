import { Select } from 'antd';
import React, { useState } from 'react';
import { View } from 'react-native-web';

type AppSelectFormProps = {
  formTypes: { type: string; render: any }[];
};
const AppSelectForm: React.FC<AppSelectFormProps> = ({ formTypes }) => {
  const [selectedType, setSelectedType] = useState(formTypes[0].type);
  return (
    <View>
      <Select onChange={setSelectedType}>
        {formTypes.map((item, index) => (
          <Select.Option value={item.type} key={index}>
            {item.type}
          </Select.Option>
        ))}
      </Select>
      <View>
        {formTypes?.find(item => item.type === selectedType)?.render()}
      </View>
    </View>
  );
};

export default AppSelectForm;
