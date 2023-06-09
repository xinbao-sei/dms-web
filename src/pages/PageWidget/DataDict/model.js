/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-03-16 14:43:19
 */
import {
  del,
  getDataDictTypes,
  save,
  getDataDictItems,
  saveDictItem,
  deleteDictItem,
  privateDictItem,
} from './service';
import { message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { utils } from 'suid';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'dataDict',

  state: {
    dataDictTypes: [],
    currDictType: null,
    showCreateModal: false,
    selectedTreeNode: null,
    dataDictItems: [],
    isPrivateDictItems: false,
  },
  effects: {
    *queryList({ payload }, { call, put }) {
      const ds = yield call(getDataDictTypes, payload);
      if (ds.success) {
        yield put({
          type: 'updateState',
          payload: {
            dataDictTypes: ds.data,
          },
        });
      } else {
        throw ds;
      }
      return ds;
    },
    *save({ payload }, { call, put }) {
      const re = yield call(save, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
      } else {
        message.error(re.message);
      }
      return re;
    },
    *del({ payload }, { call }) {
      const re = yield call(del, payload.id);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }

      return re;
    },
    *getDataDictItems({ payload }, { call, put }) {
      const re = yield call(getDataDictItems, payload);
      if (re.success) {
        const isPrivateDictItems = re.data.some(it => it.tenantPrivate);
        yield put({
          type: 'updateState',
          payload: {
            dataDictItems: re.data,
            isPrivateDictItems,
          },
        });
      } else {
        message.error(re.message);
      }
      return re;
    },
    *saveDictItem({ payload }, { call }) {
      const re = yield call(saveDictItem, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
      } else {
        message.error(re.message);
      }
      return re;
    },
    *deleteDictItem({ payload }, { call }) {
      const re = yield call(deleteDictItem, payload.id);
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      return re;
    },
    *privateDictItem({ payload }, { call }) {
      const re = yield call(privateDictItem, payload);
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      return re;
    },
  },
});
