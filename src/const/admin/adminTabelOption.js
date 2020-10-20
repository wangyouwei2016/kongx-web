import {
    DIC
} from '@/const/dic'
import website from '@/const/website';
export const userOption = {
    maxHeight: 900,
    labelWidth: 120,
    index: true,
    border: true,
    menuBtn: true,
    selection: true,
    addBtn: false,
    delBtn: false,
    editBtn: false,
    refreshBtn: false,
    columnBtn: false,
    menuAlign: 'left',
    align: 'center',
    searchSize: 'mini',
    menuWidth: 180,
    column: [
        {
            label: "用户账号",
            prop: "userId",
            width: "150",
            fixed: true,
            editDisabled: true,
            rules: [{
                required: true,
                message: "请输入用户账号",
                trigger: "blur"
            }]
        },
        {
            label: "用户名",
            prop: "name",
            width: "120",
            fixed: true,
            rules: [{
                required: true,
                message: "请输入用户名",
                trigger: "blur"
            }]
        },

        {
            label: "邮箱",
            prop: "email",
            width: "200",
            rules: [{
                required: true,
                message: '请输入邮箱',
                trigger: 'blur'
            }
            ]
        },
        {
            label: "手机号",
            prop: "mobile",
            width: "120",
            formatter: (row, value, label, column) => {
                if (value && value.length == 11) {
                    var dh = value.substr(0, 3) + "****" + value.substr(7);
                    return dh;
                }
                return value;
            }
        },

        {
            label: "所属用户组",
            prop: "userGroupList",
            align: 'left',
            slot: true,
        },
        {
            label: "注册时间",
            prop: "create_at",
            sortable: true,
            type: "datetime",
            width: 160,
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            formatter: (row, value, label, column) => {
                return value ;
            }
        }
    ]
};

export const userGroupOption = {
    maxHeight: 900,
    labelWidth: 120,
    index: true,
    border: true,
    menuBtn: true,
    addBtn: false,
    delBtn: false,
    editBtn: false,
    refreshBtn: false,
    columnBtn: false,
    menuAlign: 'left',
    align: 'center',
    searchSize: 'mini',
    menu: true,
    menuWidth: 260,
    column: [{
        label: "用户组名称",
        prop: "name",
        width: "150",
        span: 24,
        fixed: true,
        rules: [{
            required: true,
            message: "请输入用户组名称",
            trigger: "blur"
        }]
    }
        ,
    {
        label: "是否有效",
        prop: "useYn",
        type: "switch",
        value: 'y',
        span: 24,
        dicData: DIC.USE_YN,
        rules: [{
            required: true,
            message: "请选择",
            trigger: "blur"
        }]
    },
    {
        span: 24,
        label: "备注",
        prop: "remark",
        type: "textarea"
    },
    {
        label: "创建时间",
        prop: "create_at",
        addDisplay: false,
        editDisplay: false,
        format: "yyyy-MM-dd HH:mm:ss",
        valueFormat: "yyyy-MM-dd HH:mm:ss",
        type: "date",
    }
    ]
};

export const roleOption = {
    maxHeight: 900,
    labelWidth: 120,
    index: true,
    border: true,
    menuBtn: true,
    addBtn: false,
    delBtn: false,
    editBtn: false,
    refreshBtn: false,
    columnBtn: false,
    menuAlign: 'left',
    align: 'center',
    searchSize: 'mini',
    menu: true,
    menuWidth: 300,
    column: [{
        label: "角色名称",
        prop: "name",
        width: "150",
        span: 24,
        fixed: true,
        rules: [{
            required: true,
            message: "请输入角色名称",
            trigger: "blur"
        }]
    }
        ,
    {
        label: "角色编码",
        prop: "code",
        span: 24,
        width: "120",
        editDisabled: true,
        rules: [{
            required: true,
            message: "请输入角色编码",
            trigger: "blur"
        }]
    },
    {
        label: '角色类型',
        prop: "roleType",
        type: "radio",
        value: 'menu',
        span: 24,
        width: "120",
        dicData: DIC.ROLE_TYPE,
        rules: [{
            required: true,
            message: "请选择角色类型",
            trigger: "blur"
        }]
    },
    {
        label: "是否有效",
        prop: "useYn",
        type: "switch",
        value: 'y',
        span: 24,
        width: "80",
        dicData: DIC.USE_YN,
        rules: [{
            required: true,
            message: "请选择",
            trigger: "blur"
        }]
    },
    {
        span: 24,
        label: "备注",
        prop: "remark",
        type: "textarea"
    },
    {
        label: "创建时间",
        prop: "create_at",
        width: "140",
        addDisplay: false,
        editDisplay: false,
        format: "yyyy-MM-dd HH:mm:ss",
        valueFormat: "yyyy-MM-dd HH:mm:ss",
        type: "date",
    }
    ]
};


