import React, { Component } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import { ProLayout } from 'suid';
import PageWrapper from '@/components/PageWrapper';
import ParentTable from './components/ParentTable';
import ChildTable from './components/ChildTable';

const { Header, Content, SiderBar } = ProLayout;

@withRouter
@connect(({ customer, loading }) => ({ customer, loading }))
class Customer extends Component {
  getRightCmp = () => {
    const { customer } = this.props;
    const { currPRowData } = customer;
    if (currPRowData) {
      return <ChildTable key={currPRowData.id} />;
    }

    return null;
  };

  render() {
    const { customer, loading } = this.props;
    const { currPRowData } = customer;

    return (
      <PageWrapper loading={loading.global}>
        <ProLayout>
          <SiderBar width={350} allowCollapse gutter={[0, 4]}>
            <ProLayout layout="column">
              <Header title="客户" />
              <Content>
                <ParentTable />
              </Content>
            </ProLayout>
          </SiderBar>
          <ProLayout layout="column">
            <Header title="配置公司" subTitle={currPRowData && currPRowData.name} />
            <Content empty={{ description: '请选择客户进行配置' }}>{this.getRightCmp()}</Content>
          </ProLayout>
        </ProLayout>
      </PageWrapper>
    );
  }
}

export default Customer;
