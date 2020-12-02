<template>
  <div style="margin-left: 15px">
    <div slot="header" class="clearfix">
      <span>
        <strong>{{ dateStr }}</strong>
      </span>
      <el-button
        style="float: right; padding: 6px 10px"
        type="text"
        v-if="nextLogTag"
        @click="nextOrpre(nextLogTag)"
        >下一天</el-button
      >
      <el-button
        style="float: right; padding: 6px 10px"
        type="primary"
        v-if="preLogTag"
        @click="nextOrpre(preLogTag)"
        >上一天</el-button
      >
      <el-button
        style="float: right; padding: 6px 10px"
        type="text"
        v-if="nextLogTag || preLogTag"
        @click="reset(nextLogTag || preLogTag)"
        >返回</el-button
      >
    </div>
    <el-divider></el-divider>
    <el-timeline v-if="!listView">
      <el-timeline-item
        v-for="(activity, index) in logData"
        placement="top"
        :key="index"
        :size="index == 0 ? 'large' : 'normal'"
        :color="activity.status == 'success' ? '#0bbd87' : '#0bbd87'"
      >
        <el-card shadow="hover" style="cursor: pointer">
          <el-popover
            placement="top-start"
            title="日志内容"
            width="600"
            trigger="click"
            effect="dark"
          >
            <div style="overflow-y: auto; height: 90%">
              <json-viewer
                :value="JSON.parse(activity.content)"
                :expand-depth="5"
                copyable
                sort
              ></json-viewer>
            </div>
            <div slot="reference">
              {{ activity.create_at | parseTime("{h}:{i}:{s}") }}-
              {{ activity.remark }}
            </div>
          </el-popover>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <avue-crud
      v-if="listView"
      :option="operationLogOption"
      :data="logData"
      :table-loading="tableLoading"
      v-model="objData"
      :page="page"
      @current-change="handleCurrentChange"
      @row-click="handleRowClick"
      @size-change="handleCurrentSize"
      @search-change="handleSearchChange"
      style="cursor: pointer"
      ><template slot-scope="{ row }" slot="create_at">
        {{ new Date(row.create_at) | dateFormat }}
      </template></avue-crud
    >
    <el-drawer
      size="35%"
      title="操作对象内容"
      :visible.sync="drawerDetail"
      v-if="drawerDetail"
      :direction="direction"
      :before-close="handleClose"
    >
      <div
        style="
          margin-left: 10px;
          overflow-y: auto;
          overflow-x: auto;
          height: 90%;
        "
      >
        <json-viewer
          :value="JSON.parse(currentLog.content)"
          :expand-depth="1"
          copyable
          sort
        ></json-viewer>
      </div>
    </el-drawer>
  </div>
</template>
<style>
.el-card__header {
  padding: 5px 5px;
}
.el-timeline-item__timestamp.is-top {
  margin-bottom: 4px;
  padding-top: 4px;
}
.el-timeline-item {
  position: relative;
  padding-bottom: 0px;
}
.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 8px 0;
}
</style>
<script>
import { operationLogOption } from "@/const/table/operatingOption";
import { findAllLogsByDay, findAllLogsByBefore } from "@/api/operating/log";
export default {
  data() {
    return {
      operationLogOption: operationLogOption,
      dateStr: "",
      preLogTag: null,
      nextLogTag: null,
      logData: [], //表格的数据,
      currentLog: { content: "{}" },
      drawerDetail: false,
      currentLogTag: null,
    };
  },
  props: {
    logTag: { type: Object, required: true },
    keyword: { required: true },
    listView: { required: true },
  },
  created() {
    this.findSyncLog();
  },
  watch: {
    logTag(val) {
      this.findSyncLog();
    },
    keyword(val) {
      this.findSyncLog();
    },
  },
  methods: {
    handleRowClick(row) {
      this.currentLog = row;
      this.drawerDetail = true;
    },
    findSyncLog() {
      this.nextOrpre(this.logTag);
    },
    reset(tag) {
      tag.value = tag.begin;
      this.nextOrpre(tag);
    },
    nextOrpre(tag) {
      tag["keyword"] = this.keyword;
      findAllLogsByDay(tag).then((res) => {
        let _data = res.data.data;
        this.dateStr = _data.dateStr;
        this.preLogTag = _data.logTags.pre;
        this.nextLogTag = _data.logTags.next;
        this.logData = _data.logs;
        this.currentLogTag = _data.logParams;
      });
    },
  },
};
</script>