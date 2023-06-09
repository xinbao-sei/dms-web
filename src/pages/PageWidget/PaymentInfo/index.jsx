import React, { useState } from 'react';
import { Input, Select, Row, Col } from 'antd';
import { ComboList } from 'suid';
import { get } from 'lodash';
import DropMenu from '@/components/DropMenu';
import { constants } from '@/utils';
import SimpleTable from '@/components/SimpleTable';
import { save, remove } from './service';

const { MDMSCONTEXT } = constants;
const RECEIVER_TYPE = {
  H: '员工',
  K: '供应商',
  D: '客户',
};

const USE_SCOPE = {
  ALL: '通用',
  BILL: '票据',
  CASH: '现汇',
};
const colSpan = 24;

const PaymentInfo = () => {
  const [viewType, setViewType] = useState('H');

  const getComboListProps = form => {
    const { getFieldValue } = form;

    const receiverType = getFieldValue('receiverType');

    let tempPath = 'personnel';
    if (receiverType === 'K') {
      tempPath = 'supplier';
    }

    if (receiverType === 'D') {
      tempPath = 'customer';
    }

    return {
      key: receiverType,
      form,
      allowClear: true,
      name: 'receiverName',
      remotePaging: true,
      searchPlaceHolder: '请输入代码或名称关键字搜索',
      store: {
        type: 'POST',
        autoLoad: false,
        url: `${MDMSCONTEXT}/${tempPath}/findByPage`,
      },
      rowKey: 'id',
      reader: {
        name: 'name',
        description: 'code',
        field: ['id', 'code'],
      },
      field: ['receiverId', 'receiverCode'],
    };
  };

  const getBankComboListProps = form => {
    return {
      form,
      allowClear: true,
      name: 'bankName',
      remotePaging: true,
      searchPlaceHolder: '请输入代码或名称关键字搜索',
      store: {
        type: 'POST',
        autoLoad: false,
        url: `${MDMSCONTEXT}/bank/findByPage`,
      },
      rowKey: 'id',
      reader: {
        name: 'name',
        description: 'code',
        field: ['id', 'code', 'erpBankCode'],
      },
      field: ['bankId', 'bankCode', 'erpBankCode'],
    };
  };

  const tableProps = {
    searchPlaceHolder: '请输入收款方代码，名称',
    searchProperties: ['receiverCode', 'receiverName'],
    modalWidth: 600,
    cascadeParams: {
      filters: [
        {
          fieldName: 'receiverType',
          operator: 'EQ',
          value: viewType,
        },
      ],
    },
    toolBar: {
      prefix: (
        <DropMenu
          icon="eye"
          label="收款类型"
          menuItems={Object.entries(RECEIVER_TYPE).map(([type, label]) => ({
            key: type,
            value: label,
          }))}
          onSelect={key => {
            setViewType(key);
          }}
          defalutSelectedKey={viewType}
        />
      ),
    },
    formProps: {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    },
    actions: {
      add: save,
      edit: save,
      del: remove,
    },
    store: {
      type: 'POST',
      url: `${MDMSCONTEXT}/paymentInfo/findByPage`,
    },
    renderFormItems: (form, FormItem, editData) => {
      const { setFieldsValue } = form;
      return (
        <Row>
          <Col span={colSpan}>
            <FormItem
              label="收款对象类型"
              name="receiverType"
              initialValue={get(editData, 'receiverType', 'H')}
              rules={[
                {
                  required: true,
                  message: '请选择收款对象类型',
                },
              ]}
            >
              <Select
                onChange={() => {
                  setFieldsValue({ receiverName: '' });
                }}
              >
                {Object.keys(RECEIVER_TYPE).map(key => (
                  <Select.Option key={key} value={key}>
                    {RECEIVER_TYPE[key]}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={colSpan}>
            <FormItem
              label="收款对象Id"
              name="receiverId"
              hidden
              initialValue={get(editData, 'receiverId')}
            >
              <Input />
            </FormItem>
            <FormItem
              label="收款对象Code"
              name="receiverCode"
              initialValue={get(editData, 'receiverCode')}
              hidden
            >
              <Input />
            </FormItem>
            <FormItem
              label="收款对象"
              name="receiverName"
              initialValue={get(editData, 'receiverName')}
              rules={[
                {
                  required: true,
                  message: '请选择收款对象',
                },
              ]}
            >
              <ComboList {...getComboListProps(form)} />
            </FormItem>
          </Col>
          <Col span={colSpan}>
            <FormItem
              label="银行省区代码"
              name="bankProvinceCode"
              initialValue={get(editData, 'bankProvinceCode')}
              hidden
            >
              <Input />
            </FormItem>
            <FormItem
              label="银行省区"
              name="bankProvinceName"
              initialValue={get(editData, 'bankProvinceName')}
              hidden
            >
              <Input />
            </FormItem>
          </Col>
          <Col span={colSpan}>
            <FormItem
              label="银行地区代码"
              name="bankAreaCode"
              initialValue={get(editData, 'bankAreaCode')}
              hidden
            >
              <Input />
            </FormItem>
            <FormItem
              label="银行地区"
              name="bankAreaName"
              initialValue={get(editData, 'bankAreaName')}
              hidden
            >
              <Input />
            </FormItem>
          </Col>
          <Col span={colSpan}>
            <FormItem label="银行id" name="bankId" initialValue={get(editData, 'bankId')} hidden>
              <Input />
            </FormItem>
            <FormItem
              label="银行代码"
              name="bankCode"
              initialValue={get(editData, 'bankCode')}
              hidden
            >
              <Input />
            </FormItem>
            <FormItem
              name="erpBankCode"
              label="erp银行代码"
              initialValue={get(editData, 'erpBankCode')}
              hidden
            >
              <Input />
            </FormItem>
            <FormItem
              label="银行"
              name="bankName"
              initialValue={get(editData, 'bankName')}
              rules={[
                {
                  required: true,
                  message: '请选择银行',
                },
              ]}
            >
              <ComboList {...getBankComboListProps(form)} />
            </FormItem>
          </Col>
          <Col span={colSpan}>
            <FormItem
              label="银行户名"
              name="bankAccountName"
              initialValue={get(editData, 'bankAccountName')}
              rules={[
                {
                  required: true,
                  message: '请输入银行户名',
                },
              ]}
            >
              <Input />
            </FormItem>
          </Col>
          <Col span={colSpan}>
            <FormItem
              label="银行帐号"
              name="bankAccountNumber"
              initialValue={get(editData, 'bankAccountNumber')}
              rules={[
                {
                  required: true,
                  message: '请输入银行帐号',
                },
              ]}
            >
              <Input />
            </FormItem>
          </Col>
          <Col span={colSpan}>
            <FormItem
              name="useScope"
              label="账号用途"
              initialValue={get(editData, 'useScope')}
              rules={[
                {
                  required: true,
                  message: '请选择帐号用途',
                },
              ]}
            >
              <Select>
                {Object.keys(USE_SCOPE).map(key => (
                  <Select.Option key={key} value={key}>
                    {USE_SCOPE[key]}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
          </Col>
        </Row>
      );
    },
    columns: [
      {
        title: '收款对象',
        width: 180,
        dataIndex: 'receiverName',
      },
      {
        title: '收款对象代码',
        dataIndex: 'receiverCode',
      },
      {
        title: '银行帐号',
        width: 220,
        dataIndex: 'bankAccountNumber',
      },
      {
        title: '银行户名',
        width: 180,
        dataIndex: 'bankAccountName',
      },
      {
        title: '帐号用途',
        dataIndex: 'useScope',
        render: useScope => USE_SCOPE[useScope],
      },
      {
        title: '银行名称',
        dataIndex: 'bankName',
      },
      {
        title: '银行代码',
        dataIndex: 'bankCode',
      },
      {
        title: 'erp银行代码',
        dataIndex: 'erpBankCode',
      },
      {
        title: '银行行别代码',
        dataIndex: 'bankCategoryCode',
        render: bankCategoryCode => bankCategoryCode || '-',
      },
      {
        title: '银行行别名称',
        dataIndex: 'bankCategoryName',
        render: bankCategoryName => bankCategoryName || '-',
      },
    ],
  };

  return <SimpleTable {...tableProps} />;
};

export default PaymentInfo;
