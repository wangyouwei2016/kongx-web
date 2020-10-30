<template>
  <div>
    <basic-container>
      <el-tabs>
        <el-tab-pane>
          <span slot="label">
            <i class="icon-canshu"></i>
            全部参数
          </span>
          <avue-crud
            :option="tableOption"
            :data="tableData"
            :table-loading="tableLoading"
            ref="crud"
            @refresh-change="handlerefreshChange"
          >
            <template slot-scope="scope" slot="menuLeft">
              <el-button
                v-if="permission.params_add"
                icon="el-icon-plus"
                size="small"
                @click="toEditClient(scope.row, scope.$index)"
                type="primary"
                >新 增</el-button
              >
            </template>
            <template slot-scope="scope" slot="menu">
              <el-button
                v-if="permission.params_update"
                icon="el-icon-edit"
                size="small"
                @click="toEditClient(scope.row, scope.$index)"
                type="primary"
                plain
                >编辑</el-button
              >
            </template>
            <template slot="expand" slot-scope="{ row }">
              <json-viewer :value="row.configValue"></json-viewer>
            </template>
          </avue-crud>
        </el-tab-pane>
        <el-tab-pane :index="env.label" v-for="env in configTypes" :key="env">
          <span slot="label">
            <i class="icon-canshu"></i>
            {{ env.label }}
          </span>
          <avue-crud
            :option="tableOption"
            :data="env.data"
            :table-loading="tableLoading"
            ref="crud"
            @refresh-change="handlerefreshChange"
          >
            <template slot-scope="scope" slot="menuLeft">
              <el-button
                v-if="permission.params_add"
                icon="el-icon-plus"
                size="small"
                @click="toEditClient(scope.row, scope.$index)"
                type="primary"
                >新 增</el-button
              >
            </template>
            <template slot-scope="scope" slot="menu">
              <el-button
                v-if="permission.params_update"
                icon="el-icon-edit"
                size="small"
                @click="toEditClient(scope.row, scope.$index)"
                type="primary"
                plain
                >编辑</el-button
              >
            </template>
            <template slot="expand" slot-scope="{ row }">
              <json-viewer :value="row.configValue" v-if="row.configType != 'kongschemas'"></json-viewer>
              <json-viewer
                :value="JSON.parse(row.configValue)"
                :expand-depth="5"
                copyable
                sort
                v-if="row.configType == 'kongschemas'"
              ></json-viewer>
            </template>
          </avue-crud>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
    <el-dialog
      title="系统参数"
      width="70%"
      :visible.sync="grade.box"
      v-if="grade.box"
    >
      <avue-form
        :option="configColumn"
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
  addServerConfig,
  updateServerConfig,
  findConfigTypes,
} from "@/api/operating/serverConfig";
import { configOption, configColumn } from "@/const/table/operatingOption.js";
export default {
  name: "serverConfig",
  comments: {},
  data() {
    return {
      tableOption: configOption, //表格设置属性
      configColumn: configColumn, //表格设置属性
      tableData: [], //表格的数据
      tableLoading: false,
      clientForm: {},
      configTypes: [],
      grade: {
        box: false,
      },
    };
  },
  created() {
    this.handleList();
    this.initOptions();
    //初始化数据格式
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission"]),
  },
  methods: {
    initOptions() {
      if (!this.permission.params_update) {
        this.tableOption["menu"] = false;
      }
    },
    findConfigType() {
      findConfigTypes().then((res) => {
        const data = res.data;
        this.configTypes = data;
        this.initConfigData();
      });
    },
    initConfigData() {
      _.forEach(this.configTypes, (type) => {
        let _datas = [];
        _.forEach(this.tableData, (item) => {
          if (item.configType == type.value) {
            _datas.push(item);
          }
        });
        type["data"] = _datas;
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
        const data = res.data;
        this.tableData = data.data;
        this.tableLoading = false;
        this.findConfigType();
      });
    },
    handleClient(row, done) {
      if (this.clientForm && this.clientForm.id) {
        updateServerConfig(this.clientForm).then((res) => {
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
        addServerConfig(this.clientForm).then((res) => {
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
  },
};
</script>
