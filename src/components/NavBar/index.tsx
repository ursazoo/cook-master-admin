import React, { useContext, useEffect } from 'react';
import {
  Tooltip,
  Avatar,
  Select,
  Dropdown,
  Menu,
  Divider,
  Message,
} from '@arco-design/web-react';
import {
  IconLanguage,
  IconSunFill,
  IconMoonFill,
  IconUser,
  IconSettings,
  IconPoweroff,
  IconExperiment,
  IconDashboard,
  IconInteraction,
  IconTag,
} from '@arco-design/web-react/icon';
import { useSelector, useDispatch } from 'react-redux';
// import { GlobalState } from '@/store';
import { GlobalContext } from '@/context';
import useLocale from '@/utils/useLocale';
import Logo from '@/assets/logo.svg';
import IconButton from './IconButton';
import styles from './style/index.module.less';
import defaultLocale from '@/locale';
import useStorage from '@/utils/useStorage';
import { generatePermission } from '@/routes';
import { useHistory } from 'react-router';
import { selectUserInfo, setPermissions } from '@/store/userSlice';

function Navbar({ show }: { show: boolean }) {
  const history = useHistory();
  const t = useLocale();
  const userInfo = useSelector(selectUserInfo);

  const dispatch = useDispatch();

  const [_, setUserStatus] = useStorage('userStatus');
  const [role, setRole] = useStorage('userRole', 'admin');

  const { setLang, lang, theme, setTheme } = useContext(GlobalContext);

  function logout() {
    setUserStatus('logout');
    window.location.href = '/signin';
  }

  function onMenuItemClick(key) {
    switch (key) {
      case 'setting':
        history.push('/user/setting');
        break;
      case 'logout':
        logout();
        break;
      default:
        Message.info(`You clicked ${key}`);
    }
  }

  useEffect(() => {
    dispatch(setPermissions(generatePermission(role)));
  }, [role]);

  const handleChangeRole = () => {
    const newRole = role === 'admin' ? 'user' : 'admin';
    setRole(newRole);
  };

  const droplist = (
    <Menu onClickMenuItem={onMenuItemClick}>
      <Menu.SubMenu
        key="role"
        title={
          <>
            <IconUser className={styles['dropdown-icon']} />
            <span className={styles['user-role']}>
              {role === 'admin'
                ? t['menu.user.role.admin']
                : t['menu.user.role.user']}
            </span>
          </>
        }
      >
        <Menu.Item onClick={handleChangeRole} key="switch role">
          <IconTag className={styles['dropdown-icon']} />
          {t['menu.user.switchRoles']}
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="setting">
        <IconSettings className={styles['dropdown-icon']} />
        {t['menu.user.setting']}
      </Menu.Item>
      <Menu.SubMenu
        key="more"
        title={
          <div style={{ width: 80 }}>
            <IconExperiment className={styles['dropdown-icon']} />
            {t['message.seeMore']}
          </div>
        }
      >
        <Menu.Item key="workplace">
          <IconDashboard className={styles['dropdown-icon']} />
          {t['menu.dashboard.workplace']}
        </Menu.Item>
        <Menu.Item key="card list">
          <IconInteraction className={styles['dropdown-icon']} />
          {t['menu.list.cardList']}
        </Menu.Item>
      </Menu.SubMenu>

      <Divider style={{ margin: '4px 0' }} />
      <Menu.Item key="logout">
        <IconPoweroff className={styles['dropdown-icon']} />
        {t['navbar.logout']}
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <Logo />
          <div className={styles['logo-name']}>Cook Master</div>
        </div>
      </div>
      <ul className={styles.right}>
        {/* 搜索 */}
        {/* <li>
          <Input.Search
            className={styles.round}
            placeholder={t['navbar.search.placeholder']}
          />
        </li> */}

        {/* 国际化 */}
        <li>
          <Select
            triggerElement={<IconButton icon={<IconLanguage />} />}
            options={[
              { label: '中文', value: 'zh-CN' },
              { label: 'English', value: 'en-US' },
            ]}
            value={lang}
            triggerProps={{
              autoAlignPopupWidth: false,
              autoAlignPopupMinWidth: true,
              position: 'br',
            }}
            trigger="hover"
            onChange={(value) => {
              setLang(value);
              const nextLang = defaultLocale[value];
              Message.info(`${nextLang['message.lang.tips']}${value}`);
            }}
          />
        </li>

        {/* 通知 */}
        {/* <li>
          <MessageBox>
            <IconButton icon={<IconNotification />} />
          </MessageBox>
        </li> */}
        <li>
          <Tooltip
            content={
              theme === 'light'
                ? t['settings.navbar.theme.toDark']
                : t['settings.navbar.theme.toLight']
            }
          >
            <IconButton
              icon={theme !== 'dark' ? <IconMoonFill /> : <IconSunFill />}
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            />
          </Tooltip>
        </li>
        {userInfo && (
          <li>
            <Dropdown droplist={droplist} position="br" disabled={false}>
              <Avatar size={32} style={{ cursor: 'pointer' }}>
                {userInfo.avatar ? (
                  <img alt="avatar" src={userInfo.avatar} />
                ) : (
                  userInfo.name
                )}
              </Avatar>
            </Dropdown>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
