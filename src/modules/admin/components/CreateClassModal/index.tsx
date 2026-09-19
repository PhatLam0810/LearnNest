'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native-web';
import { DatePicker, Input, Modal, Segmented, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import AppButton from '@components/AppButton';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import styles from './styles';

interface CreateClassModalProps {
  open: boolean;
  onClose: () => void;
}

type LearnerMode = 'code' | 'users';
type Errors = Partial<Record<'code' | 'task' | 'dueDate' | 'learners', string>>;
interface PickedUser {
  value: string;
  label: string;
}

const MODE_OPTIONS = [
  { label: 'Theo mã lớp có sẵn', value: 'code' },
  { label: 'Chọn từng học viên', value: 'users' },
];

const buttonStyle = { width: 'auto', height: 44 } as const;

const CreateClassModal: React.FC<CreateClassModalProps> = ({
  open,
  onClose,
}) => {
  const [code, setCode] = useState('');
  const [taskId, setTaskId] = useState<string | undefined>();
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [mode, setMode] = useState<LearnerMode>('code');
  const [classCode, setClassCode] = useState<string | undefined>();
  const [picked, setPicked] = useState<PickedUser[]>([]);
  const [search, setSearch] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { data: tasks = [] } = adminQuery.useGetPracticeTasksAdminQuery(
    undefined,
    { skip: !open },
  );
  const { data: codes = [] } = adminQuery.useGetClassCodeOptionsQuery(
    undefined,
    { skip: !open },
  );
  const { data: users = [], isFetching: isSearching } =
    adminQuery.useSearchSelectableUsersQuery(search, {
      skip: !open || mode !== 'users',
    });
  const [create, { isLoading }] =
    adminQuery.useCreateClassWithAssignmentMutation();

  useEffect(() => () => clearTimeout(timer.current), []);

  // Chỉ đề đã gắn vào khóa học mới giao được (lớp thuộc khóa của đề).
  const taskOptions = tasks
    .filter(t => !!t.lessonId)
    .map(t => ({ value: t._id, label: `[${t.subject}] ${t.title}` }));

  const reset = () => {
    setCode('');
    setTaskId(undefined);
    setDueDate(null);
    setMode('code');
    setClassCode(undefined);
    setPicked([]);
    setSearch('');
    setErrors({});
  };

  const close = () => {
    reset();
    onClose();
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!code.trim()) e.code = 'Vui lòng nhập mã lớp.';
    if (!taskId) e.task = 'Vui lòng chọn bài thực hành.';
    if (!dueDate) e.dueDate = 'Vui lòng chọn hạn nộp.';
    else if (dueDate.isBefore(dayjs())) e.dueDate = 'Hạn nộp phải ở tương lai.';
    if (mode === 'code' ? !classCode : !picked.length) {
      e.learners =
        mode === 'code'
          ? 'Vui lòng chọn mã lớp có sẵn.'
          : 'Vui lòng chọn ít nhất 1 học viên.';
    }
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length || !taskId || !dueDate) return;
    try {
      const r = await create({
        class: code.trim(),
        taskId,
        dueDate: dueDate.toISOString(),
        ...(mode === 'code'
          ? { classCode }
          : { userIds: picked.map(p => p.value) }),
      }).unwrap();
      messageApi.success(`Đã tạo lớp với ${r.memberCount} học viên`);
      close();
    } catch (err: unknown) {
      messageApi.error(
        (err as { data?: { message?: string } })?.data?.message ||
          'Tạo lớp thất bại',
      );
    }
  };

  const fieldError = (key: keyof Errors) =>
    errors[key] ? <Text style={styles.error}>{errors[key]}</Text> : null;

  const revalidate = (key: keyof Errors) =>
    setErrors(prev => ({ ...prev, [key]: validate()[key] }));

  return (
    <Modal
      open={open}
      onCancel={close}
      footer={null}
      closable={false}
      width={720}
      destroyOnHidden
      styles={{ body: { padding: 0 }, content: { padding: 0 } }}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Tạo lớp thực hành</Text>
            <Text style={styles.subline}>
              Tạo lớp và giao bài kèm hạn nộp trong một bước.
            </Text>
          </View>
          <button
            type="button"
            aria-label="Đóng"
            onClick={close}
            style={styles.closeButton as React.CSSProperties}>
            Đóng
          </button>
        </View>
        <View style={styles.body}>
          <View style={styles.field}>
            <Text style={styles.label}>
              {'Mã lớp '}
              <Text style={styles.required}>*</Text>
            </Text>
            <Input
              size="large"
              aria-label="Mã lớp"
              placeholder="VD: MOS-K22-01"
              status={errors.code ? 'error' : undefined}
              value={code}
              onChange={e => setCode(e.target.value)}
              onBlur={() => revalidate('code')}
            />
            {fieldError('code')}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              {'Bài thực hành '}
              <Text style={styles.required}>*</Text>
            </Text>
            <Select
              showSearch
              size="large"
              aria-label="Bài thực hành"
              placeholder="Chọn bài thực hành"
              status={errors.task ? 'error' : undefined}
              options={taskOptions}
              optionFilterProp="label"
              value={taskId}
              onChange={v => {
                setTaskId(v);
                setErrors(prev => ({ ...prev, task: undefined }));
              }}
              onBlur={() => revalidate('task')}
            />
            <Text style={styles.hint}>
              Chỉ hiện các đề đã gắn vào một khóa học.
            </Text>
            {fieldError('task')}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              {'Hạn nộp '}
              <Text style={styles.required}>*</Text>
            </Text>
            <DatePicker
              showTime={{ format: 'HH:mm' }}
              format="DD/MM/YYYY HH:mm"
              size="large"
              aria-label="Hạn nộp"
              style={{ width: '100%' }}
              placeholder="Chọn ngày giờ"
              status={errors.dueDate ? 'error' : undefined}
              disabledDate={d => d.isBefore(dayjs().startOf('day'))}
              value={dueDate}
              onChange={v => {
                setDueDate(v);
                setErrors(prev => ({ ...prev, dueDate: undefined }));
              }}
              onOpenChange={o => !o && revalidate('dueDate')}
            />
            {fieldError('dueDate')}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              {'Học viên '}
              <Text style={styles.required}>*</Text>
            </Text>
            <Segmented
              block
              options={MODE_OPTIONS}
              value={mode}
              onChange={v => {
                setMode(v as LearnerMode);
                setErrors(prev => ({ ...prev, learners: undefined }));
              }}
            />
            {mode === 'code' ? (
              <Select
                showSearch
                size="large"
                aria-label="Mã lớp có sẵn"
                placeholder="Chọn mã lớp có sẵn"
                status={errors.learners ? 'error' : undefined}
                options={codes.map(c => ({ value: c.name, label: c.name }))}
                value={classCode}
                onChange={setClassCode}
              />
            ) : (
              <Select
                mode="multiple"
                labelInValue
                showSearch
                filterOption={false}
                size="large"
                aria-label="Chọn học viên"
                placeholder="Tìm theo tên, email hoặc MSSV"
                status={errors.learners ? 'error' : undefined}
                loading={isSearching}
                value={picked}
                onChange={v => setPicked(v as PickedUser[])}
                onSearch={v => {
                  clearTimeout(timer.current);
                  timer.current = setTimeout(() => setSearch(v), 300);
                }}
                options={users.map(u => ({
                  value: u._id,
                  label: `${u.fullName || u.email}${u.studentId ? ` · ${u.studentId}` : ''}`,
                }))}
              />
            )}
            {fieldError('learners')}
          </View>

          <View style={styles.footer}>
            <AppButton style={buttonStyle} disabled={isLoading} onClick={close}>
              Hủy
            </AppButton>
            <AppButton
              type="primary"
              style={buttonStyle}
              loading={isLoading}
              disabled={isLoading}
              onClick={handleSubmit}>
              Tạo lớp
            </AppButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CreateClassModal;
