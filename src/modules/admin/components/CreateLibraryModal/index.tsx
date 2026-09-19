'use client';
import React, { useMemo } from 'react';
import { Modal, Spin } from 'antd';
import dynamic from 'next/dynamic';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { CreateLibraryModalProps } from './types';

// AddLibraryContent kéo theo AppRichTextInput (@tiptap/*, CSS side-effect) -
// import THẲNG đường dẫn (không qua barrel `~mdAdmin/components`) và tách bằng
// next/dynamic, chỉ tải khi modal thật sự mở. Cố tình không export modal này
// ra barrel để side-effect không lan sang các trang khác.
const AddLibraryContent = dynamic(() => import('../AddLibraryContent'), {
  ssr: false,
  loading: () => <Spin style={{ margin: 24 }} />,
});

const CreateLibraryModal: React.FC<CreateLibraryModalProps> = ({
  isVisible,
  onClose,
  initialValues,
  onCreated,
  onUpdated,
}) => {
  // getAllLibrary (nguồn của `initialValues`) cố tình bỏ questionList để bảng
  // danh sách nhẹ hơn — fetch lại đầy đủ document khi mở form Cập nhật để
  // không mất câu hỏi đã gắn sẵn cho bài học này.
  const { data: fullLibrary } = adminQuery.useGetLibraryByIdQuery(
    initialValues?._id ?? '',
    { skip: !isVisible || !initialValues?._id },
  );
  const [updateLibrary] = adminQuery.useUpdateLibraryMutation();
  // useMemo để giữ nguyên tham chiếu - AddLibraryContent setFieldsValue lại
  // mỗi khi initialValues đổi tham chiếu, sẽ ghi đè phần admin đang gõ dở.
  const formInitialValues = useMemo(
    () => (fullLibrary ? { ...initialValues, ...fullLibrary } : initialValues),
    [initialValues, fullLibrary],
  );
  // Form hiện ngay, không bắt đợi — nhưng nút "Cập nhật bài học" bị khoá
  // (loading) cho tới khi có đủ dữ liệu gốc. Nếu cho bấm nộp sớm khi bản rút
  // gọn (thiếu questionList) chưa được bổ sung đầy đủ, form sẽ gửi đi thiếu
  // câu hỏi và xoá mất toàn bộ questionList đã tạo trước đó.
  const isSubmitDisabled = !!initialValues?._id && !fullLibrary;

  return (
    <Modal
      title={initialValues ? 'Cập nhật bài học' : 'Thêm bài học'}
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={1120}
      centered
      destroyOnClose>
      {initialValues ? (
        <AddLibraryContent
          initialValues={formInitialValues}
          isSubmitDisabled={isSubmitDisabled}
          onFinish={values => {
            updateLibrary({ _id: initialValues._id, ...values })
              .unwrap()
              .then(() => {
                onUpdated?.();
                onClose();
              })
              .catch((e: { data?: { message?: string } }) => {
                messageApi.error(
                  e?.data?.message || 'Cập nhật bài học thất bại',
                );
              });
          }}
        />
      ) : (
        <AddLibraryContent
          onDone={library => {
            onCreated?.(library);
            onClose();
          }}
        />
      )}
    </Modal>
  );
};

export default CreateLibraryModal;
