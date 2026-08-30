import { LibraryItem } from '@/app/dashboard/library/_components';
import { useAppPagination } from '@hooks';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, Text, View } from 'react-native-web';
import styles from './styles';
import Search from 'antd/es/input/Search';
import { Button, Modal as AntdModal, Segmented, Select, Tag } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { Library } from '~mdDashboard/types';
import { PracticeTask, PracticeSubject } from '~mdDashboard/types/practice';
import { AddLibraryContent } from '~mdAdmin/components';
import { adminQuery } from '~mdAdmin/redux';
import './styles.scss';

type ModalSelectLibraryProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  // Phần học ĐANG sửa (undefined lúc tạo mới) — dùng để phân biệt "bài này
  // đã thuộc CHÍNH phần đang sửa" (bình thường) với "đang thuộc phần khác"
  // (cần cảnh báo, vì 1 bài thực hành chỉ thuộc được 1 phần — chọn nó ở đây
  // sẽ ÂM THẦM gỡ nó khỏi phần kia khi lưu).
  currentModuleId?: string;
  initialValues?: Library[];
  initialTaskValues?: PracticeTask[];
  onDone: (libraries: Library[], tasks: PracticeTask[]) => void;
};

// 1 modal chọn cả 2 loại nội dung cho 1 phần học: bài học video (tab có
// sẵn) và bài thực hành (tab mới) — mở lên là chọn được luôn cả 2, không
// phải mở 2 nơi khác nhau. Việc LƯU thật sự (ghi vào Module.libraries[]
// hay gọi PUT .../module cho từng PracticeTask) vẫn do component cha
// (AddModuleContent) xử lý lúc bấm "Lưu phần học" — modal này chỉ thu
// thập lựa chọn.
const ModalSelectLibrary: React.FC<ModalSelectLibraryProps> = ({
  isVisible,
  setIsVisible,
  currentModuleId,
  initialValues,
  initialTaskValues,
  onDone,
}) => {
  const { listItem, fetchData, search, refresh } = useAppPagination<Library>({
    apiUrl: 'library/getAllLibrary',
  });
  const [selectedItems, setSelectedItems] = useState<Library[]>([]);
  const [isVisibleModalAddNew, setIsVisibleModalAddNew] = useState(false);
  const [activeTab, setActiveTab] = useState<'library' | 'practiceTask'>(
    'library',
  );

  // Bài thực hành không thuộc riêng 1 khóa học nào khi chưa gắn — lấy hết
  // toàn bộ để chọn, giống hệt cách bài học video cũng không lọc theo
  // khóa học trong picker này.
  const { data: allTasks } = adminQuery.useGetPracticeTasksAdminQuery();
  const [selectedTasks, setSelectedTasks] = useState<PracticeTask[]>([]);
  const [taskSearch, setTaskSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<PracticeSubject | 'all'>(
    'all',
  );

  const closeModal = () => setIsVisible(false);
  const closeModalAddNew = () => setIsVisibleModalAddNew(false);

  const handleDone = () => {
    onDone(selectedItems, selectedTasks);
    closeModal();
  };

  useEffect(() => {
    if (isVisible) {
      setSelectedItems(initialValues || []);
      setSelectedTasks(initialTaskValues || []);
      setActiveTab('library');
    }
  }, [isVisible]);

  const handleSelectLibrary = (data: any) => {
    if (selectedItems.some(item => item._id === data._id)) {
      setSelectedItems(selectedItems.filter(item => item._id !== data._id));
    } else {
      setSelectedItems([...selectedItems, data]);
    }
  };

  const handleSelectTask = (task: PracticeTask) => {
    if (selectedTasks.some(item => item._id === task._id)) {
      setSelectedTasks(selectedTasks.filter(item => item._id !== task._id));
    } else {
      setSelectedTasks([...selectedTasks, task]);
    }
  };

  const filteredTasks = (allTasks || []).filter(
    t =>
      t.title.toLowerCase().includes(taskSearch.toLowerCase()) &&
      (subjectFilter === 'all' || t.subject === subjectFilter),
  );

  return (
    <Modal
      visible={isVisible}
      style={styles.modalContainer}
      transparent
      animationType="fade">
      <View style={styles.modal} onClick={closeModal}>
        <View
          style={{
            ...styles.content,
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={e => e.stopPropagation()}>
          <Segmented
            style={{ marginBottom: 16, alignSelf: 'flex-start' }}
            value={activeTab}
            onChange={v => setActiveTab(v as 'library' | 'practiceTask')}
            options={[
              {
                label: `Bài học video (${selectedItems.length})`,
                value: 'library',
              },
              {
                label: `Bài thực hành (${selectedTasks.length})`,
                value: 'practiceTask',
              },
            ]}
          />

          {/* flex:1 + overflowY:auto + minHeight:0 — bắt buộc phải có cả 3 để
              vùng này tự cuộn riêng bên trong khung modal cố định 90vh, thay
              vì đẩy cả trang cuộn theo khiến nút Done/Add new library bị đẩy
              ra ngoài tầm với. */}
          <View style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {activeTab === 'library' ? (
              <>
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
                  key="library-list"
                  data={listItem}
                  numColumns={4}
                  onEndReached={fetchData}
                  columnWrapperStyle={{ gap: '0.5%' }}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => item._id + index}
                  renderItem={({ item }) => (
                    <LibraryItem
                      style={
                        selectedItems.findIndex(
                          sItem => sItem._id === item._id,
                        ) !== -1 && styles.itemSelected
                      }
                      data={item}
                      onClick={() => handleSelectLibrary(item)}
                    />
                  )}
                />
              </>
            ) : (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 8,
                    marginBottom: 20,
                  }}>
                  <Search
                    placeholder="Tìm bài thực hành"
                    enterButton="Search"
                    allowClear
                    size="large"
                    style={{ flex: 1 }}
                    onSearch={setTaskSearch}
                  />
                  <Select
                    value={subjectFilter}
                    onChange={setSubjectFilter}
                    style={{ width: 140 }}
                    size="large"
                    options={[
                      { value: 'all', label: 'Tất cả môn' },
                      { value: 'Word', label: 'Word' },
                      { value: 'Excel', label: 'Excel' },
                    ]}
                  />
                </View>
                {/* Danh sách 1 cột, không phải lưới thẻ như bài học video —
                    tiêu đề bài thực hành thường dài (1 câu mô tả bài tập),
                    lưới 4 cột làm chữ bị bóp/xuống dòng xấu và trông vỡ
                    layout. Mỗi dòng cao tự nhiên theo nội dung, có dấu tick
                    rõ ràng khi đã chọn thay vì chỉ đổi viền. */}
                <FlatList
                  key="task-list"
                  data={filteredTasks}
                  numColumns={1}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => item._id + index}
                  renderItem={({ item }) => {
                    const isSelected = selectedTasks.some(
                      t => t._id === item._id,
                    );
                    // moduleId khác currentModuleId (kể cả currentModuleId
                    // là undefined lúc tạo mới) -> bài này đang thật sự
                    // thuộc 1 phần học KHÁC. Chọn nó ở đây, lúc lưu sẽ gỡ nó
                    // khỏi phần đó — đúng thiết kế (1 bài chỉ ở 1 phần) chứ
                    // không phải lỗi, nhưng admin cần biết trước để khỏi
                    // nhầm là "thêm mới" như với 1 bài chưa gán đâu cả.
                    const assignedElsewhere =
                      !!item.moduleId && item.moduleId !== currentModuleId;
                    return (
                      <View
                        onClick={() => handleSelectTask(item)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 10,
                          padding: 12,
                          marginBottom: 10,
                          borderRadius: 8,
                          borderWidth: isSelected ? 2 : 0.5,
                          borderColor: isSelected
                            ? 'var(--color-vhu-primary)'
                            : '#8D8D8D',
                          cursor: 'pointer',
                        }}>
                        <Tag
                          color={item.subject === 'Excel' ? 'green' : 'blue'}>
                          {item.subject}
                        </Tag>
                        {!item.isPublished && <Tag color="default">Nháp</Tag>}
                        <Text style={{ flex: 1, fontSize: 14 }}>
                          {item.title}
                        </Text>
                        {assignedElsewhere && (
                          <Tag color="warning">
                            Đang thuộc: {item.moduleTitle || 'phần khác'}
                          </Tag>
                        )}
                        {isSelected && (
                          <CheckCircleFilled
                            style={{
                              color: 'var(--color-vhu-primary)',
                              fontSize: 18,
                            }}
                          />
                        )}
                      </View>
                    );
                  }}
                />
              </>
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              paddingTop: 12,
              flexShrink: 0,
            }}>
            <Button style={styles.button} onClick={handleDone}>
              <Text style={styles.buttonText}>Done</Text>
            </Button>
            <Button
              style={styles.buttonAddNew}
              onClick={() => setIsVisibleModalAddNew(true)}>
              <Text style={styles.buttonText}>Add new library</Text>
            </Button>
          </View>
        </View>
      </View>
      <AntdModal
        open={isVisibleModalAddNew}
        onCancel={closeModalAddNew}
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
