import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  PaginationProps,
  Button,
  Space,
  Form,
  Typography,
  Badge,
  TableColumnProps,
  Link,
} from '@arco-design/web-react';
import dayjs from 'dayjs';
// import PermissionWrapper from '@/components/PermissionWrapper';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import SearchForm from './components/form';
// import locale from './locale';
import styles from './style/index.module.less';
import { IPrimaryMaterial } from '@/common/apis/material/primary';
import { useRequest } from 'ahooks';

import { getAllUserList } from '@/common/apis/user/find';

const { Title } = Typography;

const { useForm } = Form;

function BaseMaterialPage() {
  const [infoForm] = useForm();
  const [current, setCurrent] = useState<any>();

  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });
  // const [loading, setLoading] = useState(true);
  const [formParams, setFormParams] = useState({});
  const [primaryMaterialList] = useState<IPrimaryMaterial[]>([]);

  const columns: TableColumnProps[] = [
    {
      title: '用户名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '用户账号',
      dataIndex: 'account',
      align: 'center',
    },
    {
      title: '相关菜谱',
      dataIndex: 'posts',
      align: 'center',
      render: (_, record) => (
        <Link href={`/post/list?base-material-id=${record.id}`}>
          {_?.length || 0}
        </Link>
      ),
    },
    {
      title: '权限',
      dataIndex: 'role',
      align: 'center',
      render(x) {
        return Number(x).toLocaleString();
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (x) => {
        return <Badge status="success" text={'启用'}></Badge>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      align: 'center',
      render: (x) => dayjs(x).format('YYYY-MM-DD HH:mm'),
      sorter: (a, b) =>
        dayjs(b.createdTime).unix() - dayjs(a.createdTime).unix(),
    },
    {
      title: '操作',
      dataIndex: 'operations',
      align: 'center',
      render: (_, record) => {
        return (
          <>
            <Button
              type="text"
              size="small"
              onClick={() => {
                setCurrent(record);
                setVisible(true);
              }}
            >
              编辑
            </Button>
            <Button status="danger" type="text" size="small">
              删除
            </Button>
          </>
        );
      },
    },
  ];

  const { run: handleGetAllUserList } = useRequest(getAllUserList, {
    defaultParams: [{ pageNum: 1, pageSize: 10 }],
    onSuccess: (result) => {
      if (result.success) {
        setData(result.data.list || []);
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  useEffect(() => {
    if (visible) {
      setModalTitle(`${current ? '编辑' : '新建'}基础材料`);
      infoForm.setFieldsValue({
        name: current?.name,
        secondaryMaterialId: current?.secondaryMaterial?.id,
      });
    } else {
      setCurrent(undefined);
      setConfirmLoading(false);
      infoForm.resetFields();
    }
  }, [visible, current]);

  // 表格设置分页属性或翻页
  function onChangeTable({ current, pageSize }) {
    setPagination({
      ...pagination,
      current,
      pageSize,
    });
  }

  // 表格表单搜索
  function handleSearch(values) {
    console.log(values);
    setPagination({ ...pagination, current: 1 });
    setFormParams(values);
    handleGetAllUserList(values);
  }

  return (
    <Card>
      <Title heading={6}>用户管理</Title>
      <SearchForm
        onSearch={handleSearch}
        primaryMaterialList={primaryMaterialList}
      />
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
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        data={data}
      />
    </Card>
  );
}

export default BaseMaterialPage;
