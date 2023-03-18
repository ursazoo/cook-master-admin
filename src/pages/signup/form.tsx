import { Form, Input, Button, Space, Message } from '@arco-design/web-react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { IconLock, IconUser } from '@arco-design/web-react/icon';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useStorage from '@/utils/useStorage';
import styles from './style/index.module.less';
import { useRequest } from 'ahooks';
import { signup } from '@/common/apis/user/sign';

export default function LoginForm() {
  const history = useHistory();
  const formRef = useRef<FormInstance>();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginParams, setLoginParams, removeLoginParams] =
    useStorage('loginParams');

  const [rememberPassword, setRememberPassword] = useState(!!loginParams);

  function afterLoginSuccess(params) {
    // 记住密码
    if (rememberPassword) {
      setLoginParams(JSON.stringify(params));
    } else {
      removeLoginParams();
    }
    // 记录登录状态
    localStorage.setItem('userStatus', 'login');
    // 跳转首页
    window.location.href = '/';
  }

  // function login(params) {
  //   setErrorMessage('');
  //   setLoading(true);
  //   axios
  //     .post('/api/user/login', params)
  //     .then((res) => {
  //       const { status, msg } = res.data;
  //       if (status === 'ok') {
  //         afterLoginSuccess(params);
  //       } else {
  //         setErrorMessage(msg || t['login.form.login.errMsg']);
  //       }
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }

  const { run: handleSignup } = useRequest(signup, {
    manual: true,
    onSuccess: (result) => {
      if (result.success) {
        Message.success({
          content: '注册成功',
          duration: 1500,
          onClose: () => {
            history.replace('/signin');
          },
        });
      }
    },
    onError: (e) => {
      Message.error({
        content: e.message,
        duration: 2000,
      });
    },
  });

  function onSubmitClick() {
    formRef.current.validate().then((values) => {
      console.log(values);
      handleSignup(values);
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
    <div className={styles['signup-form-wrapper']}>
      <div className={styles['signup-form-title']}>Cook Master</div>
      <div className={styles['signup-form-sub-title']}>design by ursazoo</div>
      <div className={styles['signup-form-error-msg']}>{errorMessage}</div>
      <Form
        className={styles['signup-form']}
        layout="horizontal"
        ref={formRef}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
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
          label="用户名"
          field="name"
          rules={[{ required: true, message: '用户名是必填项' }]}
        >
          <Input
            prefix={<IconUser />}
            placeholder={'请输入用户名'}
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
        <Form.Item
          label="确认密码"
          field="confirmPassword"
          rules={[{ required: true, message: '确认密码是必填项' }]}
        >
          <Input.Password
            prefix={<IconLock />}
            placeholder={'请确认密码'}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Space align={'center'} size={16} direction="vertical">
          <Button type="primary" onClick={onSubmitClick} loading={loading}>
            注册账号
          </Button>
        </Space>
      </Form>
    </div>
  );
}
