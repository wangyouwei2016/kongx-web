<template>
  <div>
    <basic-container>
      <search-banner
        ref="routeSearch"
        placeholder="请输入Name、Upstream Name或Host"
        :handleList="handleList"
        :span="permission.service_add || isDevProfile ? 20 : 24"
        :searchProps="searchProps"
        :page="page"
        @search-change="searchChange"
      >
        <template slot="menu">
          <el-button
            v-if="permission.service_add || isDevProfile"
            icon="el-icon-plus"
            size="small"
            @click="handleGrade({})"
            type="primary"
            >新增</el-button
          >
          <el-button
            v-if="permission.service_sync"
            icon="el-icon-refresh"
            size="small"
            @click="handlerSyncBox"
            type="success"
            >同步Services</el-button
          >
        </template>
      </search-banner>
      <avue-crud
        :option="tableOption"
        :data="tableData"
        :table-loading="tableLoading"
        :page="page"
        @row-click="handleRowClick"
        @row-save="handleSave"
        @row-del="handleDel"
        @refresh-change="handlerefreshChange"
        @current-change="handleCurrentChange"
        @size-change="handleCurrentSize"
        @search-change="handleSearchChange"
      >
        <template slot="expand" slot-scope="{ row }">
          <el-form
            label-width="80px"
            label-position="top"
            style="margin-left: 10px"
          >
            <el-form-item label="代理列表">
              <targets mode="view" :upstream="{ id: row.host }"></targets>
            </el-form-item>
            <el-form-item label="路由列表">
              <query-routes :service="row" mode="view"></query-routes>
            </el-form-item>
            <el-form-item label="插件列表">
              <service-plugins :service="row"></service-plugins>
            </el-form-item>
          </el-form>
        </template>
        <template slot="name" slot-scope="{ row }">
          <el-link :underline="false" type="success" @click="toDetail(row)">{{
            row.name
          }}</el-link>
        </template>
        <template slot-scope="scope" slot="menu">
          <el-button
            v-if="permission.service_update || isDevProfile"
            icon="el-icon-edit"
            size="small"
            @click="handleGrade(scope.row, scope.$index)"
            type="text"
            >编辑</el-button
          >
          <el-button
            v-if="permission.service_delete || isDevProfile"
            icon="el-icon-delete"
            size="small"
            @click="handleDel(scope.row, scope.$index)"
            type="text"
            >删除</el-button
          >
        </template>
      </avue-crud>
      <el-drawer
        title="服务管理"
        size="50%"
        :visible.sync="grade.box"
        v-if="grade.box"
      >
        <div
          style="
            margin-left: 10px;
            overflow-y: auto;
            overflow-x: auto;
            height: 90%;
          "
        >
          <upload-service
            :service="form"
            :mode="mode"
            @callback="callback"
          ></upload-service>
        </div>
      </el-drawer>
      <el-drawer
        size="100%"
        :title="同步服务配置"
        :visible.sync="grade.syncBox"
        v-if="grade.syncBox"
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
          <sync-service></sync-service>
        </div>
      </el-drawer>
      <el-drawer
        size="100%"
        :title="'\'' + form.name + '\' 详情'"
        :visible.sync="grade.drawerDetail"
        v-if="grade.drawerDetail"
        :direction="direction"
        :before-close="handleClose"
      >
        <div
          style="
            margin-left: 10px;
            overflow-y: auto;
            overflow-x: auto;
            width: 100%;
            height: 90%;
          "
        >
          <upload-service
            :service="form"
            :mode="mode"
            @callback="callback"
          ></upload-service>
        </div>
      </el-drawer>
    </basic-container>
  </div>
