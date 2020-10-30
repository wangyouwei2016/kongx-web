import request from '@/router/axios';
import website from '@/const/website'
let ENTITY_PATH = website.path + '/kong/api/consumers/';
export const findAllEntities = (customer, entityName) => request({
    url: ENTITY_PATH + customer + "/" + entityName,
    method: 'get'
})

export const entitySave = (data, customer, entityName) => request({
    url: ENTITY_PATH + customer + "/" + entityName,
    method: 'post',
    data: data
})


export const entityRemove = (customer, entityName, entityId) => request({
    url: ENTITY_PATH + customer + "/" + entityName + "/" + entityId,
    method: 'delete'
});
