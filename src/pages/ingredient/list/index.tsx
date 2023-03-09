import type {ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import {Button, Form, Input, Modal} from 'antd';
import {useState} from 'react';
import {useRequest} from "ahooks";
import {getIngredients} from "@/common/apis/ingredient";
// import emojiData from '@emoji-mart/data'
import emojiData from '@emoji-mart/data/sets/13.1/native.json'

import Picker from '@emoji-mart/react'

import './index.less'
import {BaseEmoji} from "emoji-mart/dist-es/utils/emoji-index/nimble-emoji-index";

export type TableListItem = {
    id: number;
    name: string;
    ingredientSubType: {
        id: string;
        name: string;
    }
};

const columns: ProColumns<TableListItem>[] = [
    {
        title: '食材ID',
        width: 120,
        dataIndex: 'id',
        align: 'center',
        render: (_) => <div>{_}</div>,
    },
    {
        title: '所属二级分类',
        width: 120,
        dataIndex: 'ingredientSubType',
        align: 'center',
        render: (_, row) => {
            return <>
                {row.ingredientSubType.name || ''}
            </>
        },
    },
    {
        title: '食材名称',
        width: 120,
        dataIndex: 'name',
        align: 'center',
        render: (_) => <div>{_}</div>,
    },
    {
        title: 'emoji',
        width: 120,
        dataIndex: 'emoji',
        align: 'center',
        render: (_) => <div>{_}</div>,
    },
    {
        title: '选择次数',
        width: 120,
        dataIndex: 'times',
        align: 'center',
        render: (_) => <div>{_}</div>,
    },
    {
        title: '操作',
        width: 200,
        key: 'option',
        valueType: 'option',
        align: 'center',
        render: () => <div style={{display: 'flex', justifyContent: 'space-around'}}>
            <Button>编辑</Button>
        </div>,
    },
];
const IngredientListPage =  () => {
    const [showEmoji, setShowEmoji] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState<BaseEmoji>();
    const [dataSource, setDataSource] = useState([]);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');

    const showModal = () => setOpen(true);

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

    useRequest(getIngredients, {
        onSuccess: (data, params) => {
            if(data.success){
                setDataSource(data.data.list || [])
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
                dataSource={dataSource}
                rowKey="id"
                pagination={{showQuickJumper: true}}
                columns={columns}
                search={false}
                dateFormatter="string"
                headerTitle="食材列表"
                toolBarRender={() => [
                    <Button type="primary" key="primary" onClick={() => setOpen(true)}>
                        新增食材
                    </Button>,
                ]}
            />

            <Modal
                title="新增食材"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                footer={false}
            >
                <Form
                    preserve={false}
                    name="ingredient-form"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    style={{ maxWidth: 600 }}
                    // initialValues={{ remember: true }}
                    autoComplete="off"
                    onFinish={(values) => {
                        // const result = await values.validateFields();
                        console.log(values)
                        const result = {
                            ...values,
                            emoji: selectedEmoji?.unified
                        }
                    }}
                    onFinishFailed={(errorInfo) => {
                        console.log(errorInfo)
                    }}
                >
                    <Form.Item
                        label="食材名称"
                        name="name"
                        rules={[{ required: true, message: '请输入食材名称' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="emoji"
                        name="emoji"
                    >
                        <>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Button onClick={() => setShowEmoji(!showEmoji)}>{ showEmoji ? '收起选择器' : '展开选择器' }</Button>
                                {
                                    selectedEmoji ? <div style={{fontSize: '24px', marginLeft: '20px'}}>{selectedEmoji?.native}</div> : null
                                }
                            </div>
                            {
                                showEmoji ? <div style={{marginTop: '20px'}} >
                                    <Picker data={emojiData} onEmojiSelect={(emoji: any) => {
                                        console.log(emoji)
                                        setSelectedEmoji(emoji)
                                        setShowEmoji(false)
                                    }} />
                                </div> : null
                            }
                        </>
                    </Form.Item>

                    <Form.Item>
                        <Button htmlType='submit' type='primary'>保存</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default IngredientListPage;
