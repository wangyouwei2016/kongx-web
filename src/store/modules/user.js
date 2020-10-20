import { setToken, removeToken } from '@/util/auth'
import { setStore, getStore } from '@/util/store'
import { isURL } from '@/util/validate'
import { encryption, deepClone } from '@/util/util'
import webiste from '@/const/website'
// import { loginByUsername, getUserInfo, getMenu, logout, getMenuAll, RefeshToken } from '@/api/authorize'
import { loginByUsername, getUserInfo, getMenu, logout } from '@/api/authorize'
import { findActiveClient } from '@/api/operating/systemProfile'


function addPath(ele, first) {
    const propsConfig = webiste.menu.props;
    const propsDefault = {
        label: propsConfig.label || 'label',
        path: propsConfig.path || 'path',
        icon: propsConfig.icon || 'icon',
        children: propsConfig.children || 'children'
    }
    const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0;
    if (!isChild && first) {
        return
    }
    ele[propsDefault.children].forEach(child => {
        if (!isURL(child[propsDefault.path])) {
            child[propsDefault.path] = `${ele[propsDefault.path]}/${child[propsDefault.path] ? child[propsDefault.path] : 'index'}`

        }
        // console.log('child[propsDefault.path]=',child)
        addPath(child);
    })
}
const user = {
    state: {
        kongClient: {},
        systemProfile: {},
        userInfo: {},
        permission: {},
        roles: [],
        menu: getStore({ name: 'menu' }) || [],
        menuAll: [],
        token: getStore({ name: 'token' }) || '',
        isDevProfile: false,
        isProdProfile: false
    },
    actions: {
        //根据用户名登录
        LoginByUsernameDis({ commit }, userInfo) {
            //暂不加密
            const user = encryption({
                data: userInfo,
                type: 'Base64',
                key: 'avue',
                param: ['useranme', 'password']
            });
            return new Promise((resolve, reject) => {
                loginByUsername(user.username, user.password, userInfo.code, userInfo.redomStr).then(res => {
                    const _data = res.data;
                    const _status = _data.status;
                    if (_status == '0') {
                        const _token = _data.data;
                        commit('SET_TOKEN', _token);
                        commit('DEL_ALL_TAG');
                        commit('CLEAR_LOCK');
                        setToken(_token);
                        resolve();
                    } else {
                        reject(_data)
                    }
                });
            })
        },
        //根据手机号登录
        LoginByPhone({ commit }, userInfo) {
            return new Promise((resolve) => {
                loginByUsername(userInfo.phone, userInfo.code).then(res => {
                    const data = res.data.data;
                    commit('SET_TOKEN', data);
                    commit('DEL_ALL_TAG');
                    commit('CLEAR_LOCK');
                    setToken(data);
                    resolve();
                })
            })
        },
        //获取用户信息
        GetUserInfo({ commit }) {
            return new Promise((resolve, reject) => {
                getUserInfo().then((res) => {
                    // console.log("res:", res.data.data);
                    const data = res.data.data;
                    commit('SET_USERIFNO', data.userInfo);
                    commit('SET_ROLES', data.roles);
                    commit('SET_PERMISSION', data.permission)
                    resolve(data.userInfo);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        FindActiveClient({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                findActiveClient('name').then(res => {
                    const data = res.data;
                    commit('SET_KONGCLIENT', data);
                    commit('SET_SYSTEM_PROFILE', data);
                    resolve(data);
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //刷新token
        RefeshToken({ commit }) {
            return new Promise((resolve, reject) => {
                RefeshToken().then(res => {
                    const data = res.data.data;
                    commit('SET_TOKEN', data);
                    setToken(data);
                    resolve(data);
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 登出
        LogOut({ commit }) {
            return new Promise((resolve, reject) => {
                logout().then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_MENU', [])
                    commit('SET_ROLES', [])
                    commit('DEL_ALL_TAG');
                    commit('CLEAR_LOCK');
                    commit('SET_KONGCLIENT', { id: -1 });
                    commit('SET_SYSTEM_PROFILE', { id: -1 });
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //注销session
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                commit('SET_MENU', [])
                commit('SET_ROLES', [])
                commit('DEL_ALL_TAG');
                commit('CLEAR_LOCK');
                removeToken()
                resolve()
            })
        },
        //获取系统菜单
        GetMenu({ commit }, parentId) {
            return new Promise(resolve => {
                getMenu(parentId).then((res) => {
                    const data = res.data.data
                    let menu = deepClone(data);
                    menu.forEach(ele => {
                        addPath(ele, true);
                    })
                    commit('SET_MENU', menu)
                    resolve(menu)
                })
            })
        },
        //获取全部菜单
        GetMenuAll({ commit }) {
            return new Promise(resolve => {
                getMenuAll().then((res) => {
                    const data = res.data.data;
                    commit('SET_MENU_ALL', data);
                    resolve(data);
                })
            })
        },

    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
            setStore({ name: 'token', content: state.token, type: 'session' })
        },
        SET_USERIFNO: (state, userInfo) => {
            state.userInfo = userInfo;
        },
        SET_KONGCLIENT: (state, kongClient) => {
            state.kongClient = kongClient
        },
        SET_SYSTEM_PROFILE: (state, systemProfile) => {
            state.systemProfile = systemProfile
            state.isDevProfile = false;
            if (systemProfile.profile && (systemProfile.profile == 'betaf' || systemProfile.profile == 'betadevb')) {
                state.isDevProfile = true;
            }
            if (systemProfile.profile && (systemProfile.profile == 'prod')) {
                state.isProdProfile = true;
            }
        },
        SET_MENU: (state, menu) => {
            state.menu = menu
            setStore({ name: 'menu', content: state.menu, type: 'session' })
        },
        SET_MENU_ALL: (state, menuAll) => {
            state.menuAll = menuAll;
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        SET_PERMISSION: (state, permission) => {
            state.permission = {};
            permission.forEach(ele => {
                state.permission[ele] = true;
            });
        },
        SET_DEVELOPER: (state, val) => {
            state.developerId = val
        }
    }

}
export default user
