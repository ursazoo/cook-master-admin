import React from 'react';
import { Form, Input, Select, Button, Grid } from '@arco-design/web-react';
import { IconRefresh, IconSearch } from '@arco-design/web-react/icon';
import styles from '../style/index.module.less';

const { Row, Col } = Grid;
const { useForm, Item: FormItem } = Form;

export const Status = ['未上线', '已上线'];

const { OptGroup, Option } = Select;

function SearchForm(props: {
  primaryMaterialList: any[];
  onSearch: (values: Record<string, any>) => void;
}) {
  const [searchForm] = useForm();

  const handleSubmit = () => {
    const values = searchForm.getFieldsValue();
    props.onSearch(values);
  };

  const handleReset = () => {
    searchForm.resetFields();
    props.onSearch({});
  };

  return (
    <div className={styles['search-form-wrapper']}>
      <Form
        form={searchForm}
        className={styles['search-form']}
        labelAlign="left"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
      >
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label="用户账号" field="account">
              <Input allowClear placeholder="请输入用户账号" />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="用户昵称" field="name">
              <Input allowClear placeholder="请输入用户昵称" />
            </FormItem>
          </Col>
          {/* <Col span={8}>
            <Form.Item label={'筛选方式'} field="filterType">
              <Select
                placeholder={'全部'}
                options={FilterType.map((item, index) => ({
                  label: item,
                  value: index,
                }))}
                mode="multiple"
                allowClear
              />
            </Form.Item>
          </Col> */}
          {/* <Col span={8}>
            <Form.Item label={'创建时间'} field="createdTime">
              <DatePicker.RangePicker
                allowClear
                style={{ width: '100%' }}
                disabledDate={(date) => dayjs(date).isAfter(dayjs())}
              />
            </Form.Item>
          </Col> */}
          {/* <Col span={8}>
            <Form.Item label={'状态'} field="status">
              <Select
                placeholder={'全部'}
                options={Status.map((item, index) => ({
                  label: item,
                  value: index,
                }))}
                mode="multiple"
                allowClear
              />
            </Form.Item>
          </Col> */}
        </Row>
      </Form>
      <div className={styles['right-button']}>
        <Button
          style={{ marginRight: '10px' }}
          type="primary"
          icon={<IconSearch />}
          onClick={handleSubmit}
        >
          搜索
        </Button>
        <Button icon={<IconRefresh />} onClick={handleReset}>
          重置
        </Button>
      </div>
    </div>
  );
}

export default SearchForm;
