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
} from '@arco-design/web-react';
import dayjs from 'dayjs';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import SearchForm from './components/form';

import { useRequest } from 'ahooks';

import styles from './style/index.module.less';

const { Title, Text } = Typography;

const { useForm } = Form;

function PostListPage() {
  const history = useHistory();

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });
  const [formParams, setFormParams] = useState({});

  const [baseMaterialList, setBaseMaterialList] = useState([]);

  const columns: TableColumnProps[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      //   hide: true,
      render: (value) => <Text>{value}</Text>,
    },
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '用时',
      dataIndex: 'time',
      align: 'center',
      render: (value) => <Text>{value || '/'}</Text>,
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      align: 'center',
      render: (value) => <Text>{value || '/'}</Text>,
    },
    {
      title: '所需材料',
      dataIndex: 'materials',
      align: 'center',
      render: (_, record) => <Text>{_ || '/'}</Text>,
    },
    {
      title: '所需厨具',
      dataIndex: 'cookware',
      align: 'center',
      render: (_, record) => <Text>{_ || '/'}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (x) => {
        // if (x === 0) {
        //   return <Badge status="error" text={Status[x]}></Badge>;
        // }
        return <Badge status="success" text={'启用'}></Badge>;
      },
    },
    {
      title: '选择次数',
      dataIndex: 'count',
      sorter: (a, b) => +a.count - +b.count,
      align: 'center',
      render(x) {
        return Number(x).toLocaleString();
      },
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
    // handleGetIngredients(values)
  }

  return (
    <Card>
      <Title heading={6}>菜谱管理</Title>
      <SearchForm
        onSearch={handleSearch}
        baseMaterialList={baseMaterialList}
        cookwareList={[]}
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
        data={data}
      />
    </Card>
  );
}

export default PostListPage;
