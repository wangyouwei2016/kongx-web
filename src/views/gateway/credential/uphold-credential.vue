<template>
    <div>
        <el-divider></el-divider>
        <avue-form
                :option="consumersColumn"
                v-model="upholdEntity"
                ref="form"
                @submit="handleEntity"
        >
            <template slot="redirect_uris">
                <item-tags
                        :tags="upholdEntity.redirect_uris"
                        @sendTag="bindTags"
                        name="redirect_uris"
                        column="redirect_uris"
                        :mode="mode"
                ></item-tags>
            </template>
            <template slot="menuForm" v-if="mode != 'view'">
                <el-button type="primary" class="el-icon-check" @click="handlerSubmit"
                >提 交
                </el-button
                >
            </template>
        </avue-form>
    </div>
</template>
<script>
    import {mapGetters} from "vuex";
    import {get_columns} from "@/const/table/gatewayColumnOption";
    import {DIC} from "@/const/dic";
    import {entitySave, entityUpdate} from "@/api/gateway/credentials";
    import ItemTags from "@/components/ItemTags";

    export default {
        name: "credential_uphold",
        components: {ItemTags},
        data() {
            return {
                consumersColumn: [],
                upholdEntity: this.entity,
                entityName: this.params.entityName,
            };
        },
        computed: {
            ...mapGetters(["permission", "systemProfile", "kongClient"]),
        },
        props: {
            entity: {type: Object, required: false},
            params: {type: Object, required: false},
            mode: {
                required: false,
            },
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.consumersColumn = get_columns(
                    this.kongClient.version,
                    this.entityName
                );
                this.initOptions();
            },
            bindTags(data) {
                this.upholdEntity = Object.assign(this.upholdEntity, data);
            },
            initOptions() {
                this.consumersColumn.column.forEach((column) => {
                    column["disabled"] = this.mode == "view";
                });
            },
            handlerSubmit() {
                this.$refs.form.submit();
            },
            handleEntity(row, done) {
                if (this.mode == "edit") {
                    this.handleEntityUpdate(row, done);
                }
                if (this.mode == "add") {
                    this.handleEntitySave(row, done);
                }
            },

            handleEntitySave(row, done) {
                var _config = {};
                for (var p in this.upholdEntity) {
                    let _value = this.upholdEntity[p];
                    if (p.indexOf("$") == -1) {
                        _config[p] = _value;
                    }
                }
                this.upholdEntity = _config;
                entitySave(
                    this.upholdEntity,
                    this.params.customer,
                    this.params.entityName
                )
                    .then((res) => {
                        let _data = res.data;
                        if (_data.status != 0) {
                            this.$message.error(_data.errmsg);
                        } else {
                            this.$message.success("新增成功");
                            this.callback();
                        }
                        done();
                    })
                    .catch((error) => {
                        this.$message.error("新增失败,错误信息：" + error);
                        done();
                    });
            },
            callback() {
                this.$emit("callback", {});
            },
        },
    };
</script>
