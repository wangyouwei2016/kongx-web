<template>
  <div>
    <el-tabs ref="upstreamTabs" :tab-position="tabPosition">
      <el-tab-pane label="基本信息" ref="targetTab">
        <span slot="label">
          <i class="el-icon-info"></i> 基本信息
        </span>
        <avue-form :option="routeColumn" ref="routeForm" v-model="targetForm" @submit="handleRoute">
          <template slot="hosts">
            <item-tags
              :tags="targetForm.hosts"
              @sendTag="bindTags"
              name="主机"
              column="hosts"
              :mode="mode"
            ></item-tags>
          </template>
          <template slot="paths">
            <item-tags
              :tags="targetForm.paths"
              @sendTag="bindTags"
              name="匹配路由"
              column="paths"
              :mode="mode"
            ></item-tags>
          </template>
          <template slot="methods">
            <item-tags
              :tags="targetForm.methods"
              @sendTag="bindTags"
              name="请求方法"
              column="methods"
              :mode="mode"
            ></item-tags>
          </template>
          <template slot="menuForm" v-if="mode!='view'">
            <el-button type="primary" class="el-icon-check" @click="handlerSubmit">提 交</el-button>
            <el-button @click="handleEmpty" class="el-icon-delete">清 空</el-button>
          </template>
        </avue-form>
      </el-tab-pane>
      <el-tab-pane label=" 路由插件" ref="targetTab" v-if="mode!='add'">
        <span slot="label">
          <i class="el-icon-success"></i>
          路由插件
        </span>
        <query-plugins :route="route" :mode="mode"></query-plugins>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { routeColumn } from "@/const/table/gatewayOption";
import { routeSave, routeUpdate } from "@/api/gateway/route";
import ItemTags from "@/components/ItemTags";
import listPlugin from "@/views/gateway/plugin/listPlugin";
import queryPlugins from "@/views/gateway/plugin/queryPlugins";
export default {
  name: "Route",
  components: {
    ItemTags,
    listPlugin,
    queryPlugins,
  },
  data() {
    return {
      routeColumn: routeColumn,
      tabPosition: "top",
      targetForm: { paths: [], hosts: [], methods: [] },
      routeData: [],
    };
  },
  props: {
    route: { type: Object, required: false },
    mode: {
      required: false,
    },
  },
  created() {
    this.initOptions();
    this.targetForm = _.cloneDeep(this.route);
    delete this.targetForm["serviceName"];
  },
  methods: {
    initOptions() {
      this.routeColumn.column.forEach((column) => {
        column["disabled"] = this.mode == "view";
      });
    },
    bindTags(data) {
      this.targetForm = Object.assign(this.targetForm, data);
    },
    handlerSubmit() {
      this.$refs.routeForm.submit();
    },
    handleRoute(row, done) {
      if (this.mode == "edit") {
        this.handleRouteUpdate(row, done);
      }
      if (this.mode == "add") {
        this.handleRouteSave(row, done);
      }
    },
    handleRouteUpdate(row, done) {
      this.targetForm = Object.assign(this.targetForm, row);
      routeUpdate(row)
        .then((res) => {
          let _data = res.data;
          if (_data.status != 0) {
            this.$errorInfo(_data.errmsg);
          } else {
            this.targetData = res.data.data;
            this.$successInfo("修改成功");
            this.callback();
          }
          done();
        })
        .catch((error) => {
          this.$errorInfo("更新失败");
          done();
        });
    },

    handleRouteSave(row, done) {
      this.targetForm = Object.assign(this.targetForm, row);
      routeSave(row)
        .then((res) => {
          let _data = res.data;
          if (_data.status != 0) {
            this.$errorInfo(_data.errmsg);
          } else {
            this.targetData = res.data.data;
            this.$successInfo("新增成功");
            this.callback();
          }
          done();
        })
        .catch((error) => {
          // this.$errorInfo(error);
          this.$errorInfo("新增失败,错误信息：", error);
          done();
        });
    },
    callback() {
      this.$emit("callback", {});
    },
  },
};
</script>
