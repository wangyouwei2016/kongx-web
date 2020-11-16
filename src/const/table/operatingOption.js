import { DIC } from '@/const/dic'
import { checkNumber } from '@/util/validate'
import website from '@/const/website';

/**
 * @title 连接管理
 * @type {{border: boolean, menuAlign: string, maxHeight: number, delBtn: boolean, dicData: *, menuBtn: boolean, column: *[], index: boolean, labelWidth: number, align: string, addBtn: boolean, searchSize: string}}
 */
export const envColumn = {
    card: true,
    size: 'small',
    emptyBtn: false,
    group: [{
        label: '网关配置',
        column: [
            {
                label: "Kong Admin URL",
                row: true,
                span: 24,
                labelWidth: 140,
                value: 'http://localhost:8001/',
                prop: "url",
                tip: '请填写kong的管理URL，如：http://localhost:8001/',
                rules: [{ required: true, message: "请填写URL，如：http://localhost:8001/", trigger: "blur" }]
            },
            // {
            //     label: "注册中心",
            //     row: true,
            //     span: 24,
            //     labelWidth: 140,
            //     prop: "consul_url",
            //     tip: '请填写注册中心的管理地址，如：http://localhost:8001/',
            // }, {
            //     label: "配置中心",
            //     row: true,
            //     span: 24,
            //     labelWidth: 140,
            //     prop: "config_url",
            //     tip: '请填写配置中心的管理地址，如：http://localhost:8001/',
            // }

        ]
    }, {
        label: '环境信息',
        column: [
            {
                label: "名称",
                prop: "name",
                span: 24,
                labelWidth: 140,
                width: 150,
                rules: [{ required: true, message: "请填写名称", trigger: "blur" }]
            },
            {
                label: "环境编码",
                prop: "profileCode",
                span: 24,
                labelWidth: 140,
                width: 150,
                rules: [{ required: true, message: "请填写环境编码", trigger: "blur" }]
            },
            {
                label: "所属环境",
                prop: "env",
                span: 24,
                labelWidth: 140,
                width: 150,
                disabled: true,
            },
            {
                label: "部署类型",
                prop: "deployType",
                span: 24,
                labelWidth: 140,
                width: 150,
                disabled: true,
            },
            {
                label: "简称",
                prop: "ab",
                span: 24,
                labelWidth: 140,
                width: 150,
                disabled: true,
            },
        ]
    },
        // {
        //     label: '扩展配置(JSON) 格式为：[{"name":"热配","code":"hot_config","url":"http://localhost:8089/"}]',
        //     column: [
        //         {
        //             label: "extensions",
        //             row: true,
        //             type: 'textarea',
        //             span: 24,
        //             labelWidth: 140,
        //             prop: "extensions",
        //             tip: '格式为：[{"name":"热配","code":"hot_config","url":"http://localhost:8089/"}]，多个以英文逗号隔开'
        //         }
        //     ]
        // }
    ]

}

export const clientColumn = {
    column: [
        {
            label: "名称",
            prop: "name",
            span: 24,
            labelWidth: 140,
            width: 150,
            rules: [{ required: true, message: "请填写名称", trigger: "blur" }]
        },
        {
            label: "Kong Admin URL",
            row: true,
            span: 24,
            labelWidth: 140,
            prop: "url",
            tip: '请填写kong的管理URL，如：http://localhost:8001/',
            rules: [{ required: true, message: "请填写URL，如：http://localhost:8001/", trigger: "blur" }]
        },
        {
            label: "所属环境",
            labelWidth: 140,
            prop: "profile",
            type: 'select',
            group: true,
            dicUrl: website.path + '/system/envs/',
        }
    ]
}

export const clientOption = {
    maxHeight: 600,
    labelWidth: 120,
    simplePage: true,
    index: true,
    border: true,
    menuBtn: true,
    addBtn: false,
    simplePage: true,
    delBtn: false,
    editBtn: false,
    refreshBtn: false,
    columnBtn: false,
    menuAlign: 'center',
    align: 'center',
    searchSize: 'mini',
    column: [
        { label: 'Active', prop: 'id', slot: true, width: 80 },
        {
            label: "Name",
            prop: "name",
            sortable: true,
            width: 150
        },
        {
            label: "Kong Admin URL",
            prop: "url",
        },
        {
            label: "Version",
            prop: "version",
        },
        {
            label: "Created_at",
            prop: "create_at",
            width: "180",
            sortable: true,
            type: "datetime",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            formatter: (row, value, label, column) => {
                return value;
            }
        }

    ]
};


export const syncConfigOption = {
    maxHeight: 900,
    expand: true,
    labelWidth: 120,
    index: true,
    menuBtn: true,
    addBtn: false,
    delBtn: false,
    editBtn: false,
    simplePage: true,
    refreshBtn: false,
    columnBtn: false,
    menuAlign: 'center',
    align: 'center',
    searchSize: 'mini',
    menu: false,
    column: [
        {
            label: "源环境",
            prop: "src_client",
            slot: true,
            width: "280",
        },
        {
            label: "目标环境",
            prop: "clients",
            overHidden: true,
            slot: true,
        },
        // {
        //     label: "同步对象",
        //     overHidden: true,
        //     prop: "services",
        //     slot: true,
        // },
        {
            label: "数据类型",
            prop: "dataType",
        },
        {
            label: "同步策略",
            prop: "policy",
        },
        {
            label: "同步时间",
            prop: "create_at",
            width: "180",
            sortable: true,
            type: "datetime",
            slot: true,
        },
        {
            label: "同步状态",
            prop: "status",
        },

        {
            label: "备注",
            span: 24,
            labelWidth: 140,
            overHidden: true,
            type: 'textarea',
            prop: "comment",
        },
        {
            label: "操作人",
            prop: "creator", width: 100
        },

    ]
};

