import request from '@/common/request';

interface APIResponse<T> {
  code: number;
  success: boolean;
  data: T;
  message: string;
}

export const getAllUserList = (data: any): Promise<APIResponse<any>> => {
  return request.post('/api/user/list', data);
};
