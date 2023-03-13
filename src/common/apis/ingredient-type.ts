import {request} from "../request";

interface IListResponse {
    code: number;
    success: boolean;
    data: {
        list: {
            id: number;
            name: string;
            ingredientSubTypes: any[]
        }[] & never[]
    },
    message: string;
}

export const getIngredientTypes = ():Promise<IListResponse> => {
    return request('/api/ingredient-type/list', {
        method: 'GET',
    });
}