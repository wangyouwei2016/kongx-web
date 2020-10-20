<template>
  <div>
    <basic-container>
      <search-banner
        :span="permission.route_update || isDevProfile ? 21 : 24"
        ref="routeSearch"
        placeholder="请输入NAME、PATHS或HOSTS"
        :handleList="handleList"
        :searchProps="searchProps"
        :page="page"
        @search-change="searchChange"
      >
        <template slot="menu">
          <update-hosts
            v-if="permission.route_update || isDevProfile"
            @callback="reloadDataList"
          ></update-hosts>
        </template>
      </search-banner>
      <avue-crud
        :option="tableOption"
        :data="tableData"
        :table-loading="tableLoading"
        :page="page"
        @row-click="handleRowClick"
        @row-save="handleSave"
        @row-del="handleDel"
        @refresh-change="handlerefreshChange"
        @current-change="handleCurrentChange"
        @size-change="handleCurrentSize"
        @search-change="handleSearchChange"
        @expand-change="expandChanges"
      >
        <template slot="expand" slot-scope="{ row }">
          <el-form
            label-width="80px"
            style="
              margin-left: 10px;
              overflow-y: auto;
              overflow-x: auto;
              height: 90%;
            "
          >
            <!-- <el-form-item label="Host" v-if="row.hosts && row.hosts.length>0">
              <item-tags :tags="row.hosts" name="匹配路径" column="hosts" mode="view"></item-tags>
            </el-form-item>-->
            <el-form-item label="PATHS">
              <item-tags
                :tags="row.paths"
                name="匹配路径"
                column="paths"
                mode="view"
              ></item-tags>
            </el-form-item>
            <el-form-item label="插件">
              <query-plugins :route="row" mode="view"></query-plugins>
            </el-form-item>
          </el-form>
        </template>
        <template slot="name" slot-scope="{ row }">
          <el-link :underline="false" type="success" @click="toDetail(row)">{{
            row.name
          }}</el-link>
        </template>
        <template slot="service" slot-scope="{ row }">
          <el-link
            :underline="false"
            type="success"
            @click="toServiceDetail(row)"
            >{{ row.serviceName }}</el-link
          >
        </template>
        <template slot="hosts" slot-scope="{ row }">
          <item-tags :tags="row.hosts" column="hosts" mode="view"></item-tags>
        </template>
        <template slot="paths" slot-scope="{ row }">
          <item-tags :tags="row.paths" column="paths" mode="view"></item-tags>
        </template>
        <template slot-scope="{ row }" slot="menuLeft"></template>
        <template slot-scope="scope" slot="menu">
          <el-button
            v-if="permission.route_update || isDevProfile"
            icon="el-icon-edit"
            size="small"
            @click="handleGrade(scope.row, scope.$index)"
            type="text"
            >编辑</el-button
          >
          <el-button
            v-if="permission.route_delete || isDevProfile"
            icon="el-icon-delete"
            size="small"
            @click="handleDel(scope.row, scope.$index)"
            type="text"
            >删除</el-button
          >
        </template>
      </avue-crud>
      <el-dialog
        title="路由管理"
        width="70%"
        :visible.sync="grade.box"
        v-if="grade.box"
      >
        <uphold-route
          :route="form"
          mode="edit"
          @callback="reloadDataList"
        ></uphold-route>
      </el-dialog>
      <el-drawer
        size="45%"
        :title="'\'' + form.name + '\' 详情'"
        :visible.sync="grade.drawerDetail"
        v-if="grade.drawerDetail"
        :direction="direction"
        :before-close="handleClose"
      >
        <div
          style="
            margin-left: 10px;
            overflow-y: auto;
            overflow-x: auto;
            height: 90%;
          "
        >
          <uphold-route :route="form" mode="view"></uphold-route>
        </div>
      </el-drawer>
      <el-drawer
        size="100%"
        :title="'\'' + form.serviceName + '\'服务的详情'"
        :visible.sync="grade.drawerServiceDetail"
        v-if="grade.drawerServiceDetail"
        :direction="direction"
        :before-close="handleClose"
      >
        <div
          style="
            margin-left: 10px;
            overflow-y: auto;
            overflow-x: auto;
            height: 90%;
          "
        >
          <upload-service
            :service="{ id: form.service.id, name: form.serviceName }"
            mode="view"
          ></upload-service>
        </div>
      </el-drawer>
    </basic-container>
  </div>
