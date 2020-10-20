import request from '@/router/axios';
import website from '@/const/website';

export const findInfo = () => request({
    url: website.path + '/kong/api/info',
    method: 'get'
});

export const findStatus = () => request({
    url: website.path + '/kong/api/status',
    method: 'get'
});
