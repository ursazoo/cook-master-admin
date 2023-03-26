import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Table,
  Card,
  PaginationProps,
  Button,
  Space,
  Form,
  Typography,
  Select,
  Badge,
  TableColumnProps,
  Tag,
  Link,
} from '@arco-design/web-react';
import dayjs from 'dayjs';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import SearchForm from './components/form';

import { useRequest } from 'ahooks';

import styles from './style/index.module.less';
import { getPostList } from '../../../common/apis/post/index';
import { getSecondaryMaterialList } from '@/common/apis/material/secondary';
import { getCookwareList } from '@/common/apis/material/cookware';

const { Title, Text } = Typography;

const { useForm } = Form;

function PostListPage() {
  const history = useHistory();

  const [pagination, setPagination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });
  const [formParams, setFormParams] = useState({});

  const [materialList, setMaterialList] = useState([]);

  const [cookwareList, setCookwareList] = useState([]);

  const [postList, setPostList] = useState([]);

  const columns: TableColumnProps[] = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   align: 'center',
    //   //   hide: true,
    //   render: (value) => <Text>{value}</Text>,
    // },
    {
      title: '名称',
      dataIndex: 'title',
      align: 'center',
      render: (_, record) => (
        <Link href={`/post/${record.id}`} key={record.id}>
          {_}
        </Link>
      ),
    },
    // {
    //   title: '用时',
    //   dataIndex: 'time',
    //   align: 'center',
    //   render: (value) => <Text>{value || '/'}</Text>,
    // },
    // {
    //   title: '难度',
    //   dataIndex: 'difficulty',
    //   align: 'center',
    //   render: (value) => <Text>{value || '/'}</Text>,
    // },
    {
      title: '所需材料',
      dataIndex: 'baseMaterialList',
      align: 'center',
      render: (_, record) => (
        <>
          {_.map((item) => (
            <Tag style={{ margin: '0 10px' }} key={item.id}>
              {item.name}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '所需厨具',
      dataIndex: 'cookwareList',
      align: 'center',
      render: (_, record) => (
        <>
          {_.map((item) => (
            <Tag style={{ margin: '0 10px' }} key={item.id}>
              {item.name}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '作者',
      dataIndex: 'author',
      align: 'center',
      render: (_) => (
        <Tag style={{ margin: '0 10px' }} key={_.id}>
          {_.name}
        </Tag>
      ),
    },
    // {
    //   title: '状态',
    //   dataIndex: 'status',
    //   align: 'center',
    //   render: (x) => {
    //     // if (x === 0) {
    //     //   return <Badge status="error" text={Status[x]}></Badge>;
    //     // }
    //     return <Badge status="success" text={'启用'}></Badge>;
    //   },
    // },
    // {
    //   title: '选择次数',
    //   dataIndex: 'count',
    //   sorter: (a, b) => +a.count - +b.count,
    //   align: 'center',
    //   render(x) {
    //     return Number(x).toLocaleString();
    //   },
    // },

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
                history.push(`/post/edit/${record.id}`);
                // setCurrent(record)
                // setVisible(true)
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
  }

  const { run: handleGetPostList } = useRequest(getPostList, {
    manual: true,
    defaultParams: [
      {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      },
    ],
    onSuccess: (result) => {
      if (result.success) {
        setPostList(result.data.list || []);
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const { run: handleGetSecondaryMaterialList } = useRequest(
    getSecondaryMaterialList,
    {
      // manual: true,
      onSuccess: (result) => {
        if (result.success) {
          setMaterialList(result.data.list || []);
        }
      },
      onError: (e) => {
        console.log(e);
      },
    }
  );

  const { run: handleGetCookwareList } = useRequest(getCookwareList, {
    onSuccess: (result) => {
      if (result.success) {
        setCookwareList(result.data.list || []);
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  useEffect(() => {
    handleGetPostList({
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formParams,
    });
  }, [pagination.current, pagination.pageSize, formParams]);

  return (
    <Card>
      <Title heading={6}>菜谱管理</Title>
      <SearchForm
        onSearch={handleSearch}
        materialList={materialList}
        cookwareList={cookwareList}
      />
      <div className={styles['button-group']}>
        <Space>
          <Button
            type="primary"
            icon={<IconPlus />}
            onClick={() => history.push('/post/create')}
          >
            新建
          </Button>
        </Space>
        <Space>
          <Button icon={<IconDownload />}>下载</Button>
        </Space>
      </div>
      <Table
        rowKey="id"
        loading={false}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        data={postList}
      />
    </Card>
  );
}

export default PostListPage;
