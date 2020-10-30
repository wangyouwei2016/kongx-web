<template>
  <el-tabs ref="upstreamTabs">
    <el-tab-pane>
      <span slot="label"> <i class="icon-services-sm"></i> 基本信息 </span>
      <avue-form
        :option="serviceColumn"
        v-model="service"
        ref="form"
        @submit="handleSave"
      >
        <template slot="tags">
          <item-tags
            :tags="service.tags"
            @sendTag="bindTags"
            name="tags"
            column="tags"
            :mode="mode"
          ></item-tags>
        </template>
        <template slot="client_certificate">
          <select-entity
            @bind="bindTags"
            :value="service.client_certificate"
            column="client_certificate"
            :dic="certificates"
            :props="{ label: 'id', value: 'id' }"
          >
          </select-entity>
        </template>
        <template slot="menuForm" v-if="mode != 'view'">
          <el-button type="primary" class="el-icon-check" @click="handlerSubmit"
            >提 交</el-button
          >
          <el-button @click="handleEmpty" class="el-icon-delete"
            >清 空</el-button
          >
        </template>
      </avue-form>

      <el-row v-if="mode != 'add'">
        <el-col :span="12">
          <basic-container>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>
                  <h3>
                    <strong>路由列表</strong>
                  </h3>
                </span>
              </div>
              <query-routes :service="service" mode="view"></query-routes>
            </el-card>
          </basic-container>
        </el-col>
        <el-col :span="12">
          <basic-container>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>
                  <h3>
                    <strong>插件列表</strong>
                  </h3>
                </span>
              </div>
              <service-plugins :service="service"></service-plugins>
            </el-card>
          </basic-container>
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="服务路由" ref="targetTab" v-if="mode != 'add'" lazy>
      <span slot="label"> <i class="icon-route-sm"></i> 服务路由 </span>
      <!-- <service-route :service="service" ref="targets" edit="add"></service-route> -->
      <query-routes :service="service" :mode="mode"></query-routes>
    </el-tab-pane>
    <el-tab-pane label="服务插件" ref="pluginTab" v-if="mode != 'add'" lazy>
      <span slot="label"> <i class="icon-plugin-sm"></i> 服务插件 </span>
      <query-plugins :service="service" :mode="mode"></query-plugins>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { mapGetters } from "vuex";
import { serviceUpdate, serviceSave } from "@/api/gateway/service";
import { findAllEntities } from "@/api/gateway/certificates";
import { get_columns } from "@/const/table/gatewayColumnOption";
import queryPlugins from "@/views/gateway/plugin/queryPlugins";
import queryRoutes from "@/views/gateway/routing/queryRoutes";
import targets from "@/views/gateway/upstream/targets";
import ItemTags from "@/components/ItemTags";
import SelectEntity from "@/components/SelectEntity";
import { DIC } from "@/const/dic.js";
import servicePlugins from "./servicePlugins";
export default {
  components: {
    queryPlugins,
    queryRoutes,
    servicePlugins,
    targets,
    ItemTags,
    SelectEntity,
  },
  name: "upholdService",
  data() {
    return {
      name: DIC.SERVICES,
      serviceColumn: [],
      certificates: [],
    };
  },
  computed: {
    ...mapGetters(["permission", "systemProfile", "kongClient"]),
  },
  props: {
    service: {
      type: Object,
      required: false,
    },
    mode: { required: false },
  },
  created() {
    let version = this.kongClient.version;
    this.serviceColumn = get_columns(version, this.name);
    this.initOptions();
    findAllEntities().then((res) => {
      this.certificates = res.data.data;
    });
  },
  methods: {
    initOptions() {
      this.serviceColumn.column.forEach((column) => {
        column["disabled"] = this.mode == "view";
      });
      this.mode == "view" &&
        (this.serviceColumn.group[0]["collapse"] = this.mode == "view");
    },
    handlerSubmit() {
      this.$refs.form.submit();
    },
    bindTags(data) {
      this.service = Object.assign(this.service, data);
    },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/

    handleSave(row, done) {
      this.mode == "add" &&
        serviceSave(row).then((res) => {
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
        serviceUpdate(row).then((res) => {
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
    },
  },
};
</script>