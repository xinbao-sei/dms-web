import React from 'react';
import cls from 'classnames';
import { ExtIcon } from 'suid';

import styles from './index.less';

class Header extends React.Component {
  handleBack = () => {
    const { onBack } = this.props;
    if (onBack) {
      onBack();
    }
  };

  render() {
    const { dataModel } = this.props;

    return (
      <div className={cls(styles['ui-header'])}>
        <span className={cls('back-icon')}>
          <ExtIcon type="left" onClick={this.handleBack} antd />
        </span>
        {`模型【${dataModel.tableName}】对应的UI表单配置`}
      </div>
    );
  }
}

export default Header;