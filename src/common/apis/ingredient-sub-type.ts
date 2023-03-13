import {request} from "../request";

interface IListResponse {
    code: number;
    success: boolean;
    data: {
        list: {
            id: number;
            name: string;
            ingredients: any[]
        }[] & never[]
    },
    message: string;
}

export const getIngredientSubTypes = ():Promise<IListResponse> => {
    return request('/api/ingredient-sub-type/list', {
        method: 'GET',
    });
}