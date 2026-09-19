'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Input, Modal, Switch } from 'antd';
import AppButton from '@components/AppButton';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { ClassItem } from '../../redux/RTKQuery/type';
import { apiErrorMessage } from '../practiceClassShared';
import styles from './styles';

interface ClassFormModalProps {
  open: boolean;
  // Có classItem = sửa lớp đó, không có = tạo lớp mới.
  classItem?: ClassItem;
  onClose: () => void;
  onSaved?: (item: ClassItem) => void;
}

type Field = 'code' | 'name' | 'termLabel' | 'note';
type Errors = Partial<Record<Field, string>>;

const MAX_LENGTH: Record<Field, number> = {
  code: 50,
  name: 200,
  termLabel: 100,
  note: 1000,
};

const buttonStyle = { width: 'auto', height: 44 } as const;

const validateField = (
  field: Field,
  value: string,
  isEdit: boolean,
): string | undefined => {
  const v = value.trim();
  if (field === 'code' && !isEdit && !v) return 'Vui lòng nhập mã lớp.';
  if (field === 'name' && !v) return 'Vui lòng nhập tên lớp.';
  if (v.length > MAX_LENGTH[field]) {
    return `Tối đa ${MAX_LENGTH[field]} ký tự.`;
  }
  return undefined;
};

const ClassForm: React.FC<Omit<ClassFormModalProps, 'open'>> = ({
  classItem,
  onClose,
  onSaved,
}) => {
  const isEdit = !!classItem;
  const [values, setValues] = useState<Record<Field, string>>({
    code: classItem?.code ?? '',
    name: classItem?.name ?? '',
    termLabel: classItem?.termLabel ?? '',
    note: classItem?.note ?? '',
  });
  const [archived, setArchived] = useState(classItem?.status === 'archived');
  const [errors, setErrors] = useState<Errors>({});

  const [createClass, { isLoading: isCreating }] =
    adminQuery.useCreateClassMutation();
  const [updateClass, { isLoading: isUpdating }] =
    adminQuery.useUpdateClassMutation();
  const isSaving = isCreating || isUpdating;

  const setValue = (field: Field, value: string) =>
    setValues(prev => ({ ...prev, [field]: value }));

  const revalidate = (field: Field) =>
    setErrors(prev => ({
      ...prev,
      [field]: validateField(field, values[field], isEdit),
    }));

  const handleSubmit = async () => {
    const next: Errors = {};
    (Object.keys(MAX_LENGTH) as Field[]).forEach(f => {
      next[f] = validateField(f, values[f], isEdit);
    });
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    const body = {
      name: values.name.trim(),
      termLabel: values.termLabel.trim(),
      note: values.note.trim(),
    };
    try {
      const saved = classItem
        ? await updateClass({
            classId: classItem._id,
            body: { ...body, status: archived ? 'archived' : 'active' },
          }).unwrap()
        : await createClass({ code: values.code.trim(), ...body }).unwrap();
      messageApi.success(classItem ? 'Đã lưu lớp học' : 'Đã tạo lớp học');
      onSaved?.(saved);
      onClose();
    } catch (err: unknown) {
      const message = apiErrorMessage(err, 'Lưu lớp học thất bại');
      // 409 = trùng mã lớp: hiện ngay dưới ô mã lớp thay vì toast.
      if ((err as { status?: number })?.status === 409) {
        setErrors(prev => ({ ...prev, code: message }));
      } else {
        messageApi.error(message);
      }
    }
  };

  const fieldError = (field: Field) =>
    errors[field] ? <Text style={styles.error}>{errors[field]}</Text> : null;

  return (
    <View style={styles.shell}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>
            {isEdit ? 'Sửa lớp học' : 'Tạo lớp học'}
          </Text>
          <Text style={styles.subline}>
            {isEdit
              ? `Mã lớp ${classItem.code}`
              : 'Tạo lớp trống, thêm học viên sau.'}
          </Text>
        </View>
        <button
          type="button"
          aria-label="Đóng"
          onClick={onClose}
          style={styles.closeButton as React.CSSProperties}>
          Đóng
        </button>
      </View>
      <View style={styles.body}>
        <View style={styles.field}>
          <Text style={styles.label}>
            {'Mã lớp '}
            {!isEdit && <Text style={styles.required}>*</Text>}
          </Text>
          <Input
            size="large"
            aria-label="Mã lớp"
            placeholder="VD: MOS-K22-01"
            disabled={isEdit}
            status={errors.code ? 'error' : undefined}
            value={values.code}
            onChange={e => setValue('code', e.target.value)}
            onBlur={() => revalidate('code')}
          />
          {isEdit && (
            <Text style={styles.hint}>
              Mã lớp là khóa tham chiếu với dữ liệu người dùng nên không đổi
              được.
            </Text>
          )}
          {fieldError('code')}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            {'Tên lớp '}
            <Text style={styles.required}>*</Text>
          </Text>
          <Input
            size="large"
            aria-label="Tên lớp"
            placeholder="VD: Tin học văn phòng MOS - K22"
            status={errors.name ? 'error' : undefined}
            value={values.name}
            onChange={e => setValue('name', e.target.value)}
            onBlur={() => revalidate('name')}
          />
          {fieldError('name')}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Học kỳ</Text>
          <Input
            size="large"
            aria-label="Học kỳ"
            placeholder="VD: HK1 2025-2026"
            status={errors.termLabel ? 'error' : undefined}
            value={values.termLabel}
            onChange={e => setValue('termLabel', e.target.value)}
            onBlur={() => revalidate('termLabel')}
          />
          {fieldError('termLabel')}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Ghi chú</Text>
          <Input.TextArea
            rows={3}
            aria-label="Ghi chú"
            status={errors.note ? 'error' : undefined}
            value={values.note}
            onChange={e => setValue('note', e.target.value)}
            onBlur={() => revalidate('note')}
          />
          {fieldError('note')}
        </View>

        {isEdit && (
          <View style={styles.field}>
            <View style={styles.switchRow}>
              <Switch
                aria-label="Lưu trữ lớp"
                checked={archived}
                onChange={setArchived}
              />
              <Text style={styles.label}>
                {archived ? 'Lớp đã lưu trữ' : 'Lưu trữ lớp'}
              </Text>
            </View>
            <Text style={styles.hint}>
              Lớp đã lưu trữ không thêm được học viên mới. Có thể khôi phục bất
              cứ lúc nào, dữ liệu học viên không bị xóa.
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <AppButton style={buttonStyle} disabled={isSaving} onClick={onClose}>
            Hủy
          </AppButton>
          <AppButton
            type="primary"
            style={buttonStyle}
            loading={isSaving}
            disabled={isSaving}
            onClick={handleSubmit}>
            {isEdit ? 'Lưu thay đổi' : 'Tạo lớp học'}
          </AppButton>
        </View>
      </View>
    </View>
  );
};

const ClassFormModal: React.FC<ClassFormModalProps> = ({
  open,
  classItem,
  onClose,
  onSaved,
}) => (
  <Modal
    open={open}
    onCancel={onClose}
    footer={null}
    closable={false}
    width={720}
    destroyOnHidden
    styles={{ body: { padding: 0 }, content: { padding: 0 } }}>
    {/* Form nằm trong Modal + destroyOnHidden nên state được khởi tạo lại
        từ classItem mỗi lần mở. */}
    <ClassForm classItem={classItem} onClose={onClose} onSaved={onSaved} />
  </Modal>
);

export default ClassFormModal;
