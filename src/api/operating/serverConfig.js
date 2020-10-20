import request from '@/router/axios';
import website from '@/const/website';

export const findAll = () => request({
    url: website.path + '/system/server/configs',
    method: 'get'
});

export const addServerConfig = (client) => request({
    url: website.path + '/system/server/configs',
    method: 'post',
    data: client
});
export const updateServerConfig = (client) => request({
    url: website.path + '/system/server/configs/' + client.id,
    method: 'post',
    data: client
});

export const findConfigByKey = (key) => request({
    url: website.path + '/system/server/configs/' + key,
    method: 'get',
});

export const findConfigTypes = () => request({
    url: website.path + '/system/envs/configTypes',
    method: 'get'
});


export const findConfigJsonByKey = (key) => request({
    url: website.path + '/system/server/configs/' + key+"/json",
    method: 'get',
});