import {request} from "../request";

interface IListResponse {
    code: number;
    success: boolean;
    data: {
        list: {
            id: number;
            name: string;
            times: number;
            emoji?: string;
            posts: any[];
            ingredientSubType: any;
        }[] & never[]
    },
    message: string;
}

export const getIngredients = ():Promise<IListResponse> => {
    return request('/api/ingredient/list', {
        method: 'GET',
    });
}