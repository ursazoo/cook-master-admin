import { request } from '../request';

interface APIResponse {
  code: number;
  success: boolean;
  data: {
    list: IIngredientSubType[];
  };
  message: string;
}

interface IIngredientSubType {
  id: number;
  name: string;
  ingredients: IIngredientSubType[];
}

export const getIngredientSubTypes = (): Promise<APIResponse> => {
  return request('/api/ingredient-sub-type/list', {
    method: 'GET',
  });
};

export const createIngredientSubType = (data: any): Promise<any> => {
    return request('/api/ingredient-sub-type/create', {
        method: 'POST',
        data
      });
}