import { LibraryItem } from '@/app/dashboard/library/_components';
import { useAppPagination } from '@hooks';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, Text, View } from 'react-native-web';
import styles from './styles';
import Search from 'antd/es/input/Search';
import { Button, Modal as AntdModal } from 'antd';
import { Library } from '~mdDashboard/types';
import { AddLibraryContent } from '~mdAdmin/components';
import './styles.css';

type ModalSelectLibraryProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onFinish: (data: any[]) => void;
  initialValues?: Library[];
};
const ModalSelectLibrary: React.FC<ModalSelectLibraryProps> = ({
  isVisible,
  setIsVisible,
  onFinish,
  initialValues,
}) => {
  const { listItem, fetchData, search, refresh } = useAppPagination<Library>({
    apiUrl: 'library/getAllLibrary',
  });
  const [selectedItems, setSelectedItems] = useState<Library[]>([]);
  const [isVisibleModalAddNew, setIsVisibleModalAddNew] = useState(false);

  const closeModal = () => setIsVisible(false);
  const closeModalAddNew = () => setIsVisibleModalAddNew(false);

  const handleDone = () => {
    onFinish(selectedItems);
    closeModal();
    setSelectedItems([]);
  };

  useEffect(() => {
    if (initialValues) {
      setSelectedItems(initialValues);
    }
  }, []);

  const handleSelectLibrary = (data: any) => {
    if (selectedItems.some(item => item._id === data._id)) {
      setSelectedItems(selectedItems.filter(item => item._id !== data._id));
    } else {
      setSelectedItems([...selectedItems, data]);
    }
  };

  return (
    <Modal
      visible={isVisible}
      style={styles.modalContainer}
      transparent
      animationType="fade">
      <View style={styles.modal} onClick={closeModal}>
        <View style={styles.content} onClick={e => e.stopPropagation()}>
          <View style={{ gap: 8, marginBottom: 20 }}>
            <Search
              placeholder="Search"
              enterButton="Search"
              allowClear
              size="large"
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
            renderItem={({ item }) => {
              return (
                <LibraryItem
                  style={
                    selectedItems.findIndex(sItem => sItem._id === item._id) !==
                      -1 && styles.itemSelected
                  }
                  data={item}
                  onClick={() => handleSelectLibrary(item)}
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
              <Text style={styles.buttonText}>Add new library </Text>
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
        <AddLibraryContent
          onDone={data => {
            setSelectedItems([...selectedItems, data]);
            refresh();
            closeModalAddNew();
          }}
        />
      </AntdModal>
    </Modal>
  );
};

export default ModalSelectLibrary;
