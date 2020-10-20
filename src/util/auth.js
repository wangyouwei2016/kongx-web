import Cookies from 'js-cookie'
//const TokenKey = 'x-access-token'
const TokenKey ='E_ACCESS_TOKEN'
const oauthUid = 'COOKIE_OAUTH_UID';
var inFifteenMinutes = new Date(new Date().getTime() + 120 * 60 * 1000);
export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token, { expires: inFifteenMinutes })
}

export function removeToken() {
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;) {
                document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();//清除当前域名下的
                document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString();//清除当前域名下的
                document.cookie = keys[i] + '=0;path=/;domain=example.com;expires=' + new Date(0).toUTCString();//清除一级域名下的或指定的
            }
        }
    // return Cookies.remove(TokenKey)
}
