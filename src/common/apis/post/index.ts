import request from '@/common/request';

interface APIResponse<T> {
  code: number;
  success: boolean;
  data: T;
  message: string;
}

export const createPost = (data: any): Promise<APIResponse<any>> => {
  return request.post('/api/post', data);
};

export const getPostList = (): Promise<APIResponse<any>> => {
  return request.get('/api/post');
};

export const getPostDetail = (id: string): Promise<APIResponse<any>> => {
  return request.get(`/api/post/${id}`);
};

export const editPost = (id: string, data: any): Promise<APIResponse<any>> => {
  return request.patch(`/api/post/${id}`, data);
};
