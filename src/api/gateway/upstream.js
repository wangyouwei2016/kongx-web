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
    url: website.path + '/kong/api/upstreams',
    method: 'get'
});
export const upstreamSave = (row) => request({
    url: website.path + '/kong/api/upstreams',
    method: 'post',
    data: row
});
export const upstreamUpdate = (row) => request({
    url: website.path + '/kong/api/upstreams/' + row.id,
    method: 'post',
    data: row
});
export const upstreamDel = (id) => request({
    url: website.path + '/kong/api/upstreams/' + id.id,
    method: 'delete'
});

export const findTargets = (upstream, client) => request({
    url: website.path + '/kong/api/upstreams/' + upstream.id + '/targets/health',
    method: 'post',
    data: client
});
export const addTargets = (target) => request({
    url: website.path + '/kong/api/upstreams/' + target.upstream.id + '/targets',
    method: 'post',
    data: target
});

export const targetDel = (data) => request({
    url: website.path + '/kong/api/upstreams/' + data.upstream.id + "/targets/" + data.id,
    method: 'delete'
});