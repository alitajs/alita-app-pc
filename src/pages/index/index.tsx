import React, { FC, useEffect } from 'react';
import { IndexModelState, ConnectProps, connect } from 'alita';
import styles from './index.less';

interface PageProps extends ConnectProps {
  index: IndexModelState;
}

const IndexPage: FC<PageProps> = ({ index, dispatch }) => {
  // const intl = useIntl();
  const { name } = index;
  useEffect(() => {
    dispatch!({
      type: 'index/query',
    });
  }, []);
  return (
    <div className={styles.center}>
      {/* {intl.formatMessage(
        {
          id: 'WELCOME_WORLD',
          defaultMessage: '你好，旅行者',
        },
        {
          name: '旅行者',
        },
      )} */}
      {name}
    </div>
  );
};

export default connect(({ index }: { index: IndexModelState }) => ({ index }))(IndexPage);
