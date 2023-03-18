import request from '@/common/request';

interface APIResponse<T> {
  code: number;
  success: boolean;
  data: T;
  message: string;
}

export interface IBaseMaterial {
  id: string;
  name: string;
  count: number;
  emoji: string;
  secondaryMaterial: {
    id: string;
    name: string;
  };
}

interface IGetBaseMaterialListParams {
  name?: string;
  secondaryMaterialId?: string;
}

interface IEditBaseMaterialParams {
  name?: string;
  emoji?: string;
  secondaryMaterialId?: string;
  Ï;
  postIds?: number[];
}

export const getBaseMaterialList = (
  params?: IGetBaseMaterialListParams
): Promise<APIResponse<{ list: IBaseMaterial[] }>> => {
  return request.get('/api/base-material/list', {
    params,
  });
};

export const createBaseMaterial = (
  data: any
): Promise<APIResponse<{ list: IBaseMaterial[] }>> => {
  return request.post('/api/base-material/create', data);
};

export const editBaseMaterial = (
  id: number,
  data: IEditBaseMaterialParams
): Promise<APIResponse<null>> => {
  return request.patch(`/api/base-material/${id}`, data);
};
