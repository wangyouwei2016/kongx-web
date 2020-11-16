import { DIC } from '@/const/dic'
import { checkNumber } from '@/util/validate'

/**
 * @title 路由管理
 * @type {{border: boolean, menuAlign: string, maxHeight: number, delBtn: boolean, dicData: *, menuBtn: boolean, column: *[], index: boolean, align: string, addBtn: boolean, searchSize: string}}
 */
const routingOption = {
    maxHeight: 600,
    expand: true,
    expandRowKeys: [],
    index: true,
    menuBtn: true,
    stripe: true,
    refreshBtn: false,
    simplePage: true,
    filterBtn: false,
    searchBtn: false,
    selectClearBtn: false,
    columnBtn: false,
    addBtn: false,
    editBtn: false,
    delBtn: false,
    align: 'center',
    column: [{
        label: "路由名称",
        prop: "name",
        align: "left",
        slot: true,
    }, {
        label: "Service",
        prop: "service",
        align: "left",
        sortable: true,
        slot: true,
    }, {
        label: "Protocols",
        prop: "protocols",
        overHidden: true,
        slot: true,
        align: "left",
    }, {
        label: "Hosts",
        prop: "hosts",
        overHidden: true,
        align: "left",
        sortable: true,
    },
    // {
    //     label: "Paths",
    //     prop: "paths",
    //     overHidden: true,
    //     align: "left",
    //     slot: true,
    // },
    {
        label: "CREATED",
        prop: "created_at",
        sortable: true,
        slot: true,
        width: 160,
    }, {
        label: 'ID',
        prop: 'id',
        align: 'left',
        overHidden: true,
        slot: true,
    }
    ]
};

