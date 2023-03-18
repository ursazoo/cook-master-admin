import { request } from '../request';

interface APIResponse {
  code: number;
  success: boolean;
  data: {
    list: IIngredientType[];
  };
  message: string;
}

export interface IIngredientType {
    id: number;
    name: string;
    ingredientSubTypes: IIngredientSubType[];
  }

export interface IIngredientSubType {
  id: number;
  ingredientTypeId: number;
  name: string;
}

export const getIngredientTypes = (): Promise<APIResponse> => {
  return request('/api/ingredient-type/list', {
    method: 'GET',
  });
};
