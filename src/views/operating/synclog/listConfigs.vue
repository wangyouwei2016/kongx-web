<template>
  <div>
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
    >
      <template slot-scope="{ row }" slot="create_at">
        {{ new Date(row.create_at) | dateFormat }}
      </template>
      <template slot="expand" slot-scope="{ row }">
        <el-table :data="expandTableData" style="width: 100%">
          <el-table-column label="目标环境列表">
            <template slot-scope="scope">
              <span style="margin-left: 10px">
                <el-tag
                  v-for="tag in row.clients"
                  :key="tag"
                  :disable-transitions="false"
                  @close="handleClose(tag)"
                  >{{ tag.profile }}({{ tag.url }})</el-tag
                >
              </span>
            </template>
          </el-table-column>
          <el-table-column label="同步对象列表">
            <item-tags
              :tags="row.services"
              v-if="logType == 0"
              column="name"
              mode="view"
            ></item-tags>
            <item-tags
              :tags="row.services"
              v-if="logType == 1"
              column="paramKey"
              mode="view"
            ></item-tags>
          </el-table-column>
        </el-table>
        <el-table :data="expandTableData" style="width: 100%">
          <el-table-column label="同步日志" v-if="logType == 0">
            <sync-logs :syncConfig="row"></sync-logs>
          </el-table-column>
        </el-table>
      </template>
      <template slot="src_client" slot-scope="{ row }">
        <el-link
          :underline="false"
          type="success"
          v-if="row.status == 'success'"
          @click="handlesyncLog(row)"
          >{{ row.src_client && row.src_client.url }}</el-link
        >
        <el-link
          :underline="false"
          type="warning"
          v-if="row.status == 'running'"
          @click="handlesyncLog(row)"
          >{{ row.src_client && row.src_client.url }}</el-link
        >
        <el-link
          :underline="false"
          type="danger"
          v-if="row.status == 'failure'"
          @click="handlesyncLog(row)"
          >{{ row.src_client && row.src_client.url }}</el-link
        >
      </template>
      <template slot="clients" slot-scope="{ row }">
        <item-tags :tags="row.clients" column="profile" mode="view"></item-tags>
      </template>
      <template slot="services" slot-scope="{ row }">
        <item-tags
          :tags="row.services"
          v-if="logType == 0"
          column="name"
          mode="view"
        ></item-tags>
        <item-tags
          :tags="row.services"
          v-if="logType == 1"
          column="paramKey"
          mode="view"
        ></item-tags>
      </template>
    </avue-crud>
    <el-drawer
      title="同步日志"
      size="45%"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
    >
      <div style="overflow-y: auto; height: 90%">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in logData"
            :key="index"
            :size="index == 0 ? 'large' : 'normal'"
            :color="activity.status == 'success' ? '#0bbd87' : 'red'"
            :timestamp="activity.create_at | parseTime"
            >{{ index + 1 }}. {{ activity.comment }}</el-timeline-item
          >
        </el-timeline>
        <json-viewer
          :value="currnetSyncConfig"
          :expand-depth="5"
          copyable
          sort
        ></json-viewer>
      </div>
    </el-drawer>
  </div>
</template>
<style>
.el-timeline {
  padding-left: 10px;
}
</style>
<script>
import { syncConfigOption, logOption } from "@/const/table/operatingOption";
import { findAllByPage, findAllSyncLog } from "@/api/operating/syncConfig";
import ItemTags from "@/components/ItemTags";
import syncLogs from "./syncLogs";
export default {
  name: "syncLog",
  components: { ItemTags, syncLogs },
  data() {
    return {
      objData: {},
      tableSearch: {},
      tableOption: syncConfigOption, //表格设置属性
      logOption: logOption, //表格设置属性
      tableData: [], //表格的数据
      expandTableData: [{}],
      currnetSyncConfig: {},
      logData: [], //表格的数据
      tablePage: 1,
      tableSize: 10,
      tableLoading: false,
      options: [],
      page: {
        total: 0, //总页数
        currentPage: 1, //当前页数
        pageSize: 10, //每页显示多少条
      },
      drawer: false,
    };
  },
  created() {
    this.handleList();
  },
  props: {
    logType: { required: true },
  },
  methods: {
    handlesyncLog(row) {
      this.drawer = true;
      this.currnetSyncConfig = row;
      findAllSyncLog(row.syncNo).then((res) => {
        this.logData = res.data.data;
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
    /**
     * @title 获取数据
     * @detail 赋值为tableData表格即可
     *
     **/
    handleList(form) {
      this.tableLoading = true;
      findAllByPage(
        Object.assign({}, form, {
          start: this.tablePage,
          limit: this.tableSize,
          logType: this.logType,
        })
      ).then((res) => {
        let data = res.data.data;
        this.tableData = data.items;
        console.log(data);
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
