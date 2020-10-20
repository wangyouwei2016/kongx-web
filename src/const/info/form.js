export default {
    column: [{
        label: '个人信息',
        prop: 'info',
        option: {
            submitText: '修改',
            column: [{
                label: '用户名',
                span: 12,
                disabled: true,
                row: true,
                prop: 'userId'
            }, {
                label: '姓名',
                row: true,
                prop: 'name'
            }, {
                label: '手机号',
                span: 12,
                row: true,
                prop: 'mobile'
            }, {
                label: '邮箱',
                prop: 'email',
                row: true,
            }]
        }
    }, {
        label: '修改密码',
        prop: 'password',
        option: {
            submitText: '修改',
            column: [{
                label: '原密码',
                span: 12,
                row: true,
                type: 'password',
                prop: 'oldpassword'
            }, {
                label: '新密码',
                span: 12,
                row: true,
                type: 'password',
                prop: 'newpassword'
            }, {
                label: '确认密码',
                span: 12,
                row: true,
                type: 'password',
                prop: 'newpasswords'
            }]
        }
    }]
}