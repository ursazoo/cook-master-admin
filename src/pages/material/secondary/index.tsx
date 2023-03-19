import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  PaginationProps,
  Button,
  Space,
  Form,
  Typography,
  Input,
  Modal,
  Select,
  TableColumnProps,
  Message,
} from '@arco-design/web-react';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import { SketchPicker } from 'react-color';

import dayjs from 'dayjs';
import styles from './style/index.module.less';
import FormItem from '@arco-design/web-react/es/Form/form-item';
import { useRequest } from 'ahooks';
import {
  getSecondaryMaterialList,
  createSecondaryMaterial,
  editSecondaryMaterial,
} from '@/common/apis/material/secondary';
import { getPrimaryMaterialList } from '@/common/apis/material/primary';

const { Title, Text } = Typography;
const { OptGroup, Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};
const { useForm } = Form;
function SecondaryMaterialListPage() {
  const [infoForm] = useForm();
  const [current, setCurrent] = useState<any>({});
  const [visible, setVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });
  const [formParams, setFormParams] = useState({});
  const [secondaryMaterialList, setSecondaryMaterialList] = useState<any[]>([]);
  const [primaryMaterialList, setPrimaryMaterialList] = useState<any[]>([]);

  const columns: TableColumnProps[] = [
    // {
    //   title: 'ID',
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
      title: '颜色',
      dataIndex: 'color',
      align: 'center',
      render: (_) => {
        return (
          <div style={{ color: '50px', height: '20px', background: _ }}></div>
        );
      },
    },
    {
      title: '所属一级分类',
      dataIndex: 'primaryMaterial',
      align: 'center',
      render: (_) => _?.name || '/',
    },

    // {
    //   title: '基础材料',
    //   dataIndex: 'ingredients',
    //   align: 'center',
    //   render: (_) =>
    //     _.map((item) => (
    //       <Tag style={{ margin: '0 5px' }} key={item.id} color="green">
    //         {item.name}
    //       </Tag>
    //     )),
    // },
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
      // headerCellStyle: { paddingLeft: '15px' },
      align: 'center',
      render: (_, record) => (
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
      ),
    },
  ];

  const { run: handleGetPrimaryMaterialList } = useRequest(
    getPrimaryMaterialList,
    {
      manual: true,
      onSuccess: (result) => {
        if (result.success) {
          console.log(result);
          // setsecondaryMaterialList(result.data.list || []);
          setPrimaryMaterialList(result.data.list || []);
        }
      },
      onError: (e) => {
        console.log(e);
      },
    }
  );

  const { run: handleGetSecondaryMaterialList, loading } = useRequest(
    getSecondaryMaterialList,
    {
      // manual: true,
      onSuccess: (result) => {
        if (result.success) {
          setSecondaryMaterialList(result.data.list || []);
        }
      },
      onError: (e) => {
        console.log(e);
      },
    }
  );

  const { run: handleCreateSecondaryMaterial } = useRequest(
    createSecondaryMaterial,
    {
      manual: true,
      onSuccess: (result) => {
        if (result.success) {
          Message.success(result?.message);
          setVisible(false);
          setConfirmLoading(false);
          handleGetSecondaryMaterialList();
        }
      },
      onError: (e) => {
        console.log(e);
      },
    }
  );

  const { run: handleEditSecondaryMaterial } = useRequest(
    editSecondaryMaterial,
    {
      manual: true,
      onSuccess: (result) => {
        if (result.success) {
          Message.success(result?.message);
          setVisible(false);
          setConfirmLoading(false);
          handleGetSecondaryMaterialList();
        }
      },
      onError: (e) => {
        console.log(e);
      },
    }
  );

  // useEffect(() => {
  //   fetchData();
  // }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  useEffect(() => {
    if (visible) {
      setModalTitle(`${current ? '编辑' : '新建'}二级分类`);
      // 获取数据
      handleGetPrimaryMaterialList();
      if (current?.id) {
        infoForm.setFieldsValue({
          name: current.name,
          color: current.color,
          primaryMaterialId: current.primaryMaterial.id,
        });
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
    setFormParams(values);
    // handleGetIngredientsecondaryMaterialList(values)
  }

  // 保存基础材料信息弹窗
  function onOk() {
    infoForm.validate().then((values) => {
      console.log(values);
      setConfirmLoading(true);

      if (current.id) {
        handleEditSecondaryMaterial(current.id, values);
      } else {
        handleCreateSecondaryMaterial(values);
      }
      setTimeout(() => {
        setVisible(false);
        setConfirmLoading(false);
      }, 1500);
    });
  }

  return (
    <Card>
      <Title heading={6}>二级分类管理</Title>
      {/* <SearchForm onSearch={handleSearch} secondaryMaterialList={secondaryMaterialList} primaryMaterialList={primaryMaterialList}/> */}
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
        data={secondaryMaterialList}
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
            <Input allowClear placeholder="输入名称" />
          </FormItem>
          <FormItem
            label="颜色"
            field="color"
            rules={[{ required: true, message: '颜色是必选项' }]}
          >
            <div>
              <div
                className={styles.colorPickerBtn}
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <div
                  className={styles.colorPickerInner}
                  style={{ background: current?.color || '#fff' }}
                />
              </div>
              {showColorPicker ? (
                <div className={styles.colorPopover}>
                  <div
                    className={styles.colorCover}
                    onClick={() => setShowColorPicker(false)}
                  />
                  <SketchPicker
                    color={current?.color}
                    onChange={(newColor) => {
                      setCurrent({
                        ...current,
                        color: newColor.hex,
                      });
                      infoForm.setFieldValue('color', newColor.hex);
                    }}
                  />
                </div>
              ) : null}
            </div>
          </FormItem>
          <FormItem
            label="所属分类"
            field="primaryMaterialId"
            rules={[{ required: true, message: '所属分类是必选项' }]}
          >
            <Select
              showSearch
              allowClear
              placeholder="选择所属分类"
              style={{ width: 200 }}
            >
              {primaryMaterialList.map((option) => {
                return (
                  <Option key={`option_${option.id}`} value={option.id}>
                    {option.name}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        </Form>
      </Modal>
    </Card>
  );
}

export default SecondaryMaterialListPage;
