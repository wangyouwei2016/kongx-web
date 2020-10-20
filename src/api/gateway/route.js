/**
 * @title 一级菜单: 网关管理下辖所属菜单 api
 */
import request from '@/router/axios';
import website from '@/const/website';

/**
 * @title 网关策略
 * @param page...
 */
export const findAll = (page) => request({
    url: website.path + '/kong/api/routes',
    method: 'get'
});

export const findAllService = () => request({
    url: website.path + '/kong/api/services',
    method: 'get'
})

export const routeSave = (row) => request({
    url: website.path + '/kong/api/services/' + row.service.id + '/routes',
    method: 'post',
    data: row
});
export const routeUpdate = (row) => request({
    url: website.path + '/kong/api/routes/' + row.id,
    method: 'post',
    data: row
});
export const routeDel = (id) => request({
    url: website.path + '/kong/api/routes/' + id.id,
    method: 'delete'
});

export const findAllByService = (row, client) => request({
    url: website.path + '/kong/api/services/' + row.name + '/routes/list',
    method: 'post',
    data: client
});

export const findAllByPlugin = (row) => request({
    url: website.path + '/kong/api/plugins/' + row.id + '/routes',
    method: 'get'
});

export const updateRouteHosts = (routeParams) => request({
    url: website.path + '/kong/api/routes/hosts',
    method: 'post',
    data: routeParams
});