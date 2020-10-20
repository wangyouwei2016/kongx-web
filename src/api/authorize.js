import request from '@/router/axios';
import website from '@/const/website'
export const loginByUsername = (username, password, code) => request({
    url: website.path + '/authorize/login.do',
    method: 'post',
    data: 'username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password)

})

export const getValidateCode = (form) => request({
    url: website.path + '/authorize/validateCode.do',
    method: 'get',
    params: { username: form.username }
});

export const getErrorTimes = (form) => request({
    url: website.path + '/authorize/errorTimes.do',
    method: 'get',
    params: { username: form.username }
});


export const getUserInfo = () => request({
    url: website.path + '/authorize/getUserInfo.do',
    method: 'get'
});

export const getMenu = (type = 0) => request({
    url: website.path + '/authorize/getMenu.do',
    method: 'get',
    data: {
        type
    }
});

export const logout = () => request({
    url: website.path + '/authorize/logout.do',
    method: 'get'
})
