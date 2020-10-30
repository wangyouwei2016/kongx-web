<template>
  <div>
    <el-tabs @tab-click="checkUpstream" ref="upstreamTabs">
      <el-tab-pane>
        <span slot="label"> <i class="el-icon-info"></i> 基本信息</span>
        <avue-form
          :option="consumersColumn"
          v-model="upholdEntity"
          ref="form"
          @submit="handleEntity"
        >
          <template slot="tags">
            <item-tags
              :tags="upholdEntity.tags"
              @sendTag="bindTags"
              name="tags"
              column="tags"
              :mode="mode"
            ></item-tags>
          </template>
          <template slot="menuForm" v-if="mode != 'view'">
            <el-button
              type="primary"
              class="el-icon-check"
              @click="handlerSubmit"
              >提 交</el-button
            >
          </template>
        </avue-form>
      </el-tab-pane>
      <el-tab-pane v-if="mode != 'add'" lazy>
        <span slot="label"> <i class="el-icon-info"></i> Credentials</span>
        <credentials :consumer="upholdEntity.id"></credentials>
      </el-tab-pane>
      <el-tab-pane label="服务插件" ref="pluginTab" v-if="mode != 'add'" lazy>
        <span slot="label"> <i class="icon-plugin-sm"></i> 插件列表 </span>
        <query-plugins :consumer="upholdEntity" :mode="mode"></query-plugins>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { get_columns } from "@/const/table/gatewayColumnOption";
import { DIC } from "@/const/dic";
import { consumerSave, consumerUpdate } from "@/api/gateway/consumer";
import ItemTags from "@/components/ItemTags";
import queryPlugins from "@/views/gateway/plugin/queryPlugins";
import credentials from "../credential/credentials";
export default {
  name: DIC.CONSUMERS + "_uphold",
  components: { ItemTags, credentials, queryPlugins },
  data() {
    return {
      consumersColumn: [],
      upholdEntity: this.entity,
      entityName: DIC.CONSUMERS,
    };
  },
  computed: {
    ...mapGetters(["permission", "systemProfile", "kongClient"]),
  },
  props: {
    entity: { type: Object, required: false },
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
    handleEntityUpdate(row, done) {
      consumerUpdate(this.upholdEntity)
        .then((res) => {
          let _data = res.data;
          if (_data.status != 0) {
            this.$message.error(_data.errmsg);
          } else {
            this.$message.success("修改成功");
            this.callback();
          }
          done();
        })
        .catch((error) => {
          this.$message.error("更新失败");
          done();
        });
    },

    handleEntitySave(row, done) {
      consumerSave(this.upholdEntity)
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
