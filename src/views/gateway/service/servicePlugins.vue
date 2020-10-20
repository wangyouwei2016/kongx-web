<template>
  <div>
    <avue-crud :option="tableOption" :data="tableData" :table-loading="tableLoading">
      <template slot="enabled" slot-scope="{row}">
        <!-- <el-button
            v-show="row.enabled"
            plain
            size="mini"
            type="success"
            v-if="permission.plugin_update"
            @click="handlerPluginUpdate(row,false)"
          >启用</el-button>
          <el-button
            v-show="!row.enabled"
            plain
            size="mini"
            type="danger"
            v-if="permission.plugin_update"
            @click="handlerPluginUpdate(row,true)"
        >未启用</el-button>-->
        <el-button v-show="row.enabled" plain size="mini" type="success" disabled>启用</el-button>
        <el-button v-show="!row.enabled" plain size="mini" type="danger" disabled>未启用</el-button>
      </template>
      <template slot="name" slot-scope="{row}">{{row.name}}</template>
      <template slot-scope="scope" slot="menu">
        <el-button
          v-if="permission.plugin_update"
          icon="el-icon-edit"
          size="small"
          plain
          @click="toEditPlugin(scope.row,scope.$index)"
          type="primary"
        >编辑</el-button>
        <el-button
          v-if="permission.plugin_delete"
          icon="el-icon-delete"
          size="small"
          plain
          @click="handleDel(scope.row,scope.$index)"
          type="danger"
        >删除</el-button>
      </template>
    </avue-crud>

    <el-drawer
      size="45%"
      :title="'\''+plugin.name+'\' 详情'"
      :visible.sync="grade.drawerDetail"
      v-if="grade.drawerDetail"
      :direction="direction"
      :before-close="handleClose"
    >
      <div style="margin-left:10px; overflow-y:auto; overflow-x:auto;  height:100%;">
        <pre>{{plugin}}}</pre>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { servicePluginsOption } from "@/const/table/gatewayOption";
import { mapGetters } from "vuex";
import { findAllPluginByService } from "@/api/gateway/service";
export default {
  name: "plugin",
  data() {
    return {
      tableSearch: {},
      tableOption: servicePluginsOption, //表格设置属性
      items: [],
      tmp_items: [],
      plugins: [],
      plugin: {},
      tableData: [], //表格的数据
      tablePage: 1,
      tableSize: 10,
      tableLoading: false,
      page: {
        total: 0, //总页数
        currentPage: 1, //当前页数
        pageSize: 10 //每页显示多少条
      },
      grade: {
        drawerDetail: false
      }
    };
  },
  computed: {
    ...mapGetters(["permission"])
  },
  props: {
    service: {
      type: String,
      required: false
    },
    client: { required: false }
  },
  created() {
    this.handleList();
    this.initOptions();
  },
  methods: {
    initOptions() {},
    /**
     * @title 获取数据
     * @detail 赋值为tableData表格即可
     *
     **/
    handleList(form) {
      this.tableLoading = true;
      this.client = this.client || {};
      findAllPluginByService(this.service, this.client).then(res => {
        let _data = res.data;
        if (_data.status != 0) {
          this.$errorInfo(_data.errmsg);
        } else {
          this.tableData = _data.data;
        }
        this.tableLoading = false;
      });
    }
  }
};
</script>
