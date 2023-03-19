import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  PaginationProps,
  Button,
  Space,
  Form,
  Typography,
  Message,
  Input,
  Modal,
  TableColumnProps,
  Tag,
} from '@arco-design/web-react';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import dayjs from 'dayjs';

import styles from './style/index.module.less';
import FormItem from '@arco-design/web-react/es/Form/form-item';
import { useRequest } from 'ahooks';
import {
  createCookware,
  editCookware,
  getCookwareList,
} from '@/common/apis/material/cookware';

const { Title, Text } = Typography;

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};
const { useForm } = Form;
function CookWareListPage() {
  const [infoForm] = useForm();
  const [current, setCurrent] = useState<{
    id: string;
    name: string;
  }>();
  const [visible, setVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [data, setData] = useState([]);
  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });

  const columns: TableColumnProps[] = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   align: 'center',
    //   render: (value) => <Text>{value}</Text>,
    // },
    {
      title: '厨具名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '所属菜谱',
      dataIndex: 'posts',
      align: 'center',
      render: (_, record) => {
        return (
          <div>
            {_.length
              ? _.map((item) => {
                  return <Tag key={item.id}>{item.name}</Tag>;
                })
              : '/'}
          </div>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      align: 'center',
      render: (x) => dayjs(x).format('YYYY-MM-DD HH:mm'),
      sorter: (a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix(),
    },
    {
      title: '操作',
      dataIndex: 'operations',
      // headerCellStyle: { paddingLeft: '15px' },
      align: 'center',
      render: (_, record) => (
        <Button
          type="text"
          size="small"
          onClick={() => {
            setVisible(true);
            setCurrent(record);
          }}
        >
          编辑
        </Button>
      ),
    },
  ];

  const { run: handleGetCookwareList } = useRequest(getCookwareList, {
    onSuccess: (result) => {
      if (result.success) {
        setData(result.data.list || []);
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const { run: handleCreateCookware } = useRequest(createCookware, {
    manual: true,
    onSuccess: (result) => {
      if (result.success) {
        console.log(result);
        Message.success(result?.message);
        setVisible(false);
        setConfirmLoading(false);
        handleGetCookwareList();
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const { run: handleEditCookware } = useRequest(editCookware, {
    manual: true,
    onSuccess: (result) => {
      if (result.success) {
        console.log(result);
        Message.success(result?.message);
        setVisible(false);
        setConfirmLoading(false);
        handleGetCookwareList();
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  // useEffect(() => {
  //   fetchData();
  // }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  useEffect(() => {
    if (visible) {
      setModalTitle(`${current ? '编辑' : '新建'}厨具`);
      if (current) {
        infoForm.setFieldValue('name', current.name);
      }
    } else {
      setCurrent(undefined);
      setConfirmLoading(false);
      infoForm.resetFields();
    }
  }, [visible, current]);

  // 获取表格数据
  // function fetchData() {
  //   const { current, pageSize } = pagination;
  //   // setLoading(true);
  //   axios
  //     .get('/api/list', {
  //       params: {
  //         page: current,
  //         pageSize,
  //         ...formParams,
  //       },
  //     })
  //     .then((res) => {
  //       setData(res.data.list);
  //       setPatination({
  //         ...pagination,
  //         current,
  //         pageSize,
  //         total: res.data.total,
  //       });
  //       // setLoading(false);
  //     });
  // }

  // 表格设置分页属性或翻页
  function onChangeTable({ current, pageSize }) {
    setPatination({
      ...pagination,
      current,
      pageSize,
    });
  }

  // 表格表单搜索
  function handleSearch(values) {
    console.log(values);
    setPatination({ ...pagination, current: 1 });
    // handleGetIngredientSubTypes(values)
  }

  // 保存基础材料信息弹窗
  function onOk() {
    infoForm.validate().then((values) => {
      console.log(values);
      setConfirmLoading(true);
      console.log(current);
      if (current) {
        // 更新信息
        handleEditCookware(current.id, values);
      } else {
        handleCreateCookware(values);
      }

      // setTimeout(() => {
      //   Message.success('Success !');
      //   setVisible(false);
      //   setConfirmLoading(false);
      // }, 1500);
    });
  }

  return (
    <Card>
      <Title heading={6}>厨具管理</Title>
      {/* <SearchForm onSearch={handleSearch} ingredientSubTypes={subTypes} ingredientTypes={types}/> */}
      <div className={styles['button-group']}>
        <Space>
          <Button
            type="primary"
            icon={<IconPlus />}
            onClick={() => setVisible(true)}
          >
            新建
          </Button>
          <Button>批量导入</Button>
        </Space>
        <Space>
          <Button icon={<IconDownload />}>下载</Button>
        </Space>
      </div>
      <Table
        rowKey="id"
        // loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        data={data}
      />
      <Modal
        unmountOnExit={true}
        title={modalTitle}
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={onOk}
        onCancel={() => setVisible(false)}
      >
        <Form
          {...formItemLayout}
          form={infoForm}
          labelCol={{
            style: { flexBasis: 100 },
          }}
          wrapperCol={{
            style: { flexBasis: 'calc(100% - 100px)' },
          }}
        >
          <FormItem
            label="名称"
            field="name"
            rules={[{ required: true, message: '名称是必填项' }]}
          >
            <Input allowClear placeholder="请输入名称" />
          </FormItem>
        </Form>
      </Modal>
    </Card>
  );
}

export default CookWareListPage;
