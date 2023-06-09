import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, message, Tag } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { ExtTable, ExtIcon } from 'suid';
import { userUtils } from '@/utils';
import PopoverIcon from '@/components/PopoverIcon';
import FormModal from './FormModal';
import styles from '../../index.less';

const { getCurrentUser } = userUtils;

@connect(({ dataDict, loading }) => ({ dataDict, loading }))
class DataDictTypeTable extends Component {
  state = {
    delRowId: null,
    showModal: false,
    rowData: null,
  };

  reloadData = _ => {
    const { dispatch, dataDict } = this.props;
    const { currDictType } = dataDict;
    if (currDictType) {
      dispatch({
        type: 'dataDict/getDataDictItems',
        payload: {
          dataDictId: currDictType && currDictType.id,
        },
      });
    } else {
      message.warn('请选择数据字典');
    }
  };

  add = _ => {
    const { dataDict } = this.props;
    const { currDictType } = dataDict;
    if (currDictType) {
      this.setState({
        showModal: true,
        rowData: null,
      });
    } else {
      message.warn('请选数据字典');
    }
  };

  edit = rowData => {
    this.setState({
      showModal: true,
      rowData,
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataDict/saveDictItem',
      payload: {
        ...data,
      },
    }).then(res => {
      if (res.success) {
        this.setState(
          {
            showModal: false,
          },
          () => {
            this.reloadData();
          },
        );
      }
    });
  };

  del = record => {
    const { dispatch } = this.props;
    this.setState(
      {
        delRowId: record.id,
      },
      _ => {
        dispatch({
          type: 'dataDict/deleteDictItem',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            this.setState(
              {
                delRowId: null,
              },
              () => {
                this.reloadData();
              },
            );
          }
        });
      },
    );
  };

  handlePrivate = action => {
    const { dispatch, dataDict } = this.props;
    const { currDictType } = dataDict;
    if (currDictType) {
      dispatch({
        type: 'dataDict/privateDictItem',
        payload: {
          dictId: currDictType.id,
          action,
        },
      }).then(({ success }) => {
        if (success) {
          this.reloadData();
        }
      });
    } else {
      message.warn('请选择数据字典');
    }
  };

  closeFormModal = _ => {
    this.setState({
      showModal: false,
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['dataDict/del'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return <PopoverIcon tooltip={{ title: '删除' }} className="del" type="delete" antd />;
  };

  getExtableProps = () => {
    const { loading, dataDict } = this.props;
    const { dataDictItems, isPrivateDictItems } = dataDict;
    const userInfo = getCurrentUser();
    const { authorityPolicy } = userInfo || {};
    const isGlobalAdmin = authorityPolicy === 'GlobalAdmin';
    const isTenantAdmin = authorityPolicy === 'TenantAdmin';
    const optColumn = {
      title: formatMessage({ id: 'global.operation', defaultMessage: '操作' }),
      key: 'operation',
      width: 150,
      align: 'center',
      dataIndex: 'id',
      className: 'action',
      required: true,
      render: (_, record) => (
        <span className={cls('action-box')}>
          <PopoverIcon
            key="edit"
            className="edit"
            onClick={_ => this.edit(record)}
            type="edit"
            tooltip={{ title: '编辑' }}
            ignore="true"
            antd
          />
          <Popconfirm
            key="del"
            placement="topLeft"
            title={formatMessage({
              id: 'global.delete.confirm',
              defaultMessage: '确定要删除吗？提示：删除后不可恢复',
            })}
            onConfirm={_ => this.del(record)}
          >
            {this.renderDelBtn(record)}
          </Popconfirm>
        </span>
      ),
    };

    const columns = [
      {
        title: '展示值',
        dataIndex: 'dataName',
        width: 180,
        required: true,
      },
      {
        title: '使用值',
        dataIndex: 'dataValue',
        width: 120,
        required: true,
      },
      {
        title: '描述',
        dataIndex: 'remark',
        width: 180,
        required: true,
      },
      {
        title: '冻结',
        dataIndex: 'frozen',
        width: 80,
        required: true,
        render: text => {
          return <Tag color={text ? 'red' : 'green'}>{text ? '冻结' : '可用'}</Tag>;
        },
      },
    ];

    const extraBtns = [];
    let addBtn = null;
    if (isGlobalAdmin || (isTenantAdmin && isPrivateDictItems)) {
      columns.unshift(optColumn);
      addBtn = (
        <Button key="add" type="primary" onClick={this.add} ignore="true">
          <FormattedMessage id="global.add" defaultMessage="新建" />
        </Button>
      );
    }

    if (isTenantAdmin && !isPrivateDictItems) {
      extraBtns.push(
        <Popconfirm
          key="private"
          placement="topLeft"
          title="是否私有？"
          onConfirm={_ => {
            this.handlePrivate('true');
          }}
        >
          <Button key="private" ignore="true">
            转为私有
          </Button>
        </Popconfirm>,
      );
    }

    if (isTenantAdmin && isPrivateDictItems) {
      extraBtns.push(
        <Popconfirm
          key="private"
          placement="topLeft"
          title="是否取消私有？"
          onConfirm={_ => {
            this.handlePrivate('false');
          }}
        >
          <Button key="private" ignore="true">
            取消私有
          </Button>
        </Popconfirm>,
      );
    }

    const toolBarProps = {
      left: (
        <Fragment>
          {addBtn}
          {extraBtns}
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </Fragment>
      ),
    };
    return {
      bordered: false,
      searchProperties: ['dataName', 'tenantCode', 'dataValue'],
      columns,
      loading: loading.effects['dataDict/getDataDictItems'],
      toolBar: toolBarProps,
      dataSource: dataDictItems,
    };
  };

  getFormModalProps = () => {
    const { loading, dataDict } = this.props;
    const { currDictType } = dataDict;
    const { showModal, rowData } = this.state;
    return {
      save: this.save,
      dictType: currDictType,
      rowData: rowData,
      visible: showModal,
      onCancel: this.closeFormModal,
      saving: loading.effects['dataDict/saveDictItem'],
    };
  };

  render() {
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        <FormModal {...this.getFormModalProps()} />
      </div>
    );
  }
}

export default DataDictTypeTable;
