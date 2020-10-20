<template>
    <!-- 页面内部使用的面包屑组件（URL不变,不适用router跳转） -->
    <div class="inner-breadcrumb" v-show="showInRoot || value!=root" style="height:1px;padding:0 12px 10px;">
        <el-breadcrumb class="breadcrumb" separator="/" style="float:left;">
            <el-breadcrumb-item v-for="(node, index) in pathArr" :key="index">
                <span v-if="node.disable && index<pathArr.length-1" class="disable" :class="{'last':index==pathArr.length-1}">{{parse(node.label)}}</span>
                <a v-else :class="{'last':index==pathArr.length-1}" href="javascript:;" @click="change(node.key,node.disable)">{{parse(node.label)}}</a>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <el-button v-if="showBack&&pathArr.length>1" style="float:right;padding:0;" type="text" @click="back">返回上一级</el-button>
    </div>
</template>
<script>
    /**
     * 页面内部使用的面包屑组件（URL不变,不适用router跳转）
     */
    export default {
        name: "InnerBreadcrumb",
        props: {
            value: {
                type: String,
            },
            path: {
                type: Object,
                required: true,
                // 形如：
                default: {
                    label: "一级页面",
                    key: "1",
                    children: [
                        {
                            key: "2A",
                            label: "二级页面A"
                        },
                        {
                            key: "2B",
                            label: "二级页面B",
                            disable: true,
                            children: [
                                {
                                    key: "3",
                                    label: "三级页面"
                                }
                            ]
                        }
                    ]
                }
            },
            showBack:{ // 是否显示返回上一级
                type: Boolean,
                default: false
            },
            showInRoot: { // 是否在根目录显示
                type: Boolean,
                default: false
            },
            labelArgs:{ // 用于回显的参数 例如在 label 中使用 '设置:{info}',在 labelArgs传入{info:'用户信息'} 即可
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                pathMap: null,
                root: null,
                pathArr: []
            };
        },
        watch: {
            value(val) {
                this.buildPath(val);
            }
        },
        methods: {
            init() {
                let path = this.path;
                this.root = path.key;
                let pathMap = {};
                // 遍历path树,给每个节点加上父节点的key，parentKey空则是根节点
                let traverse = (node, parentKey) => {
                    node.parentKey = parentKey;
                    pathMap[node.key] = node;
                    if (node.children && node.children.length) {
                        for (let i = 0; i < node.children.length; i++) {
                            const child = node.children[i];
                            traverse(child, node.key);
                        }
                    }
                };
                traverse(path);
                this.pathMap = pathMap;
            },
            buildPath(key) {
                if(!key)
                    return;
                // 建立路径数组
                let node = this.pathMap[key];
                if (!node) {
                    // console.warn("InnerBreadcrumb 找不到key:" + key);
                    return;
                }
                let arr = [];
                while (node) {
                    arr.push(node);
                    node = this.pathMap[node.parentKey];
                }
                arr.reverse();
                this.pathArr = arr;
            },
            parse(label){
                const reg = /\{[^\}]+\}/g;
                let labelCopy = label; // 复制一份
                let match;
                /* match的值
                  0: "{abc}"
                  groups: undefined
                  index: 3
                  input: "123{abc},{b}"
                */
                while((match = reg.exec(label))!=null){
                    let key = match[0].substr(1,match[0].length-2);
                    let value = this.labelArgs[key];
                    if (value){
                        // console.warn('InnerBreadcrumb 找不到参数:', key);
                        labelCopy = labelCopy.replace(match[0],value);
                    }
                }
                return labelCopy;
            },
            change(key, disable) {
                if (disable) return;
                // console.log(key);
                this.$emit("input", key);
            },
            back(){
                if(this.pathArr && this.pathArr.length>1){
                    for (let i = this.pathArr.length-2; i >=0; i--) {
                        const node = this.pathArr[i];
                        if (!node.disable){
                            this.change(node.key);
                            return;
                        }
                    }
                }
                console.warn('InnerBreadcrumb 没有非disalbe的上级路径');
            }
        },
        created() {},
        mounted() {
            this.init();
            this.buildPath(this.value);
        }
    };
</script>
<style lang="scss">
    .inner-breadcrumb {
        .breadcrumb{
            span {
                font-weight: normal;
                color: #aaa;
            }
            a {
                font-weight: normal;
                color: #aaa;
            }
            a:hover{
                color: #409EFF;
            }
            .last{
                font-weight: bold!important;
                cursor: default!important;
            }
            .disable{
                cursor: default!important;
            }
        }

    }
</style>
