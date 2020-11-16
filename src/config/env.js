// 配置编译环境和线上环境之间的切换

let baseUrl = 'http://r.kongx.com:8088/';
let iconfontVersion = ['567566_qo5lxgtishg', '2106500_7cs4kk59h96'];
let iconfontUrl = `//at.alicdn.com/t/font_$key.css`;
let codeUrl = `${baseUrl}/code`
const env = process.env
if (env.NODE_ENV == 'development') {
    baseUrl = `http://r.kongx.com:8088/`; // 开发环境地址
} else if (env.NODE_ENV == 'production') {
    baseUrl = `http://r.kongx.com:8088/`; //生产环境地址
} else if (env.NODE_ENV == 'test') {
    baseUrl = `http://r.kongx.com:8088/`; //测试环境地址
}
export {
    baseUrl,
    iconfontUrl,
    iconfontVersion,
    codeUrl,
    env
}
