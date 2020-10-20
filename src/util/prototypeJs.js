/**
 * @title: 全局公用方法
 * @author: liquan
 * @date: 2019.05.09
 */
// import store from '@/store'
// import { axios } from '@/utils/request'
import { Notification } from 'element-ui'
function plugin (Vue) {
    if (plugin.installed) {
        return
    }
    /**
     * @title 全局错误提示方法
     */
    !Vue.prototype.$errorInfo && Object.defineProperties(Vue.prototype, {
        $errorInfo: {
            get () {
                return (info) => {
                    Notification({
                        title: '错误',
                        message: info,
                        type: 'error',
                        offset: 40
                    });
                }
            }
        }
    })
    !Vue.prototype.$successInfo && Object.defineProperties(Vue.prototype, {
        $successInfo: {
            get () {
                return (info) => {
                    Notification({
                        title: '成功',
                        message: info,
                        type: 'success',
                        offset: 40
                    });
                }
            }
        }
    })

}

export default plugin
