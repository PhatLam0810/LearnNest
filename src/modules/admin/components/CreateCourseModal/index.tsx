'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Button, Form, Input, Modal, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { AppUploadImageCrop } from '@components';
import { adminQuery } from '~mdAdmin/redux';
import { Module } from '~mdDashboard/redux/saga/type';
import { convertDurationToTime } from '@utils/time';
import { messageApi } from '@hooks';
import CreateSectionModal from '../CreateSectionModal';
import styles from './styles';

interface CreateCourseModalProps {
  isVisible: boolean;
  onClose: () => void;
  onDone: () => void;
}

// Modal con "Thêm phần học" mở LỒNG bên trong modal này — antd Modal mặc
// định zIndex=1000 cho mọi modal, phải nâng zIndex modal con lên cao hơn để
// không bị vẽ đè xuống dưới modal cha (xem giải thích gốc ở UpdateModuleForm).
const NESTED_MODAL_Z_INDEX = 1100;

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  isVisible,
  onClose,
  onDone,
}) => {
  const [form] = Form.useForm();
  const [addLesson, { isLoading }] = adminQuery.useAddLessonMutation();
  const [uploadImage] = adminQuery.useUploadImageMutation();
  const [attachedSections, setAttachedSections] = useState<Module[]>([]);
  const [isSectionModalVisible, setIsSectionModalVisible] = useState(false);

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
    thumbnail?: string;
    learnedSkills?: string[];
  }) => {
    addLesson({
      ...values,
      modules: attachedSections.map(s => s._id),
    })
      .unwrap()
      .then(() => {
        messageApi.success('Tạo khóa học thành công');
        resetAndClose();
        onDone();
      })
      .catch(() => {
        messageApi.error('Tạo khóa học thất bại');
      });
  };

  return (
    <Modal
      title="Thêm khóa học"
      open={isVisible}
      onCancel={resetAndClose}
      footer={null}
      width={1120}
      centered
      destroyOnClose>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
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
        <Button
          type="dashed"
          block
          icon={<PlusOutlined />}
          style={styles.addSectionButton}
          onClick={() => setIsSectionModalVisible(true)}>
          Thêm phần học
        </Button>
        <View style={styles.sectionsList}>
          {attachedSections.map(section => (
            <View key={section._id} style={styles.sectionRow}>
              <Text style={styles.sectionRowTitle}>{section.title}</Text>
              <Text style={styles.sectionRowMeta}>
                {(section.libraries?.length || 0) +
                  (section.practiceTaskCount || 0)}{' '}
                bài
              </Text>
              <Button
                style={styles.sectionDeleteButton}
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
          ))}
        </View>

        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
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
    </Modal>
  );
};

export default CreateCourseModal;
