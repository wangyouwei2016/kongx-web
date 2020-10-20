<template>
  <div>
    <el-steps :active="step" finish-status="success" simple style="margin-top: 20px">
      <el-step title="选择同步的服务"></el-step>
      <el-step title="选择同步的环境"></el-step>
      <el-step title="确认后，开始同步"></el-step>
    </el-steps>
    <div v-show="step==0">
      <el-row style="margin-top: 12px;">
        <el-col span="22">
          <el-input
            prefix-icon="el-icon-search"
            v-model="searchForm"
            @input="filterServiceData"
            placeholder="请输入服务名称或Host"
          ></el-input>
        </el-col>
        <el-col span="2">
          <el-button style="margin-left: 12px;" @click="next(1)" type="primary" size="mini">下一步</el-button>
        </el-col>
      </el-row>
      <avue-crud
        :option="serviceOption"
        :data="serviceData"
        :table-loading="tableLoading"
        ref="serviceCrud"
        @row-click="handleServiceRowClick"
        @selection-change="selectionChange"
        @search-change="handleServiceSearchChange"
        key="service"
      ></avue-crud>
    </div>
    <!--第二步设置的内容 -->
    <div v-show="step==1">
      <el-row style="margin-top: 12px;">
        <el-col span="22">
          <el-button style="margin-left: 12px;" @click="previous(0)" type="primary" size="mini">上一步</el-button>
        </el-col>
        <el-col span="2">
          <el-button style="margin-left: 12px;" @click="next(2)" type="primary" size="mini">下一步</el-button>
        </el-col>
      </el-row>
      <avue-crud
        :option="clientsOption"
        :data="clientData"
        :table-loading="tableLoading"
        ref="clientCrud"
        @selection-change="selectionClientChange"
        @row-click="handleClientRowClick"
        key="client"
      ></avue-crud>
    </div>
    <!--第三步设置的内容 -->
    <div v-show="step==2">
      <el-row style="margin-top: 12px;">
        <el-col span="22">
          <el-button style="margin-left: 12px;" @click="previous(1)" type="primary" size="mini">上一步</el-button>
        </el-col>
        <el-col span="2"></el-col>
      </el-row>

      <el-row style="margin-top: 12px;">
        <el-card>
          <div slot="header" class="clearfix">
            <span>
              <i class="el-icon-info"></i>
              <strong>同步信息(请确认后，点击'开始同步')</strong>
              <el-button
                style="margin-left: 12px;margin-bottom:12px;"
                @click="next(3)"
                type="primary"
                size="mini"
                v-show="syncForm.status=='ready'"
              >开始同步</el-button>
              <el-button
                style="margin-left: 12px;margin-bottom:12px;"
                @click="emitSyncDiff"
                type="success"
                size="mini"
              >同步差异比对</el-button>
              <el-button
                style="margin-left: 12px;margin-bottom:12px;"
                disabled
                type="info"
                size="mini"
                v-show="syncForm.status=='running'"
              >同步进行中...</el-button>
              <el-button
                style="margin-left: 12px;margin-bottom:12px;"
                disabled
                type="success"
                size="mini"
                v-show="syncForm.status=='success'"
              >同步成功</el-button>
              <el-button
                style="margin-left: 12px;margin-bottom:12px;"
                disabled
                type="danger"
                size="mini"
                v-show="syncForm.status=='failure'"
              >同步失败</el-button>
            </span>
          </div>
          <div>
            同步的目标环境：
            <el-tag
              v-for="tag in syncForm.clients"
              :key="tag"
              :disable-transitions="false"
              closable
              @close="handleClientRowClick(tag)"
            >{{tag.url}}</el-tag>
          </div>
          <div style="margin-top: 12px;">
            同步的服务列表：
            <el-tag
              v-for="tag in syncForm.services"
              :key="tag"
              :disable-transitions="false"
              closable
              @close="handleServiceRowClick(tag)"
            >{{tag.name}}</el-tag>
          </div>
          <div>
            数据类型：
            <el-radio-group v-model="syncForm.dataType">
              <el-radio label="services">同步服务</el-radio>
              <el-radio label="routes">同步路由</el-radio>
              <el-radio label="plugins">同步插件</el-radio>
              <!-- <el-radio label="plugins">同步插件(包含全局插件)</el-radio> -->
              <el-radio label="upstreams">同步上游代理</el-radio>
            </el-radio-group>
          </div>
          <div>
            同步策略：
            <el-radio-group v-model="syncForm.policy">
              <el-radio label="create_update">更新同步(存在就更新，不存在就新增)</el-radio>
              <el-radio label="over_ridden" disabled>覆盖同步</el-radio>
            </el-radio-group>
          </div>
        </el-card>
      </el-row>
      <el-row style="margin-top: 12px;" v-if="showDiff">
        <el-card>
          <div slot="header" class="clearfix">
            <span>
              <strong>同步差异比对</strong>
            </span>
          </div>
          <div>
            <sync-diff :syncConfig="syncForm"></sync-diff>
          </div>
        </el-card>
      </el-row>
      <el-row style="margin-top: 12px;">
        <el-card>
          <div slot="header" class="clearfix">
            <span>
              <strong>同步日志</strong>
            </span>
          </div>
          <div style="margin-top: 12px;">
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
        </el-card>
      </el-row>
    </div>
  </div>
