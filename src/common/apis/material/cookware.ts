import request from '@/common/request';

interface APIResponse {
  code: number;
  success: boolean;
  data: {
    list: ICookware[];
  };
  message: string;
}

export interface ICookware {
  id: string;
  name: string;
  posts: any[];
}

export const getCookwareList = (): Promise<APIResponse> => {
  return request.get('/api/cookware/list');
};

export const createCookware = (data: {
  name: string;
}): Promise<APIResponse> => {
  return request.post('/api/cookware/create', data);
};

export const editCookware = (
  id,
  data: {
    name: string;
  }
): Promise<APIResponse> => {
  return request.patch(`/api/cookware/${id}`, data);
};
