import {request} from "../request";

interface ISigninParam {
    account: string;
    password: string;
}

export const signin = (data: ISigninParam) => {
    return request('/api/user/signin', {
        method: 'POST',
        data
    });
}