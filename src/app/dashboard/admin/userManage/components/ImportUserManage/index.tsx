'use client';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Input,
  message,
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
  ImportUserPreviewRequest,
  SendImportEmailsRequest,
  SendImportEmailsResponse,
} from '~mdAdmin/redux/RTKQuery/type';
import './styles.scss';
import api from '@services/api';

const { Text } = Typography;

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
  rows.slice(0, 50).map((item, index) => ({
    key: `${index}`,
    ...item,
    error: validateRow(item),
    status: 'pending' as const,
  }));

const ImportUserManage = () => {
  const [fileUrl, setFileUrl] = useState('');
  const [previewRows, setPreviewRows] = useState<PreviewUserRow[]>([]);
  const [importResult, setImportResult] = useState<ImportUsersResponse | null>(
    null,
  );
  const [sendResult, setSendResult] = useState<SendImportEmailsResponse | null>(
    null,
  );
  const [messageApi, contextHolder] = message.useMessage();

  const [previewImport, { isLoading: previewLoading }] =
    adminQuery.usePreviewImportUsersMutation();
  const [importUsers, { isLoading: importLoading }] =
    adminQuery.useImportUsersBulkMutation();
  const [sendEmails, { isLoading: sendLoading }] =
    adminQuery.useSendImportEmailsMutation();

  const hasPreviewData = previewRows.length > 0;
  const hasImportableRows = previewRows.some(row => !row.error);
  const createdAccounts = importResult?.accounts ?? [];

  const handlePreview = async () => {
    if (!fileUrl.trim()) {
      messageApi.error('Nhập URL file Excel');
      return;
    }

    try {
      const payload: ImportUserPreviewRequest = { fileUrl: fileUrl.trim() };
      const response = await previewImport(payload).unwrap();
      const rows = mapPreviewResponse(response);
      setPreviewRows(rows);
      setImportResult(null);
      setSendResult(null);
      messageApi.success(
        `Successfully read ${rows.length} students from Excel file`,
      );
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
              error: validateRow({
                ...row,
                [field]: value,
              }),
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

    try {
      const body: ImportUsersRequest = {
        users: validatedRows.map(({ key, error, status, ...item }) => item),
      };
      const response = await importUsers(body).unwrap();

      const updatedRows = validatedRows.map(row => {
        const failedItem = response.failed.find(
          item => item.email === row.email || item.studentId === row.studentId,
        );
        const successItem = response.successful.find(
          item => item.email === row.email,
        );

        if (failedItem) {
          return {
            ...row,
            status: 'failed',
            error: failedItem.error,
          };
        }

        if (successItem) {
          return {
            ...row,
            status: 'created',
            error: undefined,
          };
        }

        return row;
      });

      // setPreviewRows(updatedRows);
      setImportResult(response);
      setSendResult(null);
      messageApi.success(
        `Imported ${response.successful.length}/${validatedRows.length} users successfully`,
      );
    } catch (error: any) {
      messageApi.error(error?.data?.message || 'Import users thất bại');
    }
  };

  const handleSendEmails = async () => {
    if (!createdAccounts.length) {
      messageApi.error('Không có account để gửi email');
      return;
    }

    try {
      const payload: SendImportEmailsRequest = {
        accounts: createdAccounts,
      };
      const response = await sendEmails(payload).unwrap();
      setSendResult(response);
      messageApi.success(
        `Sent ${response.successful}/${response.successful + response.failed} emails successfully`,
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
            className={record.error ? 'import-user__input--error' : ''}
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
            className={record.error ? 'import-user__input--error' : ''}
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
            className={record.error ? 'import-user__input--error' : ''}
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
      {
        title: 'Trạng thái',
        key: 'status',
        render: (_, record) => {
          if (record.status === 'created') {
            return <Text type="success">Đã tạo</Text>;
          }
          if (record.status === 'failed') {
            return <Text type="danger">Lỗi</Text>;
          }
          return <Text>Chưa tạo</Text>;
        },
      },
      {
        title: 'Lỗi',
        key: 'error',
        render: (_, record) => record.error || '-',
      },
    ],
    [],
  );

  const invalidCount = previewRows.filter(row => !!row.error).length;

  return (
    <div className="import-user-manage">
      {contextHolder}
      <div className="import-user-manage__header">
        <div className="import-user-manage__field">
          <Text strong>URL file Excel</Text>
          <Upload
            maxCount={1}
            listType="picture-card"
            action={api.defaults.baseURL + '/upload'}
            onChange={info => {
              if (info.file.status === 'done') {
                const responseUrl = info.file.response?.data;
                if (responseUrl) {
                  setFileUrl(responseUrl);
                }
              }
            }}>
            <Button type="text">Upload</Button>
          </Upload>
        </div>
        <Button type="primary" loading={previewLoading} onClick={handlePreview}>
          Xem trước Excel
        </Button>
      </div>

      {hasPreviewData && (
        <div className="import-user-manage__summary">
          <Space wrap>
            <Text>{`Dữ liệu preview: ${previewRows.length} dòng`}</Text>
            <Text type="danger">
              {invalidCount > 0 ? `${invalidCount} dòng lỗi` : ''}
            </Text>
          </Space>
        </div>
      )}

      <div className="import-user-manage__actions">
        <Space wrap>
          <Button
            type="primary"
            disabled={!hasPreviewData}
            loading={importLoading}
            onClick={handleImport}>
            Tạo tài khoản
          </Button>
          <Button
            type="default"
            disabled={!createdAccounts.length}
            loading={sendLoading}
            onClick={handleSendEmails}>
            Gửi email toàn bộ tài khoản đã tạo
          </Button>
        </Space>
      </div>

      {importResult && (
        <Alert
          className="import-user-manage__alert"
          type={importResult.failed.length ? 'warning' : 'success'}
          message={`Tạo tài khoản ${importResult.successful.length}/${previewRows.length} users`}
          description={`Thành công: ${importResult.successful.length}. Thất bại: ${importResult.failed.length}.`}
          showIcon
        />
      )}

      {sendResult && (
        <Alert
          className="import-user-manage__alert"
          type={sendResult.failed ? 'warning' : 'success'}
          message={`Sent ${sendResult.successful}/${sendResult.successful + sendResult.failed} emails`}
          description={
            sendResult.failed
              ? `Failed ${sendResult.failed} email(s).`
              : 'Gửi email thành công.'
          }
          showIcon
        />
      )}

      <Table
        className="import-user-manage__table"
        dataSource={previewRows}
        columns={columns}
        rowClassName={record =>
          record.error ? 'import-user-manage__row-error' : ''
        }
        pagination={false}
        scroll={{ x: 1200 }}
      />

      {importResult?.accounts.length ? (
        <div className="import-user-manage__result-card">
          <Text strong>Danh sách tài khoản đã tạo</Text>
          <Table
            className="import-user-manage__table"
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

export default ImportUserManage;