</template>
<style>
.avue-crud__menu {
  min-height: 0;
}
</style>
<script>
import { routingOption } from "@/const/table/gatewayOption";
import { mapGetters } from "vuex";
import { findAll, routeDel, findAllService } from "@/api/gateway/route";
import upholdRoute from "./upholdRoute";
import updateHosts from "./updateHosts";
import searchBanner from "@/components/searchBanner";
import queryPlugins from "@/views/gateway/plugin/queryPlugins";
import ItemTags from "@/components/ItemTags";
import uploadService from "@/views/gateway/service/uploadService";
export default {
  name: "routing",
  components: {
    upholdRoute,
    searchBanner,
    ItemTags,
    queryPlugins,
    uploadService,
    updateHosts,
  },
  data() {
    return {
      tableSearch: {},
      tableOption: routingOption, //表格设置属性
      service_items: [],
      searchProps: [
        { name: "name" },
        { name: "paths", type: "array" },
        { name: "hosts", type: "array" },
        { name: "serviceName" },
      ],
      tableData: [], //表格的数据
      tablePage: 1,
      tableSize: 10,
      tableLoading: false,
      form: {},
      page: {
        total: 0, //总页数
        currentPage: 1, //当前页数
        pageSize: 10, //每页显示多少条
      },
      grade: {
        box: false,
        drawerDetail: false,
        drawerServiceDetail: false,
      },
    };
  },
  computed: {
    ...mapGetters([
      "permission",
      "isDevProfile",
      "isProdProfile",
      "systemProfile",
    ]),
  },
  props: {
    type: {
      type: String,
      required: false,
    },
  },
  filters: {
    sname(val, service_items) {
      let _name = val;
      service_items.forEach((item) => {
        if (item.id == val) {
          _name = item.name;
          return _name;
        }
      });
      return _name;
    },
  },
  created() {
    if (this.systemProfile.id == -1) {
      this.$nextTick((_) => {
        this.$router.push("/wel/index");
      });
    } else {
      this.handleServiceList();
      // this.handleList();
      this.initOptions();
    }
  },
  methods: {
    initOptions() {
      if (this.isDevProfile) {
        this.tableOption["menu"] = true;
      } else {
        if (!this.permission.route_update) {
          this.tableOption["menu"] = false;
        }
      }
    },
    toDetail(form) {
      this.form = form;
      this.grade.drawerDetail = true;
    },
    toServiceDetail(form) {
      this.form = form;
      this.grade.drawerServiceDetail = true;
    },
    handleServiceList() {
      findAllService(Object.assign({}, this.form)).then((res) => {
        let data = res.data;
        this.service_items = data.data;
      });
    },
    handleGrade(form, index) {
      if (form && form.id) {
        // this.$refs.targets.handleList(form);
        this.form = form;
      } else {
        this.form = {};
      }
      this.grade.box = true;
    },
    expandChanges(row, expendList) {},
    /**
     * @title 页面改变值
     *
     **/
    handleCurrentChange(val) {
      this.tablePage = val;
      this.refreshTableList(true);
    },
    /**
     * @title 页面条数改变值
     *
     **/
    handleCurrentSize(val) {
      this.tableSize = val;
      this.refreshTableList(false);
    },
    /**
     * @title 获取数据
     * @detail 赋值为tableData表格即可
     *
     **/
    handleList(form) {
      this.tableLoading = true;
      return findAll(Object.assign({}, form)).then((res) => {
        let data = res.data;
        let items = data.data;
        items.forEach((item) => {
          this.service_items.forEach((service_item) => {
            if (item.service.id == service_item.id) {
              item["serviceName"] = service_item.name;
            }
          });
        });
        this.tableLoading = false;
        return items;
      });
    },
    refreshTableList(refresh) {
      this.initPage(refresh);
      this.$refs.routeSearch.refresh(this.page, refresh);
    },
    initPage(refresh) {
      if (!!!refresh) this.tablePage = 1;
      this.page.currentPage = this.tablePage;
      this.page.pageSize = this.tableSize;
    },
    searchChange(data) {
      this.tableData = data.data;
    },
    //再次加载
    reloadDataList() {
      this.initPage(false);
      this.$refs.routeSearch.loadData();
    },
    /**
     * @title 单点行选择行数据
     * @param row
     * @param event
     * @param column
     */
    handleRowClick(row, event, column) {
      if (this.type) {
        this.$emit("selectionData", row);
      }
    },
    /**
     * @title 数据删除
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     *
     **/
    handleDel(row, index) {
      var _message = "";
      this.isProdProfile && (_message = "当前为生产环境，请谨慎操作! ");
      this.$confirm(_message + `是否确认删除?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          routeDel({ id: row.id }).then((res) => {
            let _data = res.data;
            if (_data.status != 0) {
              this.$errorInfo(_data.errmsg);
            } else {
              this.$successInfo("删除成功");
              this.reloadDataList();
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>
