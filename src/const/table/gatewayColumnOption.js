import { DIC } from '@/const/dic'
import { pluginGroupOption_1_2_x, pluginGroupOption_1_3_x } from './pluginsOption'

const upstreamColumn = {
    emptyBtn: false,
    submitBtn: false,
    card: true,
    gutter: 200,
    column: [
        {
            label: 'Name', prop: 'name', row: true, span: 24, labelWidth: 120, maxlength: 32,
            showWordLimit: true, tip: 'Upstream名称只允许为英文字符且唯一，名称用在service中的host字段',
            rules: [{ required: true, message: "请填写名称", trigger: "blur" }], orderBy: 1
        },
        { label: 'Slot', row: true, span: 24, labelWidth: 120, prop: 'slots', value: '1000', minRows: 10, maxRows: 65536, type: 'number', orderBy: 3 },
        {
            label: "Tags",
            prop: "tags",
            span: 24,
            formslot: true,
            labelWidth: 120,
            orderBy: 4
        }
    ],
    group: [{
        icon: 'icon-optio3',
        label: 'Hash高级选项',
        collapse: false,
        arrow: true,
        prop: 'hashGroup',
        column: [{
            label: 'Hash on', row: true, span: 24, labelWidth: 120, formslot: true, prop: 'hash_on', value: 'none', type: 'radio', dicData: DIC.HASH_ON_TYPE,
        },
        { label: 'Hash Fallback', row: true, span: 24, labelWidth: 120, formslot: true, prop: 'hash_fallback', value: 'none', type: 'radio', dicData: DIC.HASH_ON_FALLBACK_TYPE },
        { label: 'Hash On Header', row: true, span: 24, labelWidth: 120, prop: 'hash_on_header', type: 'input' },
        { label: 'Hash Fallback Header', row: true, span: 24, labelWidth: 120, prop: 'hash_fallback_header', type: 'input' },
        { label: 'Hash On Cookie', row: true, span: 24, labelWidth: 120, prop: 'hash_on_cookie', type: 'input' },
        { label: 'Hash On Cookie Path', row: true, span: 24, labelWidth: 120, prop: 'hash_on_cookie_path', value: '/', type: 'input' },]
    }]
}

const serviceColumn = {
    emptyBtn: false,
    submitBtn: false,
    card: true,
    gutter: 200,
    column: [
        {
            label: '服务名称', row: true, span: 24, labelWidth: 120, prop: 'name', tip: '服务名称，只允许英文或数字', orderBy: 1,
            rules: [{ required: true, message: "请填写服务名称", trigger: "blur" }]
        },
        {
            label: '主机', row: true, span: 24, labelWidth: 120, prop: 'host', orderBy: 2,
            tip: '访问上游服务(Upstream)的名称或主机',
            rules: [{ required: true, message: "请填写主机", trigger: "blur" }]
        },
        { label: '标签', row: true, span: 24, labelWidth: 120, formslot: true, prop: 'tags' },

    ],
    group: [{
        icon: 'icon-optio3',
        label: '高级选项',
        collapse: false,
        arrow: true,
        prop: 'hashGroup',
        column: [
            { label: '请求协议', row: true, span: 24, labelWidth: 120, prop: 'protocol', type: 'select', dicData: DIC.PROTOCOLS, value: 'http' },
            { label: '端口号', row: true, span: 24, labelWidth: 120, type: 'number', value: 80, prop: 'port', tip: '上游服务代理的默认端口号为80' },
            { label: 'Path', row: true, span: 24, labelWidth: 120, value: '/', prop: 'path', tip: '默认为/,用于为请求上游服务' },
            { label: '重试次数', row: true, span: 24, labelWidth: 120, prop: 'retries', type: 'number', value: 5, tip: '默认重试次数为5次' },
            { label: '连接超时', row: true, span: 24, labelWidth: 120, prop: 'connect_timeout', type: 'number', value: 60000, tip: '连接上游服务的超时时长，默认值为60,000毫秒' },
            { label: '写超时', row: true, span: 24, labelWidth: 120, prop: 'write_timeout', type: 'number', value: 60000, tip: '写超时时长，默认值为60,000毫秒' },
            { label: '读超时', row: true, span: 24, labelWidth: 120, prop: 'read_timeout', type: 'number', value: 60000, tip: '读超时时长，默认值为60,000毫秒' },
        ]
    }]
}

const targetColumn = {
    column: [
        {
            label: "主机:端口",
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
            minRows: 0,
            maxRows: 1000,
            tip: '0-1000,默认值为100',
            placeholder: '取值范围：0-1000,默认值为100，当dns解析为一样时，权重将被覆盖'
        }
    ]
}