</template>
<script>
import { serviceOption, serviceColumn } from "@/const/table/gatewayOption";
import { mapGetters } from "vuex";
import syncService from "./syncService";
import uploadService from "./uploadService";
import servicePlugins from "./servicePlugins";
import searchBanner from "@/components/searchBanner";
import queryRoutes from "@/views/gateway/routing/queryRoutes";
import targets from "@/views/gateway/upstream/targets";
import { findAll, serviceDel } from "@/api/gateway/service";
export default {
  name: "strategy",
  components: {
    syncService,
    searchBanner,
    uploadService,
    servicePlugins,
    queryRoutes,
    targets,
  },
  data() {
    return {
      tableSearch: {},
      tableOption: serviceOption, //表格设置属性
      serviceColumn: serviceColumn,
      searchProps: [{ name: "name" }, { name: "host" }],
      tableData: [], //表格的数据
      tablePage: 1,
      tableSize: 10,
      tableLoading: false,
      form: {},
      page: {
        total: 0, //总页数
        currentPage: 1, //当前页数
        pageSize: 10, //每页显示多少条
      },
      grade: {
        box: false,
        syncBox: false,
        drawerDetail: false,
      },
      mode: "add",
    };
  },
  computed: {
    ...mapGetters([
      "permission",
      "isDevProfile",
      "isProdProfile",
      "systemProfile",
    ]),
  },
  props: {
    type: {
      type: String,
      required: false,
    },
  },
  created() {
    if (this.systemProfile.id == -1) {
      this.$nextTick((_) => {
        this.$router.push("/wel/index");
      });
    } else {
      // this.handleList();
      this.initOptions();
    }
  },
  methods: {
    initOptions() {
      if (this.isDevProfile) {
        this.tableOption["menu"] = true;
      } else {
        if (!this.permission.service_update) {
          this.tableOption["menu"] = false;
        }
      }
    },
    toDetail(form) {
      this.form = form;
      this.grade.drawerDetail = true;
      this.mode = "view";
    },
    callback(service) {
      this.form = service;
      this.mode = "edit";
      this.reloadDataList();
    },
    handlerSyncBox() {
      this.grade.syncBox = true;
    },
    handleGrade(form, index) {
      this.grade.box = true;
      if (form && form.id) {
        this.form = form;
        this.mode = "edit";
      } else {
        this.form = {};
        this.mode = "add";
      }
    },

    /**
     * @title 页面改变值
     *
     **/
    handleCurrentChange(val) {
      this.tablePage = val;
      this.refreshTableList(true);
    },
    /**
     * @title 页面条数改变值
     *
     **/
    handleCurrentSize(val) {
      this.tableSize = val;
      this.refreshTableList(false);
    },

    /**
     * @title 获取数据
     * @detail 赋值为tableData表格即可
     *
     **/
    handleList(form) {
      this.tableLoading = true;
      return findAll(Object.assign({}, form)).then((res) => {
        let data = res.data;
        this.tableLoading = false;
        return data.data || [];
      });
    },
    refreshTableList(refresh) {
      this.initPage(refresh);
      this.$refs.routeSearch.refresh(this.page, refresh);
    },
    initPage(refresh) {
      if (!!!refresh) this.tablePage = 1;
      this.page.currentPage = this.tablePage;
      this.page.pageSize = this.tableSize;
    },
    searchChange(data) {
      this.tableData = data.data;
    },
    //再次加载
    reloadDataList() {
      this.initPage(false);
      this.$refs.routeSearch.loadData();
    },
    /**
     * @title 单点行选择行数据
     * @param row
     * @param event
     * @param column
     */
    handleRowClick(row, event, column) {
      if (this.type) {
        this.$emit("selectionData", row);
      }
    },
    /**
     * @title 数据删除
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     *
     **/
    handleDel(row, index) {
      var _message = "";
      this.isProdProfile && (_message = "当前为生产环境，请谨慎操作! ");
      this.$confirm(_message + `是否确认删除?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          serviceDel({ id: row.id }).then((res) => {
            let _data = res.data;
            if (_data.status != 0) {
              this.$errorInfo(_data.errmsg);
            } else {
              this.reloadDataList();
              this.$successInfo("删除成功");
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>
