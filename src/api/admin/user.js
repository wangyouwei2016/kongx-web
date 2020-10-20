import request from '@/router/axios';
import website from '@/const/website'

export const saveUser = (data) => request({
    url: website.path + '/system/user',
    method: 'post',
    data: data
});


export const updateUser = (data) => request({
    url: website.path + '/system/user/' + data.userId,
    method: 'post',
    data: data
});


export const resetpwd = (userId) => request({
    url: website.path + '/system/user/reset/' + userId + "/",
    method: 'post',
});

export const modifypwd = (data) => request({
    url: website.path + '/system/user/modifypwd/',
    method: 'post',
    data: data
});

export const setStatus = (status, userId) => request({
    url: website.path + '/system/user/status/' + status + "/" + userId + "/",
    method: 'post',
});

export const updateUserRole = (data) => request({
    url: website.path + '/system/user/updateUserRole',
    method: 'post',
    data: data
});

export const findAllByPage = (page) => request({
    url: website.path + '/system/user/page',
    method: 'get',
    params: page
});



export const findAllUsers = (page) => request({
    url: website.path + '/system/user/list',
    method: 'get',
    params: page
});