export const logOption = {
    maxHeight: 600,
    // expand: true,
    // index: true,
    labelWidth: 120,
    menuBtn: true,
    addBtn: false,
    delBtn: false,
    viewBtn: true,
    editBtn: false,
    menuAlign: 'center',
    align: 'center',
    menu: false,
    columnBtn: false,
    refreshBtn: false,
    column: [

        {
            label: "同步时间",
            prop: "create_at",
            width: "160",
            sortable: true,
            type: "datetime",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            formatter: (row, value, label, column) => {
                return value;
            }
        }, {
            label: "同步消息",
            prop: "comment",
            align: "left",
            width: 400
        }

    ]
};

export const configColumn = {
    column: [
        {
            label: "KEY",
            prop: "configKey",
            span: 24,
            labelWidth: 140,
            width: 150,
            rules: [{ required: true, message: "请填写key", trigger: "blur" }]
        },
        {
            label: "VALUE",
            row: true,
            span: 24,
            labelWidth: 140,
            type: 'textarea',
            prop: "configValue",
            rules: [{ required: true, message: "请填写key值", trigger: "blur" }]
        },
        {
            label: "参数类型",
            row: true,
            span: 24,
            labelWidth: 140,
            type: 'select',
            prop: "configType",
            dicUrl: website.path + '/system/envs/configTypes',
            rules: [{ required: true, message: "请选择参数类型", trigger: "blur" }]
        },
        {
            label: "备注",
            span: 24,
            labelWidth: 140,
            type: 'textarea',
            prop: "comment",
        }
    ]
}
export const configOption = {
    maxHeight: 600,
    expand: true,
    labelWidth: 120,
    simplePage: true,
    index: true,
    menuBtn: true,
    stripe: true,
    addBtn: false,
    delBtn: false,
    editBtn: false,
    menuAlign: 'center',
    align: 'center',
    searchSize: 'mini',
    column: [
        {
            label: "KEY",
            prop: "configKey",
            align: "left",
            width: 240
        },
        {
            label: "VALUE",
            prop: "configValue",
            overHidden: true,
        },
        {
            label: "备注",
            width: 240,
            prop: "comment",
        },
        {
            label: "创建日期",
            prop: "create_at",
            width: "180",
            sortable: true,
            type: "datetime",
            slot: true
        }

    ]
};

export const syncLogGroupOption = {
    card: true,
    group: [
        {
            icon: 'el-icon-info',
            label: '同步配置信息',
            column: [{
                label: '源环境',
                type: 'select',
                labelWidth: 150,
                span: 24,
                formslot: true,
                prop: 'src_client'
            }, {
                label: '目标环境',
                prop: 'clients',
                labelWidth: 150,
                formslot: true,
            }, {
                label: '待同步的服务列表',
                prop: 'services',
                span: 24,
                labelWidth: 150,
                formslot: true,
            }]
        },
        {
            // icon: 'el-icon-info',
            label: '同步信息',
            column: []
        }
    ]
}

export const operationLogOption = {
    maxHeight: 600,
    labelWidth: 120,
    index: true,
    // border: true,
    menuBtn: false,
    addBtn: false,
    delBtn: false,
    editBtn: false,
    stripe: true,
    menu: false,
    simplePage: true,
    refreshBtn: false,
    columnBtn: false,
    menuAlign: 'center',
    align: 'center',
    searchSize: 'mini',
    column: [
        {
            label: "操作时间",
            prop: "create_at",
            width: "180",
            sortable: true,
            slot: true,
            type: "datetime",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            formatter: (row, value, label, column) => {
                return value;
            }
        },
        {
            label: "操作者",
            prop: "creator",
            width: 100
        },
        { label: '操作记录', prop: 'remark', align: 'left' },

        {
            label: "操作环境",
            prop: "profile",
            width: 100
        },
        {
            label: "执行操作",
            prop: "operation",
            width: 150,
            type: 'select',
            dicData: [
                { label: '登录', value: 'login' },
                { label: '登出', value: 'logout' },
                { label: '同步', value: 'sync' },
                { label: '新增', value: 'add' },
                { label: '修改', value: 'update' },
                { label: '删除', value: 'delete' },
                { label: '执行降级', value: 'demote_config' },
                { label: '降级回滚', value: 'rollback_config' },
                { label: 'Arthas调试', value: 'arthas_attach' },
                { label: '启动', value: 'job_startup' },
                { label: '暂停', value: 'job_pause' },
            ]
        },
        {
            label: "操作对象",
            prop: "target",
            width: 150,
            dicData: [
                { label: '全局插件', value: 'global_plugin' },
                { label: '路由插件', value: 'route_plugin' },
                { label: '服务插件', value: 'service_plugin' },
                { label: '路由', value: 'route' },
                { label: '服务', value: 'service' },
                { label: '上游服务', value: 'upstream' },
                { label: '上游代理', value: 'targets' },
                { label: '系统', value: 'system' },
                { label: '作业', value: 'monitor_job' },
                { label: '作业任务', value: 'monitor_job_task' },
                { label: '网关服务', value: 'sync_service' },
                { label: '系统参数', value: 'server_config' },
                { label: '系统环境', value: 'system_profile' },
                { label: '降级参数', value: 'demote_app_params' },
                { label: '热配参数', value: 'sync_app_params' },
                { label: '服务进程', value: 'service_progress' },
            ]
        }

    ]
};