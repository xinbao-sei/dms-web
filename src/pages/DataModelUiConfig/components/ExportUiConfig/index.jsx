import React, { Component } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import { Tabs } from 'antd';
import { get, isEqual, cloneDeep } from 'lodash';
import ExtFormRender from '@/components/ExtFormRender';
import ExtExportPriview from '@/components/ExtExportPriview';
import PageWrapper from '@/components/PageWrapper';
import Header from './components/Header';
import LeftSiderbar from './components/LeftSiderbar';
import RightSiderbar from './components/RightSiderbar';

import styles from './index.less';

const { TabPane } = Tabs;

@connect(({ dataModelUiConfig, loading }) => ({ dataModelUiConfig, loading }))
class ExportUiConfig extends Component {
  constructor(props) {
    super(props);
    const { dataModelUiConfig } = this.props;
    const { modelUiConfig } = dataModelUiConfig;
    const exportUiConfig = JSON.parse(
      get(
        modelUiConfig,
        'Export',
        JSON.stringify({
          filterFormCfg: {
            column: 1,
            displayType: 'column',
            labelWidth: 80,
            formItems: [],
          },
          colItems: [],
        }),
      ),
    );
    this.state = {
      exportUiConfig,
      oldExportUiConfig: cloneDeep(exportUiConfig),
    };
  }

  handleBack = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelUiConfig/updatePageState',
      payload: {
        vExportUiConfig: false,
      },
    });
  };

  handleFormItemChange = formItems => {
    const { exportUiConfig = {} } = this.state;
    Object.assign(exportUiConfig.filterFormCfg, { formItems });
    this.setState({
      exportUiConfig,
    });
  };

  handleDelFormItem = col => {
    const { exportUiConfig = {} } = this.state;
    const { formItems = [] } = exportUiConfig.filterFormCfg;
    const tempFormItems = formItems.filter(item => item[0].code !== col[0].code);
    Object.assign(exportUiConfig.filterFormCfg, { formItems: tempFormItems });
    this.setState({
      exportUiConfig,
    });
  };

  handleEditFormItem = col => {
    const { exportUiConfig = {} } = this.state;
    const { formItems = [] } = exportUiConfig.filterFormCfg;

    const tempColumns = formItems.map(item => {
      if (item[0].code !== col[0].code) {
        return item;
      }
      return col;
    });
    Object.assign(exportUiConfig.filterFormCfg, { formItems: tempColumns });
    this.setState({
      exportUiConfig,
    });
  };

  handleColItemChange = colItems => {
    const { exportUiConfig = {} } = this.state;
    Object.assign(exportUiConfig, { colItems });
    this.setState({
      exportUiConfig,
    });
  };

  handleDelColItem = col => {
    const { exportUiConfig = {} } = this.state;
    const { colItems = [] } = exportUiConfig;
    const tempColItems = colItems.filter(item => item.orgin.code !== col.orgin.code);
    Object.assign(exportUiConfig, { colItems: tempColItems });
    this.setState({
      exportUiConfig,
    });
  };

  handleEditColItem = item => {
    const { exportUiConfig = {} } = this.state;
    const { colItems = [] } = exportUiConfig;
    const tempColItems = colItems.map(it => {
      if (item.orgin.code === it.orgin.code) {
        return item;
      }
      return it;
    });
    Object.assign(exportUiConfig, { colItems: tempColItems });
    this.setState({
      exportUiConfig,
    });
  };

  handleFilterUiCfgChange = props => {
    const { exportUiConfig = {} } = this.state;
    Object.assign(exportUiConfig.filterFormCfg, props);
    this.setState({
      exportUiConfig,
    });
  };

  handleSave = () => {
    const { dispatch, dataModelUiConfig } = this.props;
    const { modelUiConfig, currPRowData } = dataModelUiConfig;
    const { exportUiConfig } = this.state;
    const data = {
      configData: JSON.stringify(exportUiConfig),
      configType: 'Export',
      dataDefinitionId: currPRowData.id,
    };

    this.setState({
      oldExportUiConfig: cloneDeep(exportUiConfig),
    });
    dispatch({
      type: 'dataModelUiConfig/saveModelUiConfig',
      payload: {
        modelUiConfig: Object.assign(modelUiConfig, { Export: data.configData }),
        data,
      },
    });
  };

  render() {
    const { dataModelUiConfig, loading } = this.props;
    const { currPRowData } = dataModelUiConfig;
    const { exportUiConfig, oldExportUiConfig } = this.state;

    return (
      <PageWrapper loading={loading.global}>
        <div className={cls(styles['visual-page-config'])}>
          <div className={cls('config-header')}>
            <Header
              hasUpdate={!isEqual(exportUiConfig, oldExportUiConfig)}
              onSave={this.handleSave}
              onBack={this.handleBack}
              dataModel={currPRowData}
            />
          </div>
          <div className={cls('config-left-siderbar')}>
            <LeftSiderbar
              onFormItemChange={this.handleFormItemChange}
              dataModel={currPRowData}
              onSave={this.handleSave}
              uiConfig={exportUiConfig}
              onUiCfgChange={this.handleFilterUiCfgChange}
              onDelFormItem={this.handleDelFormItem}
              onEditFormItem={this.handleEditFormItem}
            />
          </div>
          <div className={cls('config-content')}>
            <RightSiderbar
              onItemChange={this.handleColItemChange}
              onDelItem={this.handleDelColItem}
              onEditItem={this.handleEditColItem}
              uiConfig={exportUiConfig}
              dataModel={currPRowData}
            />
          </div>
          <div className={cls('config-right-siderbar')}>
            <Tabs>
              <TabPane tab="过滤表单预览" key="1">
                <ExtFormRender
                  uiConfig={{
                    ...exportUiConfig.filterFormCfg,
                    ...{
                      formItems: exportUiConfig.filterFormCfg.formItems.map(it => [it[0], it[1]]),
                    },
                  }}
                />
              </TabPane>
              <TabPane tab="导出列预览" key="2">
                <ExtExportPriview colItems={get(exportUiConfig, 'colItems', [])} />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </PageWrapper>
    );
  }
}

export default ExportUiConfig;
