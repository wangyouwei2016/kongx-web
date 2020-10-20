import Mock from 'mockjs'
import website from '@/const/website'
export default ({ mock }) => {
    if (!mock) return;
    // 用户登录
    Mock.mock(website.path+'/authorize/login.do', 'post', {
        "version": "1.0",
        "clientFrom": "",
        "timestamp": "1557216448422",
        "get_url": "",
        "status": "0",
        "errmsg": "",
        "elapsed": "",
        "acc_point": "",
        "track_id": "b8e5bc69-265a-4b5a-9467-c9b06d9bd340",
        "secur_type": "1",
        "data": "00J5740KB5B2M2A0J"
    });

    Mock.mock(RegExp(website.path + '/authorize/errorTimes.do' + '.*'), 'get', {
        "version": "1.0",
        "clientFrom": "",
        "timestamp": "1557282537340",
        "get_url": "authorize/errorTimes.do",
        "status": "401",
        "errmsg": "Tokenå·²å¤±æ•ˆæˆ–ç”¨æˆ·æœªç™»å½•!",
        "elapsed": "",
        "acc_point": "",
        "track_id": "e25087bb-408c-4ad9-a8e3-7c04f16b99b5",
        "secur_type": "1",
        "data": {
            "userInfo": null
        }
    });
    //用户退出
    Mock.mock('/user/logout', 'get', {
        data: true,
    });
    //刷新token
    Mock.mock('/user/refesh', 'post', {
        data: new Date().getTime() + ''
    });
    //获取用户信息
    Mock.mock(website.path + '/authorize/getUserInfo.do', 'get', {
        "version": "1.0",
        "clientFrom": "",
        "timestamp": "1557282539493",
        "get_url": "",
        "status": "0",
        "errmsg": "",
        "elapsed": "",
        "acc_point": "",
        "track_id": "e9b3fd87-0572-4222-bf3e-a579f746ae0d",
        "secur_type": "1",
        "data": {
            "userInfo": {
                "id": 1,
                "userType": "UserType_4",
                "roleAssignType": "1",
                "userId": "1",
                "userLoginId": "padmin",
                "userNm": "平台管理员",
                "userCode": "",
                "deptCode": "",
                "email": "admin1@kongx.com",
                "passwd": "27F4A3521E205C7BF9CF421DE9B36924",
                "clientIp": null,
                "loginDate": 1557282540549,
                "isChangedPwd": null,
                "logonToken": "00J57M28LGOGSQR3N",
                "moduleCode": null,
                "currentUrl": "",
                "applicationId": 1,
                "accessDate": null,
                "mobile": "18500436280",
                "logined": true,
                "loginErrorTimes": 0,
                "lastLoginErrorTime": null,
                "companyId": null,
                "companyName": null,
                "suppliers": null,
                "partnerType": null,
                "creatorId": 100,
                "creatorName": "admin",
                "createdDate": 1557282540549,
                "name": "平台管理员"
            },
            "permission": ["config_whpos", "role_del", "config_dep", "list_menu", "menu_add", "list_user", "user_edit", "list_role_auth", "user_add", "app_add", "role_edit", "config_vendor", "point_add", "role_add", "list_role"],
            "roles": ["admin"]
        }
    });

    //获取表格数据
    Mock.mock('/user/getTable', 'get', () => {
        let list = []
        for (let i = 0; i < 5; i++) {
            list.push(Mock.mock({
                id: '@increment',
                name: Mock.mock('@cname'),
                username: Mock.mock('@last'),
                type: [0, 2],
                checkbox: [0, 1],
                'number|0-100': 0,
                datetime: 1532932422071,
                'sex|0-1': 0,
                moreselect: [0, 1],
                "grade": 0,
                address: Mock.mock('@cparagraph(1, 3)'),
                check: [1, 3, 4]
            }))
        }
        return {
            data: {
                total: 11,
                pageSize: 10,
                tableData: list
            }
        }
    })
}
