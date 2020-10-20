import { DIC } from '@/const/dic'
import { checkNumber } from '@/util/validate'


export const menuOption = {
    children: 'children',
    label: 'appName',
    id: 'id'
};

export const syncParamOptions = {
    maxHeight: 600,
    // defaultExpandAll: true,
    selection: true,
    selectable: (row, index) => {
        return row.configId == -1;
    },
    expandRowKeys: [],
    index: true,
    border: true,
    menuBtn: true,
    refreshBtn: false,
    filterBtn: false,
    simplePage: true,
    searchBtn: false,
    selectClearBtn: false,
    columnBtn: false,
    addBtn: false,
    editBtn: false,
    delBtn: false,
    align: 'center',
    column: [
        {
            label: "参数Key",
            prop: "paramKey",
            overHidden: true,
            align: "left",
            sortable: true,
        }, {
            label: "当前环境参数值",
            prop: "paramVal",
            overHidden: true,
            align: "left",
            sortable: true,
        },
        {
            label: "目标环境参数值",
            prop: "dest",
            overHidden: true,
            align: "left",
            formatter: (row, value, label, column) => {
                return row.paramVal;
            }
        }
    ]
}

export const paramOptions = {
    maxHeight: 600,
    expand: true,
    // defaultExpandAll: true,
    selection: true,
    selectable: (row, index) => {
        return row.configId == -1;
    },
    expandRowKeys: [],
    index: true,
    simplePage: true,
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
    column: [
        {
            label: "参数Key",
            prop: "paramKey",
            overHidden: true,
            align: "left",
            sortable: true,
        }, {
            label: "参数值",
            prop: "paramVal",
            overHidden: true,
            align: "left",
            sortable: true,
        },
        {
            label: "描述",
            prop: "paramDesc",
            overHidden: true,
            align: "left",
        }
    ]
}

