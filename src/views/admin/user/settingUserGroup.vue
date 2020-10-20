<template>
    <div>
        <el-tag
                :key="tag"
                v-for="tag in dynamicTags"
                :closable="permission.user_authority?true:false"
                :disable-transitions="false"
                @close="handleClose(tag)"
        >{{tag.name}}
        </el-tag>

        <el-autocomplete
                ref="saveTagInput"
                v-if="inputVisible"
                popper-class="my-autocomplete"
                v-model="state"
                :fetch-suggestions="remoteMethod"
                placeholder="请输入用户组进行检索"
                @select="handleSelect"
                style="margin-left:10px;"
        >
            <i class="el-icon-edit el-input__icon" slot="suffix"></i>
            <template slot-scope="{ item }">
                <div class="name">{{ item.name }}</div>
                <span class="addr">{{ item.mobile }}</span>
            </template>
        </el-autocomplete>
        <el-button
                v-else
                class="button-new-tag el-icon-plus"
                v-show="permission.user_authority"
                size="small"
                @click="showInput"
        ></el-button>
    </div>
</template>
<style>
    .my-autocomplete {

    li {
        line-height: normal;
        padding: 7px;

    .name {
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .addr {
        font-size: 12px;
        color: #b4b4b4;
    }

    .highlighted .addr {
        color: #ddd;
    }

    }
    }
</style>
<script>
    import {mapGetters} from "vuex";
    import {
        setBatchGroupUser,
        deleteBatchGroupUser,
        findAllGroup
    } from "@/api/admin/usergroup";

    export default {
        data() {
            return {
                dynamicTags: this.userInfo.userGroupList,
                loading: false,
                options: [],
                state: null,
                selected: false,
                userLists: [],
                inputVisible: false,
                inputValue: ""
            };
        },
        created() {
            this.init();
        },
        props: {
            mode: {},
            userIds: {},
            userInfo: {},
            userGroupList: {}
        },
        computed: {
            ...mapGetters(["permission"])
        },
        methods: {
            init() {
                this.userLists = this.userGroupList;
                this.options = this.userLists;
                if (!this.permission.user_authority) {
                    this.mode = "view";
                }
            },
            handlerBlur() {
                console.log("this.selected:", this.selected)
                if (!this.selected) {
                    this.selected = false;
                    this.inputVisible = false;
                }
            },
            handleSelect(item) {
                let _index = _.findIndex(this.dynamicTags, user => {
                    return item.id == user.id;
                });
                if (_index == -1) {
                    setBatchGroupUser(item.id, this.getUserId()).then(res => {
                        if (res.data.status == 0) {
                            this.dynamicTags.push(item);
                            this.inputVisible = false;
                            this.selected = true;
                            this.callback();
                            this.$successInfo("设置用户组成功");
                        } else {
                            this.$errorInfo(res.data.errmsg);
                        }
                    });
                } else {
                    this.$errorInfo(item.name + " 已经设置过了");
                }
            },
            handleClose(tag) {
                deleteBatchGroupUser(tag.id, this.getUserId()).then(res => {
                    if (res.data.status == 0) {
                        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
                        this.callback();
                        this.$successInfo("删除用户成功");
                    } else {
                        this.$errorInfo(res.data.errmsg);
                    }
                });
            },
            getUserId() {
                let ids = [];
                _.forEach(this.userIds, item => {
                    ids.push(item.userId);
                });
                return ids;
            },
            remoteMethod(query, cb) {
                if (query !== "") {
                    this.options = this.userLists.filter(item => {
                        return item.name.indexOf(query) > -1;
                    });
                } else {
                    this.options = this.userLists;
                }
                cb(this.options);
            },
            showInput() {
                this.inputVisible = true;
                this.selected = false;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            callback() {
                this.$emit("callback", {});
            }
        }
    };
</script>