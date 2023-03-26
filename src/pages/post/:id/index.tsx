import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useRequest } from 'ahooks';

import {
  Breadcrumb,
  Button,
  Card,
  Descriptions,
  Grid,
  Skeleton,
  Space,
  Typography,
} from '@arco-design/web-react';
import { getPostDetail } from '@/common/apis/post';
import Cherry from 'cherry-markdown';
import 'cherry-markdown/dist/cherry-markdown.css';

const BreadcrumbItem = Breadcrumb.Item;

const PostDetailPage = () => {
  const { id: postId }: { id: string } = useParams();
  const [cherry, setCherry] = useState<Cherry>();
  const [detail, setDetail] = useState<any>();
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
        defaultModel: 'previewOnly',
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
  console.log(postId);

  const { run: handleGetPostDetail } = useRequest(getPostDetail, {
    manual: true,
    onSuccess: (result) => {
      if (result.success) {
        console.log(result);
        setDetail(result?.data || {});
        cherry.setMarkdown(result?.data?.content || '');
        // setPostList(result.data.list || []);
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  useEffect(() => {
    if (postId) {
      handleGetPostDetail({ id: postId });
    }
  }, [postId, handleGetPostDetail]);

  useEffect(() => {
    const cherryInstance: any = new Cherry(basicConfig);
    setCherry(cherryInstance);
  }, [basicConfig]);

  return (
    <>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <BreadcrumbItem>菜谱管理</BreadcrumbItem>
        <BreadcrumbItem href="/post/list">菜谱列表</BreadcrumbItem>
        <BreadcrumbItem>{detail?.title}</BreadcrumbItem>
      </Breadcrumb>
      <Card>
        <Grid.Row justify="space-between" align="center">
          <Grid.Col span={16}>
            <Typography.Title heading={6}>{detail?.title}</Typography.Title>
          </Grid.Col>
          <Grid.Col span={8} style={{ textAlign: 'right' }}>
            <Space>
              <Button
                type="primary"
                onClick={() => window.open(`/post/edit/${detail?.id}`)}
              >
                编辑菜谱
              </Button>
            </Space>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Descriptions
            layout="inline-vertical"
            valueStyle={{ width: 400 }}
            title="基础材料"
            data={
              detail?.baseMaterialList?.map((item) => ({
                label: item.secondaryMaterial.name,
                value: item.name,
              })) || {}
            }
            style={{ marginTop: '20px' }}
          />
        </Grid.Row>
        <div id="markdown-container"></div>
      </Card>
    </>
  );
};

export default PostDetailPage;
