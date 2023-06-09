import React, { Component, Fragment } from 'react';
import { Button, message, Descriptions, Dropdown, Menu } from 'antd';
import cls from 'classnames';
import { utils, ExtIcon, ProLayout } from 'suid';
import { isPlainObject, isArray, get } from 'lodash';
import TreeView from '@/components/TreeView';
import { constants } from '@/utils';
import ImportModal from './ImportModal';
import ExportModal from './ExportModal';
import FormModal from './FormModal';

import styles from './index.less';

const { SiderBar, Content } = ProLayout;
const { request } = utils;
const { MDMSCONTEXT } = constants;
const { Item: DescriptionItem } = Descriptions;

class ExtTreePreview extends Component {
  state = {
    importVisible: false,
    exportVisible: false,
    parentData: null,
    editData: null,
    selectedNode: null,
    showCreateModal: false,
    treeData: [],
    loading: {
      saving: false,
      finding: false,
      deling: false,
    },
  };

  componentDidMount() {
    this.findByTree();
  }

  toggleModalVisible = type => {
    this.setState(state => ({
      [type]: !state[type],
    }));
  };

  getImportModalProps = () => {
    const { importUiConfig, dataModel } = this.props;
    return {
      editData: dataModel,
      uiConfig: importUiConfig,
      onCancel: () => this.toggleModalVisible('importVisible'),
    };
  };

  getExportModalProps = () => {
    const { exportUiConfig } = this.props;

    return {
      uiConfig: exportUiConfig.filterFormCfg,
      onCancel: () => this.toggleModalVisible('exportVisible'),
    };
  };

  updateLoadingState = newLoading => {
    const { loading } = this.state;
    this.setState({
      loading: {
        ...loading,
        ...newLoading,
      },
    });
  };

  findByTree = () => {
    const { dataModelCode } = this.props;
    const url = `${MDMSCONTEXT}/${dataModelCode}/getMultipleRoots`;
    this.updateLoadingState({
      finding: true,
    });
    request({
      method: 'GET',
      url,
    })
      .then(result => {
        const { success, message: msg, data } = result;
        if (success) {
          this.setState({
            treeData: data,
          });
        } else {
          message.error(msg);
        }
      })
      .finally(() => {
        this.updateLoadingState({
          finding: false,
        });
      });
  };

  delById = id => {
    const { dataModelCode } = this.props;
    const url = `${MDMSCONTEXT}/${dataModelCode}/delete/${id}`;
    this.updateLoadingState({
      deling: true,
    });
    request({
      method: 'DELETE',
      url,
    })
      .then(result => {
        const { success, message: msg } = result;
        if (success) {
          this.findByTree();
        } else {
          message.error(msg);
        }
      })
      .finally(() => {
        this.updateLoadingState({
          deling: false,
        });
      });
  };

  handleCreateRootNode = () => {
    this.setState({
      editData: null,
      parentData: null,
      showCreateModal: true,
    });
  };

  handleCreateChildNode = parentData => {
    this.setState({
      parentData,
      editData: null,
      showCreateModal: true,
    });
  };

  handleEditTreeNode = editData => {
    this.setState({
      editData,
      parentData: null,
      showCreateModal: true,
    });
  };

  handleDel = delNode => {
    if (delNode) {
      this.delById(delNode.id);
    } else {
      message.warn('请选择要删除的节点！');
    }
  };

  handleSave = values => {
    const { dataModelCode } = this.props;
    const url = `${MDMSCONTEXT}/${dataModelCode}/save`;
    this.updateLoadingState({
      saving: true,
    });
    request({
      url,
      method: 'POST',
      data: values,
    })
      .then(result => {
        const { success, message: msg, data } = result;
        const { selectedNode } = this.state;
        if (success) {
          this.findByTree();
          message.success(msg);
          this.setState({
            showCreateModal: false,
            selectedNode: selectedNode && selectedNode.id === data.id ? data : selectedNode,
          });
        } else {
          message.error(msg);
        }
      })
      .finally(() => {
        this.updateLoadingState({
          saving: false,
        });
      });
  };

