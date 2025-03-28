import { useAppPagination } from '@hooks';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, Text, View } from 'react-native-web';
import styles from './styles';
import { Button, Modal as AntdModal } from 'antd';
import { Module } from '~mdDashboard/redux/saga/type';
import { ModuleItem } from '@/app/dashboard/module/_components';
import Search from 'antd/es/input/Search';
import { AddModuleContent } from '~mdAdmin/components';
type ModalSelectModuleProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  listSelected?: any[];
  onFinish: (data: any[]) => void;
};
const ModalSelectModule: React.FC<ModalSelectModuleProps> = ({
  isVisible,
  setIsVisible,
  listSelected,
  onFinish,
}) => {
  const { listItem, fetchData, refresh, search } = useAppPagination<Module>({
    apiUrl: 'lesson/getAllModule',
  });
  const [isVisibleModalAddNew, setIsVisibleModalAddNew] = useState(false);
  const closeModalAddNew = () => setIsVisibleModalAddNew(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const closeModal = () => setIsVisible(false);

  const handleDone = () => {
    onFinish(selectedItems);
    closeModal();
    setSelectedItems([]);
  };

  const handleSelectModuleLesson = (data: any) => {
    if (selectedItems.some(item => item._id === data._id)) {
      setSelectedItems(selectedItems.filter(item => item._id !== data._id));
    } else {
      setSelectedItems([...selectedItems, data]);
    }
  };

  useEffect(() => {
    if (isVisible) {
      refresh();
      if (listSelected) {
        setSelectedItems(listSelected);
      }
    }
  }, [isVisible]);

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.modal} onClick={closeModal}>
        <View style={styles.content} onClick={e => e.stopPropagation()}>
          <View style={{ gap: 8, marginBottom: 20 }}>
            <Search
              placeholder="Search"
              enterButton="Search"
              allowClear
              size="large"
              // suffix={suffix}
              onSearch={search}
            />
          </View>
          <FlatList
            data={listItem}
            numColumns={5}
            onEndReached={fetchData}
            columnWrapperStyle={{ gap: '0.5%' }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item._id + index}
            renderItem={({ item, index }) => {
              return (
                <ModuleItem
                  data={item}
                  key={item._id + index}
                  title={item.title}
                  description={item.description}
                  durations={item.durations}
                  subLessons={item.subLessons.length}
                  onClick={() => handleSelectModuleLesson(item)}
                  style={
                    selectedItems.findIndex(sItem => sItem._id === item._id) !==
                      -1 && styles.itemSelected
                  }
                />
              );
            }}
          />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button style={styles.button} onClick={handleDone}>
              <Text style={styles.buttonText}>Done</Text>
            </Button>
            <Button
              style={styles.buttonAddNew}
              onClick={() => setIsVisibleModalAddNew(true)}>
              <Text>Add new module</Text>
            </Button>
          </View>
        </View>
      </View>
      <AntdModal
        open={isVisibleModalAddNew}
        onCancel={closeModalAddNew}
        onClose={closeModalAddNew}
        footer={null}
        getContainer={false}>
        <AddModuleContent
          onDone={() => {
            refresh();
            closeModalAddNew();
          }}
        />
      </AntdModal>
    </Modal>
  );
};

export default ModalSelectModule;
