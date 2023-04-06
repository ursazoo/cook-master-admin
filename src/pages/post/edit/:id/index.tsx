import React, { useState, useEffect, useMemo } from 'react';
import Cherry from 'cherry-markdown';
import {
  Card,
  Form,
  Select,
  Grid,
  Input,
  Button,
  Space,
  Message,
  Breadcrumb,
} from '@arco-design/web-react';
import { useHistory, useParams } from 'react-router-dom';
import 'cherry-markdown/dist/cherry-markdown.css';
import styles from './styles/index.module.less';
import { getBaseMaterialList } from '@/common/apis/material/base';
import { useRequest, useDebounce, useDebounceFn } from 'ahooks';
import { getSecondaryMaterialList } from '@/common/apis/material/secondary';
import { getAllUserList } from '@/common/apis/user/find';
import { getCookwareList } from '@/common/apis/material/cookware';
import {
  createPost,
  editPost,
  getPostDetail,
} from '../../../../common/apis/post/index';

const BreadcrumbItem = Breadcrumb.Item;
const { OptGroup, Option } = Select;
const { Row, Col } = Grid;
export const DIFFICULTY = ['简单', '中等', '困难'];
export const TIME = [
  '15分钟以内',
  '30分钟以内',
  '1小时以内',
  '2小时以内',
  '大于2小时',
];

