<template>
  <div>
    <avue-crud
      :option="routingOption"
      :data="routeData"
      @row-del="handleTargetDel"
      @expand-change="expandChanges"
    >
      <template slot="empty">暂无服务路由，请添加</template>
      <template slot="expand" slot-scope="{row}">
        <el-form label-width="80px" style="margin-left:10px;">
          <el-form-item label="Host" v-if="row.hosts && row.hosts.length>0">
            <item-tags :tags="row.hosts" name="匹配路径" column="paths" mode="view"></item-tags>
          </el-form-item>
          <el-form-item label="路由PATH">
            <item-tags :tags="row.paths" name="匹配路径" column="paths" mode="view"></item-tags>
          </el-form-item>
          <el-form-item label="插件列表">
            <query-plugins :route="row" mode="view"></query-plugins>
          </el-form-item>
        </el-form>
      </template>
      <template slot="hosts" slot-scope="{row}">
        <el-tag
          v-for="tag in row.hosts"
          :key="tag"
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{tag}}</el-tag>
      </template>
      <template slot="paths" slot-scope="{row}">
        <el-tag
          v-for="tag in row.paths"
          :key="tag"
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{tag}}</el-tag>
      </template>
      <template slot-scope="scope" slot="menuRight" v-if="mode!='view'">
        <el-button
          icon="el-icon-plus"
          size="small"
          @click="toAddRoute(scope.row,scope.$index)"
          type="primary"
        >新增路由</el-button>
        <update-hosts @callback="pluginCallback" placement="bottom-end" :service="{id:service.id}"></update-hosts>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          icon="el-icon-edit"
          size="small"
          @click="toEditRoute(scope.row,scope.$index)"
          plain
          type="primary"
        >编辑</el-button>
        <el-button
          icon="el-icon-edit"
          size="small"
          @click="handleTargetDel(scope.row,scope.$index)"
          plain
          type="danger"
        >删除</el-button>
      </template>
    </avue-crud>
    <el-dialog
      title="新增路由"
      width="70%"
      :visible.sync="grade.addPluginBox"
      v-if="grade.addPluginBox"
      append-to-body
    >
      <uphold-route :route="routeForm" @callback="pluginCallback" mode="add"></uphold-route>
    </el-dialog>
    <el-dialog
      title="编辑路由"
      width="70%"
      :visible.sync="grade.editPluginBox"
      v-if="grade.editPluginBox"
      append-to-body
    >
      <uphold-route :route="routeForm" @callback="pluginCallback" :mode="mode"></uphold-route>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { serviceRouteOption } from "@/const/table/gatewayOption";
import { findAllByService, routeDel } from "@/api/gateway/route";
import queryPlugins from "@/views/gateway/plugin/queryPlugins";
import ItemTags from "@/components/ItemTags";
import upholdRoute from "./upholdRoute";
import updateHosts from "./updateHosts";
export default {
  name: "QueryRoutes",
  components: {
    ItemTags,
    upholdRoute,
    queryPlugins,
    updateHosts
  },
  data() {
    return {
      routingOption: serviceRouteOption,
      routeData: [],
      routeForm: { service: { id: this.service.id } },
      grade: { editPluginBox: false, addPluginBox: false }
    };
  },
  computed: {
    ...mapGetters(["permission", "isProdProfile", "systemProfile"])
  },
  props: {
    service: { type: Object, required: false },
    client: { required: false },
    mode: { required: false }
  },
  created() {
    this.handleList();
    this.initOption();
  },
  methods: {
    initOption() {
      this.routingOption["menu"] = this.mode == "edit";
    },
    toEditRoute(form, index) {
      this.grade.editPluginBox = true;
      this.grade.addPluginBox = false;
      this.routeForm = form;
    },
    toAddRoute(form, index) {
      this.grade.editPluginBox = false;
      this.grade.addPluginBox = true;
      this.routeForm = { service: { id: this.service.id } };
    },
    bindTags() {},
    expandChanges(row, expendList) {
      if (expendList.length) {
        this.routingOption.expandRowKeys = [];
        if (row) {
          this.routingOption.expandRowKeys.push(row.id);
        }
      } else {
        this.routingOption.expandRowKeys = [];
      }
    },
    pluginCallback() {
      this.handleList();
      this.grade.editPluginBox = false;
      this.grade.addPluginBox = false;
    },
    /**
     * @title 获取数据
     * @detail 赋值为tableData表格即可
     *
     **/
    handleList(form) {
      this.tableLoading = true;
      this.client = this.client || {};
      findAllByService(this.service, this.client).then(res => {
        this.routeData = res.data.data;
      });
    },
    handleTargetDel(row, index) {
      var _message = "";
      this.isProdProfile && (_message = "当前为生产环境，请谨慎操作! ");
      this.$confirm(_message + `是否确认删除?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          routeDel({ id: row.id }).then(res => {
            let _data = res.data;
            if (_data.status != 0) {
              this.$errorInfo(_data.errmsg);
            } else {
              this.$successInfo("删除成功");
              this.handleList();
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
