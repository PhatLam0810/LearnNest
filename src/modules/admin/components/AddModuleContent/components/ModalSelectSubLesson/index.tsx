import { useAppPagination } from '@hooks';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, Text, View } from 'react-native-web';
import styles from './styles';
import { Button, Modal as AntdModal } from 'antd';
import { Sublesson } from '~mdDashboard/redux/saga/type';
import Search from 'antd/es/input/Search';
import { SubLessonItem } from '@/app/dashboard/subLesson/_components';
import { AddSubLessonContent } from '~mdAdmin/components';
type ModalSelectSubLessonProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onFinish: (data: any[]) => void;
  initialValues?: any;
};
const ModalSelectSubLesson: React.FC<ModalSelectSubLessonProps> = ({
  isVisible,
  setIsVisible,
  onFinish,
  initialValues,
}) => {
  const { listItem, fetchData, refresh, search } = useAppPagination<Sublesson>({
    apiUrl: 'lesson/getAllSubLesson',
  });

  const [isVisibleModalAddNew, setIsVisibleModalAddNew] = useState(false);
  const closeModalAddNew = () => setIsVisibleModalAddNew(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const closeModal = () => setIsVisible(false);

  const handleDone = () => {
    onFinish(selectedItems);
    closeModal();
  };

  const handleSelectSubLesson = (data: any) => {
    if (selectedItems.some(item => item._id === data._id)) {
      setSelectedItems(selectedItems.filter(item => item._id !== data._id));
    } else {
      setSelectedItems([...selectedItems, data]);
    }
  };

  useEffect(() => {
    if (initialValues) {
      setSelectedItems(initialValues);
    }
  }, [initialValues]);

  useEffect(() => {
    if (isVisible) {
      refresh();
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
                <SubLessonItem
                  style={
                    selectedItems.findIndex(sItem => sItem._id === item._id) !==
                      -1 && styles.itemSelected
                  }
                  key={item._id + index}
                  title={item.title}
                  description={item.title}
                  durations={item.durations}
                  libraries={item.libraries.length}
                  onClick={() => handleSelectSubLesson(item)}
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
              <Text>Add new sublesson</Text>
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
        <AddSubLessonContent
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

export default ModalSelectSubLesson;
