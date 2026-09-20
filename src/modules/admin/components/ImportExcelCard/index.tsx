'use client';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Input,
  Progress,
  Select,
  Space,
  Table,
  Typography,
  Upload,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { adminQuery } from '~mdAdmin/redux';
import {
  ImportUserItem,
  ImportUsersRequest,
  ImportUsersResponse,
  ClassItem,
  ImportUserPreviewRequest,
  SendImportEmailsRequest,
  SendImportEmailsResponse,
} from '~mdAdmin/redux/RTKQuery/type';
import api from '@services/api';
import { useAppSelector } from '@redux';
import AppButton from '@components/AppButton';
import ClassFormModal from '../ClassFormModal';
import './styles.scss';
import { messageApi } from '@hooks';

const { Text } = Typography;

// BE chỉ đọc tối đa 100 dòng mỗi lần preview (excel-parser.service.ts) - hiện
// rõ giới hạn này cho admin biết thay vì âm thầm cắt bớt. Tạo user chạy theo
// lô nhỏ nối tiếp: mỗi user bcrypt tuần tự nên lô lớn dễ nghẽn VPS 1 vCPU.
const MAX_IMPORT_ROWS = 100;
const IMPORT_BATCH_SIZE = 25;

type PreviewUserRow = ImportUserItem & {
  key: string;
  error?: string;
  status?: 'pending' | 'created' | 'failed';
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRow = (row: ImportUserItem) => {
  const errors: string[] = [];

  if (!row.fullName?.trim()) {
    errors.push('Họ và tên bắt buộc');
  }

  if (!row.studentId?.trim()) {
    errors.push('Mã sinh viên bắt buộc');
  }

  if (!row.email?.trim()) {
    errors.push('Email bắt buộc');
  } else if (!EMAIL_PATTERN.test(row.email.trim())) {
    errors.push('Email không hợp lệ');
  }

  return errors.join('; ');
};

const mapPreviewResponse = (rows: ImportUserItem[]) =>
  rows.slice(0, MAX_IMPORT_ROWS).map((item, index) => ({
    key: `${index}`,
    ...item,
    error: validateRow(item),
    status: 'pending' as const,
  }));

const ImportExcelCard: React.FC = () => {
  const accessToken = useAppSelector(
    state => state.authReducer.tokenInfo?.accessToken,
  );
  const [fileUrl, setFileUrl] = useState('');
  const [previewRows, setPreviewRows] = useState<PreviewUserRow[]>([]);
  const [importResult, setImportResult] = useState<ImportUsersResponse | null>(
    null,
  );
  const [sendResult, setSendResult] = useState<SendImportEmailsResponse | null>(
    null,
  );
  const contextHolder = null;
  const [classId, setClassId] = useState<string | undefined>();
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [progress, setProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);
  const { data: classData, refetch: refetchClasses } =
    adminQuery.useGetClassesQuery({ status: 'active', pageSize: 100 });
  const classOptions = classData?.items ?? [];

  const [previewImport, { isLoading: previewLoading }] =
    adminQuery.usePreviewImportUsersMutation();
  const [importUsers, { isLoading: importLoading }] =
    adminQuery.useImportUsersBulkMutation();
  const [sendEmails, { isLoading: sendLoading }] =
    adminQuery.useSendImportEmailsMutation();
  const hasPreviewData = previewRows.length > 0;
  const createdAccounts = importResult?.accounts ?? [];

  const handlePreview = async () => {
    if (!fileUrl.trim()) {
      messageApi.warning('Vui lòng tải file Excel lên trước khi nhập dữ liệu');
      return;
    }

    try {
      const payload: ImportUserPreviewRequest = { fileUrl: fileUrl.trim() };
      const response = await previewImport(payload).unwrap();
      const rows = mapPreviewResponse(response.users);
      setPreviewRows(rows);
      setImportResult(null);
      setSendResult(null);
      messageApi.success(`Đã đọc ${rows.length} dòng từ file Excel`);
    } catch (error: any) {
      messageApi.error(error?.data?.message || 'Không thể đọc file Excel');
    }
  };

  const handleFieldChange = (
    key: string,
    field: keyof ImportUserItem,
    value: string,
  ) => {
    setPreviewRows(prev =>
      prev.map(row =>
        row.key === key
          ? {
              ...row,
              [field]: value,
              error: validateRow({ ...row, [field]: value }),
            }
          : row,
      ),
    );
  };

  const handleImport = async () => {
    if (!hasPreviewData) {
      messageApi.error('Không có dữ liệu để import');
      return;
    }

    const validatedRows = previewRows.map(row => ({
      ...row,
      error: validateRow(row),
    }));
    setPreviewRows(validatedRows);

    const hasError = validatedRows.some(row => !!row.error);
    if (hasError) {
      messageApi.error('Vui lòng sửa các lỗi trước khi import');
      return;
    }

    const items = validatedRows.map(({ key, error, status, ...item }) => item);
    const acc: ImportUsersResponse = {
      statusCode: 201,
      message: '',
      successful: [],
      failed: [],
      accounts: [],
      existing: [],
      addedToClass: 0,
    };
    try {
      setProgress({ done: 0, total: items.length });
      for (let i = 0; i < items.length; i += IMPORT_BATCH_SIZE) {
        const batch = items.slice(i, i + IMPORT_BATCH_SIZE);
        const body: ImportUsersRequest = { users: batch, classId };
        const res = await importUsers(body).unwrap();
        // controller import trả HTTP 201 kèm statusCode trong body: >= 400 là
        // cả lô bị từ chối (vd lớp không hợp lệ) - dừng, không thử lô sau.
        if (res.statusCode >= 400) {
          throw { data: { message: res.message } };
        }
        acc.successful.push(...res.successful);
        acc.failed.push(...res.failed);
        acc.accounts.push(...res.accounts);
        acc.existing?.push(...(res.existing ?? []));
        acc.addedToClass = (acc.addedToClass ?? 0) + (res.addedToClass ?? 0);
        if (res.classError) acc.classError = res.classError;
        setProgress({
          done: Math.min(i + IMPORT_BATCH_SIZE, items.length),
          total: items.length,
        });
      }
      setImportResult(acc);
      setSendResult(null);
      messageApi.success(
        `Tạo tài khoản thành công ${acc.successful.length}/${validatedRows.length}`,
      );
      window.dispatchEvent(new Event('learnnest:user-created'));
    } catch (error: any) {
      // Đã tạo được vài lô thì vẫn hiện kết quả phần đã xong để không mất
      // danh sách tài khoản (mật khẩu) đã sinh.
      if (acc.successful.length) setImportResult(acc);
      messageApi.error(error?.data?.message || 'Import users thất bại');
    } finally {
      setProgress(null);
    }
  };

  const handleSendEmails = async () => {
    if (!createdAccounts.length) {
      messageApi.error('Không có account để gửi email');
      return;
    }

    try {
      const payload: SendImportEmailsRequest = { accounts: createdAccounts };
      const response = await sendEmails(payload).unwrap();
      setSendResult(response);
      messageApi.success(
        `Đã gửi ${response.successful}/${response.successful + response.failed} email thành công`,
      );
    } catch (error: any) {
      messageApi.error(error?.data?.message || 'Gửi email thất bại');
    }
  };

  const columns: ColumnsType<PreviewUserRow> = useMemo(
    () => [
      {
        title: 'Họ và tên',
        dataIndex: 'fullName',
        key: 'fullName',
        render: (value: string, record) => (
          <Input
            value={value}
            onChange={e =>
              handleFieldChange(record.key, 'fullName', e.target.value)
            }
            className={record.error ? 'import-excel-card__input--error' : ''}
          />
        ),
      },
      {
        title: 'Mã sinh viên',
        dataIndex: 'studentId',
        key: 'studentId',
        render: (value: string, record) => (
          <Input
            value={value}
            onChange={e =>
              handleFieldChange(record.key, 'studentId', e.target.value)
            }
            className={record.error ? 'import-excel-card__input--error' : ''}
          />
        ),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: (value: string, record) => (
          <Input
            value={value}
            onChange={e =>
              handleFieldChange(record.key, 'email', e.target.value)
            }
            className={record.error ? 'import-excel-card__input--error' : ''}
          />
        ),
      },
      {
        title: 'Lớp',
        dataIndex: 'class',
        key: 'class',
        render: (value: string, record) => (
          <Input
            value={value}
            onChange={e =>
              handleFieldChange(record.key, 'class', e.target.value)
            }
          />
        ),
      },
      {
        title: 'Khoa',
        dataIndex: 'faculty',
        key: 'faculty',
        render: (value: string, record) => (
          <Input
            value={value}
            onChange={e =>
              handleFieldChange(record.key, 'faculty', e.target.value)
            }
          />
        ),
      },
      {
        title: 'Ngành',
        dataIndex: 'major',
        key: 'major',
        render: (value: string, record) => (
          <Input
            value={value}
            onChange={e =>
              handleFieldChange(record.key, 'major', e.target.value)
            }
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const invalidCount = previewRows.filter(row => !!row.error).length;
  // Chọn lớp: gắn mã lớp vào cột Lớp của mọi dòng (User.class) và gửi classId
  // để BE thêm học viên vào lớp ngay khi tạo.
  const handleClassSelect = (value?: string) => {
    setClassId(value);
    const code = classOptions.find(c => c._id === value)?.code;
    if (code) {
      setPreviewRows(prev => prev.map(row => ({ ...row, class: code })));
    }
  };
  const handleClassCreated = (item: ClassItem) => {
    refetchClasses();
    handleClassSelect(item._id);
    setClassModalOpen(false);
  };

  return (
    <div className="import-excel-card">
      {contextHolder}
      <Text strong style={{ fontSize: 16, fontWeight: 500 }}>
        Tải lên file Excel
      </Text>
      <div className="import-excel-card__header">
        <div className="import-excel-card__field">
          <Text className="import-excel-card__hint">
            File Excel bắt buộc gồm các cột: <strong>Họ và tên</strong>,{' '}
            <strong>MSSV</strong>, <strong>Email</strong>. Có thể thêm các cột
            tùy chọn: Lớp, Khoa, Ngành. Tối đa {MAX_IMPORT_ROWS} dòng mỗi lần
            nhập; hệ thống tạo theo từng lô {IMPORT_BATCH_SIZE} người.{' '}
            <AppButton
              type="link"
              href="/templates/mau-nhap-nguoi-dung.xlsx"
              download
              style={{ width: 'auto', height: 'auto', padding: 0 }}>
              Tải file mẫu →
            </AppButton>
          </Text>
          <Upload
            maxCount={1}
            listType="picture-card"
            action={api.defaults.baseURL + '/upload'}
            headers={
              accessToken
                ? { Authorization: `Bearer ${accessToken}` }
                : undefined
            }
            onChange={info => {
              if (info.file.status === 'done') {
                const responseUrl = info.file.response?.data;
                if (responseUrl) {
                  setFileUrl(responseUrl);
                }
              }
            }}>
            <div>Tải lên</div>
          </Upload>
          <AppButton
            type="primary"
            style={{ width: 'auto' }}
            loading={previewLoading}
            onClick={handlePreview}
            className="import-excel-card__preview-btn">
            Nhập dữ liệu từ file Excel
          </AppButton>
        </div>
      </div>

      <div className="import-excel-card__summary">
        {hasPreviewData ? (
          <Space wrap>
            <Text>{`Dữ liệu preview: ${previewRows.length} dòng`}</Text>
            {invalidCount > 0 && (
              <Text type="danger">{`${invalidCount} dòng lỗi`}</Text>
            )}
            {previewRows.length >= MAX_IMPORT_ROWS && (
              <Text type="warning">
                Đã đạt giới hạn {MAX_IMPORT_ROWS} dòng - file có thêm dòng sẽ
                không được đọc.
              </Text>
            )}
          </Space>
        ) : (
          'Chưa nhập dữ liệu'
        )}
      </div>

      <div className="import-excel-card__actions">
        <Select
          allowClear
          showSearch
          optionFilterProp="label"
          placeholder="Thêm vào lớp (tùy chọn)"
          style={{ minWidth: 260 }}
          value={classId}
          onChange={handleClassSelect}
          options={classOptions.map(c => ({
            value: c._id,
            label: `${c.code} - ${c.name}`,
          }))}
        />
        <AppButton
          style={{ width: 'auto' }}
          onClick={() => setClassModalOpen(true)}>
          Tạo lớp mới
        </AppButton>
        <AppButton
          type="primary"
          style={{ width: 'auto' }}
          disabled={!hasPreviewData}
          loading={importLoading}
          onClick={handleImport}>
          Tạo tài khoản
        </AppButton>
        <AppButton
          disabled={!createdAccounts.length}
          loading={sendLoading}
          onClick={handleSendEmails}
          style={
            createdAccounts.length
              ? { width: 'auto' }
              : {
                  width: 'auto',
                  background: '#f1f3f7',
                  color: '#9ca3af',
                  cursor: 'not-allowed',
                }
          }>
          Gửi email toàn bộ tài khoản đã tạo
        </AppButton>
      </div>

      {progress && (
        <Progress
          percent={Math.round((progress.done / progress.total) * 100)}
          format={() => `Đã tạo ${progress.done}/${progress.total}`}
        />
      )}

      {importResult && (
        <Alert
          className="import-excel-card__alert"
          type={importResult.failed.length ? 'warning' : 'success'}
          message={`Tạo tài khoản ${importResult.successful.length}/${previewRows.length} users`}
          description={`Thành công: ${importResult.successful.length}. Đã có tài khoản (thêm vào lớp): ${importResult.existing?.length ?? 0}. Thất bại: ${importResult.failed.length}.${importResult.addedToClass ? ` Đã thêm ${importResult.addedToClass} người vào lớp.` : ''}${importResult.classError ? ` Lưu ý: ${importResult.classError}` : ''}`}
          showIcon
        />
      )}

      <ClassFormModal
        open={classModalOpen}
        onClose={() => setClassModalOpen(false)}
        onSaved={handleClassCreated}
      />

      {sendResult && (
        <Alert
          className="import-excel-card__alert"
          type={sendResult.failed ? 'warning' : 'success'}
          message={`Đã gửi ${sendResult.successful}/${sendResult.successful + sendResult.failed} email`}
          description={
            sendResult.failed
              ? `Thất bại ${sendResult.failed} email.`
              : 'Gửi email thành công.'
          }
          showIcon
        />
      )}

      {hasPreviewData && (
        <Table
          className="import-excel-card__table"
          dataSource={previewRows}
          columns={columns}
          rowClassName={record =>
            record.error ? 'import-excel-card__row-error' : ''
          }
          pagination={false}
          scroll={{ x: 1200, y: 460 }}
        />
      )}

      {importResult?.accounts.length ? (
        <div className="import-excel-card__result-card">
          <Text strong>Danh sách tài khoản đã tạo</Text>
          <Table
            className="import-excel-card__table"
            dataSource={importResult.accounts.map((account, index) => ({
              key: `${index}`,
              ...account,
            }))}
            columns={[
              { title: 'Email', dataIndex: 'email', key: 'email' },
              { title: 'Họ và tên', dataIndex: 'fullName', key: 'fullName' },
              { title: 'Username', dataIndex: 'username', key: 'username' },
              { title: 'Password', dataIndex: 'password', key: 'password' },
            ]}
            pagination={false}
            rowKey="key"
          />
        </div>
      ) : null}
    </div>
  );
};

export default ImportExcelCard;
