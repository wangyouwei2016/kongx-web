/**
 * 全局配置文件
 */
export default {
    title: "KONGX",
    path: '',
    version: '2.0.0',
    logo: "K",
    indexTitle: 'KONGX',
    lockPage: '/lock',
    tokenTime: 6000,
    //http的status默认放行不才用统一处理的,
    statusWhiteList: [],
    //配置首页不可关闭
    isFirstPage: false,
    fistPage: {
        label: "首页",
        value: "/wel/index",
        params: {},
        query: {},
        group: [],
        close: false
    },
    //配置菜单的属性
    menu: {
        props: {
            label: 'label',
            path: 'path',
            icon: 'icon',
            children: 'children'
        }
    }
}
