import request from '@/router/axios';
import website from '@/const/website'
export const saveRole = (data) => request({
    url: website.path + '/system/role',
    method: 'post',
    data: data
});


export const updateRole = (data) => request({
    url: website.path + '/system/role/' + data.id,
    method: 'post',
    data: data
});

export const deleteRole = (data) => request({
    url: website.path + '/system/role',
    method: 'delete',
    data: data
});

export const findAllByPage = (page) => request({
    url: website.path + '/system/role/page',
    method: 'get',
    params: page
});


export const findAllRoles = () => request({
    url: website.path + '/system/role/page',
    method: 'get',
    params: {
        start: 0,
        limit: 1000
    }
});


export const updateRoleMenu = (data) => request({
    url: website.path + '/system/role/updateRoleMenu',
    method: 'post',
    data: data
});

export const findMenuByRoleId = (data) => request({
    url: website.path + '/system/role/' + data.id + "/menu",
    method: 'post',
});