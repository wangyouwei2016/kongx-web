import request from '@/router/axios';
import website from '@/const/website'
export const saveUserGroup = (data) => request({
    url: website.path + '/system/user/group',
    method: 'post',
    data: data
});


export const updateUserGroup = (data) => request({
    url: website.path + '/system/user/group/' + data.id,
    method: 'post',
    data: data
});

export const deleteUserGroup = (data) => request({
    url: website.path + '/system/user/group/',
    method: 'delete',
    data: data
});

export const findAllByPage = (page) => request({
    url: website.path + '/system/user/group/page',
    method: 'get',
    params: page
});

export const setGroupUser = (groupId, userId) => request({
    url: website.path + '/system/user/group/' + groupId + "/user/" + userId,
    method: 'post'
});

export const setBatchGroupUser = (groupId, userIds) => request({
    url: website.path + '/system/user/group/' + groupId + "/user/",
    method: 'post',
    data: userIds
});

export const deleteGroupUser = (groupId, userId) => request({
    url: website.path + '/system/user/group/' + groupId + "/user/" + userId,
    method: 'delete'
});



export const deleteBatchGroupUser = (groupId, userIds) => request({
    url: website.path + '/system/user/group/' + groupId + "/user/",
    method: 'delete',
    data: userIds
});

export const setGroupRole = (groupId, userId, profiles) => request({
    url: website.path + '/system/user/group/' + groupId + "/role/" + userId,
    method: 'post',
    data: profiles
});

export const deleteGroupRole = (groupId, userId, profiles) => request({
    url: website.path + '/system/user/group/' + groupId + "/drole/" + userId,
    method: 'post',
    data: profiles
});

export const findAllGroup = () => request({
    url: website.path + '/system/user/group/list',
    method: 'get'
});
