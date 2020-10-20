import request from '@/router/axios';
import website from '@/const/website'

export const findAll = () => request({
    url: website.path + '/kong/api/consumers',
    method: 'get'
})

export const consumerSave = (data) => request({
    url: website.path + '/kong/api/consumers',
    method: 'post',
    data: data
})

export const consumerUpdate = (data) => request({
    url: website.path + '/kong/api/consumers/' + data.id,
    method: 'post',
    data: data
})
export const consumerDel = (id) => request({
    url: website.path + '/kong/api/consumers/' + id.id,
    method: 'delete'
});
