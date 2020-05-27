import React, { useEffect } from 'react';
import ProLayout, { MenuDataItem } from '@ant-design/pro-layout';
import { ConnectRC, GlobalModelState, connect, Link, useIntl, IntlShape } from 'alita';

import { SmileOutlined, HeartOutlined } from '@ant-design/icons';
import {
  HeaderSearch,
  AvatarDropdown,
  SelectLang,
  NoticeIconView,
  WithExceptionOpChildren,
} from '@/components';
import { transformRoute } from '@umijs/route-utils';
import { LanguageItem } from '@/components/SelectLang';
import { NoticeItem } from '@/components/NoticeIconView';
import accessFactory from '@/access';
import { traverseModifyRoutes } from '@/utils/runtimeUtil';

import logo from '../assets/logo.png';

import styles from './index.less';

const IconMap = {
  smile: <SmileOutlined />,
  heart: <HeartOutlined />,
};

// 替换服务端数据中的icon
const loopMenuItem = (menus: MenuDataItem[], intl: IntlShape): MenuDataItem[] =>
  menus.map(({ icon, children, ...item }) => ({
    ...item,
    // name: intl.formatMessage(
    //   {
    //     id: item.name,
    //     defaultMessage: item.name,
    //   },
    // ),
    icon: icon && IconMap[icon as string],
    children: children && loopMenuItem(children, intl),
  }));

const headSearchDataList = [
  {
    label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>,
    value: 'umi ui',
  },
  {
    label: <a href="next.ant.design">Ant Design</a>,
    value: 'Ant Design',
  },
  {
    label: <a href="https://protable.ant.design/">Pro Table</a>,
    value: 'Pro Table',
  },
  {
    label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
    value: 'Pro Layout',
  },
];
export type SiderTheme = 'light' | 'dark';
interface SearchDataItem {
  label: Element | JSX.Element;
  value: string;
}
export interface RightContentProps {
  theme?: SiderTheme;
  layout?: 'sidemenu' | 'topmenu';
  language?: LanguageItem[];
  headSearchData?: SearchDataItem[];
  notices?: NoticeItem[];
}

const RightContent: React.SFC<RightContentProps> = (props) => {
  const { theme = 'dark', layout = 'sidemenu', language, headSearchData, notices = [] } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <div className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        defaultValue="umi ui"
        options={headSearchData}
        // onSearch={value => {
        //   //console.log('input', value);
        // }}
      />
      <NoticeIconView notices={notices} />
      <AvatarDropdown
        currentUser={{
          name: 'Serati Ma',
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          userid: '00000001',
        }}
      />
      <SelectLang className={styles.action} language={language} />
    </div>
  );
};
interface PageProps {
  global: GlobalModelState;
}

const BasicLayout: ConnectRC<PageProps> = ({ children, dispatch, global, location }) => {
  const pathName = location.pathname;
  const intl = useIntl();
  const access = accessFactory({
    currentUser: {
      access: 'admin',
    },
  });
  useEffect(() => {
    dispatch!({
      type: 'global/menu',
    });
    dispatch!({
      type: 'global/fetchNotices',
    });
  }, []);
  const serveMenuData = [
    {
      path: '/',
      name: 'index',
      icon: 'smile',
    },
    {
      path: '/ListTableList',
      name: 'list',
      icon: 'smile',
      hideInMenu: true,
      access: 'canAdmin',
    },
  ];
  const accrssMenu = traverseModifyRoutes(serveMenuData, access);
  const { menuData, breadcrumb } = transformRoute(accrssMenu, true, intl.formatMessage, false);
  const currentPathConfig = breadcrumb.get(pathName);
  console.log(menuData);
  console.log(currentPathConfig);
  const language = [
    {
      key: 'zh-CN',
      label: '简体中文',
      icon: '🇨🇳',
    },
    {
      key: 'en-US',
      label: 'English',
      icon: '🇺🇸',
    },
  ];
  const { notices } = global;
  return (
    <ProLayout
      title="Demo"
      logo={logo}
      // menuHeaderRender={() => null}
      location={location}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      menuDataRender={() => loopMenuItem(menuData as MenuDataItem[], intl)}
      rightContentRender={() => (
        <RightContent headSearchData={headSearchDataList} language={language} notices={notices} />
      )}
    >
      <div
        style={{
          height: '100vh',
        }}
      >
        <WithExceptionOpChildren currentPathConfig={currentPathConfig}>
          {children}
        </WithExceptionOpChildren>
      </div>
    </ProLayout>
  );
};

export default connect(({ global }: { global: GlobalModelState }) => ({
  global,
  notices: global.notices,
}))(BasicLayout);
