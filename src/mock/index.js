import user from './user';
import menu from './menu';
import admin from './admin';
import service from './service';
import console from './console'
/**
 * 模拟数据mock
 *
 * mock是否开启模拟数据拦截
 */
const isFlag = false

user({ mock: isFlag });

menu({ mock: isFlag });

admin({ mock: isFlag });

service({mock: isFlag});

console({mock: isFlag});
