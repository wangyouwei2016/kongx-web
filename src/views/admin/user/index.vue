<template>
  <basic-container>
    <div>
      <el-row style="margin-bottom: 5px; margin-left: 5px; margin-right: 5px">
        <el-col span="2">
          <el-button
            size="small"
            icon="el-icon-plus"
            type="primary"
            @click="toAdd"
            >新增用户</el-button
          >
        </el-col>
        <el-col span="2">
          <el-popover placement="right-start" title="用户组" v-model="visible">
            <setting-user-group
              :userInfo="{ userGroupList: [] }"
              :userIds="checkedUsers"
              :mode="mode"
              @callback="handleList"
              :userGroupList="userGroupList"
            ></setting-user-group>
            <el-button
              v-if="permission.user_authority"
              slot="reference"
              size="small"
              icon="el-icon-plus"
              type="primary"
              >批量授权</el-button
            >
          </el-popover>
        </el-col>
        <el-col :span="permission.user_authority ? 20 : 24">
          <el-input
            size="small"
            v-model="searchForm"
            placeholder="请输入用户名或姓名"
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
      @row-save="handleSave"
      @row-update="handleUpdate"
      @refresh-change="handlerefreshChange"
      @current-change="handleCurrentChange"
      @size-change="handleCurrentSize"
      @search-change="handleSearchChange"
      @selection-change="selectionChange"
      style="cursor: pointer"
    >
      <template slot-scope="{ row }" slot="create_at">
        {{ new Date(row.create_at) | dateFormat }}
      </template>
      <template slot-scope="{ row }" slot="userGroupList">
        <setting-user-group
          :key="row.userId"
          :userInfo="row"
          :userIds="[row]"
          :mode="mode"
          @callback="handleList"
          :userGroupList="userGroupList"
        ></setting-user-group>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          @click="toEdit(scope.row, scope.index)"
          size="small"
          icon="el-icon-edit"
          type="text"
          >编辑</el-button
        >
        <el-button
          @click="toResetpwd(scope.row, scope.index)"
          size="small"
          icon="el-icon-refresh"
          type="text"
          >密码重置</el-button
        >
      </template>
    </avue-crud>
    <el-drawer
      :title="mode == 'add' ? '新增用户' : '编辑用户'"
      size="50%"
      :visible.sync="upholdBox"
      v-if="upholdBox"
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
        <uphold-user
          :entity="upholdEntity"
          :mode="mode"
          @callback="handleList"
        ></uphold-user>
      </div>
    </el-drawer>
  </basic-container>
</template>
<script>
import { mapGetters } from "vuex";
import { userOption } from "@/const/admin/adminTabelOption";
import {
  findAllByPage,
  updateUserRole,
  resetpwd,
  setStatus,
} from "@/api/admin/user";
import { findAllGroup } from "@/api/admin/usergroup";
import ItemTags from "@/components/ItemTags";
import SettingUserGroup from "./settingUserGroup";
import upholdUser from "./upholdUser";
export default {
  name: "syncLog",
  components: { ItemTags, SettingUserGroup, upholdUser },
  data() {
    return {
      tableOption: userOption, //表格设置属性
      tableData: [], //表格的数据
      tablePage: 1,
      tableSize: 10,
      tableLoading: false,
      searchForm: null,
      checkedRoles: [],
      userGroupList: [],
      visible: false,
      checkedUsers: [],
      userInfo: {},
      upholdEntity: {},
      mode: "add",
      upholdBox: false,
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
  mounted() {},
  watch: {
    searchForm(val) {
      this.page.currentPage = 1;
      this.handleList();
    },
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  methods: {
    init() {
      findAllGroup().then((res) => {
        this.userGroupList = res.data;
      });
    },
    toAdd() {
      this.upholdEntity = {};
      this.mode = "add";
      this.upholdBox = true;
    },
    toEdit(row) {
      this.upholdEntity = row;
      this.mode = "edit";
      this.upholdBox = true;
    },
    toSingleRole(row, index) {
      this.checkedUsers = [row];
      this.userInfo = row;
      this.configMenuBox = true;
    },
    selectionChange(list) {
      this.checkedUsers = list;
    },
    updateUserRole() {
      if (
        (this.checkedUsers && this.checkedUsers.length == 0) ||
        this.checkedRoles.length == 0
      ) {
        this.$errorInfo("请选择需要授权的用户或角色列表");
        return;
      }
      updateUserRole({
        userInfos: this.checkedUsers,
        systemRoles: this.checkedRoles,
      }).then((res) => {
        if (res.data.status != 0) {
          this.$errorInfo(res.data.errmsg);
        } else {
          this.$successInfo("更新成功");
          this.visible = false;
          this.checkedRoles = [];
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

    toResetpwd(row) {
      this.$confirm(`确定重置用户密码为123456，是否确认?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        resetpwd(row.userId).then((res) => {
          let _data = res.data;
          if (_data.status != 0) {
            this.$message.error(_data.msg);
          } else {
            this.handleList();
            this.$message.success("重置成功");
          }
        });
      });
    },
    /**
     * @title 获取数据
     * @detail 赋值为tableData表格即可
     *
     **/
    handleList(form) {
      this.tableLoading = true;
      this.upholdBox = false;
      this.form = {
        name: this.searchForm && this.searchForm.trim(),
      };
      findAllByPage(
        Object.assign({}, this.form, {
          start: this.tablePage,
          limit: this.tableSize,
        })
      ).then((res) => {
        let data = res.data.data;
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
