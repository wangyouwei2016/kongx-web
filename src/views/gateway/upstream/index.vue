<template>
  <div>
    <basic-container>
      <search-banner
        ref="routeSearch"
        :span="permission.upstream_add || isDevProfile ? 22 : 24"
        placeholder="请输入upstream名称"
        :handleList="handleList"
        :searchProps="searchProps"
        :page="page"
        @search-change="searchChange"
      >
        <template slot="menu">
          <el-button
            v-if="permission.upstream_add || isDevProfile"
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
        <template slot="expand" slot-scope="{ row }">
          <el-form label-width="80px" style="margin-left: 10px">
            <el-form-item label="代理列表">
              <targets :upstream="row" ref="targets" mode="view"></targets>
            </el-form-item>
          </el-form>
        </template>
        <!-- <template slot-scope="scope" slot="menuLeft">
          <el-button
            v-if="permission.upstream_add||isDevProfile"
            icon="el-icon-plus"
            size="small"
            @click="handleGrade(scope.row,scope.$index)"
            type="primary"
          >新增</el-button>
        </template> -->
        <template slot="name" slot-scope="{ row }">
          <el-link :underline="false" type="success" @click="toDetail(row)">{{
            row.name
          }}</el-link>
        </template>
        <template slot-scope="scope" slot="menu">
          <el-button
            v-if="permission.upstream_update || isDevProfile"
            icon="el-icon-edit"
            size="small"
            type="text"
            @click="handleGrade(scope.row, scope.$index)"
            >编辑</el-button
          >
          <el-button
            v-if="
              !permission.upstream_update && !isDevProfile && !isProdProfile
            "
            icon="el-icon-edit"
            size="small"
            @click="handleTargetsGrade(scope.row, scope.$index)"
            type="text"
            >配置Targets</el-button
          >
          <el-button
            v-if="permission.upstream_delete || isDevProfile"
            icon="el-icon-delete"
            @click="handleDel(scope.row, scope.$index)"
            size="small"
            type="text"
            >删除</el-button
          >
        </template>
      </avue-crud>
      <el-drawer
        title="上游代理(UPSTREAM)"
        size="50%"
        :visible.sync="grade.box"
        v-if="grade.box"
        :direction="direction"
      >
        <div
          style="
            margin-left: 10px;
            overflow-y: auto;
            overflow-x: auto;
            height: 90%;
          "
        >
          <uphold-upstream
            :upstream="form"
            @callback="callback"
            :mode="mode"
          ></uphold-upstream>
        </div>
      </el-drawer>
      <el-drawer
        title="编辑代理列表"
        size="50%"
        :visible.sync="grade.targetBox"
        v-if="grade.targetBox"
      >
        <div
          style="
            margin-left: 10px;
            overflow-y: auto;
            overflow-x: auto;
            height: 90%;
          "
        >
          <uphold-targets
            :upstream="form"
            @callback="callback"
            :mode="mode"
          ></uphold-targets>
        </div>
      </el-drawer>
      <el-drawer
        size="45%"
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
            height: 90%;
          "
        >
          <uphold-upstream :upstream="form" mode="view"></uphold-upstream>
        </div>
      </el-drawer>
    </basic-container>
  </div>
</template>
<script>
import { upstreamOption, upstreamColumn } from "@/const/table/gatewayOption";
import { mapGetters } from "vuex";
import targets from "./targets";
import healthCheck from "./healthCheck";
import upholdUpstream from "./upholdUpstream";
import upholdTargets from "./upholdTargets";
import searchBanner from "@/components/searchBanner";
import { findAll, upstreamDel } from "@/api/gateway/upstream";
export default {
  components: {
    targets,
    searchBanner,
    healthCheck,
    upholdUpstream,
    upholdTargets,
  },
  name: "strategy",
  data() {
    return {
      tableSearch: {},
      tableOption: upstreamOption, //表格设置属性
      upstreamColumn: upstreamColumn,
      searchProps: [{ name: "name" }],
      form: {},
      tableData: [], //表格的数据
      tablePage: 1,
      tableSize: 10,
      tableLoading: false,
      page: {
        total: 0, //总页数
        currentPage: 1, //当前页数
        pageSize: 10, //每页显示多少条
      },
      mode: "add",
      grade: {
        box: false,
        targetBox: false,
        updateUpstream: false,
        drawerDetail: false,
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
  props: {},
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
      if (this.isDevProfile || !this.isProdProfile) {
        this.tableOption["menu"] = true;
      } else {
        if (!this.permission.upstream_update) {
          this.tableOption["menu"] = false;
        }
      }
    },
    toDetail(form) {
      this.form = form;
      this.grade.drawerDetail = true;
      this.grade.updateUpstream = true;
    },
    handleGrade(form, index) {
      if (form && form.id) {
        this.form = form;
        this.mode = "edit";
      } else {
        this.form = {};
        this.mode = "add";
      }
      this.grade.box = true;
    },
    handleTargetsGrade(form, index) {
      if (form && form.id) {
        this.form = form;
        this.mode = "edit";
      } else {
        this.form = {};
        this.mode = "add";
      }
      this.grade.targetBox = true;
    },
    callback(upstream) {
      this.form = upstream;
      this.mode = "edit";
      this.reloadDataList();
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
    handleSave(row, done) {
      upstreamSave(row).then((res) => {
        done();
        // this.grade.box = false;
        this.form = res.data;
        this.grade.updateUpstream = true;
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
          upstreamDel({ id: row.id }).then((res) => {
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
