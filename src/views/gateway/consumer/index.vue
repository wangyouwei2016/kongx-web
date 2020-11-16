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
          placeholder="请输入Username、Custom_id、Tags"
          :handleList="handleList"
          :span="permission.consumer_add || isDevProfile ? 21 : 24"
          :searchProps="searchProps"
          :page="page"
          @search-change="searchChange"
        >
          <template slot="menu">
            <el-button
              v-if="permission.consumer_add || isDevProfile"
              icon="el-icon-plus"
              size="small"
              @click="handleGrade({})"
              type="primary"
              >新增{{ entityName }}</el-button
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
          <template slot="id" slot-scope="{ row }">
            <copy-item :value="row.id"></copy-item>
          </template>
          <template slot-scope="{ row }" slot="created_at">
            {{ new Date(row.created_at * 1000) | dateFormat }}
          </template>
          <template slot="empty" v-if="permission.consumer_add || isDevProfile">
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
          <template slot="username" slot-scope="{ row }">
            <el-link :underline="false" type="success" @click="toDetail(row)">{{
              row.username
            }}</el-link>
          </template>
          <template slot="tags" slot-scope="{ row }">
            <item-tags
              :tags="row.tags"
              @sendTag="bindTags"
              name="tags"
              column="tags"
              mode="view"
            ></item-tags>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              v-if="permission.consumer_update || isDevProfile"
              icon="el-icon-edit"
              size="small"
              @click="handleGrade(scope.row, scope.$index)"
              type="text"
              >编辑</el-button
            >
            <el-button
              v-if="permission.consumer_delete || isDevProfile"
              icon="el-icon-delete"
              size="small"
              @click="handleDel(scope.row, scope.$index)"
              type="text"
              >删除</el-button
            >
          </template>
        </avue-crud>
      </div>

      <div v-if="pathKey == entityName + '_' + mode">
        <uphold-consumer
          :entity="form"
          :mode="mode"
          @callback="callback"
        ></uphold-consumer>
      </div>
    </basic-container>
  </div>
</template>
<script>
import { get_options } from "@/const/table/gatewayOption";
import { mapGetters } from "vuex";
import { DIC } from "@/const/dic.js";
import upholdConsumer from "./uphold-consumer";
import searchBanner from "@/components/searchBanner";
import { findAll, consumerDel } from "@/api/gateway/consumer";
import ItemTags from "@/components/ItemTags";
import InnerBreadcrumb from "@/components/InnerBreadcrumb";
import CopyItem from "@/components/CopyItem";
export default {
  name: DIC.CONSUMERS + "_list",
  components: {
    ItemTags,
    searchBanner,
    upholdConsumer,
    CopyItem,
    InnerBreadcrumb,
  },
  data() {
    return {
      tableSearch: {},
      tableOption: [], //表格设置属性
      searchProps: [
        { name: "username" },
        { name: "custom_id" },
        { name: "tags", type: "array" },
      ],
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
      mode: "add",
      entityName: DIC.CONSUMERS,
      pathKey: DIC.CONSUMERS,
      labelArgs: {},
      path: {
        label: DIC.CONSUMERS,
        key: DIC.CONSUMERS,
        children: [
          {
            key: DIC.CONSUMERS + "_add",
            label: "新建" + DIC.CONSUMERS,
          },
          {
            key: DIC.CONSUMERS + "_edit",
            label: "修改" + DIC.CONSUMERS,
          },
          {
            key: DIC.CONSUMERS + "_view",
            label: "查看" + DIC.CONSUMERS,
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
    ]),
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
      this.mode = "view";
      this.pathKey = this.entityName + "_" + this.mode;
    },
    callback(service) {
      this.form = service;
      this.mode = "edit";
      this.pathKey = this.entityName + "_" + this.mode;
      this.reloadDataList();
    },
    handleGrade(form, index) {
      if (form && form.id) {
        this.form = form;
        this.mode = "edit";
        this.pathKey = this.entityName + "_" + this.mode;
      } else {
        this.form = {};
        this.mode = "add";
        this.pathKey = this.entityName + "_" + this.mode;
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
      this.pathKey = this.entityName;
      if (this.pathKey == this.entityName) {
        this.initPage(false);
        this.$refs.routeSearch.loadData();
      }
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
          consumerDel({ id: row.id }).then((res) => {
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
