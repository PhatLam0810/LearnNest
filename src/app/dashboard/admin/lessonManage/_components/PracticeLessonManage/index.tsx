'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text } from 'react-native-web';
import {
  Button,
  Drawer,
  Form,
  Input,
  Modal,
  Space,
  Table,
  TableProps,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAppPagination, messageApi } from '@hooks';
import { Lesson, Module } from '~mdDashboard/redux/saga/type';
import { adminQuery } from '~mdAdmin/redux';
import { AddModuleContent } from '~mdAdmin/components';
import { UpdateModuleForm } from '@/app/dashboard/module/_components';
import styles from '../ModuleManage/styles';

// Quản lý các Lesson type='practice' — "phần thực hành" gom bài tập theo kỹ
// năng, KHÔNG có video, cố tình ẩn khỏi tab "Khóa học"/"Phần học" (2 tab đó
// chỉ liệt kê type='theory' — xem getAllLesson/getAllModule) để không lẫn
// vào danh sách khóa học thật. Đây là màn hình riêng để tạo/sửa/xoá các
// phần thực hành đó.
const PracticeLessonManage = () => {
  const { listItem, currentData, fetchData, refresh, search } =
    useAppPagination<Lesson>({
      apiUrl: 'lesson/getAllLesson',
      params: { filter: { type: 'practice' } },
    });

  const { data: allTasks } = adminQuery.useGetPracticeTasksAdminQuery();
  const taskCountByModule = useMemo(() => {
    const map: Record<string, number> = {};
    (allTasks || []).forEach(t => {
      if (!t.moduleId) return;
      map[t.moduleId] = (map[t.moduleId] || 0) + 1;
    });
    return map;
  }, [allTasks]);

  const [addLesson] = adminQuery.useAddLessonMutation();
  const [updateLesson] = adminQuery.useUpdateLessonMutation();
  const [deleteLesson] = adminQuery.useDeleteLessonMutation();
  const [addModuleMutation] = adminQuery.useAddModuleMutation();
  const [deleteModule] = adminQuery.useDeleteModuleMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [isCreating, setIsCreating] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Lesson | null>(null);

  // Lesson đang mở trong Drawer quản lý nội dung — đồng bộ lại theo listItem
  // mỗi khi refresh() xong (đổi tên/thêm-xoá phần), để Drawer luôn hiện đúng
  // dữ liệu mới nhất thay vì bản chụp lúc mở.
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const selectedLesson = listItem.find(l => l._id === selectedLessonId) || null;
  const [editForm] = Form.useForm();
  useEffect(() => {
    if (selectedLesson) {
      editForm.setFieldsValue(selectedLesson);
    }
  }, [selectedLesson?._id, selectedLesson?.title, selectedLesson?.description]);

  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [editModuleTarget, setEditModuleTarget] = useState<Module | null>(null);
  const [deleteModuleTarget, setDeleteModuleTarget] = useState<Module | null>(
    null,
  );

  const columns: TableProps<Lesson>['columns'] = [
    { title: 'Tên phần thực hành', dataIndex: 'title', key: 'title' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    {
      title: 'Số phần',
      key: 'modulesCount',
      render: (_, record) => (
        <p style={{ margin: 0 }}>{record.modules.length}</p>
      ),
    },
    {
      title: 'Tổng bài tập',
      key: 'totalLibraries',
      render: (_, record) => (
        <p style={{ margin: 0 }}>{record.totalLibraries}</p>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle" onClick={e => e.stopPropagation()}>
          <button style={styles.button} onClick={() => setDeleteTarget(record)}>
            <a style={styles.buttonText}>Xóa</a>
          </button>
          <button
            style={styles.button}
            onClick={() => setSelectedLessonId(record._id)}>
            <a style={styles.buttonText}>Quản lý nội dung</a>
          </button>
        </Space>
      ),
    },
  ];

  const handleCreate = async (values: {
    title: string;
    description?: string;
  }) => {
    setIsCreating(true);
    try {
      await addLesson({
        title: values.title,
        description: values.description,
        learnedSkills: [],
        categories: [],
        modules: [],
        totalLibraries: 0,
        type: 'practice',
      }).unwrap();
      messageApi.success('Đã tạo phần thực hành mới');
      createForm.resetFields();
      setIsCreateOpen(false);
      refresh();
    } catch {
      messageApi.error('Tạo phần thực hành thất bại');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSaveLessonInfo = async (values: {
    title: string;
    description?: string;
  }) => {
    if (!selectedLesson) return;
    try {
      await updateLesson({ _id: selectedLesson._id, ...values }).unwrap();
      messageApi.success('Đã lưu');
      refresh();
    } catch {
      messageApi.error('Lưu thất bại');
    }
  };

  const handleAddModuleDone = async (newModule: Module) => {
    if (!selectedLesson) return;
    try {
      await updateLesson({
        _id: selectedLesson._id,
        modules: [...selectedLesson.modules.map(m => m._id), newModule._id],
      }).unwrap();
      messageApi.success('Đã thêm phần');
      setIsAddModuleOpen(false);
      refresh();
    } catch {
      messageApi.error(
        'Thêm phần thất bại — phần học vẫn được tạo, hãy thử gắn lại',
      );
    }
  };

  const handleDeleteModule = async () => {
    if (!selectedLesson || !deleteModuleTarget) return;
    try {
      await updateLesson({
        _id: selectedLesson._id,
        modules: selectedLesson.modules
          .map(m => m._id)
          .filter(id => id !== deleteModuleTarget._id),
      }).unwrap();
      await deleteModule({ _id: deleteModuleTarget._id }).unwrap();
      messageApi.success('Đã xoá phần');
      setDeleteModuleTarget(null);
      refresh();
    } catch {
      messageApi.error('Xoá phần thất bại');
    }
  };

  const moduleColumns: TableProps<Module>['columns'] = [
    { title: 'Tên phần', dataIndex: 'title', key: 'title' },
    {
      title: 'Số bài tập',
      key: 'taskCount',
      render: (_, record) => (
        <p style={{ margin: 0 }}>{taskCountByModule[record._id] || 0}</p>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <button
            style={styles.button}
            onClick={() => setDeleteModuleTarget(record)}>
            <a style={styles.buttonText}>Xóa</a>
          </button>
          <button
            style={styles.button}
            onClick={() => setEditModuleTarget(record)}>
            <a style={styles.buttonText}>Sửa tên</a>
          </button>
        </Space>
      ),
    },
  ];

  const { Search } = Input;
  return (
    <View style={{ flex: 1, gap: 12 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Search
          placeholder="Tìm kiếm"
          onSearch={search}
          style={{ width: '50%' }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateOpen(true)}>
          Tạo phần thực hành mới
        </Button>
      </View>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={listItem}
        onChange={res => fetchData({ pageNum: res.current })}
        pagination={{
          current: currentData?.pageNum,
          pageSize: currentData?.pageSize,
          total: currentData?.totalRecords,
        }}
      />

      <Modal
        title="Tạo phần thực hành mới"
        open={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        footer={null}
        destroyOnClose>
        <Form form={createForm} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            label="Tên"
            name="title"
            rules={[{ required: true, message: 'Nhập tên phần thực hành' }]}>
            <Input placeholder="VD: Thực hành thêm: SmartArt Word & Excel" />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={isCreating}>
            Tạo
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Xóa phần thực hành"
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={async () => {
          if (!deleteTarget) return;
          await deleteLesson({ _id: deleteTarget._id }).unwrap();
          messageApi.success('Đã xoá');
          setDeleteTarget(null);
          refresh();
        }}>
        <Text>{`Xóa "${deleteTarget?.title}"? Các bài tập đang gắn vào đây sẽ KHÔNG bị xoá, chỉ mất gắn kết với khóa này.`}</Text>
      </Modal>

      <Drawer
        title={selectedLesson ? `Quản lý: ${selectedLesson.title}` : ''}
        open={!!selectedLesson}
        onClose={() => setSelectedLessonId(null)}
        width={560}
        destroyOnClose>
        {selectedLesson && (
          <View style={{ gap: 16 }}>
            <Form
              form={editForm}
              layout="vertical"
              onFinish={handleSaveLessonInfo}>
              <Form.Item
                label="Tên"
                name="title"
                rules={[{ required: true, message: 'Nhập tên' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Mô tả" name="description">
                <Input.TextArea rows={3} />
              </Form.Item>
              <Button htmlType="submit">Lưu thông tin</Button>
            </Form>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{ fontWeight: '600' }}>Các phần</Text>
              <Button
                icon={<PlusOutlined />}
                onClick={() => setIsAddModuleOpen(true)}>
                Thêm phần
              </Button>
            </View>
            <Table
              rowKey="_id"
              size="small"
              columns={moduleColumns}
              dataSource={selectedLesson.modules}
              pagination={false}
            />
          </View>
        )}
      </Drawer>

      {/* zIndex nâng lên trên Drawer (mặc định 1000, bằng z-index Drawer nên
          bị đè khuất — đã kiểm chứng: mở được, DOM có mặt, nhưng không thấy
          gì) — 3 overlay dưới đây đều có thể mở TRONG LÚC Drawer đang mở. */}
      <Modal
        title="Thêm phần mới"
        open={isAddModuleOpen}
        onCancel={() => setIsAddModuleOpen(false)}
        footer={null}
        width="70%"
        zIndex={1100}
        destroyOnClose>
        <AddModuleContent onDone={handleAddModuleDone} />
      </Modal>

      <UpdateModuleForm
        data={editModuleTarget}
        isVisible={!!editModuleTarget}
        setIsVisible={open => {
          if (!open) setEditModuleTarget(null);
        }}
        refresh={refresh}
        setSelectedItem={() => setEditModuleTarget(null)}
        setIsVisibleModalAdd={() => setEditModuleTarget(null)}
        zIndex={1100}
      />

      <Modal
        title="Xóa phần"
        open={!!deleteModuleTarget}
        onCancel={() => setDeleteModuleTarget(null)}
        onOk={handleDeleteModule}
        zIndex={1100}>
        <Text>{`Xóa phần "${deleteModuleTarget?.title}"? Các bài tập trong phần này sẽ mất gắn kết (không bị xoá).`}</Text>
      </Modal>
    </View>
  );
};

export default PracticeLessonManage;
