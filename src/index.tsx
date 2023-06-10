import './style/global.less';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { ConfigProvider } from '@arco-design/web-react';
import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import store from './store';
import PageLayout from './layout';
import { GlobalContext } from './context';
import Signin from './pages/signin';
import Signup from './pages/signup';
import checkLogin from './utils/checkLogin';
import changeTheme from './utils/changeTheme';
import useStorage from './utils/useStorage';

// const store = createStore(rootReducer);

function Index() {
  const [lang, setLang] = useStorage('arco-lang', 'en-US');
  const [theme, setTheme] = useStorage('arco-theme', 'light');

  // function fetchUserInfo() {
  //   store.dispatch({
  //     type: 'update-userInfo',
  //     payload: { userLoading: true },
  //   });
  //   axios.get('/api/user/userInfo').then((res) => {
  //     store.dispatch({
  //       type: 'update-userInfo',
  //       payload: { userInfo: res.data, userLoading: false },
  //     });
  //   });
  // }

  // useEffect(() => {
  //   if (checkLogin()) {
  //     fetchUserInfo();
  //   } else if (
  //     window.location.pathname.replace(/\//g, '') !== 'signin' &&
  //     window.location.pathname.replace(/\//g, '') !== 'signup'
  //   ) {
  //     window.location.pathname = '/signin';
  //   }
  // }, []);

  useEffect(() => {
    changeTheme(theme);
  }, [theme]);

  const contextValue = {
    lang,
    setLang,
    theme,
    setTheme,
  };

  return (
    <BrowserRouter>
      <ConfigProvider
        locale={zhCN}
        componentConfig={{
          Card: {
            bordered: false,
          },
          List: {
            bordered: false,
          },
          Table: {
            border: false,
          },
        }}
      >
        <Provider store={store}>
          <GlobalContext.Provider value={contextValue}>
            <Switch>
              <Route path="/signup" component={Signup} />
              <Route path="/signin" component={Signin} />
              <Route path="/" component={PageLayout} />
            </Switch>
          </GlobalContext.Provider>
        </Provider>
      </ConfigProvider>
    </BrowserRouter>
  );
}

ReactDOM.render(<Index />, document.getElementById('root'));
