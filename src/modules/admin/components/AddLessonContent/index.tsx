/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';
import React, { useEffect, useState } from 'react';
import styles from './styles';
import { ScrollView, Text, View } from 'react-native-web';
import {
  Form,
  Input,
  Select,
  Button,
  Switch,
  Space,
  InputNumber,
  Row,
  Col,
} from 'antd';
import api from '@services/api';
import { adminQuery } from '@/modules/admin/redux';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { CreateLessonFrom } from './type';
import { DragModuleItem, ModalSelectModule } from './_components';
import { messageApi } from '@hooks';
import { AppUploadImageCrop, DraggableList } from '@components';
import { Lesson } from '~mdDashboard/redux/saga/type';
import { getYouTubeThumbnail } from '@utils/youtube';
import { bcs } from '@mysten/sui/bcs';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { useAppDispatch } from '@redux';
import { adminAction } from '@/modules/admin/redux';

type CreateLessonFormProps = {
  initialValues?: Lesson;
  onFormFinish?: (data: any) => void;
  onDone?: (data: Lesson) => void;
};
const CreateLessonForm: React.FC<CreateLessonFormProps> = ({
  initialValues,
  onFormFinish,
  onDone,
}) => {
  const [form] = Form.useForm();
  const [addLesson] = adminQuery.useAddLessonMutation();
  const [isPremium, setIsPremium] = useState(initialValues?.isPremium);
  const dispatch = useAppDispatch();
  const [listSelected, setListSelected] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleModalSelect, setIsVisibleModalSelect] = useState(false);
  const { mutateAsync } = useSignAndExecuteTransaction();
  const client = useSuiClient();

  async function waitForTx(client, digest) {
    for (let i = 0; i < 10; i++) {
      try {
        return await client.getTransactionBlock({
          digest,
          options: { showEffects: true },
        });
      } catch {
        await new Promise(r => setTimeout(r, 500));
      }
    }
    throw new Error('Tx not found');
  }
  const handleSubmit = async lessonData => {
    // ===== create DataObject on-chain =====
    const tx = new Transaction();
    const mist = BigInt(Math.floor(Number(lessonData.price) * 1e9));

    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::transaction::create_data`,
      arguments: [
        tx.pure(
          bcs
            .vector(bcs.u8())
            .serialize(new TextEncoder().encode(lessonData.title)),
        ),
        tx.pure.u64(mist),
      ],
    });

    // ký & gửi tx
    const data = await mutateAsync({ transaction: tx });
    const res = await waitForTx(client, data.digest);
    const createdObjectId = res.effects?.created?.[0]?.reference?.objectId;
    dispatch(adminAction.setObjectId(createdObjectId));
  };
  const onFinish = (values: CreateLessonFrom) => {
    const lessonData = {
      ...values,
      modules: listSelected.map(item => item._id),
      durations: listSelected.reduce(
        (cur, prev) => cur + (prev.durations || 0),
        0,
      ),
    };
    handleSubmit(lessonData);
    onFormFinish
      ? onFormFinish(lessonData)
      : addLesson(lessonData)
          .unwrap()
          .then(res => {
            messageApi.success('Add new lesson successfully!');
            form.resetFields();
            onDone && onDone(res);
            setListSelected([]);
            setIsLoading(false);
          })
          .catch(() => {
            messageApi.error('Add new lesson failed!');
          });
  };
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        categories: initialValues.categories.map(item => item._id),
        thumbnail: initialValues.thumbnail.includes('youtube.com/watch')
          ? getYouTubeThumbnail(initialValues.thumbnail)
          : initialValues.thumbnail,
      });
      setListSelected(initialValues.modules);
    }
  }, [initialValues]);

  const onChange = (checked: boolean) => {
    setIsPremium(checked);
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Form
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ categories: [] }}>
          <ScrollView style={{ flex: 1, scrollbarWidth: 'none' }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 4 }}>
                <Form.Item
                  style={styles.formItemTitle}
                  label="Lesson Name"
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the lesson name!',
                    },
                  ]}>
                  <Input placeholder="Enter lesson name" />
                </Form.Item>

                <Form.Item
                  style={styles.formItemTitle}
                  label="Description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the description!',
                    },
                  ]}>
                  <Input.TextArea
                    rows={4}
                    placeholder="Enter lesson description"
                  />
                </Form.Item>

                <Row align="middle" gutter={16}>
                  {/* Switch */}
                  <Col>
                    <Form.Item label="Premium Lesson" name="isPremium">
                      <Switch onChange={onChange} />
                    </Form.Item>
                  </Col>

                  {/* Input price chỉ hiển thị khi bật switch */}
                  {isPremium && (
                    <Col>
                      <Form.Item
                        name="price"
                        label="Price Lesson"
                        validateTrigger="onBlur"
                        rules={[
                          {
                            required: true,
                            message: 'Price is required!',
                          },
                          {
                            validator: (_, value) =>
                              value && value > 10
                                ? Promise.reject(
                                    new Error('Maximum price is 10 ETH!'),
                                  )
                                : Promise.resolve(),
                          },
                        ]}>
                        <InputNumber
                          addonAfter="SUI"
                          value={initialValues?.price || 0}
                          placeholder="Enter price"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                  )}
                </Row>

                <Form.Item
                  style={styles.formItemTitle}
                  label="Skill learned"
                  name="learnedSkills">
                  <Form.List name="learnedSkills">
                    {(fields, { add, remove }) => (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                        }}>
                        {fields.map(({ key, name, ...restField }) => {
                          return (
                            <Form.Item
                              key={key}
                              {...restField}
                              name={name}
                              rules={[
                                {
                                  required: true,
                                  message: 'skill is required',
                                },
                              ]}>
                              <SkillItem remove={remove} />
                            </Form.Item>
                          );
                        })}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}>
                            Add Row
                          </Button>
                        </Form.Item>
                      </div>
                    )}
                  </Form.List>
                </Form.Item>
              </View>
              <View style={{ flex: 1.5 }}>
                <Form.Item
                  style={styles.formItemTitle}
                  label="Thumbnail"
                  name="thumbnail">
                  <AppUploadImageCrop
                    containerStyle={styles.uploadCrop}
                    onChange={async data => {
                      const blob = await fetch(data).then(res => res.blob());
                      const formData = new FormData();
                      const timestamp = new Date().getTime();
                      formData.append(
                        'file',
                        new File([blob], `cropped-image-${timestamp}.jpg`, {
                          type: 'image/jpeg',
                        }),
                      );
                      const res = await api.post('/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                      });
                      form.setFieldsValue({ thumbnail: res.data.data });
                    }}
                  />
                </Form.Item>
              </View>
            </View>

            <h4>Select module</h4>

            <Button onClick={() => setIsVisibleModalSelect(true)}>
              <Text>Add Module</Text>
            </Button>
            <DraggableList
              data={listSelected}
              keyExtractor={item => item?._id}
              handleUpdatedList={setListSelected}
              style={styles.draggableList}
              renderItem={({ item }) => (
                <DragModuleItem
                  data={item}
                  onDelete={() => {
                    const newList = [...listSelected].filter(
                      sItem => sItem._id !== item._id,
                    );
                    setListSelected(newList);
                  }}
                />
              )}
            />
          </ScrollView>
          <Button
            loading={isLoading}
            onClick={() => {
              setIsLoading(true);
            }}
            style={styles.btn}
            type="primary"
            htmlType="submit">
            Done
          </Button>
        </Form>
      </View>
      <ModalSelectModule
        isVisible={isVisibleModalSelect}
        setIsVisible={setIsVisibleModalSelect}
        listSelected={listSelected}
        onFinish={setListSelected}
      />
    </View>
  );
};

export default CreateLessonForm;

const SkillItem = ({ value, onChange, remove }: any) => {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Input.TextArea
        placeholder="Skill learned"
        value={value}
        onChange={onChange}
      />
      <MinusCircleOutlined onClick={() => remove(name)} />
    </div>
  );
};
