import request from '@/common/request';

interface APIResponse {
  code: number;
  success: boolean;
  data: {
    list: IPrimaryMaterial[];
  };
  message: string;
}

export interface IPrimaryMaterial {
  id: string;
  name: string;
  secondaryMaterialList: ISecondaryMaterial[];
}

export interface ISecondaryMaterial {
  id: string;
  name: string;
  primaryMaterialId: string;
}

export const getPrimaryMaterialList = (): Promise<APIResponse> => {
  return request.get('/api/primary-material/list');
};

export const createPrimaryMaterial = (data: {
  name: string;
}): Promise<APIResponse> => {
  return request.post('/api/primary-material/create', data);
};

export const editPrimaryMaterial = (
  id,
  data: {
    name: string;
  }
): Promise<APIResponse> => {
  return request.patch(`/api/primary-material/${id}`, data);
};
