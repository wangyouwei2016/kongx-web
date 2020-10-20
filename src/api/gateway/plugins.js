/**
 * @title 一级菜单: 网关管理下辖所属菜单 api
 */
import request from '@/router/axios';
import website from '@/const/website';
export const PREFIX = website.path + "/kong/api/"

export const findAll = (page) => request({
    url: PREFIX + 'plugins',
    method: 'get'
});

export const findAllByRoute = (row) => request({
    url: PREFIX + 'routes/' + row.route.id + '/plugins',
    method: 'get'
});

export const findAllByService = (row) => request({
    url: PREFIX + '/services/' + row.service.id + '/plugins',
    method: 'get'
});

export const findPluginSchema = (name) => request({
    url: PREFIX + '/plugins/schema/' + name,
    method: 'get'
});

export const pluginSave = (row) => request({
    url: PREFIX + '/plugins',
    method: 'post',
    data: row
});

export const pluginRouteSave = (row) => request({
    url: PREFIX + '/routes/' + row.route.id + '/plugins',
    method: 'post',
    data: row
});

export const pluginServiceSave = (row) => request({
    url: PREFIX + '/services/' + row.service.id + '/plugins',
    method: 'post',
    data: row
});
export const pluginUpdate = (row) => request({
    url: PREFIX + '/plugins/' + row.id,
    method: 'post',
    data: row
});

export const pluginsDel = (id) => request({
    url: PREFIX + '/plugins/' + id.id,
    method: 'delete'
});

