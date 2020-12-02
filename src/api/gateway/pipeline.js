import request from '@/router/axios';
import website from '@/const/website'
const PATH = website.path + "/kong/api"
export const savePipeline = (data) => request({
    url: PATH + '/pipeline',
    method: 'post',
    data: data
});

export const updatePipeline = (data) => request({
    url: PATH + '/pipeline/' + data.id,
    method: 'post',
    data: data
});

export const deletePipeline = (data) => request({
    url: PATH + '/pipeline/' + data.id,
    method: 'delete',
});

export const findAllPipeline = (page) => request({
    url: PATH + '/pipeline/list/profile',
    method: 'get',
});

export const findPipelineById = (data) => request({
    url: PATH + '/pipeline/' + data.id,
    method: 'get',
});


export const truncatePipeline = (data) => request({
    url: PATH + '/pipeline/truncate/entity',
    method: 'post',
    data: data
})


export const queryEntity = (data) => request({
    url: PATH + '/pipeline/query/entity',
    method: 'post',
    data: data
})