<template>
  <el-tabs ref="upstreamTabs">
    <el-tab-pane>
      <span slot="label">
        <i class="el-icon-info"></i> 基本信息
      </span>
      <avue-form :option="serviceColumn" v-model="service" ref="form" @submit="handleSave">
        <template slot="menuForm" v-if="mode!='view'">
          <el-button type="primary" class="el-icon-check" @click="handlerSubmit">提 交</el-button>
          <el-button @click="handleEmpty" class="el-icon-delete">清 空</el-button>
        </template>
      </avue-form>
      <el-form label-width="80px" label-position="left" style="margin-left:10px;">
        <el-form-item label="代理列表">
          <targets mode="view" :upstream="{id:service.host}"></targets>
        </el-form-item>
        <el-form-item label="路由列表" v-if="mode=='view'">
          <query-routes :service="service" mode="view"></query-routes>
        </el-form-item>
        <el-form-item label="插件列表" v-if="mode=='view'">
          <service-plugins :service="service"></service-plugins>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="服务路由" ref="targetTab" v-if="mode!='add'">
      <span slot="label">
        <i class="el-icon-success"></i> 服务路由
      </span>
      <!-- <service-route :service="service" ref="targets" edit="add"></service-route> -->
      <query-routes :service="service" :mode="mode"></query-routes>
    </el-tab-pane>
    <el-tab-pane label="服务插件" ref="pluginTab" v-if="mode!='add'">
      <span slot="label">
        <i class="el-icon-warning"></i> 服务插件(应用于服务)
      </span>
      <query-plugins :service="service" :mode="mode"></query-plugins>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { serviceUpdate, serviceSave } from "@/api/gateway/service";
import { serviceColumn } from "@/const/table/gatewayOption";
import queryPlugins from "@/views/gateway/plugin/queryPlugins";
import queryRoutes from "@/views/gateway/routing/queryRoutes";
import targets from "@/views/gateway/upstream/targets";
import servicePlugins from "./servicePlugins";
export default {
  components: {
    queryPlugins,
    queryRoutes,
    servicePlugins,
    targets
  },
  name: "upholdService",
  data() {
    return {
      serviceColumn: serviceColumn
    };
  },
  props: {
    service: {
      type: Object,
      required: false
    },
    mode: { required: false }
  },
  created() {
    this.initOptions();
  },
  methods: {
    initOptions() {
      this.serviceColumn.column.forEach(column => {
        column["disabled"] = this.mode == "view";
      });
    },
    handlerSubmit() {
      this.$refs.form.submit();
    },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/

    handleSave(row, done) {
      this.mode == "add" &&
        serviceSave(row).then(res => {
          let _data = res.data;
          if (_data.status != 0) {
            this.$errorInfo(_data.errmsg);
          } else {
            this.service = _data.data;
            this.$successInfo("新增成功");
            this.callback();
          }
          done();
        });

      this.mode == "edit" &&
        serviceUpdate(row).then(res => {
          let _data = res.data;
          if (_data.status != 0) {
            this.$errorInfo(_data.errmsg);
          } else {
            this.service = _data.data;
            this.$successInfo("修改成功");
            this.callback();
          }
          done();
        });
    },
    callback() {
      this.$emit("callback", this.service);
    }
  }
};
</script>