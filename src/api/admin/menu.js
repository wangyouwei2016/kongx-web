import request from '@/router/axios';
import website from '@/const/website'
export const findAllMenu = () => request({
    url: website.path + '/system/function/tree',
    method: 'get'
});

export const findAllMenuByRole = () => request({
    url: website.path + '/system/function/menu/role',
    method: 'get'
});

export const addSystemFunction = (systemFunction) => request({
    url: website.path + '/system/function',
    method: 'post',
    data: systemFunction
});

export const updateSystemFunction = (systemFunction) => request({
    url: website.path + '/system/function/' + systemFunction.id,
    method: 'post',
    data: systemFunction
});

export const removeSystemFunction = (systemFunction) => request({
    url: website.path + '/system/function/' + systemFunction.id,
    method: 'delete',
});