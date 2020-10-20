import { DIC } from '@/const/dic'
import { checkNumber } from '@/util/validate'
import store from '@/store'
import website from '@/const/website'

/**
 * @title 路由管理
 * @type {{border: boolean, menuAlign: string, maxHeight: number, delBtn: boolean, dicData: *, menuBtn: boolean, column: *[], index: boolean, align: string, addBtn: boolean, searchSize: string}}
 */
export const routingOption = {
    maxHeight: 600,
    expand: true,
    // defaultExpandAll: true,
    expandRowKeys: [],
    index: true,
    border: true,
    menuBtn: true,
    refreshBtn: false,
    filterBtn: false,
    searchBtn: false,
    selectClearBtn: false,
    columnBtn: false,
    addBtn: false,
    editBtn: false,
    delBtn: false,
    align: 'center',
    column: [{
        label: "NAME",
        prop: "name",
        align: "left",
        slot: true,
        width: 200
    }, {
        label: "SERVICE",
        prop: "service",
        align: "left",
        sortable: true,
        slot: true,
        width: 200
    }, {
        label: "HOSTS",
        prop: "hosts",
        overHidden: true,
        align: "left",
        sortable: true,
        slot: true,
    },
    {
        label: "PATHS",
        prop: "paths",
        overHidden: true,
        align: "left",
        slot: true,
        sortable: true,
    },
    {
        label: "CREATED",
        prop: "created_at",
        sortable: true,
        type: "datetime",
        width: 160,
        format: "yyyy-MM-dd HH:mm:ss",
        valueFormat: "yyyy-MM-dd HH:mm:ss",
        formatter: (row, value, label, column) => {
            return value * 1000;
        }
    }
    ]
};

export const serviceRouteOption = {
    maxHeight: 600,
    expandRowKeys: [],
    expand: true,
    rowkey: 'id',
    dialogDrag: true,
    border: true,
    addBtn: false,
    delBtn: false,
    simplePage: true,
    editBtn: false,
    refreshBtn: false,
    filterBtn: false,
    searchBtn: false,
    selectClearBtn: false,
    columnBtn: false,
    menuAlign: 'right',
    menuWidth: 180,
    align: 'center',
    column: [{
        label: "路由名称",
        prop: "name",
    }, {
        label: "HOSTS",
        prop: "hosts",
        overHidden: true,
        slot: true,
    },
    {
        label: "PATHS",
        prop: "paths",
        overHidden: true,
        align: "left",
        slot: true,
    }
    ]
};

export const routeColumn = {
    emptyBtn: false,
    submitBtn: false,
    column: [
        { label: "路由名称", span: 24, prop: "name", rules: [{ required: true, message: "请填写路由名称", trigger: "blur" }] },
        { label: "主机列表", span: 24, formslot: true, prop: "hosts", type: 'select', tip: '路由匹配主机名或域名【主机和路由path，可以只填一个，或者两个都填】,主机可以填多个，如：www.baidu.com,www.sina.com' },
        {
            label: "路由PATH", span: 24, formslot: true, prop: "paths",
            type: 'select',
            placeholder: '路由匹配路径【主机和路由path，可以只填一个，或者两个都填】,匹配路径可以填多个，如：/path1,/paths2/xx.do'
        },
        { label: "是否截断Path", labelWidth: 120, span: 8, prop: "strip_path", type: 'switch' },
        { label: "正则优先级", span: 8, prop: "regex_priority", type: 'number', value: 0, tip: '当多个路由同时使用正则表达式匹配某个给定请求时，用来选择哪个路由解析该请求的数字。当两个路由匹配路径并且具有相同的regex_优先级时，将使用较旧的路由（最低创建位置）。注意，非regex路由的优先级不同（较长的非regex路由在较短的路由之前匹配）。默认为0。' },
        { label: "保留主机", span: 8, prop: "preserve_host", type: 'switch' },
        { label: "请求方法", row: true, formslot: true, prop: "methods", type: 'array' },
        { label: "请求协议", prop: "protocols", multiple: true, type: 'select', dicData: DIC.PROTOCOLS, },
    ]
}
/**
 * @title 上游代理
 * @type {{border: boolean, menuAlign: string, maxHeight: number, delBtn: boolean, dicData: *, menuBtn: boolean, column: *[], index: boolean, labelWidth: number, align: string, addBtn: boolean, searchSize: string}}
 */
