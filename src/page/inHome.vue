<template>
  <div>
    <basic-container>
      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix">
          <span>
            <h3>
              <strong>CONNECTIONS【{{ kongClient.url }}】</strong>
            </h3>
          </span>
        </div>
        <avue-data-display :option="easyDataOption"></avue-data-display>
      </el-card>
    </basic-container>
    <el-row>
      <el-col :span="8">
        <basic-container height="160">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>
                <h3>
                  <strong>NODE INFO</strong>
                </h3>
              </span>
            </div>
            <avue-crud :option="nodeOption" :data="nodeData"></avue-crud>
          </el-card>
        </basic-container>
      </el-col>
      <el-col :span="8">
        <basic-container>
          <el-card shadow="always">
            <div slot="header" class="clearfix">
              <span>
                <h3>
                  <strong>CONFIG INFO</strong>
                </h3>
              </span>
            </div>
            <avue-crud :option="nodeOption" :data="configData"></avue-crud>
          </el-card>
        </basic-container>
      </el-col>
      <el-col :span="8">
        <basic-container>
          <el-card shadow="always">
            <div slot="header" class="clearfix">
              <h3>
                <span>
                  <strong>DATASTORE INFO</strong>
                </span>
                <div
                  style="
                    float: right;
                    padding: 0px 0;
                    color: green;
                    font-size: 14px;
                  "
                  v-if="reachable"
                >
                  <strong>Reachable</strong>
                </div>
                <div
                  style="
                    float: right;
                    padding: 0px 0;
                    color: red;
                    font-size: 14px;
                  "
                  v-else
                >
                  <strong>Unreachable</strong>
                </div>
              </h3>
            </div>

            <avue-crud
              :option="nodeOption"
              :data="dbData"
              v-model="obj"
            ></avue-crud>
          </el-card>
        </basic-container>
      </el-col>
    </el-row>

    <basic-container>
      <el-card>
        <div slot="header" class="clearfix">
          <span>
            <h3>
              <strong>PLUGINS</strong>
            </h3>
          </span>
        </div>
        <div class="tag-group">
          <el-tag
            :disable-transitions="false"
            v-for="plugin in plugins"
            :type="plugin.type"
            :key="plugin.name"
            style="margin-top: 5px"
            effect="dark"
          >
            <strong>{{ plugin.name }}</strong>
          </el-tag>
        </div>
      </el-card>
    </basic-container>
  </div>
</template>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.avue-crud__menu {
  min-height: 0px;
}
.el-card__header {
  padding: 0px;
}
.data-icons .item {
  width: 100% !important;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
/* .avue-crud__pagination {
  position: relative;
  height: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
  padding: 0px 0px;
} */
</style>

<script>
import { findInfo, findStatus } from "@/api/gateway/kongInfo";
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      total_requests: 0,
      reachable: false,
      plugins: [],
      nodeData: [],
      configData: [],
      obj: {},
      dbData: [],
      nodeOption: {
        border: false,
        header: false,
        simplePage: true,
        showHeader: false,
        addBtn: false,
        delBtn: false,
        editBtn: false,
        refreshBtn: false,
        filterBtn: false,
        searchBtn: false,
        selectClearBtn: false,
        columnBtn: false,
        menuAlign: "right",
        menu: false,
        menuWidth: 180,
        align: "center",
        column: [
          { label: "名称", prop: "name" },
          { label: "值", prop: "value", width: 230, align: "left" },
        ],
      },
      easyDataOption: {
        span: 4,
        data: [
          {
            click: (item) => {},
            title: "ACTIVE",
            count: 0,
            icon: "icon-yonghuguanli",
            color: "rgb(49, 180, 141)",
          },
          {
            title: "READING",
            count: 0,
            icon: "icon-shujuzhanshi2",
            color: "rgb(56, 161, 242)",
          },
          {
            title: "WRITING",
            count: 0,
            icon: "icon-jiaoseguanli",
            color: "rgb(117, 56, 199)",
          },
          {
            title: "WAITING",
            count: 0,
            icon: "icon-jiaoseguanli",
            color: "rgb(117, 56, 199)",
          },
          {
            title: "ACCEPTED",
            count: 0,
            icon: "icon-jiaoseguanli",
            color: "rgb(117, 56, 199)",
          },
          {
            title: "HANDLED",
            count: 0,
            icon: "icon-jiaoseguanli",
            color: "rgb(117, 56, 199)",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo", "kongClient"]),
  },
  created() {
    this.findActiveKongclient();
  },
  mounted() {
    const timer = setInterval(() => {
      this.queryInfo();
    }, 5000);
    // 在beforeDestroy钩子触发时清除定时器
    this.$once("hook:beforeDestroy", () => {
      clearInterval(timer);
    });
  },
  watch: {
    kongClient(val) {
      this.queryInfo();
      this.queryStatus();
    },
  },
  methods: {
    findActiveKongclient() {
      this.$store.dispatch("FindActiveClient", this.userInfo).then((res) => {
        // this.kongClient = res;
      });
    },
    queryStatus() {
      findStatus().then((res) => {
        let _data = res.data;
        let server = _data["server"];
        this.reachable = _data.database.reachable;
        this.easyDataOption.data.forEach((item) => {
          let _key = "connections_" + item.title.toLowerCase();
          item["count"] = server[_key];
        });
        this.total_requests = 0 || server["total_requests"];
      });
    },
    queryInfo() {
      findInfo().then((res) => {
        let infos = res.data;
        let _plugins = infos.plugins;
        if (!infos || !_plugins) {
          return;
        }
        this.nodeData = [];
        this.plugins = [];
        this.dbData = [];
        this.configData = [];
        this.nodeData.push({ name: "HostName", value: infos.hostname });
        this.nodeData.push({ name: "Tag Line", value: infos.tagline });
        this.nodeData.push({ name: " Version", value: infos.version });
        this.nodeData.push({ name: "Lua version", value: infos.lua_version });

        this.nodeData.push({
          name: "Admin Listen",
          value: infos.configuration.admin_listen,
        });
        let _configuration = infos.configuration;
        this.configData.push({
          name: "Config path",
          value: _configuration.nginx_kong_conf,
        });
        this.configData.push({
          name: "Log level",
          value: _configuration.log_level,
        });
        this.configData.push({
          name: "Keepalive",
          value: _configuration.upstream_keepalive,
        });

        this.configData.push({
          name: "Access log",
          value: _configuration.proxy_access_log,
        });
        this.configData.push({
          name: "Error log",
          value: _configuration.proxy_error_log,
        });
        this.dbData.push({ name: "DBMS", value: _configuration.database });
        this.dbData.push({ name: "Host", value: _configuration.pg_host });
        this.dbData.push({
          name: "Database",
          value: _configuration.pg_database,
        });
        this.dbData.push({ name: "User", value: _configuration.pg_user });
        this.dbData.push({ name: "Port", value: _configuration.pg_port });

        for (var plugin in _plugins.available_on_server) {
          var type = "info";
          _plugins.enabled_in_cluster.forEach((item) => {
            if (item === plugin) {
              type = "success";
              return;
            }
            return "info";
          });
          this.plugins.push({ name: plugin, type: type });
        }
      });
    },
  },
};
</script>
