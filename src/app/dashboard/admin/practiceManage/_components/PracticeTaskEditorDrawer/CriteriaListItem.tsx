import React from 'react';
import {
  Button,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Select,
  Switch,
} from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import {
  PracticeCriteriaType,
  PRACTICE_CRITERIA_LABELS,
  PracticeSubject,
} from '~mdDashboard/types/practice';

const EXCEL_TYPES: PracticeCriteriaType[] = [
  'excel_cell_formula',
  'excel_cell_number_format',
  'excel_freeze_panes',
  'excel_column_width',
  'excel_cell_style',
  'excel_cell_value',
  'excel_wrap_text',
  'excel_table_name',
  'excel_sparkline_exists',
  'excel_chart_title',
  'excel_chart_axis_title',
  'excel_chart_data_labels',
  'excel_table_converted_to_range',
];

const WORD_TYPES: PracticeCriteriaType[] = [
  'word_margins',
  'word_paragraph_style',
  'word_find_replace_result',
  'word_table_structure',
  'word_bookmark_exists',
  'word_line_spacing',
  'word_header_different_first_page',
  'word_symbol_inserted',
  'word_table_cell_spacing',
  'word_footnotes_to_endnotes',
  'word_text_shadow_color',
];

type Props = {
  form: FormInstance;
  name: number;
  restField: any;
  remove: (index: number) => void;
  subject: PracticeSubject;
};