  handleCancel = () => {
    this.setState({
      showCreateModal: false,
    });
  };

  getDownloadMenu = () => {
    const { importUiConfig, exportUiConfig } = this.props;
    if (importUiConfig || exportUiConfig) {
      return (
        <Dropdown
          overlay={
            <Menu>
              {importUiConfig ? (
                <Menu.Item>
                  <Button type="link" onClick={() => this.toggleModalVisible('importVisible')}>
                    导入
                  </Button>
                </Menu.Item>
              ) : null}
              {exportUiConfig ? (
                <Menu.Item>
                  <Button type="link" onClick={() => this.toggleModalVisible('exportVisible')}>
                    导出
                  </Button>
                </Menu.Item>
              ) : null}
            </Menu>
          }
        >
          <span className={cls('icon-wrapper')}>
            <ExtIcon type="more" antd />
          </span>
        </Dropdown>
      );
    }

    return null;
  };

  getToolBarProps = () => ({
    left: (
      <Fragment>
        <Button onClick={this.handleCreateRootNode} type="primary">
          创建根结点
        </Button>
        {this.getDownloadMenu()}
      </Fragment>
    ),
  });

  getModalProps = () => {
    const { formUiConfig } = this.props;
    const { parentData, editData, showCreateModal, loading } = this.state;
    // 默认创建子节点
    let uiIndex = 1;
    // 编辑子节点
    if (editData) {
      uiIndex = 2;
    }
    // 创建根结点
    if (!parentData && !editData) {
      uiIndex = 3;
    }

    return {
      parentData,
      editData,
      formUiConfig: {
        ...formUiConfig,
        ...{ formItems: formUiConfig.formItems.map(it => [it[0], it[uiIndex]]) },
      },
      saving: loading.saving,
      onSave: this.handleSave,
      visible: showCreateModal,
      onCancel: this.handleCancel,
    };
  };

  handleSelect = ([selectedNode]) => {
    this.setState({
      selectedNode,
    });
  };

  render() {
    const { showCreateModal, treeData, selectedNode, importVisible, exportVisible } = this.state;
    const { treeUiConfig, formUiConfig } = this.props;
    const { detailFields = [], column } = treeUiConfig || {};
    const canCreateRoot = get(formUiConfig, 'canCreateRoot', false);

    return (
      <div className={cls(styles['ext-tree-preview'])}>
        <ProLayout>
          <SiderBar width={300} gutter={[0, 4]}>
            <TreeView
              slotClassName={cls('slot-col-wrapper')}
              toolBar={canCreateRoot ? this.getToolBarProps() : null}
              treeData={treeData}
              onSelect={this.handleSelect}
              iconOpts={
                formUiConfig
                  ? [
                      {
                        icon: 'plus',
                        title: '新增子节点',
                        onClick: this.handleCreateChildNode,
                      },
                      {
                        icon: 'edit',
                        title: '编辑',
                        onClick: this.handleEditTreeNode,
                      },
                      {
                        icon: 'delete',
                        title: '删除',
                        onClick: this.handleDel,
                        isDel: true,
                      },
                    ]
                  : []
              }
            />
          </SiderBar>
          <Content
            empty={{
              description: '请选择结点查看更详细的信息',
            }}
          >
            {selectedNode && (
              <div className={cls('detail-wrapper')}>
                <Descriptions column={column} title={`${selectedNode.name}详情`}>
                  {detailFields.map(item => {
                    const { code, name } = item;
                    return (
                      <DescriptionItem key={code} label={name}>
                        {!isArray(selectedNode[code]) && !isPlainObject(selectedNode[code])
                          ? selectedNode[code]
                          : JSON.stringify(selectedNode[code])}
                      </DescriptionItem>
                    );
                  })}
                </Descriptions>
              </div>
            )}
          </Content>
        </ProLayout>
        {showCreateModal ? <FormModal {...this.getModalProps()} /> : null}
        {importVisible ? <ImportModal {...this.getImportModalProps()} /> : null}
        {exportVisible ? <ExportModal {...this.getExportModalProps()} /> : null}
      </div>
    );
  }
}

export default ExtTreePreview;
