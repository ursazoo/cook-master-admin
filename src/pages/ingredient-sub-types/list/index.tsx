import { DownOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import {Button, Form, Input, Modal, Tag} from 'antd';
import { useState } from 'react';
import {useRequest} from "ahooks/es";
import {getIngredientTypes} from "@/common/apis/ingredient-type";

import './index.less'
import styles from './index.module.less'

export type TableListItem = {
    id: number;
    name: string;
    ingredientSubTypes: {
        id: string;
        name: string;
    }[]
};

// for (let i = 0; i < 5; i += 1) {
//     tableListDataSource.push({
//         id: i,
//         name: 'AppName',
//         ingredientSubTypes: [
//             {
//                 id: i+1,
//                 name: 'app_name'
//             }
//         ],
//     });
// }

const columns: ProColumns<TableListItem>[] = [
    {
        title: '分类ID',
        width: 120,
        dataIndex: 'id',
        align: 'center',
        render: (_) => <div>{_}</div>,
    },
    {
        title: '分类名称',
        width: 120,
        dataIndex: 'name',
        align: 'center',
        render: (_) => <div>{_}</div>,
    },
    {
        title: '二级分类',
        // width: 80,
        dataIndex: 'ingredientSubTypes',
        align: 'center',
        render: (_, row) => {
            return <>
                {row?.ingredientSubTypes?.map(item => <Tag className={styles.tag} key={item.id} title={item.name}>{item.name}</Tag>)}
            </>
        },
    },
    {
        title: '操作',
        width: 240,
        key: 'option',
        valueType: 'option',
        align: 'center',
        render: () => <div style={{display: 'flex', justifyContent: 'space-around'}}>
            <Button type='primary' ghost>增加二级分类</Button>
            <Button >编辑</Button>
        </div>,
    },
];
const IngredientTypesListPage =  () => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    useRequest(getIngredientTypes, {
        onSuccess: (data, params) => {
            if(data.success){
                setData(data.data.list || [])
            }
        },
        onError: (e) => {
            console.log(e)
        }
    })

    return (
        <>
            <ProTable<TableListItem>

                bordered={true}
                dataSource={data}
                rowKey="id"
                pagination={{showQuickJumper: true}}
                columns={columns}
                search={false}
                dateFormatter="string"
                headerTitle="食材一级分类"
                toolBarRender={() => [
                    <Button type="primary" key="primary" onClick={() => setOpen(true)}>
                        新增分类
                    </Button>,
                ]}
            />

            <Modal
                title="创建一级分类"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                footer={false}
            >
                <Form
                    preserve={false}
                    name="ingredient-types-form"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    style={{ maxWidth: 600 }}
                    // initialValues={{ remember: true }}
                    autoComplete="off"
                    onFinish={(values) => {
                        // const result = await values.validateFields();
                        console.log(values)
                    }}
                    onFinishFailed={(errorInfo) => {
                        console.log(errorInfo)
                    }}
                >
                    <Form.Item
                        label="一级分类名称"
                        name="name"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button htmlType='submit' type='primary'>保存</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default IngredientTypesListPage;
