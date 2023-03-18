import request from '@/common/request';
import { IBaseMaterial } from './base';
interface APIResponse {
  code: number;
  success: boolean;
  data: {
    list: ISecondaryMaterial[];
  };
  message: string;
}

interface ISecondaryMaterial {
  id: string;
  name: string;
  baseMaterialList: IBaseMaterial[];
}

export const getSecondaryMaterialList = (
  params?: any
): Promise<APIResponse> => {
  return request.get('/api/secondary-material/list', {
    params,
  });
};

export const createSecondaryMaterial = (data: any): Promise<any> => {
  return request.post('/api/secondary-material/create', data);
};