export const serviceRouteOption = {
    maxHeight: 600,
    expandRowKeys: [],
    expand: true,
    rowkey: 'id',
    dialogDrag: true,
    stripe: true,
    refreshBtn: false,
    simplePage: true,
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

/**
 * @title 上游代理
 * @type {{border: boolean, menuAlign: string, maxHeight: number, delBtn: boolean, dicData: *, menuBtn: boolean, column: *[], index: boolean, labelWidth: number, align: string, addBtn: boolean, searchSize: string}}
 */
const upstreamOption = {
    maxHeight: 600,
    expand: true,
    index: true,
    menuBtn: true,
    stripe: true,
    refreshBtn: false,
    simplePage: true,
    filterBtn: false,
    searchBtn: false,
    selectClearBtn: false,
    columnBtn: false,
    addBtn: false,
    editBtn: false,
    delBtn: false,
    menuAlign: 'center',
    align: 'center',
    size: "small",
    searchSize: 'small',
    column: [{
        label: 'NAME',
        prop: 'name',
        align: 'left',
        slot: true,
    },
    {
        label: "SLOT",
        rules: [{ validator: checkNumber, trigger: 'blur' }],
        prop: "slots"
    },
    {
        label: "CREATED",
        prop: "created_at",
        sortable: true,
        slot: true,
        width: 160,
    }, {
        label: 'ID',
        prop: 'id',
        align: 'left',
        overHidden: true,
        slot: true,
    }]
};

export const activeHealthCheckOption = {
    card: true,
    emptyBtn: false,
    submitBtn: false,
    gutter: 200,

    group: [{
        icon: 'icon-jichuxinxi',
        label: '基础参数',
        // collapse: false,
        arrow: true,
        prop: 'unhealthy',
        column: [{
            label: '请求协议类型',
            type: 'radio',
            labelWidth: 110,
            span: 24,
            prop: 'type',
            value: 'http',
            dicData: DIC.PROTOCOLS_HEALTHCHECK
        }, {
            label: '请求路径',
            prop: 'http_path',
            span: 24,
            labelWidth: 110,
            value: '/'
        }, {
            label: '超时时长',
            prop: 'timeout',
            type: 'number',
            minRows: 0,
            span: 24,
            maxRows: 60000,
            labelWidth: 110,
            value: 1
        }, {
            label: 'https_sni',
            labelWidth: 110,
            span: 24,
            prop: 'https_sni'
        }, {
            label: '并发数',
            prop: 'concurrency',
            type: 'number',
            labelWidth: 110,
            span: 24,
            value: 10,
        }, {
            label: '是否验证https证书',
            labelWidth: 140,
            prop: 'https_verify_certificate',
            span: 24,
            type: 'switch'
        }]
    },
    {
        icon: 'icon-unhealthy',
        label: '非健康(Unhealthy)',
        collapse: false,
        arrow: true,
        prop: 'unhealthy',
        column: [{
            label: '错误状态码',
            prop: 'fail_http_statuses',
            labelWidth: 110,
            formslot: true,
            span: 24,
            type: 'select',
            value: ['429', '404', '500', '501', '502', '503', '504', '505']
        }, {
            label: '间隔时长',
            type: 'number',
            labelWidth: 110,
            prop: 'interval',
            minRows: 0,
            span: 24,
            value: 0
        },
        {
            label: 'HTTP失败次数',
            type: 'number',
            labelWidth: 110,
            minRows: 0,
            span: 24,
            prop: 'http_failures',
            value: 0
        }, {
            label: 'TCP失败次数',
            type: 'number',
            minRows: 0,
            span: 24,
            labelWidth: 110,
            prop: 'tcp_failures',
            value: 0
        }, {
            label: '超时次数',
            type: 'number',
            minRows: 0,
            span: 24,
            labelWidth: 110,
            prop: 'timeouts',
            value: 0
        }]
    },
    {
        icon: 'icon-healthy',
        label: '健康(Healthy)',
        collapse: false,
        arrow: true,
        prop: 'healthy',
        column: [{
            label: '正常状态码',
            labelWidth: 110,
            prop: 'http_statuses',
            type: 'select',
            span: 24,
            formslot: true,
            value: ['200', '304']
        }, {
            label: '间隔时长',
            type: 'number',
            labelWidth: 110,
            minRows: 0,
            span: 24,
            prop: 'healthy_interval',
            value: 0
        },
        {
            label: '请求成功次数', labelWidth: 110, minRows: 0,
            span: 24, prop: 'successes', type: 'number', value: 0
        }]
    }
    ]
}

export const passiveHealthCheckOption = {
    card: true,
    emptyBtn: false,
    submitBtn: false,
    gutter: 200,
    column: [{
        label: 'HTTP失败次数',
        type: 'number',
        labelWidth: 110,
        minRows: 0,
        span: 24,
        prop: 'http_failures',
        value: 0
    }, {
        label: '非健康状态码',
        prop: 'fail_http_statuses',
        labelWidth: 110,
        formslot: true,
        span: 24,
        type: 'select',
    }, {
        label: 'TCP失败次数',
        type: 'number',
        minRows: 0,
        span: 24,
        labelWidth: 110,
        prop: 'tcp_failures',
        value: 0
    }, {
        label: '超时次数',
        type: 'number',
        minRows: 0,
        span: 24,
        labelWidth: 110,
        prop: 'timeouts',
        value: 0
    },
    {
        label: '请求协议类型',
        type: 'radio',
        labelWidth: 110,
        span: 24,
        prop: 'type',
        value: 'http',
        dicData: DIC.PROTOCOLS_HEALTHCHECK
    },
    {
        label: '请求成功次数', labelWidth: 110, minRows: 0,
        span: 24, prop: 'successes', type: 'number', value: 0
    }, {
        label: '健康状态码',
        labelWidth: 110,
        prop: 'http_statuses',
        type: 'select',
        span: 24,
        formslot: true,
    },
    ]
}

/**
 * @title 服务管理
 * @type {{border: boolean, menuAlign: string, maxHeight: number, delBtn: boolean, dicData: *, menuBtn: boolean, column: *[], index: boolean, labelWidth: number, align: string, addBtn: boolean, searchSize: string}}
 */
const serviceOption = {
    maxHeight: 600,
    stripe: true,
    refreshBtn: false,
    simplePage: true,
    index: true,
    menuBtn: true,
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
        label: '服务名称',
        prop: 'name',
        align: 'left',
        slot: true,
    }, {
        label: 'HOST',
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
        slot: true,
        width: 160,
    }, {
        label: 'ID',
        prop: 'id',
        align: 'left',
        overHidden: true,
        slot: true,
    },]
};

/**
 * @title 插件管理
 * @type {{border: boolean, menuAlign: string, maxHeight: number, delBtn: boolean, dicData: *, menuBtn: boolean, column: *[], index: boolean, saveBtnTitle: string, align: string, addBtn: boolean, searchSize: string}}
 */

const pluginsOption = {
    maxHeight: 600,
    labelWidth: 120,
    menuAlign: 'center',
    index: true,
    stripe: true,
    refreshBtn: false,
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
            label: "Consumer",
            prop: "consumer",
            slot: true,
            overHidden: true,
        },
        {
            label: "CREATED",
            prop: "created_at",
            sortable: true,
            slot: true,
            width: 160,
        }, {
            label: 'ID',
            prop: 'id',
            align: 'left',
            overHidden: true,
            slot: true,
        }
    ]
};

export const servicePluginsOption = {
    maxHeight: 600,
    labelWidth: 120,
    menuAlign: 'center',
    index: true,
    stripe: true,
    refreshBtn: false,
    simplePage: true,
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
            // displayAs: 'switch'
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
    stripe: true,
    refreshBtn: false,
    simplePage: true,
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
        },
        {
            label: "插件名称",
            prop: "name",
        },
        {
            label: "创建日期",
            prop: "created_at",
            sortable: true,
            type: "datetime",
            slot: true
        }
    ]
};

