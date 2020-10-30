/**
 * 本地全局字典
 *
 */
export const DIC = {
    UPSTREAMS: 'Upstreams',
    SERVICES: 'Services',
    ROUTES: 'Routes',
    PLUGINS: 'Plugins',
    CONSUMERS: 'Consumers',
    SNIS: 'Snis',
    TARGETS: 'Targets',
    CERTIFICATES: 'Certificates',
    CACERTIFICATES: 'CaCertificates',
    USERTYPE: [{
        label: '请选择',
        value: ''
    }, {
        label: '超级用户',
        value: 'UserType_1'
    }, {
        label: '管理员',
        value: 'UserType_2'
    }, {
        label: '供应商用户',
        value: 'UserType_3'
    }, {
        label: '公司用户',
        value: 'UserType_4'
    }],
    DEVELOPER_STATE: [
        {
            label: '请选择',
            value: ''
        }, {
            label: '未激活',
            value: '1'
        }, {
            label: '正常',
            value: '2'
        }, {
            label: '禁用',
            value: '3'
        }],
    USE_YN: [{
        label: '否',
        value: 'n',
        color: 'red'
    }, {
        label: '是',
        value: 'y',
        color: 'green'
    }],
    ROLE_TYPE: [{
        label: '菜单角色',
        value: 'menu'
    }, {
        label: '数据角色',
        value: 'data'
    }],
    VAILD: [{
        label: '真',
        value: 'true',
        color: 'green'
    }, {
        label: '假',
        value: 'false',
        color: 'red'
    }],
    SEX: [{
        label: '男',
        value: 0,
        color: 'green'
    }, {
        label: '女',
        value: 1,
        color: 'red'
    }],
    POSTIONDATA: [{
        label: '左对齐',
        value: 'left'
    }, {
        label: '居中',
        value: 'center'
    }, {
        label: '右对齐',
        value: 'right'
    }],
    TYPE: [{
        label: '一级1',
        value: 0,
        children: [{
            label: '一级1二级1',
            value: 2,
        }]
    }, {
        label: '一级2',
        value: 1,
        children: [{
            label: '一级2二级1',
            value: 2,
        }]
    }

    ],

    GRADE: [{
        label: "管理员",
        value: 0
    },
    {
        label: "二级管理员",
        value: 1
    }
    ],
    VAILDATA: [{
        label: "激活",
        value: true,
    },
    {
        label: "禁用",
        value: false,
    }
    ],

    ISGLOBAl: [{
        label: "否",
        value: 0
    }, {
        label: '是',
        value: 1
    }],
    AVA: [{
        label: "可用",
        value: '1',
    }, {
        label: "不可用",
        value: '0'
    }],
    HASH_ON_TYPE: [{ label: "none", value: 'none' }, {
        label: "consumer",
        value: "consumer"
    }, {
        label: "ip",
        value: "ip"
    }, {
        label: "header",
        value: "header"
    }, {
        label: "cookie",
        value: "cookie"
    }],
    PROTOCOLS: [{ label: "http", value: 'http' }, { label: "https", value: 'https' }],
    ROUTE_PROTOCOLS: [
        {
            value: 'http',
            label: 'http',
            children: [{ label: "http", value: 'http' }, { label: "https", value: 'https' }]
        },
        {
            value: 'grpc',
            label: 'grpc',
            children: [{ label: "grpc", value: 'grpc' }, { label: "grpcs", value: 'grpcs' }]
        },
        {
            value: 'tcp',
            label: 'tcp',
            children: [{ label: "tcp", value: 'tcp' }, { label: "tls", value: 'tls' }]
        },
    ],
    U_ALGORITHMS: [{ label: "round-robin", value: 'round-robin' }, { label: "consistent-hashing", value: 'consistent-hashing' }, { label: "least-connections", value: 'least-connections' }],
    PROTOCOLS_HEALTHCHECK: [{ label: "http", value: 'http' }, { label: "https", value: 'https' }, { label: "tcp", value: 'tcp' }],
    HASH_ON_FALLBACK_TYPE: [
        { label: "none", value: 'none' },
        {
            label: "consumer",
            value: "consumer"
        }, {
            label: "ip",
            value: "ip"
        }, {
            label: "header",
            value: "header"
        }],
}
