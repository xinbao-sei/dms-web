import React from 'react';
import { ExtTable } from 'suid';
import { isEmpty } from 'lodash';
import formatters from './formatter';

class ExtTablePreview extends React.Component {
  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  getExtTableProps = () => {
    const { tableUiConfig = { columns: [] }, store, tableProps } = this.props;
    if (!tableProps) {
      const { columns } = tableUiConfig;
      const tempPlaceHolder = [];
      const searchProperties = [];
      const sortField = {};
      columns.forEach(it => {
        const { title, canSearch, dataIndex, formatter, sort } = it;
        if (canSearch) {
          tempPlaceHolder.push(title);
          searchProperties.push(dataIndex);
        }
        if (formatter) {
          Object.assign(it, {
            render: formatters[formatter],
          });
        }
        if (sort) {
          sortField[dataIndex] = 'asc';
        }
      });
      Object.assign(tableUiConfig, {
        searchPlaceHolder: `请输入${tempPlaceHolder.join(',')}关键字进行查询`,
        searchProperties,
        sort: !isEmpty(sortField)
          ? {
              multiple: true,
              field: sortField,
            }
          : null,
      });

      tableUiConfig.store = store;

      return tableUiConfig;
    }
    const { columns: tempColumns } = tableProps;
    tempColumns.forEach(item => {
      const { formatter, render } = item;
      if (formatter && !render) {
        Object.assign(item, {
          render: formatters[formatter],
        });
      }
    });
    return tableProps;
  };

  render() {
    return <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtTableProps()} />;
  }
}

export default ExtTablePreview;
