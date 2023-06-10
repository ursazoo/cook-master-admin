import request from '@/common/request';

interface APIResponse<T> {
  code: number;
  success: boolean;
  data: T;
  message: string;
}

interface IBaseInfo {
  id: string;
  name: string;
}

interface IPostItem {
  id: string;
  title: string;
  content: string;
  author: IBaseInfo;
  baseMaterialList: (IBaseInfo & { emoji: string })[];
  cookwareList: IBaseInfo[];
}

export const createPost = (data: any): Promise<APIResponse<null>> => {
  return request.post('/api/post', data);
};

export const getPostList = (data: {
  pageNum: number;
  pageSize: number;
  withDetail: boolean;
  authorId?: string;
}): Promise<APIResponse<{ list: IPostItem[] }>> => {
  return request.post('/api/post/list', data);
};

export const getPostDetail = (params: {
  id: string;
}): Promise<APIResponse<IPostItem>> => {
  console.log(params);
  return request.get(`/api/post/${params.id}`);
};

export const editPost = (data: any): Promise<APIResponse<null>> => {
  return request.patch(`/api/post`, data);
};

export const viewPost = (id: string): Promise<APIResponse<null>> => {
  return request.patch(`/api/post/view/${id}`);
};