const routeColumn = {
    emptyBtn: false,
    submitBtn: false,
    column: [
        { label: "路由名称", labelWidth: 120, span: 24, prop: "name", orderBy: 1, rules: [{ required: true, message: "请填写路由名称", trigger: "blur" }] },
        {
            label: "Service",
            prop: "service",
            orderBy: 2,
            placeholder: '请选择service',
            rules: [{ required: true, message: "请选择service", trigger: "blur" }],
            span: 24,
            formslot: true,
            labelWidth: 120,
        },
        { label: "Hosts", labelWidth: 120, span: 24, formslot: true, prop: "hosts", type: 'select', orderBy: 2, tip: '路由匹配主机名或域名【主机和路由path，可以只填一个，或者两个都填】,主机可以填多个，如：www.baidu.com,www.sina.com' },
        {
            label: "Paths", labelWidth: 120, span: 24, formslot: true, prop: "paths", orderBy: 3,
            placeholder: '路由匹配路径【主机和路由path，可以只填一个，或者两个都填】,匹配路径可以填多个，如：/path1,/paths2/xx.do'
        },


        {
            label: "Tags",
            prop: "tags",
            span: 24,
            formslot: true,
            labelWidth: 120,
            orderBy: 6
        }

    ],
    group: [{
        icon: 'icon-optio3',
        label: '高级选项',
        collapse: false,
        arrow: true,
        prop: 'hashGroup',
        column: [
            { label: "请求方法", row: true, span: 24, labelWidth: 120, formslot: true, prop: "methods", orderBy: 4 },
            { label: "截断Path", labelWidth: 120, span: 24, prop: "strip_path", type: 'switch' },
            {
                label: "正则优先级", row: true, span: 24, labelWidth: 120, prop: "regex_priority", type: 'number', minRows: 0,
                value: 0, tip: '当多个路由同时使用正则表达式匹配某个给定请求时，用来选择哪个路由解析该请求的数字。当两个路由匹配路径并且具有相同的regex_优先级时，将使用较旧的路由（最低创建位置）。注意，非regex路由的优先级不同（较长的非regex路由在较短的路由之前匹配）。默认为0。'
            },
            { label: "保留主机", row: true, span: 24, labelWidth: 120, prop: "preserve_host", type: 'switch' },
        ]
    }
    ]
}

const consumersColumn = {
    emptyBtn: false,
    submitBtn: false,
    card: true,
    gutter: 200,
    column: [
        {
            label: "Username",
            labelWidth: 100,
            span: 24,
            prop: "username",
        },
        {
            label: "Custom_id",
            prop: "custom_id",
            span: 24,
            labelWidth: 100,
        }, {
            label: "Tags",
            prop: "tags",
            span: 24,
            formslot: true,
            labelWidth: 100,
        }
    ]
}

const snisColumn = {
    emptyBtn: false,
    submitBtn: false,
    card: true,
    gutter: 200,
    column: [
        {
            label: "Name",
            labelWidth: 100,
            span: 24,
            prop: "name",
            rules: [{ required: true, message: "请填写Snis Name", trigger: "blur" }]
        },
        {
            label: "Certificate",
            prop: "certificate",
            placeholder: '请选择Certificate',
            rules: [{ required: true, message: "请选择Certificate", trigger: "blur" }],
            span: 24,
            formslot: true,
            labelWidth: 100,
        }, {
            label: "Tags",
            prop: "tags",
            span: 24,
            formslot: true,
            labelWidth: 100,
        }
    ]
}


const certificatesColumn = {
    emptyBtn: false,
    submitBtn: false,
    card: true,
    column: [{
        label: "Server Name Indications(SNI)",
        prop: "snis",
        span: 24,
        formslot: true,
        labelWidth: 260,
        rules: [{ required: true, message: "请填写Snis", trigger: "blur" }]
    },
    {
        label: "Cert",
        labelWidth: 260,
        type: 'textarea',
        span: 24,
        prop: "cert",
        rules: [{ required: true, message: "请填写Cert", trigger: "blur" }]
    },
    {
        label: "Key",
        prop: "key",
        type: 'textarea',
        span: 24,
        labelWidth: 260,
        rules: [{ required: true, message: "请填写Key", trigger: "blur" }]
    }, {
        label: "Tags",
        prop: "tags",
        span: 24,
        formslot: true,
        labelWidth: 260
    }
    ]
}

const ca_certificatesColumn = {
    emptyBtn: false,
    submitBtn: false,
    card: true,
    column: [
        {
            label: "Cert",
            labelWidth: 260,
            type: 'textarea',
            span: 24,
            prop: "cert",
            rules: [{ required: true, message: "请填写Cert", trigger: "blur" }]
        }, {
            label: "Tags",
            prop: "tags",
            span: 24,
            formslot: true,
            labelWidth: 260
        }
    ]
}

const jwtColumn = {
    emptyBtn: false,
    submitBtn: false,
    card: true,
    column: [
        {
            label: "key",
            span: 24,
            prop: "key",
        }, {
            label: "secret",
            prop: "secret",
            span: 24,
        }, {
            label: "rsa_public_key",
            prop: "rsa_public_key",
            span: 24,
        }, {
            label: "algorithm",
            prop: "algorithm",
            span: 24,
            value: 'HS256',
            type: 'radio',
            dicData: [{ "label": "HS256", value: "HS256" }, { "label": "RS256", value: "RS256" }],
        }
    ]
}

