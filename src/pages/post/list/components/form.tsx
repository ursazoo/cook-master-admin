import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  materialList: any[];
  cookwareList: any[];
  onSearch: (values: Record<string, any>) => void;
}) {
  const [searchForm] = useForm();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const baseMaterialId = params.get('base-material-id');
  const cookwareId = params.get('cookware-id');
  const postTitle = params.get('post-title');

  const handleSubmit = () => {
    const values = searchForm.getFieldsValue();
    props.onSearch(values);
  };

  const handleReset = () => {
    searchForm.resetFields();
    props.onSearch({});
  };

  // const [materialList, setMaterialList] = useState(props?.materialList || []);
  const [fetching, setFetching] = useState(false);
  const refFetchId = useRef(null);

  const debouncedFetchUser = useCallback((inputValue) => {
    refFetchId.current = Date.now();
    const fetchId = refFetchId.current;
    setFetching(true);
    // setMaterialList([]);
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
        }
      });
  }, []);

  useEffect(() => {
    searchForm.setFieldsValue({
      title: postTitle,
      baseMaterialIds: baseMaterialId ? [baseMaterialId] : [],
      cookwareIds: cookwareId ? [cookwareId] : [],
    });
    handleSubmit();
    // props.onSearch({
    //   title: postTitle,
    //   baseMaterialIds: baseMaterialId ?[baseMaterialId] : [],
    //   cookwareIds: cookwareId ? [cookwareId] : []
    // });
  }, [postTitle, baseMaterialId, cookwareId]);

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
            <Form.Item label="菜谱名称" field="title">
              <Input placeholder="请输入菜谱名称" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="基础材料" field="baseMaterialIds">
              {/* <Select
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
              /> */}
              <Select
                showSearch
                allowClear
                placeholder="请选择基础材料"
                mode="multiple"
                filterOption={(inputValue, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(inputValue.toLowerCase()) >= 0
                }
              >
                {props?.materialList?.map((options) => (
                  <OptGroup
                    label={`${options.primaryMaterial.name}-${options.name}`}
                    key={options.id}
                  >
                    {options.baseMaterialList.map((option) => (
                      <Option key={option.id} value={option.id}>
                        {option.name}
                      </Option>
                    ))}
                  </OptGroup>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="厨具" field="cookwareIds">
              <Select
                mode="multiple"
                showSearch
                allowClear
                placeholder="请选择厨具"
              >
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
