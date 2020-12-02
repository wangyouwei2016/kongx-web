<template>
  <div>
    <basic-container>
      <el-alert type="info" show-icon
        ><h3>
          <span v-if="permission.manage_env"
            >请激活Kong的管理连接，设置Kong管理连接请前往：
            <router-link :to="{ path: routerUrl }"
              ><strong
                ><el-link
                  type="success"
                  :underline="false"
                  @click.native="toConfig()"
                  >配置中心</el-link
                ></strong
              ></router-link
            ></span
          ><span v-else>请激活Kong的管理连接，其它情况请联系平台管理员</span>
        </h3></el-alert
      >

      <avue-crud
        :option="tableOption"
        :data="tableData"
        :table-loading="tableLoading"
        ref="crud"
        @refresh-change="handlerefreshChange"
      >
        <template slot-scope="{ row }" slot="create_at">
          {{ new Date(row.create_at) | dateFormat }}
        </template>
        <template slot="id" slot-scope="{ row }">
          <el-button
            v-if="activeClient.id != row.id"
            type="info"
            size="mini"
            plain
            @click="handActiveClient(row)"
            >激活</el-button
          >
          <el-button v-if="activeClient.id == row.id" type="success" size="mini"
            >已激活</el-button
          >
        </template>

        <template slot-scope="scope" slot="menuLeft">
          <el-button
            v-if="permission.client_add && false"
            icon="el-icon-plus"
            size="small"
            @click="toEditClient(scope.row, scope.$index)"
            type="primary"
            >新 增</el-button
          >
        </template>
        <template slot-scope="scope" slot="menu">
          <el-button
            v-if="permission.client_update"
            icon="el-icon-edit"
            size="small"
            @click="toEditClient(scope.row, scope.$index)"
            type="primary"
            plain
            >编辑</el-button
          >
          <el-button
            v-if="permission.client_delete"
            icon="el-icon-delete"
            size="small"
            @click="handlerDelete(scope.row, scope.$index)"
            type="danger"
            plain
            >删除</el-button
          >
        </template>
      </avue-crud>
    </basic-container>
    <el-dialog
      title="新增Kong连接"
      width="70%"
      :visible.sync="grade.box"
      v-if="grade.box"
    >
      <avue-form
        :option="clientColumn"
        v-model="clientForm"
        @submit="handleClient"
      ></avue-form>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  findAll,
  addClient,
  updateClient,
  removeClient,
  findActiveClient,
  setActiveClient,
} from "@/api/operating/systemProfile";
import { clientOption, clientColumn } from "@/const/table/operatingOption.js";
export default {
  name: "client",
  components: {},
  data() {
    return {
      tableOption: clientOption, //表格设置属性
      clientColumn: clientColumn, //表格设置属性
      tableData: [], //表格的数据
      tableLoading: false,
      clientForm: {},
      routerUrl: null,
      activeClient: { id: -1 },
      grade: {
        box: false,
      },
    };
  },
  created() {
    //初始化数据格式
    this.findActiveKongclient();
    this.handleList();
    this.initOptions();
  },
  watch: {},
  mounted() {},
  computed: {
    ...mapGetters(["permission", "userInfo"]),
  },
  props: [],
  methods: {
    toConfig() {
      this.routerUrl = "/operating/envs";
      setTimeout(() => {
        this.$emit("callback", {});
      }, 200);
    },
    initOptions() {
      //if (!this.permission.client_update)
      this.tableOption["menu"] = false;
    },
    findActiveKongclient() {
      this.$store.dispatch("FindActiveClient", this.userInfo).then((res) => {
        this.activeClient = res;
      });
    },
    handActiveClient(client) {
      setActiveClient(this.userInfo.name, client).then((res) => {
        if (window.location.href.indexOf("#/wel/index") > 0) {
          window.location.reload();
        } else {
          this.$nextTick((_) => {
            this.$router.push("/wel/index");
          });
        }
      });
    },
    toEditClient(form, index) {
      this.grade.box = true;
      this.clientForm = form;
    },
    /**
     * @title 刷新数据
     *
     **/
    handlerefreshChange(page) {
      this.handleList(this.tableSearch);
    },
    /**
     * @title 获取数据
     * @detail 赋值为tableData表格即可
     *
     **/
    handleList(form) {
      this.tableLoading = true;
      findAll(Object.assign({})).then((res) => {
        const data = res.data.data;
        this.tableData = data;
        this.tableLoading = false;
      });
    },
    handleClient(row, done) {
      if (this.clientForm && this.clientForm.id) {
        updateClient(this.clientForm).then((res) => {
          const _data = res.data;
          if (_data.status == 0) {
            this.$successInfo("修改成功");
            this.handleList();
            this.grade.box = false;
          } else {
            this.$errorInfo("修改失败");
          }
          done();
        });
      } else {
        addClient(this.clientForm).then((res) => {
          const _data = res.data;
          if (_data.status == 0) {
            this.$successInfo("新增成功");
            this.handleList();
            this.grade.box = false;
          } else {
            this.$errorInfo("新增失败");
          }
          done();
        });
      }
    },
    handlerDelete(row) {
      this.$confirm(`是否确认删除?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        removeClient(row).then((res) => {
          const _data = res.data;
          if (_data.status == 0) {
            this.$successInfo("删除成功");
            this.handleList();
          } else {
            this.$errorInfo("删除失败");
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.table-container {
  padding: 8px 10px;
}
</style>
