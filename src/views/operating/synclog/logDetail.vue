<template>
  <div>
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in logData"
        :key="index"
        :size="index==0?'large':'normal'"
        :color="activity.status=='success'?'#0bbd87':'red'"
        :timestamp="activity.create_at|parseTime"
      >{{index+1}}. {{activity.comment}}</el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
import { findEachSyncLog } from "@/api/operating/syncConfig";
export default {
  data() {
    return {
      logData: [] //表格的数据
    };
  },
  props: {
    syncConfig: { type: Object, required: true },
    service: { type: Object, required: true },
    client: { type: Object, required: true }
  },
  created() {
    this.findSyncLog();
  },
  methods: {
    findSyncLog() {
      findEachSyncLog({
        syncNo: this.syncConfig.syncNo,
        service: this.service.name,
        dest_client: this.client.url
      }).then(res => {
        this.logData = res.data.data;
      });
    }
  }
};
</script>