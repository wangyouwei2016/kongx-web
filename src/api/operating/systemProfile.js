import request from '@/router/axios';
import website from '@/const/website';

export const findAll = () => request({
    url: website.path + '/system/profile/profiles',
    method: 'get'
});

export const findAllClient = () => request({
    url: website.path + '/system/profile/profiles',
    method: 'get'
});

export const findAllByGroup = () => request({
    url: website.path + '/system/profile/profiles/group',
    method: 'get'
});

export const findActiveClient = (username) => request({
    url: website.path + '/system/profile/active/',
    method: 'get'
});

export const setActiveClient = (username, client) => request({
    url: website.path + '/system/profile/active/',
    method: 'post',
    data: client
});

export const addClient = (client) => request({
    url: website.path + '/system/profile/profiles/',
    method: 'post',
    data: client
});

export const probingClient = (client) => request({
    url: website.path + '/system/profile/profiles/probing',
    method: 'post',
    data: client
});

export const updateClient = (client) => request({
    url: website.path + '/system/profile/profiles/' + client.id,
    method: 'post',
    data: client
});

export const removeClient = (client) => request({
    url: website.path + '/system/profile/profiles/' + client.id,
    method: 'delete'
});

export const findEnvs = () => request({
    url: website.path + '/system/envs/',
    method: 'get'
});

export const findClientByProfile = (profile) => request({
    url: website.path + '/system/profile/profiles/' + profile,
    method: 'get'
});


