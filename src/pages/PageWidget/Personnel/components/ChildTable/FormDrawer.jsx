import React, { Component } from 'react';
import { Input, Row, Select, DatePicker, Col } from 'antd';
import { get } from 'lodash';
import moment from 'moment';
import FormDrawer from '@/components/FormDrawer';
import { constants } from '@/utils';

const { MDMSCONTEXT, GENDER } = constants;
const commonSpan = 24;

class EditFormDrawer extends Component {
  getGenderProps = form => {
    return {
      form,
      name: 'genderName',
      store: {
        type: 'GET',
        autoLoad: false,
        url: `${MDMSCONTEXT}/dataDict/getCanUseDataDictValues?dictCode=PUB-GENDER`,
      },
      columns: [
        {
          title: '代码',
          width: 120,
          dataIndex: 'dataValue',
        },
        {
          title: '名称',
          width: 160,
          dataIndex: 'dataName',
        },
      ],
      rowKey: 'dataValue',
      reader: {
        name: 'dataName',
        field: ['dataValue'],
      },
      field: ['gender'],
    };
  };

  renderFormItems = (form, FormItem) => {
    const { editData, parentData } = this.props;
    const { getFieldDecorator } = form;

    return (
      <>
        <Row>
          <Col span={commonSpan}>
            <FormItem label="员工编号">
              {getFieldDecorator('code', {
                initialValue: get(editData, 'code', ''),
                rules: [
                  {
                    required: true,
                    message: '请输入员工编号',
                  },
                ],
              })(<Input disabled={!!editData} />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="员工姓名">
              {getFieldDecorator('name', {
                initialValue: get(editData, 'name', ''),
                rules: [
                  {
                    required: true,
                    message: '请输入员工姓名',
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="姓名缩写">
              {getFieldDecorator('shortName', {
                initialValue: get(editData, 'shortName', ''),
                rules: [
                  {
                    required: true,
                    message: '请输入姓名缩写',
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="身份证">
              {getFieldDecorator('idCard', {
                initialValue: get(editData, 'idCard', ''),
                rules: [
                  {
                    required: true,
                    message: '请输入身份证',
                  },
                  {
                    reg: /^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[Xx])$)$/,
                    message: '请输入有效的身份证',
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="ERP公司代码">
              {getFieldDecorator('erpCorporationCode', {
                initialValue: get(parentData, 'erpCode'),
                rules: [
                  {
                    required: true,
                    message: '请输入ERP公司代码',
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="在职状态">
              {getFieldDecorator('workingStatus', {
                initialValue: get(editData, 'workingStatus'),
                rules: [
                  {
                    required: true,
                    message: '请选择在职状态',
                  },
                ],
              })(
                <Select>
                  <Select.Option value="ON_JOB">正常</Select.Option>
                  <Select.Option value="RESIGNED">离职</Select.Option>
                  <Select.Option value="SUPERANNUATED">退休</Select.Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="员工组">
              {getFieldDecorator('personnelGroup', {
                initialValue: get(editData, 'personnelGroup', ''),
                rules: [
                  {
                    required: true,
                    message: '请输入员工组',
                  },
                  {
                    max: 1,
                    message: '员工组长度不能超过1',
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="HR组织机构代码">
              {getFieldDecorator('hrOrganizationCode', {
                initialValue: get(editData, 'hrOrganizationCode', ''),
                rules: [
                  {
                    required: true,
                    message: '请选择Hr组织机构代码',
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="HR组织机构名称">
              {getFieldDecorator('hrOrganizationName', {
                initialValue: get(editData, 'hrOrganizationName', ''),
                rules: [
                  {
                    required: true,
                    message: '请选择Hr组织机构名称',
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="成本中心代码">
              {getFieldDecorator('costCenterCode', {
                initialValue: get(editData, 'costCenterCode'),
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="性别">
              {getFieldDecorator('gender', {
                initialValue: get(editData, 'gender'),
                rules: [
                  {
                    required: true,
                    message: '请选择性别',
                  },
                ],
              })(
                <Select>
                  {Object.entries(GENDER).map(([value, label]) => (
                    <Select.Option key={value} value={value}>
                      {label}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="职位">
              {getFieldDecorator('post', {
                initialValue: get(editData, 'post'),
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="生日">
              {getFieldDecorator('birthday', {
                initialValue: moment(get(editData, 'birthday')),
              })(<DatePicker style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="电子邮件">
              {getFieldDecorator('email', {
                initialValue: get(editData, 'email'),
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="移动电话">
              {getFieldDecorator('mobile', {
                initialValue: get(editData, 'mobile'),
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="座机电话">
              {getFieldDecorator('telephone', {
                initialValue: get(editData, 'telephone'),
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="邮政编码">
              {getFieldDecorator('postalCode', {
                initialValue: get(editData, 'postalCode'),
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={commonSpan}>
            <FormItem label="通信地址">
              {getFieldDecorator('mailingAddress', {
                initialValue: get(editData, 'mailingAddress'),
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
      </>
    );
  };

  render() {
    const { editData, confirmLoading, onOk, visible, onClose } = this.props;
    const title = editData ? '编辑' : '新增';
    return (
      <FormDrawer
        title={title}
        visible={visible}
        onClose={onClose}
        width={550}
        onOk={onOk}
        confirmLoading={confirmLoading}
        renderFormItems={this.renderFormItems}
      />
    );
  }
}

export default EditFormDrawer;