const basicColumn = {
    emptyBtn: false,
    submitBtn: false,
    card: true,
    column: [
        {
            label: "username",
            span: 24,
            prop: "username",
        }, {
            label: "password",
            prop: "password",
            span: 24,
        }
    ]
}

const keyColumn = {
    emptyBtn: false,
    submitBtn: false,
    card: true,
    column: [
        {
            label: "key",
            span: 24,
            prop: "key",
        }
    ]
}

const hmacColumn = {
    emptyBtn: false,
    submitBtn: false,
    card: true,
    column: [
        {
            label: "username",
            span: 24,
            prop: "username",
        }, {
            label: "secret",
            span: 24,
            prop: "secret",
        }
    ]
}

const oauth2Column = {
    emptyBtn: false,
    submitBtn: false,
    card: true,
    column: [
        {
            label: "name",
            span: 24,
            prop: "name",
        }, {
            label: "redirect_uris",
            span: 24,
            formslot: true,
            prop: "redirect_uris",
        }, {
            label: "client_id",
            span: 24,
            prop: "client_id",
        }, {
            label: "client_secret",
            span: 24,
            prop: "client_secret",
        }
    ]
}


const COLUMNS_1_2_X = {

    "Upstreams": _.cloneDeep(upstreamColumn),
    "Services": _.cloneDeep(serviceColumn),
    "Routes": _.assign(_.cloneDeep(routeColumn), {
        column: _.sortBy(_.concat(routeColumn.column, ([{
            label: "请求协议", prop: "protocols", row: true, span: 24, labelWidth: 120, multiple: true,
            type: 'select', dicData: DIC.PROTOCOLS, orderBy: 5
        }])), function (o) {
            return o.orderBy;
        })
    }),
    "Targets": targetColumn,
    'Consumers': consumersColumn,
    'Snis': snisColumn,
    'Certificates': certificatesColumn,
    "Plugins": pluginGroupOption_1_2_x,
    "jwt": jwtColumn,
    "basic-auth": basicColumn,
    "key-auth": keyColumn,
    "oauth2": oauth2Column,
    "hmac-auth": hmacColumn
}

const COLUMNS_1_3_X = {
    "Upstreams": _.assign(_.cloneDeep(upstreamColumn), {
        column: _.sortBy(_.concat(upstreamColumn.column, ([{
            label: '负载算法', row: true, span: 24, labelWidth: 120, prop: 'algorithm', value: 'round-robin', type: 'radio', disabled: true, dicData: DIC.U_ALGORITHMS, orderBy: 2
        }])), function (o) {
            return o.orderBy;
        })
    }),
    "Services": _.assign(_.cloneDeep(serviceColumn), {
        column: _.sortBy(_.concat(serviceColumn.column, ([{
            label: "Client Certificate", prop: "client_certificate", row: true, span: 24, labelWidth: 120, orderBy: 4,
            formslot: true,
            placeholder: '请输入Certificate ID'
        }])), function (o) {
            return o.orderBy;
        })
    }),
    "Routes": _.assign(_.cloneDeep(routeColumn), {
        column: _.sortBy(_.concat(routeColumn.column, ([{
            label: "请求协议", prop: "protocols", row: true, span: 24, labelWidth: 120, multiple: true,
            'leaf-only': true, value: ['http', 'https'],
            type: 'tree', dicData: DIC.ROUTE_PROTOCOLS, orderBy: 5
        }])), function (o) {
            return o.orderBy;
        })
    }),
    "Targets": targetColumn,
    'Consumers': consumersColumn,
    'Snis': snisColumn,
    'Certificates': certificatesColumn,
    'CaCertificates': ca_certificatesColumn,
    "Plugins": pluginGroupOption_1_3_x,
    "jwt": jwtColumn,
    "basic-auth": basicColumn,
    "key-auth": keyColumn,
    "oauth2": oauth2Column,
    "hmac-auth": hmacColumn
}

const KONG_COLUMNS = {
    "1.2.x": COLUMNS_1_2_X,
    "1.3.x": COLUMNS_1_3_X,
    "1.4.x": COLUMNS_1_3_X,
    "1.5.x": COLUMNS_1_3_X,
    "2.0.x": COLUMNS_1_3_X,
    "2.1.x": COLUMNS_1_3_X,
}

export function get_columns(version, name) {
    console.log('Kong version :', version, ',Entity :', name)
    let _v = version
    if (_v) {
        _v = _v.substr(0, _v.lastIndexOf('.'));
    }
    if (!!!_v) {
        _v = '1.2'
    }

    _v = _v + ".x"
    let columns = KONG_COLUMNS[_v][name]
    if (!!!columns) {
        columns = KONG_COLUMNS['1.2.x'][name]
    }
    return _.cloneDeep(columns);
}