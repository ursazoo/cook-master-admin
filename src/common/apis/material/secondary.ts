import axios from 'axios';

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

export const getIngredientSubTypes = (params?: any): Promise<APIResponse> => {
  return axios.get('/api/ingredient-sub-type/list', {
    params
  });
};

export const createIngredientSubType = (data: any): Promise<any> => {
    return axios.post('/api/ingredient-sub-type/create', data);
}