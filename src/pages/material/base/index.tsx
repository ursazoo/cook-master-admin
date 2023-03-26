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
      title: '颜色',
      dataIndex: 'color',
      align: 'center',
      render: (_) => {
        return (
          <div
            style={{
              width: '50px',
              height: '20px',
              margin: '0 auto',
              background: _,
            }}
          ></div>
        );
      },
    },
    {
      title: '所属二级类型',
      dataIndex: 'secondaryMaterial',
      align: 'center',
      render: (_) => _?.name,
    },
    {
      title: '可选菜谱',
      dataIndex: 'posts',
      align: 'center',
      render: (_, record) => (
        <Link href={`/post/list?base-materil-id=${record.id}`}>
          {_?.length || 0}
        </Link>
      ),
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

  const { run: handleGetBaseMaterialList, loading } = useRequest(
    getBaseMaterialList,
    {
      onSuccess: (result) => {
        if (result.success) {
          setData(result.data.list || []);
        }
      },
      onError: (e) => {
        console.log(e);
      },
    }
  );

  const { run: handleGetPrimaryMaterialList } = useRequest(
    getPrimaryMaterialList,
    {
      // manual: true,
      onSuccess: (result) => {
        if (result.success) {
          setPrimaryMaterialList(result.data.list || []);
        }
      },
      onError: (e) => {
        console.log(e);
      },
    }
  );

  const { run: handleCreateBaseMaterial } = useRequest(createBaseMaterial, {
    manual: true,
    onSuccess: (result) => {
      if (result.success) {
        console.log(result);
        Message.success(result?.message);
        setVisible(false);
        setConfirmLoading(false);
        handleGetBaseMaterialList();
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const { run: handleEditBaseMaterial } = useRequest(editBaseMaterial, {
    manual: true,
    onSuccess: (result) => {
      if (result.success) {
        console.log(result);
        Message.success(result?.message);
        setVisible(false);
        setConfirmLoading(false);
        handleGetBaseMaterialList();
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
    handleGetBaseMaterialList(values);
  }

  // 保存基础材料信息弹窗
  function onOk() {
    infoForm.validate().then((values) => {
      setConfirmLoading(true);
      current?.id
        ? handleEditBaseMaterial(current.id, values)
        : handleCreateBaseMaterial(values);
    });
  }

  return (
    <Card>
      <Title heading={6}>基础材料管理</Title>
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
          <FormItem
            label="名称"
            field="name"
            rules={[{ required: true, message: '名称是必填项' }]}
          >
            <Input allowClear placeholder="输入名称" />
          </FormItem>
          <FormItem
            label="所属分类"
            field="secondaryMaterialId"
            rules={[{ required: true, message: '所属分类是必选项' }]}
          >
            <Select
              showSearch
              allowClear
              placeholder="选择所属分类"
              style={{ width: 200 }}
            >
              {primaryMaterialList.map((options, index) => {
                return (
                  <OptGroup label={options.name} key={`group_${index}`}>
                    {options.secondaryMaterialList.map((option) => (
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

export default BaseMaterialPage;
