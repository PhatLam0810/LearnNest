'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Text, View } from 'react-native-web';
import { Button, Form, Input, Modal, Segmented, Typography } from 'antd';
import {
  DeleteOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from '@components/AppIcon';
import { AppUploadImageCrop, DraggableList } from '@components';
import { adminQuery } from '~mdAdmin/redux';
import { Lesson, Module } from '~mdDashboard/redux/saga/type';
import { convertDurationToTime } from '@utils/time';
import { getYouTubeThumbnail } from '@utils/youtube';
import { messageApi } from '@hooks';
import CreateSectionModal from '../CreateSectionModal';
import styles from './styles';

// ModalSelectModule import file SCSS (side-effect) - tách bằng next/dynamic để
// không kéo CSS vào mọi trang import barrel `~mdAdmin/components`; picker chỉ
// tải khi admin thật sự bấm "Chọn phần có sẵn".
const ModalSelectModule = dynamic(() => import('../ModalSelectModule'), {
  ssr: false,
});

interface CreateCourseModalProps {
  isVisible: boolean;
  onClose: () => void;
  onDone: () => void;
  // Có initialValues -> chế độ cập nhật khóa học đã có, ngược lại là tạo mới.
  initialValues?: Lesson | null;
}

// Modal con "Thêm phần học"/"Chọn phần có sẵn" mở LỒNG bên trong modal này — antd Modal mặc
// định zIndex=1000 cho mọi modal, phải nâng zIndex modal con lên cao hơn để
// không bị vẽ đè xuống dưới modal cha (xem giải thích ở CreateSectionModal).
const NESTED_MODAL_Z_INDEX = 1100;

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  isVisible,
  onClose,
  onDone,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [addLesson, { isLoading: isAdding }] =
    adminQuery.useAddLessonMutation();
  const [updateLesson, { isLoading: isUpdating }] =
    adminQuery.useUpdateLessonMutation();
  const [uploadImage] = adminQuery.useUploadImageMutation();
  const [attachedSections, setAttachedSections] = useState<Module[]>([]);
  const [isSectionModalVisible, setIsSectionModalVisible] = useState(false);
  const [isSelectModalVisible, setIsSelectModalVisible] = useState(false);

  // Modal dùng destroyOnClose nên Form được mount lại mỗi lần mở - đưa giá trị
  // gốc qua prop initialValues của Form (áp lúc mount) thay vì setFieldsValue
  // từ effect, vì lúc effect chạy Form có thể chưa kịp gắn vào form instance.
  const formInitialValues = initialValues
    ? {
        title: initialValues.title,
        description: initialValues.description,
        instructor: initialValues.instructor,
        accessMode: initialValues.accessMode ?? 'public',
        learnedSkills: initialValues.learnedSkills,
        thumbnail: initialValues.thumbnail?.includes('youtube.com/watch')
          ? getYouTubeThumbnail(initialValues.thumbnail)
          : initialValues.thumbnail,
      }
    : undefined;

  // Mỗi lần mở: nạp lại danh sách phần học đã gắn (mảng modules giữ đúng thứ
  // tự đã lưu) khi sửa, hoặc danh sách rỗng khi tạo mới.
  useEffect(() => {
    if (isVisible) setAttachedSections(initialValues?.modules ?? []);
  }, [isVisible, initialValues]);

  const { totalLibraries, totalDuration } = attachedSections.reduce(
    (acc, m) => {
      acc.totalLibraries +=
        (m.libraries?.length || 0) + (m.practiceTaskCount || 0);
      acc.totalDuration += m.durations || 0;
      return acc;
    },
    { totalLibraries: 0, totalDuration: 0 },
  );

  const resetAndClose = () => {
    form.resetFields();
    setAttachedSections([]);
    onClose();
  };

  const handleFinish = (values: {
    title: string;
    description: string;
    instructor?: string;
    accessMode?: 'public' | 'class';
    thumbnail?: string;
    learnedSkills?: string[];
  }) => {
    // Thứ tự trong attachedSections (đã kéo-thả) chính là thứ tự lưu.
    // BE updateLesson $set nguyên payload và trang public /khoa-hoc đọc thẳng
    // 2 field tổng này đã lưu -> luôn gửi lại theo các phần đang gắn.
    const payload = {
      ...values,
      modules: attachedSections.map(s => s._id),
      totalLibraries,
      totalDuration,
    };
    const isEdit = !!initialValues;
    (isEdit
      ? updateLesson({ _id: initialValues._id, ...payload })
      : addLesson(payload)
    )
      .unwrap()
      .then(() => {
        messageApi.success(
          isEdit ? 'Cập nhật khóa học thành công' : 'Tạo khóa học thành công',
        );
        resetAndClose();
        onDone();
      })
      .catch(() => {
        messageApi.error(
          isEdit ? 'Cập nhật khóa học thất bại' : 'Tạo khóa học thất bại',
        );
      });
  };

  return (
    <Modal
      title={initialValues ? 'Cập nhật khóa học' : 'Thêm khóa học'}
      open={isVisible}
      onCancel={resetAndClose}
      footer={null}
      width={1120}
      centered
      destroyOnClose>
      <Form
        form={form}
        layout="vertical"
        initialValues={formInitialValues}
        onFinish={handleFinish}>
        <View style={styles.grid}>
          <View style={styles.leftCol}>
            <Form.Item
              style={styles.formItem}
              label="Tên khóa học"
              name="title"
              rules={[
                { required: true, message: 'Vui lòng nhập tên khóa học' },
              ]}>
              <Input placeholder="Nhập tên khóa học" style={styles.control} />
            </Form.Item>

            <Form.Item
              style={styles.formItem}
              label="Giảng viên"
              name="instructor"
              rules={[{ max: 100, message: 'Tối đa 100 ký tự' }]}>
              <Input placeholder="Tên giảng viên" style={styles.control} />
            </Form.Item>

            <Form.Item
              style={styles.formItem}
              label="Ai được học khóa này"
              name="accessMode"
              initialValue="public"
              extra="Khóa 'Chỉ lớp được phân' bị ẩn với người ngoài lớp; gán khóa cho lớp ở tab Lớp Học.">
              <Segmented
                options={[
                  { value: 'public', label: 'Công khai' },
                  { value: 'class', label: 'Chỉ lớp được phân' },
                ]}
              />
            </Form.Item>

            <Form.Item
              style={styles.formItem}
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
              <Input.TextArea rows={5} placeholder="Nhập mô tả" />
            </Form.Item>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Tổng bài học</Text>
                <Text style={styles.statValue}>{totalLibraries}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Thời lượng khóa học</Text>
                <Text style={styles.statValue}>
                  {convertDurationToTime(totalDuration)}
                </Text>
              </View>
            </View>

            <Form.Item style={styles.formItem} label="Kỹ năng đạt được">
              <Form.List name="learnedSkills">
                {(fields, { add, remove }) => (
                  <View style={styles.skillsList}>
                    {fields.map(({ key, name, ...restField }) => (
                      <View key={key} style={styles.skillRow}>
                        <Form.Item
                          {...restField}
                          name={name}
                          style={styles.skillInputWrap}
                          rules={[
                            {
                              required: true,
                              message: 'Vui lòng nhập kỹ năng',
                            },
                          ]}>
                          <Input placeholder="Kỹ năng học viên đạt được" />
                        </Form.Item>
                        <DeleteOutlined
                          style={styles.skillDeleteIcon}
                          onClick={() => remove(name)}
                        />
                      </View>
                    ))}
                    <Button
                      type="dashed"
                      block
                      icon={<PlusOutlined />}
                      onClick={() => add()}>
                      Thêm kỹ năng
                    </Button>
                  </View>
                )}
              </Form.List>
            </Form.Item>
          </View>

          <View style={styles.rightCol}>
            <Form.Item
              style={styles.formItem}
              label="Hình nền"
              name="thumbnail">
              <AppUploadImageCrop
                containerStyle={styles.coverUpload}
                onChange={async data => {
                  const blob = await fetch(data).then(res => res.blob());
                  const formData = new FormData();
                  formData.append(
                    'file',
                    new File([blob], `course-cover-${Date.now()}.jpg`, {
                      type: 'image/jpeg',
                    }),
                  );
                  const url = await uploadImage(formData).unwrap();
                  form.setFieldsValue({ thumbnail: url });
                }}
              />
            </Form.Item>
          </View>
        </View>

        <Typography.Title level={5} style={styles.sectionsTitle}>
          Chọn phần học
        </Typography.Title>
        <View style={styles.addSectionRow}>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            style={styles.addSectionButton}
            onClick={() => setIsSectionModalVisible(true)}>
            Thêm phần học
          </Button>
          <Button
            type="dashed"
            icon={<UnorderedListOutlined />}
            style={styles.addSectionButton}
            onClick={() => setIsSelectModalVisible(true)}>
            Chọn phần có sẵn
          </Button>
        </View>
        {/* Kéo-thả để đổi thứ tự phần học (DraggableList chỉ bắt đầu kéo sau
            khi di chuyển >= 5px nên nút xóa dùng onClick bình thường). */}
        <DraggableList
          data={attachedSections}
          keyExtractor={(section: Module) => section._id}
          handleUpdatedList={setAttachedSections}
          style={styles.sectionsList}
          renderItem={({ item: section }: { item: Module }) => {
            return (
              <View style={styles.sectionRow}>
                <Text style={styles.sectionRowTitle}>{section.title}</Text>
                <Text style={styles.sectionRowMeta}>
                  {(section.libraries?.length || 0) +
                    (section.practiceTaskCount || 0)}{' '}
                  bài
                </Text>
                <Button
                  style={styles.sectionDeleteButton}
                  aria-label={`Xóa phần học ${section.title}`}
                  onClick={() =>
                    setAttachedSections(prev =>
                      prev.filter(s => s._id !== section._id),
                    )
                  }>
                  <DeleteOutlined
                    style={{ color: 'var(--color-text-on-primary)' }}
                  />
                </Button>
              </View>
            );
          }}
        />

        <Button
          type="primary"
          htmlType="submit"
          loading={isAdding || isUpdating}
          block
          style={styles.submitButton}>
          Xác nhận
        </Button>
      </Form>

      <CreateSectionModal
        isVisible={isSectionModalVisible}
        onClose={() => setIsSectionModalVisible(false)}
        onCreated={section => setAttachedSections(prev => [...prev, section])}
        zIndex={NESTED_MODAL_Z_INDEX}
      />

      {/* Picker trả về toàn bộ danh sách đã chọn (gồm cả phần đã gắn, bỏ tick
          = gỡ) nên không thể gắn trùng 1 phần. */}
      <ModalSelectModule
        isVisible={isSelectModalVisible}
        setIsVisible={setIsSelectModalVisible}
        listSelected={attachedSections}
        onFinish={setAttachedSections}
        zIndex={NESTED_MODAL_Z_INDEX}
      />
    </Modal>
  );
};

export default CreateCourseModal;
