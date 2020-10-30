import request from '@/router/axios';
import website from '@/const/website'
let ENTITY_PATH = website.path + '/kong/api/certificates/';
export const findAllEntities = () => request({
    url: ENTITY_PATH,
    method: 'get'
})

export const entitySave = (data) => request({
    url: ENTITY_PATH,
    method: 'post',
    data: data
})

export const entityUpdate = (data) => request({
    url: ENTITY_PATH + data.id,
    method: 'post',
    data: data
})
export const entityRemove = (id) => request({
    url: ENTITY_PATH + id.id,
    method: 'delete'
});
