<template>
  <div>
    <basic-container v-if="pathKey != entityName">
      <div>
        <inner-breadcrumb
          v-model="pathKey"
          showBack="true"
          :path="path"
          :labelArgs="labelArgs"
        ></inner-breadcrumb>
      </div>
    </basic-container>
    <basic-container>
      <div v-if="pathKey == entityName">
        <search-banner
          ref="routeSearch"
          :span="permission.plugin_add || isDevProfile ? 21 : 24"
          placeholder="请输入插件名称、服务名称或路由名称"
          :handleList="handleList"
          :searchProps="searchProps"
          :page="page"
          @search-change="searchChange"
        >
          <template slot="menu">
            <el-button
              v-if="permission.plugin_add || isDevProfile"
              icon="el-icon-plus"
              size="small"
              @click="handleGrade({})"
              type="primary"
              >新增全局插件</el-button
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
          @current-change="handleCurrentChange"
          @size-change="handleCurrentSize"
        >
          <template slot-scope="{ row }" slot="created_at">
            {{ new Date(row.created_at * 1000) | dateFormat }}
          </template>
          <template slot="empty">
            <div class="avue-empty__image" style="height: 50px">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"
                alt=""
              />
            </div>
            <h3>
              <el-button
                icon="el-icon-plus"
                type="text"
                @click="handleGrade({})"
                ><strong>新增{{ entityName }}</strong></el-button
              >
            </h3></template
          >
          <template slot="id" slot-scope="{ row }">
            <copy-item :value="row.id"></copy-item>
          </template>
          <template slot="consumer" slot-scope="{ row }">
            <div v-if="row.consumer">
              <copy-item :value="row.consumer.id"></copy-item>
            </div>
            <div v-if="!row.consumer">All Consumers</div>
          </template>
          <template slot="enabled" slot-scope="{ row }">
            <el-button
              v-show="row.enabled"
              plain
              size="mini"
              type="success"
              v-if="permission.plugin_update"
              @click="handlerPluginUpdate(row, false)"
              >启用</el-button
            >
            <el-button
              v-show="!row.enabled"
              plain
              size="mini"
              type="danger"
              v-if="permission.plugin_update"
              @click="handlerPluginUpdate(row, true)"
              >未启用</el-button
            >
            <el-button
              v-show="row.enabled"
              plain
              size="mini"
              type="success"
              disabled
              v-if="!permission.plugin_update"
              >启用</el-button
            >
            <el-button
              v-show="!row.enabled"
              plain
              size="mini"
              type="danger"
              disabled
              v-if="!permission.plugin_update"
              >未启用</el-button
            >
          </template>
          <template slot="name" slot-scope="{ row }">
            <el-link
              :underline="false"
              type="success"
              @click="toDetailPlugin(row)"
              >{{ row.name }}</el-link
            >
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              v-if="permission.plugin_update || isDevProfile"
              icon="el-icon-edit"
              size="small"
              @click="toEditPlugin(scope.row, scope.$index)"
              type="text"
              >编辑</el-button
            >
            <el-button
              v-if="permission.plugin_delete || isDevProfile"
              icon="el-icon-delete"
              size="small"
              @click="handleDel(scope.row, scope.$index)"
              type="text"
              >删除</el-button
            >
          </template>
        </avue-crud>
      </div>
      <div v-if="pathKey == entityName + '_edit'">
        <uphold-plugin
          :plugin="plugin"
          @callback="refreshList"
          edit="edit"
          :fields="fields"
        ></uphold-plugin>
      </div>
      <div v-if="pathKey == entityName + '_add'">
        <list-plugin @callback="reloadDataList"></list-plugin>
      </div>
      <div v-if="pathKey == entityName + '_view'">
        <json-viewer
          :value="plugin"
          :expand-depth="5"
          copyable
          sort
        ></json-viewer>
      </div>
    </basic-container>
  </div>
