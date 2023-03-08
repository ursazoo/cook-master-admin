import {Outlet, useNavigate} from 'react-router-dom'
import { GithubFilled, InfoCircleFilled, QuestionCircleFilled } from '@ant-design/icons';
import type { ProSettings } from '@ant-design/pro-components';
import { PageContainer, ProLayout, ProCard } from '@ant-design/pro-components';
import { useState } from 'react';

export default () => {
    const navigate = useNavigate();
    const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
        layout: 'side',
    });

    const [pathname, setPathname] = useState('/home');

    return (
        <div style={{ height: '100vh' }} >
            <ProLayout
                siderWidth={216}
                bgLayoutImgList={[
                    {
                        src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
                        left: 85,
                        bottom: 100,
                        height: '303px',
                    },
                    {
                        src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
                        bottom: -68,
                        right: -45,
                        height: '303px',
                    },
                    {
                        src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
                        bottom: 0,
                        left: 0,
                        width: '331px',
                    },
                ]}
                location={{ pathname }}
                breadcrumbRender={() => false}
                menu={{
                    request: async () => {
                            await console.log('get')
                            return [
                                {
                                    path: '/home',
                                    name: '数据分析',
                                    exact: true,
                                },
                                {
                                    path: '/posts',
                                    name: '菜谱管理',
                                    routes: [
                                        {
                                            path: '/posts/list',
                                            name: '菜谱列表',
                                            exact: true,
                                        },
                                        {
                                            path: '/posts/edit',
                                            name: '创建菜谱',
                                            exact: true,
                                        },
                                    ],
                                },
                                {
                                    path: '/ingredient-types',
                                    name: '食材分类管理',
                                    routes: [
                                        {
                                            path: '/ingredient-types/list',
                                            name: '食材分类列表',
                                            exact: true,
                                        },
                                        {
                                            path: '/ingredient-types/edit',
                                            name: '创建食材分类',
                                            exact: true,
                                        },
                                    ],
                                },
                                {
                                    path: '/ingredients',
                                    name: '食材管理',
                                    routes: [
                                        {
                                            path: '/ingredients/list',
                                            name: '食材列表',
                                            exact: true,
                                        },
                                        {
                                            path: '/ingredients/edit',
                                            name: '创建食材',
                                            exact: true,
                                        },
                                    ],
                                },
                            ];
                        },
                }}
                avatarProps={{
                    src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
                    title: 'ursazoo',
                    size: 'small',
                }}
                actionsRender={(props) => {
                    if (props.isMobile) return [];
                    return [
                        <InfoCircleFilled key="InfoCircleFilled" />,
                        <QuestionCircleFilled key="QuestionCircleFilled" />,
                        <GithubFilled key="GithubFilled" onClick={() => window.open('https://github.com/ursazoo')}/>,
                    ];
                }}
                menuItemRender={(item, dom) => (
                    <div
                        onClick={() => {
                            setPathname(item.path || '/home');
                            navigate(item.path || '/home')
                        }}
                    >
                        {dom}
                    </div>
                )}
                {...settings}
            >
                <PageContainer>
                    <ProCard
                        style={{
                            height: '100vh',
                            minHeight: 800,
                        }}
                    >
                        <Outlet />
                    </ProCard>
                </PageContainer>
            </ProLayout>
            {/*<SettingDrawer*/}
            {/*    pathname={pathname}*/}
            {/*    enableDarkTheme*/}
            {/*    getContainer={() => document.getElementById('test-pro-layout')}*/}
            {/*    settings={settings}*/}
            {/*    onSettingChange={(changeSetting) => {*/}
            {/*        setSetting(changeSetting);*/}
            {/*    }}*/}
            {/*    disableUrlParams={false}*/}
            {/*/>*/}
        </div>
    );
};