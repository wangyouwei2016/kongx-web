<template>
  <div>
    <basic-container>
      <search-banner
        ref="routeSearch"
        placeholder="请输入USERNAME、TAGS"
        :handleList="handleList"
        :span="isDevProfile ? 21 : 24"
        :searchProps="searchProps"
        :page="page"
        @search-change="searchChange"
      >
        <template slot="menu">
          <el-button
            v-if="isDevProfile"
            icon="el-icon-plus"
            size="small"
            @click="handleGrade({})"
            type="primary"
            >新增</el-button
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
            v-if="isDevProfile"
            icon="el-icon-edit"
            size="small"
            @click="handleGrade(scope.row, scope.$index)"
            type="text"
            >编辑</el-button
          >
          <el-button
            v-if="isDevProfile"
            icon="el-icon-delete"
            size="small"
            @click="handleDel(scope.row, scope.$index)"
            type="text"
            >删除</el-button
          >
        </template>
      </avue-crud>
      <el-drawer
        title="CONSUMERS"
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
          <upload-consumer
            :entity="form"
            :mode="mode"
            @callback="callback"
          ></upload-consumer>
        </div>
      </el-drawer>

      <el-drawer
        size="50%"
        :title="'\'' + form.username + '\' 详情'"
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
          <upload-consumer
            :entity="form"
            :mode="mode"
            @callback="callback"
          ></upload-consumer>
        </div>
      </el-drawer>
    </basic-container>
  </div>
</template>
<script>
import { consumersOption } from "@/const/table/gatewayOption";
import { mapGetters } from "vuex";
import uploadConsumer from "./upload-consumer";
import searchBanner from "@/components/searchBanner";
import { findAll, consumerDel } from "@/api/gateway/consumer";
import ItemTags from "@/components/ItemTags";
export default {
  name: "strategy",
  components: {
    ItemTags,
    searchBanner,
    uploadConsumer,
  },
  data() {
    return {
      tableSearch: {},
      tableOption: consumersOption, //表格设置属性
      searchProps: [{ name: "username" }, { name: "tags", type: "array" }],
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
      this.grade.box = false;
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
