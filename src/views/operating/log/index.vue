<template>
  <basic-container>
    <el-row style="margin-top: 0px;">
      <el-col span="10">
        <el-tag
          v-for="logTag in logTags"
          :key="logTag"
          :type="logTag.type"
          effect="dark"
          @click="changeTag(logTag)"
          style="margin-left:7px;margin-bottom:5px;cursor:pointer;"
        >{{logTag.name}}</el-tag>
        <el-popover placement="bottom-start">
          <el-date-picker
            v-model="daterange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
          <el-tag
            style="margin-left:7px;margin-bottom:5px;cursor:pointer;"
            effect="dark"
            :type="autoLogTag.type"
            slot="reference"
          >{{autoLogTag.name}}</el-tag>
        </el-popover>
      </el-col>
      <el-col span="13">
        <el-input
          prefix-icon="el-icon-search"
          v-model="searchForm"
          @input="filterServiceData"
          placeholder="请输入姓名或其它关键词"
        ></el-input>
      </el-col>
      <el-col span="1">
        <i
          class="el-icon-s-grid"
          style="margin-left: 12px;margin-top: 10px;  font-size: 25px;cursor:pointer;"
          @click="changeView()"
          v-if="!listView"
          title="视图切换"
        ></i>
        <i
          class="el-icon-s-grid"
          style="margin-left: 12px;margin-top: 10px;  font-size: 25px;cursor:pointer;color:green"
          @click="changeView()"
          title="视图切换"
          v-if="listView"
        ></i>
      </el-col>
    </el-row>
    <log ref="logViewer" :logTag="logTag" :listView="listView" :keyword="searchForm"></log>
  </basic-container>
</template>
<script>
import { findAllLogsByDay, findAllLogsByBefore } from "@/api/operating/log";
import log from "./log";
export default {
  components: { log },
  data() {
    return {
      logData: [], //表格的数据
      searchForm: null,
      daterange: null,
      logTag: { name: "今 天", value: 0, label: "today", type: "success" },
      autoLogTag: { name: "自定义", value: 0, label: "auto", type: "info" },
      logTags: [
        { name: "所 有", value: 0, label: "all", type: "info" },
        { name: "今 天", value: 0, label: "today", type: "success" },
        { name: "昨 天", value: 1, label: "yesterday", type: "info" },
        { name: "近7天", value: 0, label: "recent7", type: "info" },
        { name: "上 周", value: 0, label: "preweek", type: "info" },
        { name: "本 周", value: 0, label: "thisweek", type: "info" },
        { name: "上 月", value: 0, label: "premonth", type: "info" },
        { name: "本 月", value: 0, label: "thismonth", type: "info" }
      ],
      listView: true,
      pickerOptions: {
        onPick: daterange => {
          if (daterange.minDate && daterange.maxDate) {
            this.logTag = null;
            this.autoLogTag.type = "success";
            let _now = new Date();
            this.autoLogTag.value = this.getDaysBetween(
              daterange.maxDate,
              _now
            );
            if (this.autoLogTag.value < 0) {
              this.autoLogTag.value = this.autoLogTag.value - 1;
            }
            this.autoLogTag.begin = this.autoLogTag.value;
            this.autoLogTag.end = this.getDaysBetween(daterange.minDate, _now);
            if (this.autoLogTag.end >= 0) {
              this.autoLogTag.end =
                this.getDaysBetween(daterange.minDate, _now) + 1;
            }
            this.changeTag(this.autoLogTag);
            this.$refs.logViewer.nextOrpre(this.autoLogTag);
          }
        }
      }
    };
  },
  created() {},
  methods: {
    getDaysBetween(dateString1, dateString2) {
      var startDate = Date.parse(dateString1);
      var endDate = Date.parse(dateString2);
      var days = parseInt((endDate - startDate) / (1 * 24 * 60 * 60 * 1000));
      return days;
    },
    changeView() {
      this.listView = !this.listView;
    },
    changeTag(tag) {
      this.logTag = tag;
      tag.label !== "auto" && (this.autoLogTag.type = "info");
      this.logTags.forEach(item => {
        if (item.label == tag.label) {
          item.type = "success";
        } else {
          item.type = "info";
        }
      });
    }
  }
};
</script>