export const upstreamOption = {
    maxHeight: 600,
    expand: true,
    index: true,
    border: true,
    menuBtn: true,
    refreshBtn: false,
    filterBtn: false,
    searchBtn: false,
    selectClearBtn: false,
    columnBtn: false,
    addBtn: false,
    editBtn: false,
    delBtn: false,
    menuAlign: 'center',
    align: 'center',
    searchSize: 'mini',
    column: [{
        label: 'NAME',
        prop: 'name',
        align: 'left',
        slot: true,
    },
    //  {
    //     label: 'CONSUL',
    //     prop: 'consul_server',
    // },
    {
        label: "SLOT",
        rules: [{ validator: checkNumber, trigger: 'blur' }],
        prop: "slots"
    },
    {
        label: "CREATED",
        prop: "created_at",
        sortable: true,
        width: 160,
        type: "datetime",
        format: "yyyy-MM-dd HH:mm:ss",
        valueFormat: "yyyy-MM-dd HH:mm:ss",
        formatter: (row, value, label, column) => {
            return value * 1000;
        }
    }]
};

export const upstreamColumn = {
    emptyBtn: false,
    submitBtn: false,
    column: [
        {
            label: 'Name', prop: 'name', labelWidth: 120, span: 16, tip: 'Upstream名称只允许为英文字符，该名称不可重复，该名称会用在service中的host字段中',
            rules: [{ required: true, message: "请填写upstream名称", trigger: "blur" }]
        },
        { label: 'Slot', span: 8, prop: 'slots', value: '1000', type: 'number' },
        {
            label: 'Hash on', labelWidth: 120, prop: 'hash_on', type: 'select', dicData: DIC.HASH_ON_TYPE,
            change: () => { }
        },
        { label: 'Hash Fallback', labelWidth: 120, prop: 'hash_fallback', type: 'select', dicData: DIC.HASH_ON_FALLBACK_TYPE },
        { label: 'Hash on header', labelWidth: 120, prop: 'hash_on_header', type: 'input' },
        { label: 'Fallback header', labelWidth: 120, prop: 'hash_fallback_header', type: 'input' },
        { label: 'Hash on cookie', labelWidth: 120, prop: 'hash_on_cookie', type: 'input' },
        { label: 'Cookie path', labelWidth: 120, prop: 'hash_on_cookie_path', type: 'input' },
    ]
}

export const activeHealthCheckOption = {
    card: true,
    emptyBtn: false,
    submitBtn: false,
    group: [
        {
            // icon: 'el-icon-info',
            label: '基本配置',
            column: [{
                label: '请求协议',
                type: 'select',
                labelWidth: 110,
                prop: 'type',
                dicData: DIC.PROTOCOLS_HEALTHCHECK
            }, {
                label: '请求路径',
                prop: 'http_path',
                labelWidth: 110,
                value: '/'
            }, {
                label: '请求超时',
                prop: 'timeout',
                labelWidth: 110,
                value: 1
            }, {
                label: 'https_sni',
                labelWidth: 110,
                prop: 'https_sni'
            }, {
                label: '并发数',
                prop: 'concurrency',
                labelWidth: 110,
                value: 10,
            }, {
                label: '是否验证https证书',
                labelWidth: 140,
                prop: 'https_verify_certificate',
                type: 'switch'
            }]
        },
        {
            // icon: 'el-icon-info',
            label: '非健康(Unhealthy)',
            column: [{
                label: '错误状态码',
                prop: 'fail_http_statuses',
                labelWidth: 110,
                formslot: true,
                type: 'select',
                value: ['429', '404', '500', '501', '502', '503', '504', '505']
            }, {
                label: '间隔时长',
                type: 'number',
                labelWidth: 110,
                prop: 'interval',
                value: 0
            },
            {
                label: 'HTTP失败次数',
                type: 'number',
                labelWidth: 110,
                prop: 'http_failures',
                value: 0
            }, {
                label: 'TCP失败次数',
                type: 'number',
                labelWidth: 110,
                prop: 'tcp_failures',
                value: 0
            }, {
                label: '超时时长',
                type: 'number',
                labelWidth: 110,
                prop: 'timeouts',
                value: 0
            }]
        },
        {
            // icon: 'el-icon-info',
            label: '健康(Healthy)',
            column: [{
                label: '正常状态码',
                labelWidth: 110,
                prop: 'http_statuses',
                type: 'select',
                formslot: true,
                value: ['200', '304']
            }, {
                label: '间隔时长',
                type: 'number',
                labelWidth: 110,
                prop: 'healthy_interval',
                value: 0
            },
            { label: '请求成功次数', labelWidth: 110, prop: 'successes', type: 'number', value: 0 }]
        }
    ]
}

export const passiveHealthCheckOption = {
    column: [{
        label: '内容1',
        prop: 'text1'
    }]
}

