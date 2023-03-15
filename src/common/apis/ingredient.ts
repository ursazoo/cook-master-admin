import axios from "axios";

interface APIResponse<T> {
    code: number;
    success: boolean;
    data: T;
    message: string;
  }
  
  export interface IIngredient {
      id: number;
      name: string;
      count: number;
      emoji: string;
      ingredientSubType: {
        id: number;
        name: string;
      }
    }

  interface IGetIngredientsParams {
    name?: string;
    ingredientSubTypeId?: number;
  }

  interface IEditIngredientParams {
    name?: string;
    emoji?: string;
    ingredientSubTypeId?: number;
    postIds?: number[];
  }
  
export const getIngredients = (params?: IGetIngredientsParams):Promise<APIResponse<{list: IIngredient[]}>> => {
    return axios.get('/api/ingredient/list', {
        params
    });
}

export const createIngredient = (data: any):Promise<APIResponse<{list: IIngredient[]}>> => {
  return axios.post('/api/ingredient/create', data);
}

export const editIngredient = (id: number, data: IEditIngredientParams):Promise<APIResponse<null>> => {
  return axios.patch(`/api/ingredient/${id}`, data);
}