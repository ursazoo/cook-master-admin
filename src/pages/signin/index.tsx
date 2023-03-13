import { useRef, useState } from 'react';

import {useRequest} from "ahooks";
import {
    LockOutlined,
    MobileOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
    LoginFormPage,
    ProForm,
    ProFormCaptcha,
    ProFormInstance,
    ProFormText,
} from '@ant-design/pro-components';
import {Button, Card, Carousel, message, Tabs, TabsProps} from 'antd';

import {useNavigate} from "react-router-dom";

import {signin} from "../../common/apis/user";
import styles from './index.module.less';

type TabType = 'signin' | 'signup';

interface ISignin {
    account: string;
    password: string;
}

interface ISignup extends ISignin{
    name: string;
    repeatPassword: string;
}

export default () => {
    const navigation = useNavigate();
    const signinFormRef = useRef<ProFormInstance<ISignin>>();
    const signupFormRef = useRef<ProFormInstance<ISignup>>();

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const tailLayout = {
        wrapperCol: {
            offset: 8,
            span: 16,
        },
    };

    const [tabType, setTabType] = useState<TabType>('signin');

    const { loading: signinLoading, run: runSignin } = useRequest(signin, {
        manual: true,
        onSuccess: (result, params) => {
            console.log(result);
            message.success('登录成功');
            navigation('/home', {replace: true})
        },
        onError: (e, params) => {
            console.log(e);
        }
    });

    const items: TabsProps['items'] = [
        {
            key: 'signin',
            label: `登录`,
            children: <>
                <ProFormText
                    name="username"
                    fieldProps={{
                        prefix: <UserOutlined className={'prefixIcon'} />,
                    }}
                    placeholder={'用户名: admin or user'}
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名!',
                        },
                    ]}
                />
                <ProFormText.Password
                    name="password"
                    fieldProps={{
                        prefix: <LockOutlined className={'prefixIcon'} />,
                    }}
                    placeholder={'密码: ant.design'}
                    rules={[
                        {
                            required: true,
                            message: '请输入密码！',
                        },
                    ]}
                />
            </>,
        },
        {
            key: 'signup',
            label: `注册`,
            children: <>
                <ProFormText
                    fieldProps={{

                        prefix: <MobileOutlined className={'prefixIcon'} />,
                    }}
                    name="mobile"
                    placeholder={'手机号'}
                    rules={[
                        {
                            required: true,
                            message: '请输入手机号！',
                        },
                        {
                            pattern: /^1\d{10}$/,
                            message: '手机号格式错误！',
                        },
                    ]}
                />
                <ProFormCaptcha
                    fieldProps={{

                        prefix: <LockOutlined className={'prefixIcon'} />,
                    }}
                    captchaProps={{

                    }}
                    placeholder={'请输入验证码'}
                    captchaTextRender={(timing, count) => {
                        if (timing) {
                            return `${count} ${'获取验证码'}`;
                        }
                        return '获取验证码';
                    }}
                    name="captcha"
                    rules={[
                        {
                            required: true,
                            message: '请输入验证码！',
                        },
                    ]}
                    onGetCaptcha={async () => {
                        message.success('获取验证码成功！验证码为：1234');
                    }}
                />
            </>,
        },
    ]

    return (
        <div className={styles.signinPageContainer}>
            <div className={styles.cover}></div>
            <div className={styles.form}>
                    {/*<Tabs*/}
                    {/*    centered*/}
                    {/*    activeKey={tabType}*/}
                    {/*    defaultActiveKey="signin"*/}
                    {/*    items={items}*/}
                    {/*    onChange={(activeKey) => setTabType(activeKey as TabType)}*/}
                    {/*/>*/}
                <Card title='登录' className={styles.formCard}>
                    <ProForm<ISignin>
                        {...layout}
                        // layout='horizontal'
                        // labelAlign='right'
                        formRef={signinFormRef}
                        formKey="sign-in-form"
                        autoFocusFirstInput
                        requiredMark={false}
                        onFinish={async (values) => {
                            console.log(values);
                            const val1 = await signinFormRef.current?.validateFields();
                            console.log('validateFields:', val1);
                            const val2 = await signinFormRef.current?.validateFieldsReturnFormatValue?.();
                            console.log('validateFieldsReturnFormatValue:', val2);
                            message.success('提交成功');
                        }}
                    >
                        <ProForm.Group>
                            <ProFormText
                                width="md"
                                name="name"
                                label="账号"
                                placeholder="请输入账号"
                                
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm your password!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                        },
                                    }),
                                ]}
                            />
                            <ProFormText.Password width="md" name="password" label="密码" placeholder="请输入密码"  rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                    },
                                }),
                            ]} />
                        </ProForm.Group>
                    </ProForm>
                </Card>

                <Card title='注册' className={styles.formCard}>
                    <ProForm<ISignin>
                        {...layout}
                        // layout='horizontal'
                        // labelAlign='right'
                        formRef={signupFormRef}
                        formKey="sign-up-form"
                        autoFocusFirstInput
                        requiredMark={false}
                        onFinish={async (values) => {

                        }}
                    >
                        <ProForm.Group>
                            <ProFormText
                                width="md"
                                name="account"
                                label="账号"
                                placeholder="请输入账号"
                            />
                            <ProFormText
                                width="md"
                                name="name"
                                label="昵称"
                                placeholder="请输入昵称"
                                
                            />
                            <ProFormText.Password width="md" name="password" label="密码" placeholder="请输入密码"  />
                            <ProFormText.Password width="md" name="repeatPassword" label="确认密码" placeholder="请输入密码"  />
                        </ProForm.Group>
                    </ProForm>
                </Card>
                {/*<div className={styles.formCard}>*/}
                {/*    <ProForm<ISignin>*/}
                {/*        formRef={signinFormRef}*/}
                {/*        formKey="sign-in-form"*/}
                {/*        autoFocusFirstInput*/}
                {/*        requiredMark={false}*/}
                {/*        onFinish={async (values) => {*/}
                {/*            console.log(values);*/}
                {/*            const val1 = await signinFormRef.current?.validateFields();*/}
                {/*            console.log('validateFields:', val1);*/}
                {/*            const val2 = await signinFormRef.current?.validateFieldsReturnFormatValue?.();*/}
                {/*            console.log('validateFieldsReturnFormatValue:', val2);*/}
                {/*            message.success('提交成功');*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        <ProForm.Group>*/}
                {/*            <ProFormText*/}
                {/*                width="md"*/}
                {/*                name="name"*/}
                {/*                label="账号"*/}
                {/*                placeholder="请输入账号"*/}
                {/*                rules={[*/}
                {/*                    {*/}
                {/*                        required: true,*/}
                {/*                        message: 'Please confirm your password!',*/}
                {/*                    },*/}
                {/*                    ({ getFieldValue }) => ({*/}
                {/*                        validator(_, value) {*/}
                {/*                            if (!value || getFieldValue('password') === value) {*/}
                {/*                                return Promise.resolve();*/}
                {/*                            }*/}
                {/*                            return Promise.reject(new Error('The two passwords that you entered do not match!'));*/}
                {/*                        },*/}
                {/*                    }),*/}
                {/*                ]}*/}
                {/*            />*/}
                {/*            <ProFormText.Password width="md" name="password" label="密码" placeholder="请输入密码" rules={[*/}
                {/*                {*/}
                {/*                    required: true,*/}
                {/*                    message: 'Please confirm your password!',*/}
                {/*                },*/}
                {/*                ({ getFieldValue }) => ({*/}
                {/*                    validator(_, value) {*/}
                {/*                        if (!value || getFieldValue('password') === value) {*/}
                {/*                            return Promise.resolve();*/}
                {/*                        }*/}
                {/*                        return Promise.reject(new Error('The two passwords that you entered do not match!'));*/}
                {/*                    },*/}
                {/*                }),*/}
                {/*            ]} />*/}
                {/*        </ProForm.Group>*/}
                {/*    </ProForm>*/}
                {/*</div>*/}
                {/*<div className={styles.formCard}>*/}
                {/*    */}
                {/*</div>*/}
            </div>
            {/*<LoginFormPage*/}
            {/*    backgroundImageUrl="https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png"*/}
            {/*    logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"*/}
            {/*    title="GitHub"*/}
            {/*    subTitle="全球最大的代码托管平台"*/}
            {/*    onFinish={async (values) => {*/}
            {/*        // await waitTime(2000);*/}
            {/*        await console.log(values);*/}
            {/*        runSignin({account: 'rabbit_king', password: '123456'});*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <Tabs*/}
            {/*        centered*/}
            {/*        activeKey={tabType}*/}
            {/*        defaultActiveKey="signin"*/}
            {/*        items={items}*/}
            {/*        onChange={(activeKey) => setTabType(activeKey as TabType)}*/}
            {/*    />*/}
            {/*</LoginFormPage>*/}
        </div>
    );
};