<template>
  <el-popover :placement="placement" title="路由Hosts更新为" v-model="visible">
    <div style="margin-top: 20px">
      <item-tags
        :tags="this.routeParms.hosts"
        @sendTag="bindTags"
        name="路由Hosts"
        column="hosts"
        mode="edit"
      ></item-tags>
    </div>
    <el-button
      icon="el-icon-refresh"
      size="small"
      slot="reference"
      type="success"
      @click="findConfigByKey"
    >批量更新HOSTS</el-button>
    <div style="text-align: right; margin-top: 20px">
      <el-button size="mini" type="text" @click="visible = false">取消</el-button>
      <el-button type="primary" size="mini" @click="batchUpdateRouteHosts">确定</el-button>
    </div>
  </el-popover>
</template>
<script>
import { findConfigByKey } from "@/api/operating/serverConfig";
import ItemTags from "@/components/ItemTags";
import { updateRouteHosts } from "@/api/gateway/route";
export default {
  name: "routing",
  components: { ItemTags },
  data() {
    return {
      visible: false,
      routeParms: { hosts: [], service: this.service }
    };
  },
  props: {
    service: {
      required: false
    },
    placement: { default: "bottom-start", required: false }
  },
  created() {
    this.findConfigByKey();
  },
  methods: {
    findConfigByKey() {
      findConfigByKey("default_domains").then(res => {
        var _data = res.data.data;
        var _hosts = JSON.parse(_data.configValue);
        this.routeParms["hosts"] = _hosts;
      });
    },
    batchUpdateRouteHosts() {
      //   if (this.routeParms.hosts.length == 0) {
      //     this.$errorInfo("请填写路由Hosts");
      //     return;
      //   }
      updateRouteHosts(this.routeParms).then(res => {
        let _data = res.data;
        if (_data.status != 0) {
          this.$errorInfo(_data.errmsg);
        } else {
          this.targetData = res.data.data;
          if (_data.errmsg.trim().length === 0) {
            this.$successInfo("更新成功");
          } else {
            this.$successInfo(
              "部分路由paths为空，不能再更新Hosts为空，路由列表为：" +
                _data.errmsg
            );
          }
          this.callback();
        }
      });
    },
    callback() {
      this.$emit("callback", {});
    }
  }
};
</script>