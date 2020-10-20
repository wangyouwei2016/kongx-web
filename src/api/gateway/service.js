import request from '@/router/axios';
import website from '@/const/website'
export const findAll = () => request({
    url: website.path + '/kong/api/services',
    method: 'get'
})

export const findAllPluginByService = (data, client) => request({
    url: website.path + '/kong/api/services/' + data.id + "/list/plugins",
    method: 'post',
    data: client
})

export const serviceSave = (data) => request({
    url: website.path + '/kong/api/services',
    method: 'post',
    data: data
})

export const serviceUpdate = (data) => request({
    url: website.path + '/kong/api/services/' + data.id,
    method: 'post',
    data: data
})
export const serviceDel = (id) => request({
    url: website.path + '/kong/api/services/' + id.id,
    method: 'delete'
});

export const syncConfig = (row) => request({
    url: website.path + '/kong/sync/configs/',
    method: 'post',
    data: row
});