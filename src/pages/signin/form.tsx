import {
  Form,
  Input,
  Checkbox,
  Link,
  Button,
  Space,
  Message,
} from '@arco-design/web-react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { IconLock, IconUser } from '@arco-design/web-react/icon';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useStorage from '@/utils/useStorage';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/index.module.less';
import { useRequest } from 'ahooks';
import { signin } from '@/common/apis/user/sign';
import Cookies from 'js-cookie';

export default function LoginForm() {
  const history = useHistory();
  const formRef = useRef<FormInstance>();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginParams, setLoginParams, removeLoginParams] =
    useStorage('loginParams');

  const t = useLocale(locale);

  const [rememberPassword, setRememberPassword] = useState(!!loginParams);

  const { run: handleSignin } = useRequest(signin, {
    manual: true,
    onSuccess: (result) => {
      console.log(result);
      if (result.success) {
        Message.success({
          content: '登录成功',
          duration: 1500,
          onClose: () => {
            Cookies.set('Authorization', result?.data?.token);
            history.replace('/material/primary');
          },
        });
      } else {
        Message.error({
          content: result.message,
          duration: 2000,
        });
      }
    },
    onError: (e) => {
      console.log(e);
      Message.error({
        content: e.message,
        duration: 2000,
      });
    },
  });

  function onSubmitClick() {
    formRef.current.validate().then((values) => {
      console.log(values);
      handleSignin(values);
    });
  }

  // 读取 localStorage，设置初始值
  useEffect(() => {
    const rememberPassword = !!loginParams;
    setRememberPassword(rememberPassword);
    if (formRef.current && rememberPassword) {
      const parseParams = JSON.parse(loginParams);
      formRef.current.setFieldsValue(parseParams);
    }
  }, [loginParams]);

  return (
    <div className={styles['signin-form-wrapper']}>
      <div className={styles['signin-form-title']}>Cook Master</div>
      <div className={styles['signin-form-sub-title']}>design by ursazoo</div>
      <div className={styles['signin-form-error-msg']}>{errorMessage}</div>
      <Form
        className={styles['signin-form']}
        layout="horizontal"
        ref={formRef}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
        // initialValues={{ account: 'admin', password: 'admin' }}
      >
        <Form.Item
          label="账号"
          field="account"
          rules={[{ required: true, message: '账号是必填项' }]}
        >
          <Input
            prefix={<IconUser />}
            placeholder={'请输入账号'}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Form.Item
          label="密码"
          field="password"
          rules={[{ required: true, message: '密码是必填项' }]}
        >
          <Input.Password
            prefix={<IconLock />}
            placeholder={'请输入密码'}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Space align={'center'} size={16} direction="vertical">
          <div className={styles['signin-form-password-actions']}>
            <Checkbox checked={rememberPassword} onChange={setRememberPassword}>
              {t['login.form.rememberPassword']}
            </Checkbox>
            <Link>{t['login.form.forgetPassword']}</Link>
          </div>
          <Button type="primary" onClick={onSubmitClick} loading={loading}>
            登录
          </Button>
          <Button
            type="text"
            className={styles['signin-form-register-btn']}
            onClick={() => history.replace('/signup')}
          >
            注册账号
          </Button>
        </Space>
      </Form>
    </div>
  );
}
