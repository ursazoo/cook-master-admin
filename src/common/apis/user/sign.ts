import request from '@/common/request';

interface APIResponse<T> {
  code: number;
  success: boolean;
  data: T;
  message: string;
}

export const signup = (data: any): Promise<APIResponse<any>> => {
  return request.post('/api/user/signup', data);
};

export const signin = (data: any): Promise<APIResponse<any>> => {
  return request.post('/api/user/signin', data);
};