// Mỗi tiêu chí có 1 bộ tham số (params) khác nhau tuỳ loại — render đúng bộ
// input cho loại đang chọn của DÒNG NÀY (không phải toàn form), nên phải
// theo dõi field `type` riêng của chính dòng này bằng Form.useWatch theo path.
const CriteriaListItem: React.FC<Props> = ({
  form,
  name,
  restField,
  remove,
  subject,
}) => {
  const typeValue: PracticeCriteriaType = Form.useWatch(
    ['criteria', name, 'type'],
    form,
  );

  const typeOptions = (subject === 'Excel' ? EXCEL_TYPES : WORD_TYPES).map(
    t => ({ value: t, label: PRACTICE_CRITERIA_LABELS[t] }),
  );

  const renderParamsFields = () => {
    if (!typeValue) return null;

    // Mọi tiêu chí Excel đều cần biết chấm ở sheet nào.
    const sheetField = subject === 'Excel' && (
      <Form.Item
        {...restField}
        label="Tên sheet"
        name={[name, 'params', 'sheet']}
        rules={[{ required: true, message: 'Nhập tên sheet' }]}>
        <Input placeholder="VD: Doanh thu" />
      </Form.Item>
    );

    switch (typeValue) {
      case 'excel_cell_formula':
      case 'excel_cell_number_format':
        return (
          <>
            {sheetField}
            <Form.Item
              {...restField}
              label="Ô cần kiểm tra"
              name={[name, 'params', 'cell']}
              rules={[{ required: true, message: 'Nhập vị trí ô, VD: E2' }]}>
              <Input placeholder="VD: E2" />
            </Form.Item>
            <Form.Item
              {...restField}
              label={
                typeValue === 'excel_cell_formula'
                  ? 'Công thức phải chứa'
                  : 'Định dạng số phải chứa'
              }
              name={[name, 'params', 'mustContain']}
              rules={[{ required: true, message: 'Nhập nội dung cần có' }]}>
              <Input
                placeholder={
                  typeValue === 'excel_cell_formula'
                    ? 'VD: SUM'
                    : 'VD: 0.00 hoặc #,##0'
                }
              />
            </Form.Item>
          </>
        );
      case 'excel_freeze_panes':
        return (
          <>
            {sheetField}
            <Form.Item
              {...restField}
              label="Số hàng cố định (ySplit)"
              name={[name, 'params', 'ySplit']}
              rules={[{ required: true, message: 'Nhập số hàng cố định' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              {...restField}
              label="Số cột cố định (xSplit) — không bắt buộc"
              name={[name, 'params', 'xSplit']}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </>
        );
      case 'excel_column_width':
        return (
          <>
            {sheetField}
            <Form.Item
              {...restField}
              label="Các cột cần kiểm tra"
              name={[name, 'params', 'columns']}
              rules={[{ required: true, message: 'Chọn ít nhất 1 cột' }]}>
              <Select
                mode="tags"
                placeholder="Nhập tên cột rồi Enter, VD: B"
                tokenSeparators={[',', ' ']}
              />
            </Form.Item>
            <Form.Item
              {...restField}
              label="Độ rộng yêu cầu"
              name={[name, 'params', 'width']}
              rules={[{ required: true, message: 'Nhập độ rộng' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </>
        );
      case 'excel_cell_style':
        return (
          <>
            {sheetField}
            <Form.Item
              {...restField}
              label="Vùng ô (range)"
              name={[name, 'params', 'range']}
              rules={[{ required: true, message: 'Nhập vùng ô, VD: A1:E1' }]}>
              <Input placeholder="VD: A1:E1" />
            </Form.Item>
            <Form.Item
              {...restField}
              label="Yêu cầu chữ đậm (bold)"
              name={[name, 'params', 'bold']}
              valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item
              {...restField}
              label="Căn lề — không bắt buộc"
              name={[name, 'params', 'align']}>
              <Select
                allowClear
                placeholder="Chọn căn lề"
                options={[
                  { value: 'left', label: 'Trái' },
                  { value: 'center', label: 'Giữa' },
                  { value: 'right', label: 'Phải' },
                ]}
              />
            </Form.Item>
          </>
        );
      case 'excel_cell_value':
        return (
          <>
            {sheetField}
            <Form.Item
              {...restField}
              label="Ô cần kiểm tra"
              name={[name, 'params', 'cell']}
              rules={[{ required: true, message: 'Nhập vị trí ô, VD: A1' }]}>
              <Input placeholder="VD: A1" />
            </Form.Item>
            <Form.Item
              {...restField}
              label="Giá trị yêu cầu"
              name={[name, 'params', 'value']}
              rules={[{ required: true, message: 'Nhập giá trị yêu cầu' }]}>
              <Input placeholder="VD: Doanh thu" />
            </Form.Item>
          </>
        );
      case 'word_margins':
        return (
          <>
            <p style={{ color: '#888', fontSize: 12, marginBottom: 4 }}>
              Đơn vị DXA (1440 = 1 inch = 2.54cm). Bỏ trống lề nào thì lề đó
              không bị kiểm tra.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <Form.Item
                {...restField}
                label="Trên"
                name={[name, 'params', 'top']}
                style={{ flex: 1 }}>
                <InputNumber style={{ width: '100%' }} placeholder="1440" />
              </Form.Item>
              <Form.Item
                {...restField}
                label="Dưới"
                name={[name, 'params', 'bottom']}
                style={{ flex: 1 }}>
                <InputNumber style={{ width: '100%' }} placeholder="1440" />
              </Form.Item>
              <Form.Item
                {...restField}
                label="Trái"
                name={[name, 'params', 'left']}
                style={{ flex: 1 }}>
                <InputNumber style={{ width: '100%' }} placeholder="1440" />
              </Form.Item>
              <Form.Item
                {...restField}
                label="Phải"
                name={[name, 'params', 'right']}
                style={{ flex: 1 }}>
                <InputNumber style={{ width: '100%' }} placeholder="1440" />
              </Form.Item>
            </div>
          </>
        );
      case 'word_paragraph_style':
        return (
          <>
            <Form.Item
              {...restField}
              label="Đoạn văn chứa cụm từ"
              name={[name, 'params', 'textContains']}
              rules={[
                { required: true, message: 'Nhập cụm từ nhận diện đoạn văn' },
              ]}>
              <Input placeholder="VD: Chương 1" />
            </Form.Item>
            <Form.Item
              {...restField}
              label="Style yêu cầu"
              name={[name, 'params', 'style']}
              rules={[
                { required: true, message: 'Nhập tên style, VD: Heading1' },
              ]}>
              <Input placeholder="VD: Heading1" />
            </Form.Item>
          </>
        );
      case 'word_find_replace_result':
        return (
          <>
            <Form.Item
              {...restField}
              label="Văn bản phải còn chứa — không bắt buộc"
              name={[name, 'params', 'mustContain']}>
              <Input placeholder="VD: mới" />
            </Form.Item>
            <Form.Item
              {...restField}
              label="Văn bản không được còn chứa — không bắt buộc"
              name={[name, 'params', 'mustNotContain']}>
              <Input placeholder="VD: cũ" />
            </Form.Item>
          </>
        );
      case 'word_table_structure':
        return (
          <>
            <Form.Item
              {...restField}
              label="Bảng thứ mấy (0 = bảng đầu tiên)"
              name={[name, 'params', 'tableIndex']}
              initialValue={0}
              rules={[{ required: true, message: 'Nhập vị trí bảng' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              {...restField}
              label="Số hàng yêu cầu"
              name={[name, 'params', 'rows']}
              rules={[{ required: true, message: 'Nhập số hàng' }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              {...restField}
              label="Số cột — không bắt buộc"
              name={[name, 'params', 'cols']}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </>
        );
      case 'word_bookmark_exists':
        return (
          <Form.Item
            {...restField}
            label="Tên bookmark"
            name={[name, 'params', 'name']}
            rules={[{ required: true, message: 'Nhập tên bookmark' }]}>
            <Input placeholder="VD: ChuY" />
          </Form.Item>
        );
      case 'word_line_spacing':
        return (
          <>
            <Form.Item
              {...restField}
              label="Đoạn văn chứa cụm từ"
              name={[name, 'params', 'textContains']}
              rules={[
                { required: true, message: 'Nhập cụm từ nhận diện đoạn văn' },
              ]}>
              <Input placeholder="VD: Câu lạc bộ đọc sách" />
            </Form.Item>
            <Form.Item
              {...restField}
              label="Hệ số giãn dòng"
              name={[name, 'params', 'lineMultiple']}
              rules={[
                { required: true, message: 'Nhập hệ số giãn dòng, VD: 1.5' },
              ]}>
              <InputNumber min={1} step={0.5} style={{ width: '100%' }} />
            </Form.Item>
          </>
        );
      case 'excel_wrap_text':
        return (
          <>
            {sheetField}
            <Form.Item
              {...restField}
              label="Vùng ô (range)"
              name={[name, 'params', 'range']}
              rules={[{ required: true, message: 'Nhập vùng ô, VD: A5:G5' }]}>
              <Input placeholder="VD: A5:G5" />
            </Form.Item>
          </>
        );
      case 'excel_table_name':
        return (
          <>
            {sheetField}
            <Form.Item
              {...restField}
              label="Tên bảng yêu cầu"
              name={[name, 'params', 'name']}
              rules={[{ required: true, message: 'Nhập tên bảng' }]}>
              <Input placeholder="VD: ProductInventory" />
            </Form.Item>
          </>
        );
      case 'excel_table_converted_to_range':
        return (
          <>
            {sheetField}
            <Form.Item
              {...restField}
              label="Vùng ô của bảng cũ (range)"
              name={[name, 'params', 'range']}
              rules={[{ required: true, message: 'Nhập vùng ô, VD: A1:C6' }]}>
              <Input placeholder="VD: A1:C6" />
            </Form.Item>
          </>
        );
      case 'excel_sparkline_exists':
        return (
          <>
            {sheetField}
            <Form.Item
              {...restField}
              label="Vùng chứa Sparkline (1 cột hoặc 1 hàng)"
              name={[name, 'params', 'range']}
              rules={[{ required: true, message: 'Nhập vùng ô, VD: D2:D6' }]}>
              <Input placeholder="VD: D2:D6" />
            </Form.Item>
            <Form.Item
              {...restField}
              label="Kiểu Sparkline — không bắt buộc"
              name={[name, 'params', 'sparkType']}>
              <Select
                allowClear
                placeholder="Chọn kiểu"
                options={[
                  { value: 'line', label: 'Line' },
                  { value: 'column', label: 'Column' },
                  { value: 'stacked', label: 'Win/Loss' },
                ]}
              />
            </Form.Item>
          </>
        );
      case 'excel_chart_title':
        return (
          <>
            {sheetField}
            <Form.Item
              {...restField}
              label="Tiêu đề biểu đồ yêu cầu"
              name={[name, 'params', 'mustContain']}
              rules={[{ required: true, message: 'Nhập tiêu đề yêu cầu' }]}>
              <Input placeholder="VD: Doanh thu theo quý" />
            </Form.Item>
          </>
        );
      case 'excel_chart_axis_title':
        return (
          <>
            {sheetField}
            <Form.Item
              {...restField}
              label="Trục"
              name={[name, 'params', 'axis']}
              initialValue="vertical"
              rules={[{ required: true, message: 'Chọn trục' }]}>
              <Select
                options={[
                  { value: 'vertical', label: 'Trục dọc' },
                  { value: 'horizontal', label: 'Trục ngang' },
                ]}
              />
            </Form.Item>
            <Form.Item
              {...restField}
              label="Tiêu đề trục yêu cầu"
              name={[name, 'params', 'mustContain']}
              rules={[{ required: true, message: 'Nhập tiêu đề yêu cầu' }]}>
              <Input placeholder="VD: Hours" />
            </Form.Item>
          </>
        );
      case 'excel_chart_data_labels':
        return <>{sheetField}</>;
      case 'word_header_different_first_page':
        return (
          <Form.Item
            {...restField}
            label="Nội dung header trang đầu — không bắt buộc"
            name={[name, 'params', 'headerTextContains']}>
            <Input placeholder="VD: Integral" />
          </Form.Item>
        );
      case 'word_symbol_inserted':
        return (
          <>
            <Form.Item
              {...restField}
              label="Đoạn văn gần vị trí chèn — không bắt buộc"
              name={[name, 'params', 'textContains']}>
              <Input placeholder="VD: Caution: the baking tray" />
            </Form.Item>
            <Form.Item
              {...restField}
              label="Font ký hiệu"
              name={[name, 'params', 'font']}
              rules={[
                { required: true, message: 'Nhập tên font, VD: Webdings' },
              ]}>
              <Input placeholder="VD: Webdings" />
            </Form.Item>
            <Form.Item
              {...restField}
              label="Mã ký tự (character code)"
              name={[name, 'params', 'charCode']}
              rules={[{ required: true, message: 'Nhập mã ký tự' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </>
        );
      case 'word_table_cell_spacing':
        return (
          <>
            <Form.Item
              {...restField}
              label="Bảng thứ mấy (0 = bảng đầu tiên)"
              name={[name, 'params', 'tableIndex']}
              initialValue={0}
              rules={[{ required: true, message: 'Nhập vị trí bảng' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              {...restField}
              label="Khoảng cách giữa các ô (inch)"
              name={[name, 'params', 'spacingInch']}
              rules={[{ required: true, message: 'Nhập khoảng cách' }]}>
              <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
            </Form.Item>
          </>
        );
      case 'word_footnotes_to_endnotes':
        return (
          <Form.Item
            {...restField}
            label="Số chú thích cuối văn bản tối thiểu"
            name={[name, 'params', 'minEndnoteCount']}
            initialValue={1}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        );
      case 'word_text_shadow_color':
        return (
          <>
            <Form.Item
              {...restField}
              label="Đoạn văn chứa cụm từ"
              name={[name, 'params', 'textContains']}
              rules={[
                { required: true, message: 'Nhập cụm từ nhận diện đoạn văn' },
              ]}>
              <Input placeholder="VD: Styled Text Here" />
            </Form.Item>
            <Form.Item
              {...restField}
              label="Màu chữ (hex, không dấu #)"
              name={[name, 'params', 'color']}
              rules={[{ required: true, message: 'Nhập màu, VD: FF0000' }]}>
              <Input placeholder="VD: FF0000" />
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        border: '1px solid #f0f0f0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
      }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}>
        <b>Tiêu chí {name + 1}</b>
        <MinusCircleOutlined onClick={() => remove(name)} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Form.Item
          {...restField}
          label="Loại tiêu chí"
          name={[name, 'type']}
          style={{ flex: 2 }}
          rules={[{ required: true, message: 'Chọn loại tiêu chí' }]}>
          <Select placeholder="Chọn loại tiêu chí" options={typeOptions} />
        </Form.Item>
        <Form.Item
          {...restField}
          label="Điểm"
          name={[name, 'points']}
          initialValue={1}
          style={{ flex: 1 }}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </div>
      {renderParamsFields()}
    </div>
  );
};

export default CriteriaListItem;
