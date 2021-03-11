import React from 'react';
import { Form, Switch, InputNumber, Select } from 'antd';
import { ExtModal } from 'suid';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

@Form.create()
class EditModal extends React.Component {
  handleSave = () => {
    const { form, onSave, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      if (onSave) {
        onSave({ ...editData, ...formData });
      }
    });
  };

  getContent = () => {
    const { form, editData } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form {...formItemLayout}>
        <FormItem label="列宽">
          {getFieldDecorator('width', {
            initialValue: editData && editData.width,
          })(<InputNumber style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label="格式化">
          {getFieldDecorator('formatter', {
            initialValue: editData && editData.formatter,
          })(
            <Select>
              <Select.Option value="formatText">文本</Select.Option>
              <Select.Option value="formatDate">日期</Select.Option>
              <Select.Option value="formatBool">布尔</Select.Option>
            </Select>,
          )}
        </FormItem>
        <FormItem
          label="快速查询"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          {getFieldDecorator('canSearch', {
            valuePropName: 'checked',
            initialValue: editData && editData.canSearch,
          })(<Switch />)}
        </FormItem>
        <FormItem label="排序字段">
          {getFieldDecorator('sort', {
            valuePropName: 'checked',
            initialValue: editData && editData.sort,
          })(<Switch />)}
        </FormItem>
        {/* <FormItem label="支持复制" {...colFormItemLayout}>
          {getFieldDecorator('isCopy', {
            valuePropName: 'checked',
            initialValue: editData && editData.isCopy,
          })(<Switch />)}
        </FormItem> */}
        {/* <FormItem label="格式化" {...colFormItemLayout}>
          {getFieldDecorator('isFormatter', {
            valuePropName: 'checked',
            initialValue: editData && editData.isFormatter,
          })(<Switch />)}
        </FormItem> */}
      </Form>
    );
  };

  render() {
    const { editData, onCancel } = this.props;
    const { title } = editData;

    return (
      <ExtModal
        visible={!!editData}
        title={`编辑列【${title}】`}
        onCancel={onCancel}
        onOk={this.handleSave}
      >
        {this.getContent()}
      </ExtModal>
    );
  }
}

export default EditModal;