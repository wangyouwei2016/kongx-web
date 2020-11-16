<template>
  <div>
    <avue-crud
      :option="queryPluginsOption"
      :data="routeData"
      @row-del="handleTargetDel"
    >
      <template slot="empty">暂无插件，请添加</template>
      <template slot-scope="{ row }" slot="created_at">
        {{ new Date(row.created_at * 1000) | dateFormat }}
      </template>
      <template slot-scope="scope" slot="menuRight">
        <el-button
          v-if="mode == 'edit'"
          icon="el-icon-plus"
          size="small"
          @click="toAddPlugin(scope.row, scope.$index)"
          type="primary"
          >新增插件</el-button
        >
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          icon="el-icon-edit"
          size="small"
          @click="toEditPlugin(scope.row, scope.$index)"
          type="text"
          >编辑</el-button
        >
        <el-button
          icon="el-icon-delete"
          size="small"
          @click="handleTargetDel(scope.row, scope.$index)"
          type="text"
          >删除</el-button
        >
      </template>
    </avue-crud>
    <el-dialog
      title="新增插件"
      width="70%"
      :visible.sync="grade.addPluginBox"
      v-if="grade.addPluginBox"
      append-to-body
    >
      <list-plugin
        v-if="grade.addPluginBox"
        @callback="pluginCallback"
        :route="route"
        :service="service"
        :consumer="consumer"
      ></list-plugin>
    </el-dialog>
    <el-dialog
      title="编辑插件"
      width="70%"
      :visible.sync="grade.editPluginBox"
      v-if="grade.editPluginBox"
      append-to-body
    >
      <uphold-plugin
        v-if="grade.editPluginBox"
        :plugin="pluginForm"
        @callback="pluginCallback"
        edit="edit"
        :fields="fields"
      ></uphold-plugin>
    </el-dialog>
  </div>
</template>
<style>
.avue-crud__empty {
  padding: 10px 0;
}
</style>
<script>
import { mapGetters } from "vuex";
import { queryPluginsOption } from "@/const/table/gatewayOption";
import {
  findAllByRoute,
  findAllByService,
  findAllByCustomer,
  pluginsDel,
  findPluginSchema,
} from "@/api/gateway/plugins";
import ItemTags from "@/components/ItemTags";
import upholdPlugin from "./upholdPlugins";
import listPlugin from "./listPlugin";
export default {
  name: "QueryPlugins",
  components: {
    ItemTags,
    upholdPlugin,
    listPlugin,
  },
  data() {
    return {
      queryPluginsOption: _.cloneDeep(queryPluginsOption),
      routeData: [],
      pluginForm: {
        service: this.service,
        route: this.route,
        consumer: this.consumer,
      },
      activeNames: "listRoute",
      hiddenAddRoute: true,
      pluginUpdate: false,
      grade: { editPluginBox: false, addPluginBox: false },
    };
  },
  props: {
    service: { type: Object, required: false },
    route: { type: Object, required: false },
    consumer: { type: Object, required: false },
    mode: { required: false },
  },
  computed: {
    ...mapGetters([
      "permission",
      "isDevProfile",
      "isProdProfile",
      "systemProfile",
    ]),
  },
  mounted() {
    this.handleList();
    this.initOption();
  },
  methods: {
    initOption() {
      this.queryPluginsOption["menu"] = this.mode == "edit";
    },
    toEditPlugin(form, index) {
      this.pluginForm = form;
      findPluginSchema(this.pluginForm.name).then((res) => {
        let _data = res.data;
        this.fields = _data.fields || [];
        this.grade.editPluginBox = true;
        this.grade.addPluginBox = false;
      });
    },
    toAddPlugin(form, index) {
      this.grade.editPluginBox = false;
      this.grade.addPluginBox = true;
    },
    bindTags() {},
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
    handleList() {
      this.tableLoading = true;
      if (this.route) {
        this.pluginForm.route = { id: this.route.id };
        this.queryListByRoute(this.route);
      }
      if (this.service) {
        this.pluginForm.service = { id: this.service.id };
        this.queryListByService(this.service);
      }
      if (this.consumer) {
        this.pluginForm.consumer = { id: this.consumer.id };
        this.queryListByCustomer(this.consumer);
      }
    },

    queryListByRoute(form) {
      findAllByRoute(this.pluginForm).then((res) => {
        this.routeData = res.data.data;
      });
    },
    queryListByService(form) {
      findAllByService(this.pluginForm).then((res) => {
        this.routeData = res.data.data;
      });
    },

    queryListByCustomer(form) {
      findAllByCustomer(this.pluginForm).then((res) => {
        this.routeData = res.data.data;
      });
    },

    handleTargetDel(row, index) {
      var _message = "";
      this.isProdProfile && (_message = "当前为生产环境，请谨慎操作! ");
      this.$confirm(_message + `是否确认删除?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          pluginsDel({ id: row.id }).then((res) => {
            let _data = res.data;
            if (_data.status != 0) {
              this.$errorInfo(_data.errmsg);
            } else {
              this.handleList();
              this.$successInfo("删除成功");
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>
