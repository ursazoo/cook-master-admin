import React, { useCallback, useRef, useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Grid,
  Spin,
  Avatar,
} from '@arco-design/web-react';
import { IconRefresh, IconSearch } from '@arco-design/web-react/icon';
import { useDebounce } from 'ahooks';
import styles from '../style/index.module.less';

const { Row, Col } = Grid;
const { useForm } = Form;
export const Status = ['未上线', '已上线'];

const { OptGroup, Option } = Select;

function SearchForm(props: {
  baseMaterialList: any[];
  cookwareList: any[];
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

  const [options, setOptions] = useState(props?.baseMaterialList || []);
  const [fetching, setFetching] = useState(false);
  const refFetchId = useRef(null);

  const debouncedFetchUser = useCallback((inputValue) => {
    refFetchId.current = Date.now();
    const fetchId = refFetchId.current;
    setFetching(true);
    setOptions([]);
    fetch('https://randomuser.me/api/?results=5')
      .then((response) => response.json())
      .then((body) => {
        if (refFetchId.current === fetchId) {
          const options = body.results.map((user) => ({
            label: (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar size={24} style={{ marginLeft: 6, marginRight: 12 }}>
                  <img alt="avatar" src={user.picture.thumbnail} />
                </Avatar>
                {`${user.name.first} ${user.name.last}`}
              </div>
            ),
            value: user.email,
          }));
          setFetching(false);
          setOptions(options);
        }
      });
  }, []);

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
          <Col span={12}>
            <Form.Item label="基础材料" field="name">
              <Select
                // style={{ width: 345 }}
                showSearch
                mode="multiple"
                options={options}
                placeholder="请输入基础材料名称"
                filterOption={false}
                renderFormat={(option: any) => {
                  return option?.children?.props?.children?.[1];
                }}
                notFoundContent={
                  fetching ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Spin style={{ margin: 12 }} />
                    </div>
                  ) : null
                }
                onSearch={debouncedFetchUser}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="厨具" field="cookwareId">
              <Select showSearch allowClear placeholder="请选择厨具">
                {props?.cookwareList.map((option, index) => {
                  return (
                    <Option key={`option_${option.id}`} value={option.id}>
                      {option.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
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
