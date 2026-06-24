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
import { convertDurationToTime } from '@utils/time';

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

  const [listSelected, setListSelected] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleModalSelect, setIsVisibleModalSelect] = useState(false);

  const { totalLibraries, totalDuration } = listSelected.reduce(
    (acc, item) => {
      const libArray = Array.isArray(item.libraries) ? item.libraries : [];
      acc.totalLibraries += libArray.length;

      const durationSumInLibraries = libArray.reduce((sum, lib) => {
        return sum + (Number(lib.duration) || 0);
      }, 0);

      acc.totalDuration += durationSumInLibraries;

      return acc;
    },
    { totalLibraries: 0, totalDuration: 0 },
  );

  const onFinish = (values: CreateLessonFrom) => {
    const lessonData = {
      ...values,
      modules: listSelected.map(item => item._id),
    };
    if (onFormFinish) {
      onFormFinish(lessonData);
      setIsLoading(false);
    } else {
      addLesson(lessonData)
        .unwrap()
        .then(res => {
          messageApi.success('Add new lesson successfully!');
          form.resetFields();
          setListSelected([]);
          if (onDone) onDone(res);
        })
        .catch(() => {
          messageApi.error('Add new lesson failed!');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        categories: initialValues.categories?.map(item => item._id),
        thumbnail: initialValues.thumbnail.includes('youtube.com/watch')
          ? getYouTubeThumbnail(initialValues.thumbnail)
          : initialValues.thumbnail,
      });
      setListSelected(initialValues.modules);
    }
  }, [initialValues]);

  useEffect(() => {
    if (totalDuration || totalLibraries) {
      form.setFieldsValue({
        ...initialValues,
        totalLibraries: totalLibraries,
        totalDuration: totalDuration,
      });
    }
  }, [totalLibraries, totalDuration]);

  return (
    <View style={styles.container}>
      <View style={styles.flex1}>
        <Form<CreateLessonFrom>
          style={styles.containerColumn}
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ categories: [] }}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.rowLayout}>
              <View style={styles.flex4}>
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

                <Row align="middle" style={{ marginBottom: 16 }}>
                  {/* Switch */}
                  {/* <Form.Item label="Premium Lesson" name="isPremium">
                      <Switch onChange={onChange} />
                    </Form.Item> */}
                  <Form.Item
                    label="Total Libraries"
                    name="totalLibraries"
                    style={{ marginBottom: 0 }}>
                    <span className="ant-form-text">{totalLibraries}</span>
                  </Form.Item>

                  <Form.Item
                    label="Total Duration"
                    name="totalDuration"
                    style={{ marginBottom: 0 }}>
                    <span className="ant-form-text">
                      {convertDurationToTime(totalDuration)}
                    </span>
                  </Form.Item>

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
                          min={0.0001}
                          step={0.0001}
                          value={initialValues?.price || 0}
                          placeholder="Enter price"
                          style={styles.fullWidth}
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
                      <div style={styles.columnContainer}>
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
              <View style={styles.flex1_5}>
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

            <h4 style={{ marginBottom: 16 }}>Select module</h4>

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
    <div style={styles.buttonGap}>
      <Input.TextArea
        placeholder="Skill learned"
        value={value}
        onChange={onChange}
      />
      <MinusCircleOutlined onClick={() => remove(name)} />
    </div>
  );
};