const PostEditPage = () => {
  const history = useHistory();
  const { id: postId }: { id: string } = useParams();
  console.log(`postId: ${postId}`);
  const [form] = Form.useForm();
  const [cherry, setCherry] = useState<Cherry>();

  const basicConfig = useMemo(
    () => ({
      id: 'markdown-container',
      isPreviewOnly: false,
      engine: {
        global: {},
        syntax: {
          codeBlock: {
            theme: 'twilight',
          },
          table: {
            enableChart: false,
            // chartEngine: Engine Class
          },
          fontEmphasis: {
            allowWhitespace: false, // 是否允许首尾空格
          },
          strikethrough: {
            needWhitespace: false, // 是否必须有前后空格
          },
          mathBlock: {
            engine: 'MathJax', // katex或MathJax
            src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js', // 如果使用MathJax plugins，则需要使用该url通过script标签引入
          },
          inlineMath: {
            engine: 'MathJax', // katex或MathJax
          },
          emoji: {
            useUnicode: false,
            customResourceURL:
              'https://github.githubassets.com/images/icons/emoji/unicode/${code}.png?v8',
            upperCase: true,
          },
          // toc: {
          //     tocStyle: 'nested'
          // }
          // 'header': {
          //   strict: false
          // }
        },
        customSyntax: {
          // SyntaxHookClass
        },
      },
      toolbars: {
        toolbar: [
          'bold',
          'italic',
          {
            strikethrough: [
              'strikethrough',
              'underline',
              'sub',
              'sup',
              'ruby',
              'customMenuAName',
            ],
          },
          'size',
          '|',
          'color',
          'header',
          '|',
          'ol',
          'ul',
          'checklist',
          'panel',
          'detail',
          '|',
          // 'formula',
          {
            insert: [
              'image',
              'audio',
              'video',
              'link',
              'hr',
              'br',
              'code',
              'formula',
              'toc',
              'table',
              'pdf',
              'word',
              'ruby',
            ],
          },
          // 'graph',
          // 'togglePreview',
          'settings',
          'switchModel',
          'codeTheme',
          'export',
          // 'theme'
        ],
        bubble: [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'sub',
          'sup',
          'quote',
          'ruby',
          '|',
          'size',
          'color',
        ], // array or false
        // sidebar: ['mobilePreview', 'copy', 'theme'],
      },
      editor: {
        defaultModel: 'edit&preview',
        height: '80vh',
      },
      previewer: {
        // 自定义markdown预览区域class
        // className: 'markdown'
      },
      keydown: [],
      //extensions: [],
    }),
    []
  );

  const [secondaryMaterialList, setSecondaryMaterialList] = useState([]);
  const [cookwareList, setCookwareList] = useState([]);
  const [authorList, setAuthorList] = useState([]);
  const [editInfo, setEditInfo] = useState<any>();

  useRequest(getSecondaryMaterialList, {
    onSuccess: (result) => {
      console.log(result);
      if (result?.success) {
        setSecondaryMaterialList(result?.data?.list || []);
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  useRequest(getAllUserList, {
    defaultParams: [
      {
        pageNum: 1,
        pageSize: 20,
      },
    ],
    onSuccess: (result) => {
      console.log(result);
      if (result?.success) {
        setAuthorList(result?.data?.list || []);
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  useRequest(getCookwareList, {
    onSuccess: (result) => {
      console.log(result);
      if (result?.success) {
        setCookwareList(result?.data?.list || []);
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  useRequest(getPostDetail, {
    defaultParams: [
      {
        id: postId,
      },
    ],
    onSuccess: (result) => {
      if (result?.success) {
        console.log(result);

        setEditInfo(result?.data);
        form.setFieldsValue({
          title: result?.data?.title,
          authorId: result?.data?.author?.id,
          baseMaterialIds: result?.data?.baseMaterialList.map(
            (item) => item.id
          ),
          cookwareIds: result?.data?.cookwareList.map((item) => item.id),
        });
        cherry.setMarkdown(result?.data?.content || '');
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const { run: handleEditPost } = useRequest(editPost, {
    manual: true,
    onSuccess: (result) => {
      if (result?.success) {
        Message.success('修改菜谱成功');
        history.replace(`/post/list`);
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  function onSubmit(published: boolean) {
    form.validate().then((values) => {
      handleEditPost({
        id: postId,
        title: values.title,
        content: cherry?.getMarkdown(),
        authorId: values.authorId,
        baseMaterialIds: values.baseMaterialIds,
        cookwareIds: values.cookwareIds,
        published,
      });
    });
  }

  useEffect(() => {
    // const cherryInstance: any = new Cherry(basicConfig);
    setCherry(new Cherry(basicConfig));
  }, [basicConfig]);

  return (
    <>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <BreadcrumbItem>菜谱管理</BreadcrumbItem>
        <BreadcrumbItem href="/post/list">菜谱列表</BreadcrumbItem>
        <BreadcrumbItem>菜谱编辑</BreadcrumbItem>
        <BreadcrumbItem>{editInfo?.title}</BreadcrumbItem>
      </Breadcrumb>
      <Card>
        <Form
          form={form}
          labelAlign="right"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
        >
          <Row gutter={24}>
            {/* 菜谱名称 */}
            <Col span={6}>
              <Form.Item
                label={'菜谱名称'}
                field="title"
                rules={[
                  {
                    required: true,
                    message: '菜谱名称是必填项',
                  },
                ]}
              >
                <Input allowClear placeholder={'请输入菜谱名称'} />
              </Form.Item>
            </Col>

            {/* 菜谱作者 */}
            <Col span={6}>
              <Form.Item required label={'菜谱作者'} field="authorId">
                {/* <Input allowClear placeholder={'请输入菜谱作者'} /> */}
                <Select
                  placeholder={'请选择菜谱作者'}
                  options={authorList.map((label) => ({
                    label: label.name,
                    value: label.id,
                  }))}
                />
              </Form.Item>
            </Col>

            {/* 菜谱难度 */}
            {/* <Col span={6}>
            <Form.Item
              label={'菜谱难度'}
              field="difficulty"
              rules={[
                {
                  required: true,
                  message: '菜谱难度是必选项',
                },
              ]}
            >
              <Select
                placeholder={'请选择菜谱难度'}
                options={DIFFICULTY.map((label, value) => ({
                  label,
                  value,
                }))}
              />
            </Form.Item>
          </Col> */}

            {/* 花费时间 */}
            {/* <Col span={6}>
            <Form.Item
              label={'花费时间'}
              field="time"
              rules={[
                {
                  required: true,
                  message: '花费时间是必选项',
                },
              ]}
            >
              <Select
                placeholder={'请选择花费时间'}
                options={TIME.map((label, value) => ({
                  label,
                  value,
                }))}
              />
            </Form.Item>
          </Col> */}

            {/* 厨具 */}
            <Col span={6}>
              <Form.Item
                label="所需厨具"
                field="cookwareIds"
                rules={[
                  {
                    required: true,
                    message: '厨具是必选项',
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  showSearch
                  allowClear
                  placeholder="请选择厨具"
                >
                  {cookwareList.map((option) => (
                    <Option key={option.id} value={option.id}>
                      {option.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                label="基础材料"
                field="baseMaterialIds"
                rules={[
                  {
                    required: true,
                    message: '基础材料是必选项',
                  },
                ]}
              >
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
                  {secondaryMaterialList.map((options) => (
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
        <Space style={{ margin: '5px 0 15px' }}>
          <Button type="outline" onClick={() => onSubmit(false)}>
            保存为草稿
          </Button>
          <Button
            type="primary"
            status="success"
            onClick={() => onSubmit(true)}
          >
            更新菜谱
          </Button>
        </Space>
        <div id="markdown-container"></div>
      </Card>
    </>
  );
};

export default PostEditPage;