export const functionPointColumn = {
    emptyBtn: false,
    submitBtn: false,
    column: [
        {
            label: "父节点ID",
            prop: "parentId",
            readonly: true,
            disabled: true,
            span: 24,
            labelWidth: 100,
        },
        {
            label: "功能点名称",
            prop: "name",
            span: 24,
            labelWidth: 100,
            rules: [{
                required: true,
                message: "请输入菜单名称",
                trigger: "blur"
            }]
        },
        {
            label: "功能点编码",
            prop: "code",
            span: 24,
            width: 80,
            labelWidth: 100,
        },
        {
            label: "是否可用",
            prop: "useYn",
            type: "switch",
            formslot: true,
            value: "y",
            span: 24,
            dicData: DIC.USE_YN,
            width: 80,
            labelWidth: 100,
        },
        {
            label: "显示顺序",
            prop: "sortOrder",
            type: "number",
            formslot: true,
            span: 24,
            width: 80,
            labelWidth: 100,
        }
    ]
}

export const userColumn = {
    emptyBtn: false,
    submitBtn: false,
    column: [
        {
            label: "用户名",
            prop: "userId",
            span: 24,
            labelWidth: 100,
            rules: [{
                required: true,
                message: "请输入用户名",
                trigger: "blur"
            }]
        },
        {
            label: "姓名",
            prop: "name",
            span: 24,
            width: 80,
            labelWidth: 100,
        },
        {
            label: "手机号",
            prop: "mobile",
            span: 24,
            width: 80,
            labelWidth: 100,
        },
        {
            label: "邮箱",
            prop: "email",
            span: 24,
            width: 80,
            labelWidth: 100,
        }
    ]
}

export const functionColumn = {
    emptyBtn: false,
    submitBtn: false,
    column: [
        {
            label: "父节点ID",
            prop: "parentId",
            readonly: true,
            disabled: true,
            span: 24,
            width: 120,
        },
        {
            label: "菜单名称",
            prop: "name",
            span: 24,
            width: 80,
            rules: [{
                required: true,
                message: "请输入菜单名称",
                trigger: "blur"
            }]
        },
        // {
        //     label: "菜单编码",
        //     prop: "code",
        //     span: 24,
        //     width: 80,
        // },

        {
            label: "菜单视图",
            prop: "visitView",
            formslot: true,
            span: 24,
            width: 80,
        },
        {
            label: "访问路径",
            prop: "visitPath",
            span: 24,
            width: 80,
            placeholder: '例如：/role'
        },
        {
            label: "菜单图标",
            prop: "menuIcon",
            span: 24,
            width: 80,
        },
        {
            label: "是否可用",
            prop: "useYn",
            type: "switch",
            formslot: true,
            value: "y",
            span: 24,
            dicData: DIC.USE_YN,
            width: 80,
        },
        {
            label: "显示顺序",
            prop: "sortOrder",
            type: "number",
            formslot: true,
            span: 24,
            width: 80,
        }
    ]
}

export const menuOption = {
    children: "children",
    label: "name",
    id: "id"
};