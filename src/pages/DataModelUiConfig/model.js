/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-08-06 11:27:08
 */
import { message } from 'antd';
import { utils } from 'suid';
import { delParentRow, saveParent, saveChild, delChildRow, getByDataModalId } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

// semanteme

export default modelExtend(model, {
  namespace: 'dataModelUiConfig',

  state: {
    currPRowData: null,
    currCRowData: null,
    isAddP: false,
    pVisible: false,
    cVisible: false,
    vTableUiConfig: false,
    vFormUiConfig: false,
    modelUiConfig: null,
  },
  effects: {
    *updatePageState({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload,
      });

      return payload;
    },
    *saveChild({ payload }, { call }) {
      const result = yield call(saveChild, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *saveParent({ payload }, { call }) {
      const result = yield call(saveParent, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *delPRow({ payload }, { call }) {
      const result = yield call(delParentRow, payload);
      const { message: msg, success } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *delCRow({ payload }, { call }) {
      const result = yield call(delChildRow, payload);
      const { message: msg, success } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *getByDataModalId({ payload }, { call, put }) {
      const result = yield call(getByDataModalId, payload);
      const { message: msg, success, data: modelUiConfig } = result || {};

      message.destroy();
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            modelUiConfig,
          },
        });
      } else {
        message.error(msg);
      }

      return result;
    },
  },
});