export const targetOption = {
    index: true,
    labelWidth: 120,
    stripe: true,
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


const consumersOption = {
    index: true,
    stripe: true,
    refreshBtn: false,
    simplePage: true,
    labelWidth: 120,
    addBtn: false,
    delBtn: false,
    editBtn: false,
    refreshBtn: false,
    filterBtn: false,
    searchBtn: false,
    selectClearBtn: false,
    columnBtn: false,
    align: 'center',
    searchSize: 'mini',
    column: [
        {
            label: "Username",
            prop: "username",
            slot: true,
        },
        {
            label: "Custom_id",
            prop: "custom_id",
        },
        {
            label: "Tags",
            prop: "tags",
            type: "select",
            slot: true,
            width: 100,
        },
        {
            label: "CREATED",
            prop: "created_at",
            sortable: true,
            slot: true,
            width: 160,
        }, {
            label: 'ID',
            prop: 'id',
            align: 'left',
            overHidden: true,
            slot: true,
        }
    ]
}

const snisOption = {
    index: true,
    stripe: true,
    refreshBtn: false,
    simplePage: true,
    labelWidth: 120,
    addBtn: false,
    delBtn: false,
    editBtn: false,
    refreshBtn: false,
    filterBtn: false,
    searchBtn: false,
    selectClearBtn: false,
    columnBtn: false,
    align: 'center',
    searchSize: 'mini',
    column: [
        {
            label: "Name",
            prop: "name",
        },
        {
            label: "Tags",
            prop: "tags",
            type: "select",
            slot: true,
            width: 100,
        },
        {
            label: "CREATED",
            prop: "created_at",
            sortable: true,
            slot: true,
            width: 160,
        }, {
            label: 'ID',
            prop: 'id',
            align: 'left',
            overHidden: true,
            slot: true,
        }
    ]
}


const certificatesOption = {
    index: true,
    stripe: true,
    refreshBtn: false,
    simplePage: true,
    labelWidth: 120,
    addBtn: false,
    delBtn: false,
    editBtn: false,
    refreshBtn: false,
    filterBtn: false,
    searchBtn: false,
    selectClearBtn: false,
    columnBtn: false,
    align: 'center',
    searchSize: 'mini',
    column: [
        {
            label: "Cert",
            prop: "cert",
            overHidden: true
        },
        {
            label: "Key",
            prop: "key",
            overHidden: true
        },
        {
            label: "Snis",
            prop: "snis",
        },
        {
            label: "Tags",
            prop: "tags",
            type: "select",
            slot: true,
            width: 100,
        },
        {
            label: "CREATED",
            prop: "created_at",
            sortable: true,
            slot: true,
            width: 160,
        }, {
            label: 'ID',
            prop: 'id',
            align: 'left',
            overHidden: true,
            slot: true,
        }
    ]
}

const cacertificatesOption = {
    index: true,
    stripe: true,
    refreshBtn: false,
    simplePage: true,
    labelWidth: 120,
    addBtn: false,
    delBtn: false,
    editBtn: false,
    refreshBtn: false,
    filterBtn: false,
    searchBtn: false,
    selectClearBtn: false,
    columnBtn: false,
    align: 'center',
    searchSize: 'mini',
    column: [
        {
            label: "Cert",
            prop: "cert",
            overHidden: true
        },

        {
            label: "Tags",
            prop: "tags",
            type: "select",
            slot: true,
            width: 100,
        },
        {
            label: "CREATED",
            prop: "created_at",
            sortable: true,
            slot: true,
            width: 160,
        }, {
            label: 'ID',
            prop: 'id',
            align: 'left',
            overHidden: true,
            slot: true,
        }
    ]
}


const jwtOption = {
    index: true,
    stripe: true,
    refreshBtn: false,
    simplePage: true,
    labelWidth: 120,
    addBtn: false,
    delBtn: false,
    editBtn: false,
    refreshBtn: false,
    filterBtn: false,
    searchBtn: false,
    selectClearBtn: false,
    columnBtn: false,
    align: 'center',
    searchSize: 'mini',
    column: [
        {
            label: "Secret",
            prop: "secret",
            overHidden: true
        },
        {
            label: "Key",
            prop: "key",
            overHidden: true
        },
        {
            label: "Algorithm",
            prop: "algorithm",
        },
        {
            label: "CREATED",
            prop: "created_at",
            sortable: true,
            slot: true,
            width: 160,
        }, {
            label: 'ID',
            prop: 'id',
            align: 'left',
            overHidden: true,
            slot: true,
        }
    ]
}


const basicOption = {
    index: true,
    stripe: true,
    refreshBtn: false,
    simplePage: true,
    labelWidth: 120,
    addBtn: false,
    delBtn: false,
    editBtn: false,
    refreshBtn: false,
    filterBtn: false,
    searchBtn: false,
    selectClearBtn: false,
    columnBtn: false,
    align: 'center',
    searchSize: 'mini',
    column: [
        {
            label: "Username",
            prop: "username",
            overHidden: true
        },
        {
            label: "Password",
            prop: "password",
            overHidden: true
        },
        {
            label: "CREATED",
            prop: "created_at",
            sortable: true,
            slot: true,
            width: 160,
        }, {
            label: 'ID',
            prop: 'id',
            align: 'left',
            overHidden: true,
            slot: true,
        }
    ]
}


const keyOption = {
    index: true,
    stripe: true,
    refreshBtn: false,
    simplePage: true,
    labelWidth: 120,
    addBtn: false,
    delBtn: false,
    editBtn: false,
    refreshBtn: false,
    filterBtn: false,
    searchBtn: false,
    selectClearBtn: false,
    columnBtn: false,
    align: 'center',
    searchSize: 'mini',
    column: [

        {
            label: "Key",
            prop: "key",
            overHidden: true
        },
        {
            label: "CREATED",
            prop: "created_at",
            sortable: true,
            slot: true,
            width: 160,
        }, {
            label: 'ID',
            prop: 'id',
            align: 'left',
            overHidden: true,
            slot: true,
        }
    ]
}

const oauth2Option = {
    index: true,
    stripe: true,
    refreshBtn: false,
    simplePage: true,
    labelWidth: 120,
    addBtn: false,
    delBtn: false,
    editBtn: false,
    refreshBtn: false,
    filterBtn: false,
    searchBtn: false,
    selectClearBtn: false,
    columnBtn: false,
    align: 'center',
    searchSize: 'mini',
    column: [
        {
            label: "name",
            prop: "name",
            overHidden: true
        },
        {
            label: "client id",
            prop: "client_id",
            overHidden: true
        },
        {
            label: "redirect uris",
            prop: "redirect_uris",
            slot: true,
        },
        {
            label: "CREATED",
            prop: "created_at",
            sortable: true,
            slot: true,
            width: 160,
        }, {
            label: 'ID',
            prop: 'id',
            align: 'left',
            overHidden: true,
            slot: true,
        }
    ]
}

const hmacOption = {
    index: true,
    stripe: true,
    refreshBtn: false,
    simplePage: true,
    labelWidth: 120,
    addBtn: false,
    delBtn: false,
    editBtn: false,
    refreshBtn: false,
    filterBtn: false,
    searchBtn: false,
    selectClearBtn: false,
    columnBtn: false,
    align: 'center',
    searchSize: 'mini',
    column: [{
        label: "Username",
        prop: "username",
        overHidden: true
    },
    {
        label: "Secret",
        prop: "secret",
        overHidden: true
    },

    {
        label: "CREATED",
        prop: "created_at",
        sortable: true,
        slot: true,
        width: 160,
    }, {
        label: 'ID',
        prop: 'id',
        align: 'left',
        overHidden: true,
        slot: true,
    }
    ]
}

const COLUMNS_1_2_X = {
    "Upstreams": upstreamOption,
    "Services": serviceOption,
    "Routes": routingOption,
    "Targets": targetOption,
    'Consumers': consumersOption,
    'Snis': snisOption,
    'Certificates': certificatesOption,
    'CaCertificates': cacertificatesOption,
    "Plugins": pluginsOption,
    "jwt": jwtOption,
    "basic-auth": basicOption,
    "key-auth": keyOption,
    "oauth2": oauth2Option,
    "hmac-auth": hmacOption
}
const KONG_OPTIONS = {
    "1.2.x": COLUMNS_1_2_X,
    "1.3.x": COLUMNS_1_2_X,
    "1.4.x": COLUMNS_1_2_X,
    "1.5.x": COLUMNS_1_2_X,
    "2.0.x": COLUMNS_1_2_X,
    "2.1.x": COLUMNS_1_2_X,
}

const KONG_VERSIONS = {
    "1.0": '1.2.x',
    "2.0": "2.1.x"
}

export function get_options(version, name) {
    console.log('Kong version :', version, ',Entity :', name)
    let _v = version
    if (_v) {
        _v = _v.substr(0, _v.lastIndexOf('.'));
    }
    if (!!!_v) {
        _v = '1.2'
    }

    let _version = _v + ".x"
    let columns = KONG_OPTIONS[_version]
    if (!!!columns) {
        let v = _v.substr(0, 1) + '.0'
        columns = KONG_OPTIONS[KONG_VERSIONS[v]]
    }
    return _.cloneDeep(columns[name]);
}