export const serviceColumn = {
    emptyBtn: false,
    submitBtn: false,
    column: [
        {
            label: '服务名称', span: 24, prop: 'name', tip: '服务名称，只允许英文或数字',
            rules: [{ required: true, message: "请填写服务名称", trigger: "blur" }]
        },
        // { label: '请求URL', span: 24, prop: 'url', tip: '配置URL,可以代替以上四项的配置：请求协议、主机、端口号及访问路径，如：http://localhost:8001/kong' },
        { label: '主机', span: 12, prop: 'host', type: 'string', tip: '访问上游服务(Upstream)的名称或主机', rules: [{ required: true, message: "请填写主机", trigger: "blur" }] },
        { label: '请求协议', span: 12, prop: 'protocol', type: 'select', dicData: DIC.PROTOCOLS, value: 'http' },
        { label: '端口号', span: 12, type: 'number', value: 80, prop: 'port', tip: '上游服务代理的默认端口号为80' },
        { label: 'Path', span: 12, value: '/', prop: 'path', tip: '默认为/,用于为请求上游服务' },
        { label: '重试次数', span: 12, prop: 'retries', type: 'number', value: 5, tip: '默认重试次数为5次' },
        { label: '连接超时', span: 12, prop: 'connect_timeout', type: 'number', value: 60000, tip: '连接上游服务的超时时长，默认值为60,000毫秒' },
        { label: '写超时', span: 12, prop: 'write_timeout', type: 'number', value: 60000, tip: '写超时时长，默认值为60,000毫秒' },
        { label: '读超时', span: 12, prop: 'read_timeout', type: 'number', value: 60000, tip: '读超时时长，默认值为60,000毫秒' },
        { label: '标签', span: 24, prop: 'tags', type: 'string' }
    ]
}
/**
 * @title 服务管理
 * @type {{border: boolean, menuAlign: string, maxHeight: number, delBtn: boolean, dicData: *, menuBtn: boolean, column: *[], index: boolean, labelWidth: number, align: string, addBtn: boolean, searchSize: string}}
 */
export const serviceOption = {
    maxHeight: 600,
    // expand: true,
    index: true,
    border: true,
    menuBtn: true,
    refreshBtn: false,
    filterBtn: false,
    searchBtn: false,
    selectClearBtn: false,
    columnBtn: false,
    addBtn: false,
    editBtn: false,
    delBtn: false,
    menuAlign: 'center',
    align: 'center',
    searchSize: 'mini',
    dicData: DIC,
    column: [{
        label: 'NAME',
        prop: 'name',
        align: 'left',
        slot: true,
        // search: true,
        width: 200
    }, {
        label: 'HOST OR UPSTREAM',
        prop: 'host',

    },
    {
        label: 'URL',
        prop: 'path',
        overHidden: true,
        formatter: (row, value, label, column) => {
            return row.protocol + '://' + row.host + ':' + row.port + '' + (row.path || '/');
        },
    },
    {
        label: "CREATED",
        prop: "created_at",
        sortable: true,
        type: "datetime",
        width: 160,
        format: "yyyy-MM-dd HH:mm:ss",
        valueFormat: "yyyy-MM-dd HH:mm:ss",
        formatter: (row, value, label, column) => {
            return value * 1000;
        }
    }]
};

/**
 * @title 插件管理
 * @type {{border: boolean, menuAlign: string, maxHeight: number, delBtn: boolean, dicData: *, menuBtn: boolean, column: *[], index: boolean, saveBtnTitle: string, align: string, addBtn: boolean, searchSize: string}}
 */

export const pluginsOption = {
    maxHeight: 600,
    labelWidth: 120,
    menuAlign: 'center',
    index: true,
    border: true,
    menuBtn: true,
    refreshBtn: false,
    filterBtn: false,
    searchBtn: false,
    selectClearBtn: false,
    columnBtn: false,
    addBtn: false,
    editBtn: false,
    delBtn: false,
    align: 'center',
    searchSize: 'mini',
    column: [
        {
            label: "",
            width: 100,
            type: 'switch',
            cell: true,
            slot: true,
            prop: "enabled",
            displayAs: 'switch'
        },
        {
            label: "NAME",
            prop: "name",
            width: 150,
            slot: true,
        }, {
            label: "SCOPE",
            prop: "scope",
            width: 100,
        },
        {
            label: "APPLY TO",
            prop: "applyObject",
            formatter: function (row, value, label, column) {
                if (value) {
                    return value.name;
                }
                return "";
            },
        },
        {
            label: "CREATED",
            prop: "created_at",
            sortable: true,

            type: "datetime",
            width: 160,
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            formatter: (row, value, label, column) => {
                return value * 1000;
            }
        }
    ]
};

