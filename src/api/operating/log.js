
import request from '@/router/axios';
import website from "../../const/website";


export const findAllLogsByDay = (params) => request({
    url: website.path + '/operating/logs/',
    method: 'get',
    params: params
});
export const findAllLogsByBefore = (days) => request({
    url: website.path + '/operating/logs/' + days + "/before",
    method: 'get',
});