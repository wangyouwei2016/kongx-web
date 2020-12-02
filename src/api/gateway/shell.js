import request from '@/router/axios';
import website from '@/const/website';

/**
 * @title 网关策略
 * @param page...
 */
export const ping = (page) => request({
    url: website.path + '/kong/api/ping/shell',
    method: 'get'
});

export const shell_url = website.path + "/shell"