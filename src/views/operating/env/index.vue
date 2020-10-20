<template>
  <div>
    <basic-container>
      <el-tabs>
        <el-tab-pane :index="env.label" v-for="env in envs" :key="env" >
          <span slot="label">
            <i class="icon-env"></i>
            {{env.label}}
          </span>
          <el-tabs type="border-card" tab-position="left">
            <el-tab-pane v-for="(profile) in env.groups" :key="profile">
              <span slot="label">{{profile.profileCode}}</span>
              <uphold-env
                :client="{name:profile.label,deployType:env.deployType,profileCode:profile.profileCode,profile:profile.profile,env:env.env,ab:profile.value}"
              ></uphold-env>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.avue-group__title {
  margin-left: 10px;
}
</style>
<script>
import { mapGetters } from "vuex";

import {
  findAll,
  addClient,
  updateClient,
  removeClient,
  findActiveClient,
  setActiveClient,
  findEnvs
} from "@/api/operating/systemProfile";
import { clientOption, clientColumn } from "@/const/table/operatingOption.js";
import upholdEnv from "./upholdEnv";
export default {
  name: "client",
  components: { upholdEnv },
  data() {
    return {
      tableOption: clientOption, //表格设置属性
      clientColumn: clientColumn, //表格设置属性
      isCollapse: false,
      tableData: [], //表格的数据
      tableLoading: false,
      clientForm: {},
      envs: []
    };
  },
  created() {
    //初始化数据格式
    this.handleList();
    this.findAllEnvs();
    this.findActiveKongclient();
    this.initOptions();
  },
  watch: {},
  mounted() {},
  computed: {
    ...mapGetters(["permission", "userInfo"])
  },
  props: [],
  methods: {
    findAllEnvs() {
      findEnvs().then(res => {
        this.envs = res.data;
      });
    },
    initOptions() {
      if (!this.permission.client_update) this.tableOption["menu"] = false;
    },
    findActiveKongclient() {
      this.$store.dispatch("FindActiveClient", this.userInfo).then(res => {
        this.activeClient = res;
      });
    },
    handActiveClient(client) {
      setActiveClient(this.userInfo.name, client).then(res => {
        if (window.location.href.indexOf("#/wel/index") > 0) {
          window.location.reload();
        } else {
          window.location = "#/wel/index";
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
      findAll(Object.assign({})).then(res => {
        const data = res.data;
        this.tableData = data;
        this.tableLoading = false;
      });
    },
    handleClient(row, done) {
      if (this.clientForm && this.clientForm.id) {
        updateClient(this.clientForm).then(res => {
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
        addClient(this.clientForm).then(res => {
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
        type: "warning"
      }).then(() => {
        removeClient(row).then(res => {
          const _data = res.data;
          if (_data.status == 0) {
            this.$successInfo("删除成功");
            this.handleList();
          } else {
            this.$errorInfo("删除失败");
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.table-container {
  padding: 8px 10px;
}
</style>
