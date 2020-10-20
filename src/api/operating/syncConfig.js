import request from '@/router/axios';
import website from '@/const/website';

export const findAllByPage = (page) => request({
    url: website.path + '/kong/sync/configs/',
    method: 'get',
    params: page
});

export const findAllSyncLog = (syncNo) => request({
    url: website.path + '/kong/sync/configs/' + syncNo + "/logs",
    method: 'get'
});

export const findSyncConfig = (syncNo) => request({
    url: website.path + '/kong/sync/configs/' + syncNo + "/config",
    method: 'get'
});

export const findEachSyncLog = (params) => request({
    url: website.path + '/kong/sync/configs/logs',
    method: 'get',
    params: params
});