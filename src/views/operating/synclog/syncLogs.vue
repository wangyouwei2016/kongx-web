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
              <el-col>
                <div class="grid-content bg-purple">
                  <span style="margin-left:10px;">
                    <strong>日志列表</strong>
                  </span>
                  <div style=" overflow-y:auto;  height:100%;">
                    <log-detail :syncConfig="syncConfig" :service="service" :client="client"></log-detail>
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
<script>
import logDetail from "./logDetail";
export default {
  components: { logDetail },
  data() {
    return {
      logData: [] //表格的数据
    };
  },
  props: { syncConfig: { type: Object, required: true } },
  methods: {}
};
</script>