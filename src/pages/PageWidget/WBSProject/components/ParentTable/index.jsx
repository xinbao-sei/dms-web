import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Input, Button, Tag, Popconfirm } from 'antd';
import { get } from 'lodash';
import { ListCard, ExtIcon } from 'suid';
import Space from '@/components/Space';
import PopoverIcon from '@/components/PopoverIcon';
import { constants } from '@/utils';
import FormPopover from './FormPopover';
import styles from './index.less';

// const { authAction } = utils;
const { Search } = Input;
const { BASICCONTEXT } = constants;

@connect(({ wbsProject, loading }) => ({ wbsProject, loading }))
class ParentTable extends Component {
  state = {
    delRowId: null,
  };

  reloadData = () => {
    if (this.listCardRef) {
      this.listCardRef.remoteDataRefresh();
    }
  };

  handlerPressEnter = () => {
    this.listCardRef.handlerPressEnter();
  };

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerSearch = v => {
    this.listCardRef.handlerSearch(v);
  };

  handleSave = (data, cb) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wbsProject/saveParent',
      payload: data,
    }).then(result => {
      const success = get(result, 'success');
      if (success) {
        cb(false);
        this.reloadData();
      }
    });
  };

  getCustomTool = () => {
    const { loading } = this.props;
    return (
      <>
        {/* <FormPopover
          onSave={this.handleSave}
          isSaving={loading.effects['wbsProject/saveParent']}
        >
          <Button type="link">
            <ExtIcon type="plus" antd /> 新增
          </Button>
        </FormPopover> */}
        <div style={{ flex: 1 }}>
          <Search
            placeholder="请输入名称或代码查询"
            onChange={e => this.handlerSearchChange(e.target.value)}
            onSearch={this.handlerSearch}
            onPressEnter={this.handlerPressEnter}
            style={{ width: '100%' }}
          />
        </div>
      </>
    );
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['wbsProject/delPRow'] && delRowId === row.id) {
      return <PopoverIcon className="del-loading" type="loading" antd />;
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

  del = record => {
    const { dispatch, wbsProject } = this.props;
    const { currPRowData } = wbsProject;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'wbsProject/delPRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currPRowData && currPRowData.id === record.id) {
              dispatch({
                type: 'wbsProject/updatePageState',
                payload: {
                  currPRowData: null,
                },
              }).then(() => {
                this.setState({
                  delRowId: null,
                });
              });
            } else {
              this.setState({
                delRowId: null,
              });
            }
            this.reloadData();
          }
        });
      },
    );
  };

  getListCardProps = () => {
    const { dispatch } = this.props;

    return {
      showArrow: false,
      showSearch: false,
      store: {
        type: 'GET',
        url: `${BASICCONTEXT}/corporation/findAllUnfrozen`,
      },
      // remotePaging: true,
      onSelectChange: (_, [selectedItem]) => {
        dispatch({
          type: 'wbsProject/updatePageState',
          payload: {
            currPRowData: selectedItem,
          },
        });
        // .then(() => {
        //   dispatch({
        //     type: 'wbsProject/getConfigById',
        //     payload: {
        //       id: selectedItem.id,
        //     },
        //   });
        // });
      },
      searchProperties: ['code', 'name'],
      itemField: {
        title: item => (
          <>
            {`${item.name} `}
            {item.frozen ? <Tag color="red">冻结</Tag> : null}
          </>
        ),
        description: item => item.code,
        // extra: item => {
        //   return (
        //     <Space>
        //       <FormPopover
        //         onSave={this.handleSave}
        //         isSaving={loading.effects['wbsProject/saveParent']}
        //         editData={item}
        //       >
        //         <PopoverIcon type="edit" tooltip={{ title: '编辑' }} antd />
        //       </FormPopover>
        //       <Popconfirm
        //         key="delete"
        //         placement="topLeft"
        //         title="删除后不可恢复，确定要删除吗？"
        //         onCancel={e => e.stopPropagation()}
        //         onConfirm={e => {
        //           this.del(item);
        //           e.stopPropagation();
        //         }}
        //       >
        //         {this.renderDelBtn(item)}
        //       </Popconfirm>
        //     </Space>
        //   );
        // },
      },
      onListCardRef: ref => (this.listCardRef = ref),
      customTool: this.getCustomTool,
    };
  };

  render() {
    return (
      <div className={cls(styles['container-box'])}>
        <ListCard {...this.getListCardProps()} />
      </div>
    );
  }
}

export default ParentTable;
