/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  TimePickerProps,
  Upload,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { adminQuery } from '../../redux';
import { messageApi, useAppPagination } from '@hooks';
import api from '@services/api';
import { Library } from '~mdDashboard/types';
import { ScrollView, View } from 'react-native-web';
import { AppRichTextInput } from '@components';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getVideoDuration, getYouTubeVideoDuration } from './functions';
import debounce from 'lodash-es/debounce';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import { dashboardQuery } from '~mdDashboard/redux';
import './styles.scss';

type AddLibraryContentProps = {
  onFinish?: (values: any) => void;
  onDone?: (data: Library) => void;
  initialValues?: any;
};
const AddLibraryContent: React.FC<AddLibraryContentProps> = ({
  onFinish,
  onDone,
  initialValues,
}) => {
  const [form] = Form.useForm();

  const [addLibrary] = adminQuery.useAddLibraryMutation();
  const [generateQuestion] = dashboardQuery.useGenerateQuestionMutation();
  const [libraryType, setLibraryType] = useState('');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [duration, setDuration] = useState<number>(0);
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState('');
  const [fileUpload, setFileUpload] = useState<any[]>([]);
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setLibraryType(initialValues.type);
      setDuration(initialValues.duration);
      setFileUpload([
        {
          uid: '-1',
          name: 'video.mp4',
          status: 'done',
          url: initialValues.url,
        },
      ]);
    }
  }, [initialValues]);

  const debouncedOnChange = useCallback(
    debounce((value: string) => {
      setLink(value);
      getYouTubeVideoDuration(value).then(res => {
        form.setFieldsValue({ duration: res });
        setDuration(res);
      });

      form.setFieldsValue({ url: value });
    }, 500),
    [],
  );

  const renderInputContent = () => {
    switch (libraryType.toLocaleLowerCase()) {
      case 'text': {
        return (
          <Form.Item
            name="url"
            label="File "
            required
            rules={[
              {
                required: true,
                message: 'Please upload a file ',
              },
            ]}>
            <>
              <Upload
                maxCount={1}
                fileList={fileUpload}
                listType="picture-card"
                action={api.defaults.baseURL + '/upload'}
                onRemove={() => setFileUpload([])}
                onChange={info => {
                  if (info.file.status === 'uploading') {
                    setFileUpload([
                      {
                        uid: info.file.uid,
                        name: info.file.name,
                        status: info.file.status,
                        url: info.file.response?.data,
                      },
                    ]);
                  }
                  if (info.file.status === 'done') {
                    setFileUpload([
                      {
                        uid: info.file.uid,
                        name: info.file.name,
                        status: info.file.status,
                        url: info.file.response?.data,
                      },
                    ]);
                    const responseUrl = info.file.response?.data;
                    if (responseUrl) {
                      setLink(responseUrl);
                      form.setFieldsValue({ url: responseUrl });
                    }
                  }
                }}>
                <Button type="text">Upload</Button>
              </Upload>
            </>
          </Form.Item>
        );
      }
      case 'youtube': {
        return (
          <Form.Item
            name="url"
            label="File / Link"
            rules={[
              {
                required: true,
                message: 'Please upload a file or enter a link',
              },
            ]}>
            <Input
              placeholder="Or enter a link"
              onChange={e => debouncedOnChange(e.target.value)}
            />
          </Form.Item>
        );
      }
      default: {
        return (
          <Form.Item
            name="url"
            label="File / Link"
            required
            rules={[
              {
                required: true,
                message: 'Please upload a file or enter a link',
              },
            ]}>
            <>
              <Upload
                maxCount={1}
                fileList={fileUpload}
                listType="picture-card"
                action={api.defaults.baseURL + '/upload'}
                onRemove={() => setFileUpload([])}
                onChange={info => {
                  if (info.file.status === 'uploading') {
                    setFileUpload([
                      {
                        uid: info.file.uid,
                        name: info.file.name,
                        status: info.file.status,
                        url: info.file.response?.data,
                      },
                    ]);
                  }
                  if (info.file.status === 'done') {
                    setFileUpload([
                      {
                        uid: info.file.uid,
                        name: info.file.name,
                        status: info.file.status,
                        url: info.file.response?.data,
                      },
                    ]);
                    const responseUrl = info.file.response?.data;
                    if (responseUrl) {
                      form.setFieldsValue({ url: responseUrl });
                      setLink(responseUrl);
                      getVideoDuration(responseUrl)
                        .then(duration => {
                          form.setFieldsValue({ duration: duration });
                          setDuration(Math.floor(duration));
                        })
                        .catch(error => console.error(error));
                    }
                  }
                }}>
                <Button type="text">Upload</Button>
              </Upload>
            </>
          </Form.Item>
        );
      }
    }
  };

  const handleGenerate = async (params: { link: string }) => {
    const { link } = params;
    setLoading(true);
    try {
      const res = await generateQuestion({ url: link });
      const parsedQuestions = JSON.parse(res.data);
      form.setFieldsValue({
        questionList: parsedQuestions,
      });
    } catch (error) {
      console.error('Error generating questions:', error);
      messageApi.error('An error occurred while generating questions.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      layout="vertical"
      form={form}
      onFinish={values => {
        onFinish
          ? onFinish(values)
          : addLibrary(values)
              .then(res => {
                setSelectedItems([...selectedItems, res.data]);
                messageApi.success('Add new library successfully!');
                onDone && onDone(res.data);
                form.resetFields();
              })
              .catch(() => {
                messageApi.error('Add new library failed!');
              });
      }}>
      <ScrollView style={{ flex: 1 }}>
        <Form.Item
          label="Library Name"
          name="title"
          rules={[
            { required: true, message: 'Please enter the library name' },
          ]}>
          <Input placeholder="Enter library name" />
        </Form.Item>

        <Form.Item label="Library Description" name="description">
          <Input.TextArea placeholder="Enter library description" />
        </Form.Item>
        <Form.Item name="duration" noStyle></Form.Item>

        <Form.Item
          label="Resource Type"
          name="type"
          rules={[
            { required: true, message: 'Please select the library type' },
          ]}>
          <Select
            placeholder="Select library type"
            onChange={value => setLibraryType(value)} // Cập nhật trạng thái khi chọn
            getPopupContainer={triggerNode => triggerNode.parentNode}>
            <Select.Option value="Youtube">Link YouTube</Select.Option>
            <Select.Option value="Video">Video</Select.Option>
            <Select.Option value="Text">Test</Select.Option>
          </Select>
        </Form.Item>

        {renderInputContent()}
        <Space>
          <Button
            type="primary"
            loading={loading}
            onClick={() => {
              handleGenerate({ link: link });
            }}>
            Generate
          </Button>
        </Space>
        <Form.Item label="Questions List" name="questionsList">
          <Form.List name="questionList">
            {(fields, { add, remove }) => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                {fields.map(({ key, name, ...restField }) => {
                  return (
                    <QuestionItem
                      key={key}
                      {...restField}
                      name={name}
                      remove={remove}
                      libraryType={libraryType}
                      duration={duration}
                    />
                  );
                })}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add({ answerList: ['', '', '', ''] })}
                    block
                    icon={<PlusOutlined />}>
                    Add Question
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </Form.Item>
      </ScrollView>

      <Button type="primary" htmlType="submit">
        Add Library
      </Button>
    </Form>
  );
};

export default AddLibraryContent;
const QuestionItem = ({ remove, name, duration, libraryType }: any) => {
  return (
    <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <p style={{ margin: 0 }}>Question {name + 1}</p>
        <MinusCircleOutlined onClick={() => remove(name)} />
      </div>
      <Form.Item name={[name, 'question']} style={{ marginBottom: 8 }}>
        <Input placeholder="Enter question" style={{ marginBottom: 0 }} />
      </Form.Item>
      <Form.List name={[name, 'answerList']}>
        {fields =>
          fields.map((field, answerIndex) => (
            <div key={field.key} className="answerItemContainer">
              <div> {String.fromCharCode(65 + answerIndex)}.</div>
              <Form.Item
                style={{ margin: 0, flex: 1 }}
                key={field.key}
                name={field.name}>
                <Input placeholder={`Answer ${answerIndex + 1}`} />
              </Form.Item>
            </div>
          ))
        }
      </Form.List>

      <div style={{ display: 'flex', gap: 8 }}>
        {/* Chọn đáp án đúng */}
        <Form.Item
          label="CorrectAnswer:"
          name={[name, 'correctAnswer']}
          rules={[
            { required: true, message: 'Please select the Correct answer' },
          ]}
          wrapperCol={{ span: 16 }}>
          <Select style={{ width: 60 }}>
            <Select.Option value="A">A</Select.Option>
            <Select.Option value="B">B</Select.Option>
            <Select.Option value="C">C</Select.Option>
            <Select.Option value="D">D</Select.Option>
          </Select>
        </Form.Item>
        {libraryType !== 'Text' && (
          <Form.Item
            name={[name, 'appearTime']}
            label="AppearTime:"
            rules={[
              { required: true, message: 'Please select the appearTime' },
            ]}
            style={{ marginBottom: 8 }}>
            <TimeLimitedPicker durationInSeconds={duration} />
          </Form.Item>
        )}
      </div>
    </div>
  );
};

const TimeLimitedPicker = ({
  durationInSeconds,
  value,
  onChange,
  ...props
}: {
  durationInSeconds: number;
  value?: number;
  onChange?: (value: number | null) => void;
} & Omit<TimePickerProps, 'value' | 'onChange'>) => {
  const maxTime = dayjs().startOf('day').add(durationInSeconds, 'second');

  const disabledTime = (current: dayjs.Dayjs | null) => {
    const maxH = maxTime.hour();
    const maxM = maxTime.minute();
    const maxS = maxTime.second();

    return {
      disabledHours: () =>
        Array.from({ length: 24 }, (_, i) => i).filter(h => h > maxH),
      disabledMinutes: (h: number) =>
        h < maxH
          ? []
          : Array.from({ length: 60 }, (_, i) => i).filter(m => m > maxM),
      disabledSeconds: (h: number, m: number) =>
        h < maxH || m < maxM
          ? []
          : Array.from({ length: 60 }, (_, i) => i).filter(s => s > maxS),
    };
  };

  // Convert từ số giây sang dayjs object
  const dayjsValue =
    value != null ? dayjs().startOf('day').add(value, 'second') : null;

  return (
    <TimePicker
      {...props}
      value={dayjsValue}
      format={durationInSeconds >= 3600 ? 'HH:mm:ss' : 'mm:ss'}
      showNow={false}
      needConfirm={false}
      disabledTime={disabledTime}
      onChange={time => {
        if (time) {
          const totalSeconds =
            time.hour() * 3600 + time.minute() * 60 + time.second();
          onChange?.(totalSeconds); // Truyền số giây về Form
        } else {
          onChange?.(null);
        }
      }}
    />
  );
};
