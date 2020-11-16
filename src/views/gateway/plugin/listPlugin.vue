<template>
  <div>
    <el-tabs type="border-card" :tab-position="tabPosition">
      <el-tab-pane
        lazy
        v-for="item in pluginGroupOption.column"
        :key="item.label"
        :label="item.label"
      >
        <avue-card
          :option="cardoption"
          :data="item.option.column"
          @row-click="tip"
          @row-add="tip"
        >
          <template slot="menu" slot-scope="scope">
            <span
              @click="toAddPlugin(scope.row.name.toLowerCase())"
              type="primary"
              >新增插件</span
            >
          </template>
        </avue-card>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="新增插件"
      width="70%"
      :visible.sync="grade.pluginBox"
      append-to-body
    >
      <uphold-plugins
        :plugin="plugin"
        @callback="callback"
        :fields="fields"
        edit="add"
        :key="plugin.name"
      ></uphold-plugins>
    </el-dialog>
  </div>
</template>
<style>
.el-dialog__body {
  padding: 0px 20px 20px;
}
.center-block {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.panel-footer {
  padding: 10px 15px;
}
.max-2-lines {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  min-height: 34px;
  text-align: center;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
}
.button {
  /* padding: 0; */
  /* float: right; */
  float: right;
}
.avue-card__avatar {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  overflow: hidden;
  margin-right: 12px;
}
</style>
<script>
import { mapGetters } from "vuex";
import { get_columns } from "@/const/table/gatewayColumnOption";
import { DIC } from "@/const/dic";
import { findPluginSchema } from "@/api/gateway/plugins";
import { pluginGroupOption } from "@/const/table/pluginsOption";
import { findInfo, findStatus } from "@/api/gateway/kongInfo";
import upholdPlugins from "./upholdPlugins";
export default {
  components: { upholdPlugins },
  data() {
    return {
      svgimage: 'this.src="/img/plugins/kong.svg"',
      pluginGroupOption: [],
      fields: [],
      grade: {
        pluginBox: false,
      },
      entityName: DIC.PLUGINS,
      cardoption: {
        addBtn: false,
        span: 6,
        props: {
          img: "img",
          title: "name",
          info: "description",
        },
      },
      plugin: {
        name: "",
        config: {},
      },
      consumer_disabled_plugins: {
        "hmac-auth": true,
        "basic-auth": true,
        "key-auth": true,
        oauth2: true,
        "ldap-auth": true,
        session: true,
        acl: true,
        cors: true,
        "bot-detection": true,
      },
    };
  },
  created() {
    let version = this.systemProfile.version;
    this.pluginGroupOption = get_columns(version, this.entityName);
    if (this.route) {
      this.plugin["route"] = { id: this.route.id };
    }
    if (this.service) {
      this.plugin["service"] = { id: this.service.id };
    }
    if (this.consumer) {
      this.plugin["consumer"] = { id: this.consumer.id };
    }
  },
  mounted() {
    this.initOptions();
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
    tabPosition: { required: false },
    service: { required: false },
    route: { required: false },
    consumer: { required: false },
  },
  methods: {
    initOptions() {
      findInfo()
        .then((res) => {
          var _columns = [];
          let infos = res.data;
          let _plugins = infos.plugins;
          for (var plugin in _plugins.available_on_server) {
            let _exists = false;
            this.pluginGroupOption.column.forEach((item) => {
              item.option.column.forEach((_column) => {
                if (plugin == _column["name"].toLowerCase()) {
                  _exists = true;
                }
              });
            });
            if (!_exists) {
              _columns.push({
                name: plugin,
                description: plugin,
                img: "/img/plugins/kong.svg",
              });
            }
          }
          return _columns;
        })
        .then((_columns) => {
          var _customPlugins = {
            label: "自定义",
            description: "Custom Plugins",
            icon: "mdi-account-box-outline",
            hasConsumerPlugins: true,
            option: {
              column: [],
            },
          };

          if (_columns.length > 0) {
            _customPlugins.option.column = _columns;
            this.pluginGroupOption.column.push(_customPlugins);
          }

          this.pluginGroupOption.column.forEach((item) => {
            let columns = [];
            item.option.column.forEach((_column) => {
              if (!this.disabledPlugins(_column.name.toLowerCase())) {
                columns.push(_column);
              }
            });
            item.option.column = columns;
          });
        });
    },

    disabledPlugins(plugin) {
      if (!!!this.consumer) return false;
      let exists = this.consumer_disabled_plugins[plugin];
      return exists;
    },

    toAddPlugin(name) {
      this.plugin = {
        name: "",
        config: {},
        service: this.service,
        route: this.route,
        consumer: this.consumer,
      };
      this.plugin.name = name;
      findPluginSchema(this.plugin.name).then((res) => {
        let _data = res.data;
        this.fields = _data.fields || [];
        this.grade.pluginBox = true;
      });
    },
    callback() {
      this.$emit("callback", {});
    },
  },
};
</script>