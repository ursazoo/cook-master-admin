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
} from '@arco-design/web-react';
import dayjs from 'dayjs';
// import PermissionWrapper from '@/components/PermissionWrapper';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import axios from 'axios';
import SearchForm from './components/form';
// import locale from './locale';
import styles from './style/index.module.less';
import './mock';
// import { getColumns } from './constants';
import FormItem from '@arco-design/web-react/es/Form/form-item';
import {
  getIngredientTypes,
  IIngredientType,
} from '@/common/apis/ingredientType';
import { useRequest } from 'ahooks';
import { createIngredient, editIngredient, getIngredients } from '@/common/apis/ingredient';

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

function IngredientBasePage() {
  const [infoForm] = useForm();
  const [current, setCurrent] = useState<any>();

  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const [data, setData] = useState([]);
  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });
  // const [loading, setLoading] = useState(true);
  const [formParams, setFormParams] = useState({});
  const [typeGroups, setTypeGroups] = useState<IIngredientType[]>([]);

  const columns: TableColumnProps[] = [
    {
      title: 'id',
      dataIndex: 'id',
      align: 'center',
      render: (value) => <Text>{value}</Text>,
    },
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: 'emoji',
      dataIndex: 'emoji',
      align: 'center',
      render: (value) => <Text>{value || '/'}</Text>,
    },
    {
      title: '所属二级类型',
      dataIndex: 'ingredientSubType',
      align: 'center',
      render: (_) => _.name,
    },
    {
      title: '可选菜谱',
      dataIndex: 'posts',
      align: 'center',
      render: (_) => _?.length || 0,
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
      title: '创建时间',
      dataIndex: 'createdAt',
      align: 'center',
      render: (x) => dayjs(x).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix(),
    },
    {
      title: '操作',
      dataIndex: 'operations',
      align: 'center',
      render: (_, record) => {
        return <>
          <Button
          type="text"
          size="small"
          onClick={() => {
            setCurrent(record)
            setVisible(true)
          }}
        >
          编辑
        </Button>
        <Button
          status='danger'
          type="text"
          size="small"
        >
          删除
        </Button>
        </>
      },
    },
  ];

  const { run: handleGetIngredients, loading } = useRequest(getIngredients, {
    onSuccess: (result) => {
      if (result.success) {
        setData(result.data.list || []);
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const { run: handleGetIngredientTypes } = useRequest(getIngredientTypes, {
    // manual: true,
    onSuccess: (result) => {
      if (result.success) {
        setTypeGroups(result.data.list || []);
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const { run: handleCreateIngredient } = useRequest(
    createIngredient,
    {
      manual: true,
      onSuccess: (result) => {
        if (result.success) {
          console.log(result);
          Message.success(result?.message);
          setVisible(false);
          setConfirmLoading(false);
          handleGetIngredients();
        }
      },
      onError: (e) => {
        console.log(e);
      },
    }
  );

  const { run: handleEditIngredient } = useRequest(
    editIngredient,
    {
      manual: true,
      onSuccess: (result) => {
        if (result.success) {
          console.log(result);
          Message.success(result?.message);
          setVisible(false);
          setConfirmLoading(false);
          handleGetIngredients();
        }
      },
      onError: (e) => {
        console.log(e);
      },
    }
  );


  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  useEffect(() => {
    if (visible) {
      setModalTitle(`${current? '编辑' : '新建'}基础食材`);
      infoForm.setFieldsValue({
        name: current?.name,
        ingredientSubTypeId: current?.ingredientSubType?.id
      })
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
        setPatination({
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
    setFormParams(values);
    handleGetIngredients(values)
  }

  // 保存基础食材信息弹窗
  function onOk() {
    infoForm.validate().then((values) => {
      setConfirmLoading(true);
      current?.id ? handleEditIngredient(current.id, values) : handleCreateIngredient(values)
    });
  }

  return (
    <Card>
      <Title heading={6}>基础食材管理</Title>
      <SearchForm onSearch={handleSearch} ingredientSubTypes={typeGroups}/>
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
        loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        data={data}
      />
      <Modal
        unmountOnExit={true}
        title={modalTitle}
        visible={visible}
        onOk={onOk}
        confirmLoading={confirmLoading}
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
          <FormItem label="名称" field="name" rules={[{ required: true, message: '名称是必填项' }]}>
            <Input allowClear placeholder="输入名称" />
          </FormItem>
          <FormItem label="所属分类" field="ingredientSubTypeId" rules={[{ required: true, message: '所属分类是必选项' }]}>
            <Select
              showSearch
              allowClear
              placeholder="选择所属分类"
              style={{ width: 200 }}
            >
              {typeGroups.map((options, index) => {
                return (
                  <OptGroup label={options.name} key={`group_${index}`}>
                    {options.ingredientSubTypes.map((option) => (
                      <Option key={`option_${option.id}`} value={option.id}>
                        {option.name}
                      </Option>
                    ))}
                  </OptGroup>
                );
              })}
            </Select>
          </FormItem>
        </Form>
      </Modal>
    </Card>
  );
}

export default IngredientBasePage;