export const servicePluginsOption = {
    maxHeight: 600,
    labelWidth: 120,
    menuAlign: 'center',
    index: true,
    border: true,
    menu: false,
    simplePage: true,
    menuBtn: true,
    refreshBtn: false,
    filterBtn: false,
    searchBtn: false,
    selectClearBtn: false,
    columnBtn: false,
    addBtn: false,
    editBtn: false,
    delBtn: false,
    align: 'center',
    searchSize: 'mini',
    column: [
        {
            label: "",
            width: 100,
            type: 'switch',
            cell: true,
            slot: true,
            prop: "enabled",
            displayAs: 'switch'
        },
        {
            label: "插件名称",
            prop: "name",
            width: 150,
            slot: true
        }, {
            label: "范围",
            prop: "scope",
            width: 100,
        },
        {
            label: "应用于",
            prop: "applyObject",
            formatter: function (row, value, label, column) {
                if (value) {
                    return value.name;
                }
                return "";
            },
        }
    ]
};

export const queryPluginsOption = {
    maxHeight: 600,
    index: true,
    border: true,
    labelWidth: 120,
    menuAlign: 'center',
    simplePage: true,
    addBtn: false,
    delBtn: false,
    editBtn: false,
    refreshBtn: false,
    filterBtn: false,
    searchBtn: false,
    selectClearBtn: false,
    columnBtn: false,
    column: [
        {
            label: "是否启用",
            width: 100,
            type: 'switch',
            cell: true,
            prop: "enabled",
            displayAs: 'switch'
        },
        {
            label: "插件名称",
            prop: "name",
            width: 150
        },
        {
            label: "创建日期",
            prop: "created_at",
            sortable: true,

            type: "datetime",
            // width: 200,
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            formatter: (row, value, label, column) => {
                return value * 1000;
            }
        }
    ]
};

export const targetOption = {
    index: true,
    border: true,
    labelWidth: 120,
    // showHeader:false,
    addBtn: false,
    delBtn: false,
    editBtn: false,
    refreshBtn: false,
    filterBtn: false,
    searchBtn: false,
    selectClearBtn: false,
    columnBtn: false,
    simplePage: true,
    align: 'center',
    searchSize: 'mini',
    column: [
        {
            label: "健康",
            prop: "health",
            width: 60,
            slot: true,
        },
        {
            label: "主机/端口",
            width: 300,
            prop: "target",
            tip: '默认端口号为8000',
            placeholder: '默认端口号为8000'
        },
        {
            label: "权重",
            prop: "weight",
            value: 100,
            type: "number",
            width: 100,
            tip: '0-1000,默认值为100',
            placeholder: '取值范围：0-1000,默认值为100，当dns解析为一样时，权重将被覆盖'
        },
        {
            label: "创建日期",
            prop: "created_at",
            type: "date",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            formatter: (row, value, label, column) => {
                return value * 1000;
            }
        }
    ]
}

export const targetColumn = {
    column: [
        {
            label: "主机/端口",
            width: 300,
            cell: true,
            span: 18,
            prop: "target",
            tip: '默认端口号为8000',
            placeholder: '默认端口号为8000',
            rules: [{ required: true, message: "请填写host/port", trigger: "blur" }]
        },
        {
            label: "权重",
            prop: "weight",
            value: 100,
            type: "number",
            cell: true,
            span: 6,
            width: 100,
            tip: '0-1000,默认值为100',
            placeholder: '取值范围：0-1000,默认值为100，当dns解析为一样时，权重将被覆盖'
        }
    ]
}


export const consumersOption = {
    index: true,
    border: true,
    labelWidth: 120,
    // showHeader:false,
    addBtn: false,
    delBtn: false,
    editBtn: false,
    refreshBtn: false,
    filterBtn: false,
    searchBtn: false,
    selectClearBtn: false,
    columnBtn: false,
    simplePage: true,
    align: 'center',
    searchSize: 'mini',
    column: [
        {
            label: "USERNAME",
            prop: "username",
            slot: true,
        },
        {
            label: "CUSTOM_ID",
            prop: "custom_id",
        },
        {
            label: "TAGS",
            prop: "tags",
            type: "select",
            slot: true,
            width: 240,
        },
        {
            label: "CREATED",
            prop: "created_at",
            type: "date",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            formatter: (row, value, label, column) => {
                return value * 1000;
            }
        }
    ]
}


export const consumersColumn = {
    emptyBtn: false,
    submitBtn: false,
    column: [
        {
            label: "USERNAME",
            labelWidth: 100,
            span: 24,
            prop: "username",
        },
        {
            label: "CUSTOM_ID",
            prop: "custom_id",
            span: 24,
            labelWidth: 100,
        }, {
            label: "TAGS",
            prop: "tags",
            span: 24,
            formslot: true,
            labelWidth: 100,
        }
    ]
}