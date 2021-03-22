import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, Tag, Input, Tooltip } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { utils, ExtIcon, ListCard, ExtTable } from 'suid';
import { constants } from '@/utils';
import PopoverIcon from '@/components/PopoverIcon';
import FormModal from './FormModal';
import styles from './index.less';

const { Search } = Input;
const { APP_MODULE_BTN_KEY, SERVER_PATH } = constants;
const { authAction } = utils;

@connect(({ semanteme, loading }) => ({ semanteme, loading }))
class SemantemeTypeTable extends Component {
  state = {
    delRowId: null,
    selectedRowKeys: [],
  };

  add = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: 'semanteme/updateState',
      payload: {
        showModal: true,
        currDictType: null,
      },
    });
  };

  edit = (currDictType, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'semanteme/updateState',
      payload: {
        showModal: true,
        currDictType,
      },
    });
    e.stopPropagation();
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'semanteme/saveType',
      payload: {
        ...data,
      },
    }).then(res => {
      console.log(res, 'res');
      if (res.success) {
        dispatch({
          type: 'semanteme/updateState',
          payload: {
            showModal: false,
          },
        });
        this.reloadData();
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
          type: 'semanteme/delType',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            this.setState({
              delRowId: null,
            });
            this.reloadData();
          }
        });
      },
    );
  };

  closeFormModal = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: 'semanteme/updateState',
      payload: {
        showModal: false,
        showCopyModal: false,
        currDictType: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['semanteme/del'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return (
      <PopoverIcon
        onClick={e => e.stopPropagation()}
        tooltip={{ title: '删除' }}
        className="del"
        type="delete"
        antd
      />
    );
  };

  getFormModalProps = () => {
    const { loading, semanteme } = this.props;
    const { showModal, currDictType } = semanteme;
    return {
      save: this.save,
      rowData: currDictType,
      visible: showModal,
      onCancel: this.closeFormModal,
      saving: loading.effects['semanteme/save'],
    };
  };

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerSearch = () => {
    this.listCardRef.handlerSearch();
  };

  renderCustomTool = ({ total }) => {
    return (
      <>
        <div className="tool-bar-left">
          <Button type="link" icon="plus" onClick={this.add} ignore="true">
            <FormattedMessage id="global.add" defaultMessage="新建" />
          </Button>
        </div>
        <div>
          <Search
            placeholder="输入代码或名称关键字查询"
            onChange={e => this.handlerSearchChange(e.target.value)}
            onSearch={this.handlerSearch}
            onPressEnter={this.handlerSearch}
            style={{ width: 220 }}
          />
        </div>
      </>
    );
  };

  handlerDictTypeSelect = (keys, items) => {
    const { dispatch } = this.props;
    const currDictType = keys.length === 1 ? items[0] : null;
    dispatch({
      type: 'semanteme/updateState',
      payload: {
        currDictType,
      },
    });
    dispatch({
      type: 'semanteme/getDataDictItems',
      payload: {
        dataDictId: currDictType.id,
      },
    });
  };

  renderTitle = item => {
    return (
      <>
        {item.className}
        <span style={{ marginLeft: 8, fontSize: 12, color: '#999' }}>{item.propertyName}</span>
      </>
    );
  };

  renderItemAction = record => {
    return (
      <>
        <div className="tool-action" onClick={e => e.stopPropagation()}>
          {authAction(
            <PopoverIcon
              key={APP_MODULE_BTN_KEY.EDIT}
              className="action-item"
              onClick={e => this.edit(record, e)}
              type="edit"
              ignore="true"
              antd
            />,
          )}
          {record.frozen ? null : (
            <Popconfirm
              key={APP_MODULE_BTN_KEY.DELETE}
              placement="topLeft"
              title="确定要删除吗？"
              onCancel={e => e.stopPropagation()}
              onConfirm={e => {
                this.del(record);
                e.stopPropagation();
              }}
            >
              {this.renderDelBtn(record)}
            </Popconfirm>
          )}
        </div>
      </>
    );
  };

  getListCardProps = () => {
    const { semanteme } = this.props;
    const { currDictType } = semanteme;
    const selectedKeys = currDictType ? [currDictType.id] : [];
    return {
      className: 'left-content',
      showSearch: false,
      onSelectChange: this.handlerDictTypeSelect,
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
      selectedKeys,
      store: {
        url: `${SERVER_PATH}/sei-commons-data/semantemeType/findAll`,
      },
      itemField: {
        title: this.renderTitle,
        description: item => item.remark,
      },
      itemTool: this.renderItemAction,
    };
  };
  reloadData = _ => {
    this.tableRef && this.tableRef.remoteDataRefresh();
  };
  getExtableProps = () => {
    const { dispatch } = this.props;
    const columns = [
      {
        title: '操作',
        key: 'operation',
        width: 85,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (text, record) => {
          return (
            <>
              <div className="action-box" onClick={e => e.stopPropagation()}>
                {authAction(
                  <PopoverIcon
                    key={APP_MODULE_BTN_KEY.EDIT}
                    className="edit"
                    onClick={e => this.edit(record, e)}
                    type="edit"
                    ignore="true"
                    tooltip={{ title: '编辑' }}
                    antd
                  />,
                )}
                {record.frozen ? null : (
                  <Popconfirm
                    key={APP_MODULE_BTN_KEY.DELETE}
                    placement="topLeft"
                    title="确定要删除吗？"
                    onCancel={e => e.stopPropagation()}
                    onConfirm={e => {
                      this.del(record);
                      e.stopPropagation();
                    }}
                  >
                    {this.renderDelBtn(record)}
                  </Popconfirm>
                )}
              </div>
            </>
          );
        },
      },
      {
        title: '属性名',
        dataIndex: 'propertyName',
        width: 120,
        required: true,
      },
      {
        title: '描述',
        dataIndex: 'remark',
        width: 160,
        required: true,
        render: (text, record) => <Tooltip title={record.className}>{text}</Tooltip>,
      },
    ];

    const toolBarProps = {
      left: (
        <>
          {authAction(
            <Button key={APP_MODULE_BTN_KEY.CREATE} type="primary" onClick={this.add} ignore="true">
              <FormattedMessage id="global.add" defaultMessage="新建" />
            </Button>,
          )}
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    return {
      bordered: false,
      searchProperties: ['className', 'propertyName'],
      columns,
      toolBar: toolBarProps,
      onSelectRow: (_, selectedRows) => {
        dispatch({
          type: 'semanteme/updateState',
          payload: {
            currType: selectedRows[0],
          },
        });
      },
      store: {
        url: `${SERVER_PATH}/sei-commons-data/semantemeType/findAll`,
      },
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

export default SemantemeTypeTable;