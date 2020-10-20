<template>
  <div>
    <el-tabs tab-position="top">
      <el-tab-pane v-for="client in syncConfig.clients" :key="client" :label="client.profile">
        <el-row style="margin-top: 12px;" :gutter="5">
          <el-tabs tab-position="left">
            <el-tab-pane
              v-for="service in syncConfig.services"
              :key="service.id"
              :label="service.name"
            >
              <el-col span="12">
                <div class="grid-content bg-purple">
                  <span style="margin-left:10px;">
                    <strong>待同步的服务信息</strong>
                  </span>
                  <targets mode="view" :upstream="{id:service.host}"></targets>
                  <div style="margin-top:5px;">
                    <query-routes :service="service" mode="view"></query-routes>
                  </div>
                  <div style="margin-top:5px;">
                    <service-plugins :service="service"></service-plugins>
                  </div>
                </div>
              </el-col>
              <el-col span="12">
                <div class="grid-content bg-purple-exists">
                  <span style="margin-left:10px;">
                    <strong>已存在的服务信息</strong>
                  </span>
                  <targets mode="view" :upstream="{id:service.host}" :client="client"></targets>
                  <div style="margin-top:5px;overflow-y:auto; overflow-x:auto;  height:100%;">
                    <query-routes :service="service" mode="view" :client="client"></query-routes>
                  </div>
                  <div style="margin-top:5px;">
                    <service-plugins :service="service" :client="client" :key="client.url"></service-plugins>
                  </div>
                </div>
              </el-col>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style>
.el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 2px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}

.bg-purple-exists {
  background: rgba(35, 108, 167, 0.733);
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.basic-container {
  padding-left: 4px;
  padding-right: 4px;
}
</style>

<script>
import servicePlugins from "./servicePlugins";
import targets from "@/views/gateway/upstream/targets";
import queryRoutes from "@/views/gateway/routing/queryRoutes";
export default {
  components: {
    servicePlugins,
    queryRoutes,
    targets
  },
  data() {
    return {
      diffColumn: {
        emptyBtn: false,
        submitBtn: false,
        column: [
          {
            label: "SERVICES",
            prop: "services",
            formslot: true
          },
          {
            label: "CLIENTS",
            prop: "clients",
            formslot: true
          }
        ]
      }
    };
  },
  created() {
    console.log(this.syncConfig);
  },
  props: {
    syncConfig: { type: Object, required: true }
  }
};
</script>