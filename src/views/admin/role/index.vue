<template>
  <basic-container>
    <div>
      <el-row style="margin-bottom: 5px; margin-left: 5px; margin-right: 5px">
        <el-col span="2">
          <el-button
            v-if="permission.role_add"
            size="small"
            icon="el-icon-plus"
            type="primary"
            @click="toAdd"
            >新建角色</el-button
          >
        </el-col>
        <el-col span="22">
          <el-input
            size="small"
            v-model="searchForm"
            placeholder="请输入角色名称"
            maxlength="20"
            clearable
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <avue-crud
      :option="tableOption"
      :data="tableData"
      :table-loading="tableLoading"
      v-model="objData"
      :page="page"
      ref="crud"
      @row-save="handleSave"
      @row-update="handleUpdate"
      @refresh-change="handlerefreshChange"
      @current-change="handleCurrentChange"
      @size-change="handleCurrentSize"
      @search-change="handleSearchChange"
      style="cursor: pointer"
    >
      <template slot="messageContent" slot-scope="{ row }">
        <item-tags
          :tags="row.messageContent"
          column="messageContent"
          mode="view"
        ></item-tags>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          v-if="permission.role_config"
          @click="toConfigViewMenu(scope.row, scope.index)"
          size="small"
          type="text"
          icon="el-icon-view"
          >查看</el-button
        >
        <el-button
          v-if="permission.role_update"
          @click="toEdit(scope)"
          size="small"
          icon="el-icon-edit"
          plain
          type="text"
          >编辑</el-button
        >
        <el-button
          v-if="permission.role_config"
          @click="toConfigMenu(scope.row, scope.index)"
          size="small"
          icon="icon-biaoshilei_jiaosepeizhi"
          type="text"
          >配置权限</el-button
        >
      </template>
    </avue-crud>
    <el-drawer
      title="配置角色权限"
      size="40%"
      :visible.sync="configMenuBox"
      v-if="configMenuBox"
    >
      <div
        style="
          margin-left: 10px;
          overflow-y: auto;
          overflow-x: auto;
          height: 99%;
        "
      >
        <uphold-role
          :systemRole="systemRole"
          :mode="mode"
          @callback="handleList"
        ></uphold-role>
      </div>
    </el-drawer>
  </basic-container>
</template>
<style>
.el-timeline {
  padding-left: 10px;
}
.echarts {
  width: 1000px;
  height: 600px;
}
.el-drawer__header {
  margin-bottom: 0px;
}

.el-select .el-input {
  width: 180px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.input-with-select .el-input-group__append {
  background-color: #fff;
}
</style>
<script>
import { mapGetters } from "vuex";
import { roleOption } from "@/const/admin/adminTabelOption";
import { findAllByPage, saveRole, updateRole } from "@/api/admin/role";
import ItemTags from "@/components/ItemTags";
import upholdRole from "./upholdRole";
export default {
  name: "syncLog",
  components: { ItemTags, upholdRole },
  data() {
    return {
      objData: {},
      tableSearch: {},
      tableOption: roleOption, //表格设置属性
      tableData: [], //表格的数据
      tablePage: 1,
      tableSize: 10,
      tableLoading: false,
      currentRule: {},
      systemRole: {},
      mode: "add",
      form: {},
      configMenuBox: false,
      searchForm: null,
      users: null,
      userLists: [],
      options: [],
      templates: { span: 8, data: [] },
      page: {
        total: 0, //总页数
        currentPage: 1, //当前页数
        pageSize: 10, //每页显示多少条
      },
    };
  },
  created() {
    this.handleList();
    this.init();
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  props: {
    logType: { required: true },
  },
  watch: {
    searchForm(val) {
      this.page.currentPage = 1;
      this.handleList();
    },
    users(val) {
      this.page.currentPage = 1;
      this.handleList();
    },
  },
  methods: {
    toConfigViewMenu(row, index) {
      this.configMenuBox = true;
      this.mode = "view";
      this.systemRole = row;
    },
    toConfigMenu(row, index) {
      this.configMenuBox = true;
      this.mode = "add";
      this.systemRole = row;
    },
    toAdd() {
      this.$refs.crud.rowAdd();
    },
    toEdit(scope) {
      this.$refs.crud.rowEdit(scope.row, scope.index);
    },
    init() {},
    handleRowClick(row) {
      this.currentRule = row;
    },
    handlerTrace() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.handlerTraceDetail = true;
        } else {
        }
      });
    },
    /**
     * @title 刷新数据
     *
     **/
    handlerefreshChange(page) {
      this.handleList(this.tableSearch);
    },
    /**
     * @title 页面改变值
     *
     **/
    handleCurrentChange(val) {
      this.tablePage = val;
      this.handlerefreshChange();
    },
    /**
     * @title 页面条数改变值
     *
     **/
    handleCurrentSize(val) {
      this.tableSize = val;
      this.handlerefreshChange();
    },
    /**
     * @title 搜索按钮回掉
     *
     **/
    handleSearchChange(form) {
      this.tableSearch = form;
      this.handleList(this.tableSearch);
    },

    handleSave(row, done) {
      saveRole(row).then((res) => {
        var data = res.data;
        if (data.status !== 0) {
          this.$message({
            showClose: true,
            message: data.errmsg,
            type: "warning",
          });
        } else {
          this.tablePage = 1;
          this.handleList();
          this.$message({
            showClose: true,
            message: "新增成功",
            type: "success",
          });
        }
        done();
      });
    },
    handleUpdate(row, index, done) {
      updateRole(row).then((res) => {
        var data = res.data;
        if (data.status !== 0) {
          this.$message({
            showClose: true,
            message: data.errmsg,
            type: "warning",
          });
        } else {
          this.tablePage = 1;
          this.handleList();
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success",
          });
        }
      });

      done();
    },
    /**
     * @title 获取数据
     * @detail 赋值为tableData表格即可
     *
     **/
    handleList(form) {
      this.tableLoading = true;
      this.alertRuleBox = false;
      this.form = {
        name: this.searchForm,
      };
      findAllByPage(
        Object.assign({}, this.form, {
          start: this.tablePage,
          limit: this.tableSize,
        })
      ).then((res) => {
        let data = res.data.data;
        this.templates.data = data.items;
        this.tableData = data.items;
        this.page = {
          total: data.totalCount,
          currentPage: this.tablePage,
          pageSize: this.tableSize,
        };
        this.tableLoading = false;
      });
    },
  },
};
</script>
