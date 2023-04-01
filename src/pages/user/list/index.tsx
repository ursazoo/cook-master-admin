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
  Select,
  Badge,
  TableColumnProps,
  Link,
} from '@arco-design/web-react';
import dayjs from 'dayjs';
// import PermissionWrapper from '@/components/PermissionWrapper';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import axios from 'axios';
import SearchForm from './components/form';
// import locale from './locale';
import styles from './style/index.module.less';
// import { getColumns } from './constants';
import FormItem from '@arco-design/web-react/es/Form/form-item';
import {
  getPrimaryMaterialList,
  IPrimaryMaterial,
} from '@/common/apis/material/primary';
import { useRequest } from 'ahooks';
import {
  createBaseMaterial,
  editBaseMaterial,
  getBaseMaterialList,
} from '@/common/apis/material/base';
import { getAllUserList } from '@/common/apis/user/find';

const { Title, Text } = Typography;
const { OptGroup, Option } = Select;

export const ContentType = ['图文', '横版短视频', '竖版短视频'];
export const FilterType = ['规则筛选', '人工'];
export const Status = ['已上线', '未上线'];
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};
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
  const [primaryMaterialList, setPrimaryMaterialList] = useState<
    IPrimaryMaterial[]
  >([]);

  const columns: TableColumnProps[] = [
    // {
    //   title: 'id',
    //   dataIndex: 'id',
    //   align: 'center',
    //   render: (value) => <Text>{value}</Text>,
    // },
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
        <Link href={`/post/list?base-materil-id=${record.id}`}>
          {_?.length || 0}
        </Link>
      ),
    },
    {
      title: '权限',
      dataIndex: 'count',
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

  // useEffect(() => {
  //   fetchData();
  // }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  useEffect(() => {
    if (visible) {
      setModalTitle(`${current ? '编辑' : '新建'}基础材料`);
      infoForm.setFieldsValue({
        name: current?.name,
        secondaryMaterilId: current?.secondaryMateril?.id,
      });
    } else {
      setCurrent(undefined);
      setConfirmLoading(false);
      infoForm.resetFields();
    }
  }, [visible, current]);

  // 获取表格数据
  function fetchData() {
    const { current, pageSize } = pagination;
    // setLoading(true);
    axios
      .get('/api/list', {
        params: {
          page: current,
          pageSize,
          ...formParams,
        },
      })
      .then((res) => {
        setData(res.data.list);
        setPagination({
          ...pagination,
          current,
          pageSize,
          total: res.data.total,
        });
        // setLoading(false);
      });
  }

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