</template>
<style>
.avue-crud__menu {
  min-height: 0;
}
</style>
<script>
import { findAll, syncConfig } from "@/api/gateway/service";
import { findAllClient } from "@/api/operating/systemProfile";
import { syncLogGroupOption } from "@/const/table/operatingOption";
import { findAllSyncLog, findSyncConfig } from "@/api/operating/syncConfig";
import syncDiff from "./syncDiff";
import { mapGetters } from "vuex";
export default {
  name: "syncService",
  components: { syncDiff },
  data() {
    return {
      serviceOption: {
        maxHeight: 600,
        index: true,
        selection: true,
        simplePage: true,
        border: true,
        menu: false,
        labelWidth: 120,
        searchBtn: false,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        columnBtn: false,
        rowKey: "id",
        refreshBtn: false,
        reserveSelection: true,
        selectable: (row, index) => {
          return true;
        },
        stripe: true,
        menuAlign: "center",
        align: "center",
        searchSize: "mini",
        column: [
          {
            label: "服务名称",
            prop: "name",
            searchSpan: 18,
            search: false,
            searchFilterable: true,
            searchMmultiple: true,
            searchFilterMethod: function (value, row, column) {
              console.log(value, ",", row, ",", column);
            },
          },
          {
            label: "HOST OR UPSTREAM",
            prop: "host",
          },
          {
            label: "创建日期",
            prop: "created_at",
            sortable: true,
            type: "datetime",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            formatter: (row, value, label, column) => {
              return value * 1000;
            },
          },
        ],
      },
      clientsOption: {
        maxHeight: 600,
        index: true,
        simplePage: true,
        selection: true,
        border: true,
        menu: false,
        labelWidth: 120,
        searchBtn: false,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        columnBtn: false,
        rowKey: "id",
        refreshBtn: false,
        reserveSelection: true,
        selectable: (row, index) => {
          return true;
        },
        stripe: true,
        menuAlign: "center",
        align: "center",
        searchSize: "mini",
        column: [
          {
            label: "服务名称",
            prop: "name",
            width: 120,
          },
          {
            label: "URL",
            prop: "url",
          },
          {
            label: "环境",
            prop: "profile",
            width: 120,
          },
          {
            label: "创建日期",
            prop: "create_at",
            sortable: true,
            type: "datetime",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
          },
        ],
      },
      syncLogGroupOption: syncLogGroupOption,
      serviceData: [],
      serviceItems: [],
      clientData: [],
      searchForm: "",
      syncForm: {
        services: [],
        clients: [],
        status: "ready",
        dataType: "services",
        policy: "create_update",
      },
      logData: [],
      step: 0,
      syncConfigTimer: null,
      showDiff: false,
      try_times: -1,
    };
  },
  computed: {
    ...mapGetters(["permission", "isProdProfile", "systemProfile"]),
  },
  created() {
    this.handleServiceSearchChange();
  },
  methods: {
    emitSyncDiff() {
      this.showDiff = !this.showDiff;
    },
    filterServiceData(val) {
      let _val = val.trim();
      if (_val == "") {
        this.serviceData = this.serviceItems;
        return;
      }
      this.serviceData = this.serviceItems.filter(
        (item) => item.name.includes(_val) || item.host.includes(_val)
      );
    },
    handleServiceSearchChange() {
      this.tableLoading = true;
      findAll(Object.assign({})).then((res) => {
        let data = res.data;
        this.serviceItems = data.data;
        this.serviceData = this.serviceItems;
        this.tableLoading = false;
      });
    },
    selectionChange(list) {
      this.syncForm.services = list;
    },
    selectionClientChange(list) {
      this.syncForm.clients = list;
    },
    handleServiceRowClick(row) {
      this.$refs.serviceCrud.toggleSelection([row]);
    },
    handleClientRowClick(row) {
      this.$refs.clientCrud.toggleSelection([row]);
    },
    next(step) {
      switch (step) {
        case 0:
          break;
        case 1:
          if (this.syncForm.services && this.syncForm.services.length == 0) {
            this.$errorInfo("请先选择需要同步的服务");
            return;
          }
          findAllClient().then((res) => {
            var results = res.data.data;
            for (var i = 0; i < results.length; i++) {
              if (results[i] && "prod" !== results[i].profile) {
                this.clientData.push(results[i]);
              }
            }
          });
          break;
        case 2:
          if (this.syncForm.clients && this.syncForm.clients.length == 0) {
            this.$errorInfo("请先选择需要同步的环境");
            return;
          }
          break;
        case 3:
          if (this.syncForm.services && this.syncForm.services.length == 0) {
            this.$errorInfo("请先选择需要同步的服务");
            return;
          }
          if (this.syncForm.clients && this.syncForm.clients.length == 0) {
            this.$errorInfo("请先选择需要同步的环境");
            return;
          }
          this.syncForm.status = "running";
          syncConfig(this.syncForm)
            .then((res) => {
              this.syncForm = res.data.data;
              return this.syncForm["syncNo"];
            })
            .then((syncNo) => {
              this.syncConfigTimer = setInterval(() => {
                this.findSyncConfig();
              }, 1000);
              // 在beforeDestroy钩子触发时清除定时器
              this.$once("hook:beforeDestroy", () => {
                clearInterval(this.syncConfigTimer);
              });
            });
          return;
      }
      this.step = step;
    },
    findSyncConfig() {
      if (this.syncForm.status == "running") {
        this.doquery();
      } else {
        this.try_times = this.try_times + 1;
        if (this.try_times == 3) {
          clearInterval(this.syncConfigTimer);
        } else {
          this.doquery();
        }
      }
    },
    doquery() {
      findSyncConfig(this.syncForm["syncNo"])
        .then((res) => {
          this.syncForm = res.data.data;
          return this.syncForm["syncNo"];
        })
        .then((syncNo) => {
          findAllSyncLog(syncNo).then((res) => {
            this.logData = res.data.data;
          });
        });
    },
    previous(step) {
      this.step = step;
    },
  },
};
</script>