</template>
<style>
.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.image {
  display: block;
  margin: auto;
  height: 72px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>
<script>
import { get_options } from "@/const/table/gatewayOption";
import { mapGetters } from "vuex";
import {
  findAll,
  pluginsDel,
  pluginUpdate,
  findPluginSchema,
} from "@/api/gateway/plugins";
import { DIC } from "@/const/dic.js";
import { findInfo, findStatus } from "@/api/gateway/kongInfo";
import listPlugin from "./listPlugin";
import searchBanner from "@/components/searchBanner";
import upholdPlugin from "./upholdPlugins";
import InnerBreadcrumb from "@/components/InnerBreadcrumb";
import CopyItem from "@/components/CopyItem";
export default {
  name: "plugin",
  components: {
    listPlugin,
    searchBanner,
    upholdPlugin,
    CopyItem,
    InnerBreadcrumb,
  },
  data() {
    return {
      tableSearch: {},
      tableOption: [], //表格设置属性
      searchProps: [
        { name: "name" },
        { name: "applyObject", type: "object", childName: "name" },
      ],
      plugins: [],
      fields: [],
      plugin: {},
      tableData: [], //表格的数据
      tablePage: 1,
      tableSize: 10,
      tableLoading: false,
      mode: "add",
      page: {
        total: 0, //总页数
        currentPage: 1, //当前页数
        pageSize: 10, //每页显示多少条
      },
      pathKey: DIC.PLUGINS,
      entityName: DIC.PLUGINS,
      labelArgs: {},
      path: {
        label: DIC.PLUGINS,
        key: DIC.PLUGINS,
        children: [
          {
            key: DIC.PLUGINS + "_add",
            label: "新建" + DIC.PLUGINS,
          },
          {
            key: DIC.PLUGINS + "_edit",
            label: "修改" + DIC.PLUGINS,
          },
          {
            key: DIC.PLUGINS + "_view",
            label: "查看" + DIC.PLUGINS,
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters([
      "permission",
      "isDevProfile",
      "isProdProfile",
      "systemProfile",
      "kongClient",
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
      this.tableOption = get_options(
        this.systemProfile.version,
        this.entityName
      );
      this.queryInfo();
      this.initOptions();
    }
  },
  methods: {
    initOptions() {
      if (this.isDevProfile) {
        this.tableOption["menu"] = true;
      } else {
        if (!this.permission.plugin_update) {
          this.tableOption["menu"] = false;
        }
      }
    },
    handlerPluginUpdate(row, enabled) {
      row.enabled = enabled;
      pluginUpdate(row).then((res) => {
        this.handleList(this.tableSearch);
      });
    },
    toDetailPlugin(form, index) {
      this.mode = "view";
      this.pathKey = this.entityName + "_" + this.mode;
      this.plugin = form;
    },
    toEditPlugin(form, index) {
      this.plugin = form;
      findPluginSchema(this.plugin.name).then((res) => {
        let _data = res.data;
        this.fields = _data.fields || [];
        this.mode = "edit";
        this.pathKey = this.entityName + "_" + this.mode;
      });
    },
    handleGrade(form, index) {
      this.mode = "add";
      this.pathKey = this.entityName + "_" + this.mode;
    },
    refreshList() {
      this.initPage(true);
      this.$refs.routeSearch.refresh(this.page, true);
    },

    queryInfo() {
      findInfo().then((res) => {
        let infos = res.data;
        let _plugins = infos.plugins;
        this.plugins = _plugins.available_on_server;
      });
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
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    handleSave(row, done, loading) {
      strategySave(row).then((res) => {
        done();
        let _data = res.data.data;
        if (_data.retBool) {
          this.$successInfo("添加成功");
        } else {
          this.$errorInfo(_data.message);
        }
        this.reloadDataList();
      });
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
          pluginsDel({ id: row.id }).then((res) => {
            let _data = res.data;
            if (_data.status != 0) {
              this.$errorInfo(_data.errmsg);
            } else {
              this.$successInfo("删除成功");
              this.reloadDataList();
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>
