<template>
  <basic-container>
    <!-- <el-tabs>
      <el-tab-pane :index="logType.label" v-for="logType in logs" :key="logType">
        <span slot="label">
          <i class="el-icon-date"></i>
          {{logType.label}}
        </span>
       
      </el-tab-pane>
    </el-tabs> -->
     <list-configs :logType="0"></list-configs>
  </basic-container>
</template>
<style>
.el-timeline {
  padding-left: 10px;
}
</style>
<script>
import listConfigs from "./listConfigs";
export default {
  name: "syncLog",
  components: { listConfigs },
  data() {
    return {
      objData: {},
      logs: [
        { label: "网关同步日志", value: 0 },
        { label: "热配同步日志", value: 1 }
      ]
    };
  },
  created() {},
  methods: {}
};
</script>
