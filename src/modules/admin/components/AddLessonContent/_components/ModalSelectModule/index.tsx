import { useAppPagination } from '@hooks';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native-web';
import { Button, Modal } from 'antd';
import { Module } from '~mdDashboard/redux/saga/type';
import { ModuleItem } from '@/app/dashboard/module/_components';
import Search from 'antd/es/input/Search';
import { AddModuleContent } from '~mdAdmin/components';
import './styles.scss';
import { useAppSelector } from '@redux';
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
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const closeModal = () => setIsVisible(false);
  const { isLoading } = useAppSelector(state => state.authReducer);
  const handleDone = () => {
    onFinish(selectedItems);
    closeModal();
    setSelectedItems([]);
  };
  const observer = useRef<IntersectionObserver>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && listItem) {
          fetchData();
        }
      });

      if (node) observer.current.observe(node);
    },
    [listItem, fetchData],
  );
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
    <Modal
      open={isVisible}
      footer={null}
      onCancel={closeModal}
      loading={isLoading}
      width={'70%'}
      style={{ top: 20 }}>
      <div className="modal" onClick={closeModal}>
        <div className="content" onClick={e => e.stopPropagation()}>
          <div style={{ gap: 8, marginBottom: 20 }}>
            <Search
              placeholder="Search"
              enterButton="Search"
              allowClear
              size="large"
              onSearch={search}
            />
          </div>
          <div className="container">
            <div className="grid">
              {listItem.map((item, index) => {
                const isSelected = selectedItems.some(s => s._id === item._id);
                const isLastElement = listItem.length === index + 1;

                return (
                  <div
                    key={`${item._id}-${index}`}
                    ref={isLastElement ? lastElementRef : null}>
                    <ModuleItem
                      data={item}
                      onClick={() => handleSelectModuleLesson(item)}
                      className={isSelected ? 'item-selected' : ''}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ flexDirection: 'row', gap: 12 }}>
            <Button className="button" onClick={handleDone}>
              <div className="button-text">Done</div>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSelectModule;
