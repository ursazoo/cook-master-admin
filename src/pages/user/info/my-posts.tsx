import React, { useEffect } from 'react';
import { Avatar, List, Message } from '@arco-design/web-react';
import { useRequest } from 'ahooks';
import { getPostList } from '@/common/apis/post';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '@/store/userSlice';
import { IconDelete, IconEdit } from '@arco-design/web-react/icon';

function MyPosts() {
  const userInfo = useSelector(selectUserInfo);

  const { data } = useRequest(getPostList, {
    defaultParams: [
      {
        pageNum: 1,
        pageSize: 10,
        authorId: userInfo?.id,
        withDetail: false,
      },
    ],
    onError(e) {
      console.log(e);
      Message.error({
        content: e.message,
        duration: 2000,
      });
    },
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  const render = (actions, item, index) => (
    <List.Item
      key={index}
      actions={actions}
      onClick={() => window.open(`/post/${item.id}`)}
    >
      <List.Item.Meta
        avatar={<Avatar shape="square">{item?.author?.name}</Avatar>}
        title={item.title}
        description={item.baseMaterialList
          ?.map((item) => item?.name)
          ?.join('、')}
      />
    </List.Item>
  );

  return (
    <div>
      <List
        className="list-demo-actions"
        grid={{ gutter: 0, span: 12 }}
        style={{ marginBottom: 48 }}
        dataSource={data?.data?.list}
        render={(item, index) => (
          <List.Item
            key={index}
            actions={[
              <span
                key="edit_icon"
                className="list-demo-actions-icon"
                onClick={() => window.open(`/post/edit/${item.id}`)}
              >
                <IconEdit />
              </span>,
              <span key="delete_icon" className="list-demo-actions-icon">
                <IconDelete />
              </span>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar shape="square">{item?.author?.name}</Avatar>}
              title={
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() => window.open(`/post/${item.id}`)}
                >
                  {item.title}
                </div>
              }
              // description={`所需材料：${item?.baseMaterialList?.map((item) => item?.name).join('、')}`}
            />
          </List.Item>
        )}
      />
    </div>
  );
}

export default MyPosts;
