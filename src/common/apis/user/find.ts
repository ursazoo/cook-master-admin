import request from '@/common/request';

interface APIResponse<T> {
  code: number;
  success: boolean;
  data: T;
  message: string;
}

export const getAllUser = (): Promise<APIResponse<any>> => {
  return request.get('/api/user');
};
