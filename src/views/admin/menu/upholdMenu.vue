<template>
  <div>
    <el-row style="margin-bottom: 5px;margin-left:25px;margin-right:5px;">
      <el-col span="12">
        <el-button-group>
          <el-button
            v-if="permission.menu_add"
            size="small"
            icon="el-icon-plus"
            type="primary"
            @click="toAddChildMenu(-1,'新建一级菜单','menu')"
          >新建一级菜单</el-button>
          <el-button
            size="small"
            icon="el-icon-plus"
            type="primary"
            v-if="systemFunction.id&&systemFunction.menuType=='menu'&&permission.menu_add"
            @click="toAddChildMenu(systemFunction.id,'新建\''+systemFunction.name+'\'子菜单','menu')"
          >新建子菜单</el-button>
          <el-button
            size="small"
            icon="el-icon-plus"
            type="success"
            v-if="systemFunction.id&&systemFunction.menuType=='menu'&&permission.menu_add"
            @click="toAddChildMenu(systemFunction.id,'新建\''+systemFunction.name+'\'功能点','point')"
          >新建功能点</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <avue-form
      :option="formColumns"
      v-model="systemFunction"
      ref="form"
      @submit="handleUpholdEntity"
    >
      <template slot="visitView">
        <el-form-item>
          <el-input v-model="systemFunction.visitView" placeholder="例如：views/admin/user/index"></el-input>
        </el-form-item>
      </template>
      <template slot="useYn">
        <el-form-item>
          <el-switch
            v-model="systemFunction.useYn"
            :disabled="formGrade"
            active-color="#13ce66"
            inactive-color="#ff4949"
            value="systemFunction.useYn"
            :active-value="'y'"
            :inactive-value="'n'"
          ></el-switch>
        </el-form-item>
      </template>
      <template slot="sortOrder">
        <el-form-item>
          <el-input-number v-model="systemFunction.sortOrder" :min="1" :disabled="formGrade"></el-input-number>
        </el-form-item>
      </template>
      <template slot="menuForm" v-if="mode!='view'">
        <el-button
          v-if="permission.menu_update"
          type="primary"
          class="el-icon-check"
          @click="handlerSubmit"
        >保 存</el-button>
      </template>
    </avue-form>
    <el-drawer :title="tipTitle" size="50%" :visible.sync="childMenuBox" v-if="childMenuBox">
      <div style="margin-left:10px;overflow-y:auto; overflow-x:auto;height:90%;">
        <uphold-child-menu
          :systemFunction="{parentId:parentId,useYn:'y',sortOrder:999,menuType:menuType}"
          mode="add"
          :options="childOptions"
          @callback="callback"
        ></uphold-child-menu>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  functionColumn,
  functionPointColumn
} from "@/const/admin/adminTabelOption";
import { addSystemFunction, updateSystemFunction } from "@/api/admin/menu";
import upholdChildMenu from "./upholdChildMenu";
export default {
  name: "Route",
  components: { upholdChildMenu },
  data() {
    return {
      formColumns: functionColumn,
      childOptions: functionColumn,
      tipTitle: "新建子菜单",
      parentId: "-1",
      menuType: "menu",
      childMenuBox: false
    };
  },
  props: {
    systemFunction: { type: Object, required: false },
    mode: {
      required: false
    }
  },
  created() {
    this.initOptions();
  },
  computed: {
    ...mapGetters(["permission"])
  },
  methods: {
    initOptions() {
      this.formColumns.column.forEach(column => {
        column["disabled"] = this.mode == "view";
      });
    },
    toAddChildMenu(parentId, tipTitle, menuType) {
      this.parentId = parentId;
      this.mode = "add";
      this.menuType = menuType;
      this.childOptions =
        this.menuType == "menu" ? functionColumn : functionPointColumn;
      this.tipTitle = tipTitle;
      this.childMenuBox = true;
    },
    handlerSubmit() {
      this.$refs.form.submit();
    },
    handleUpholdEntity(row, done) {
      if (this.mode == "edit") {
        this.handleUpholdEntityUpdate(row, done);
      }
      if (this.mode == "add") {
        this.handleUpholdEntitySave(row, done);
      }
    },
    handleUpholdEntityUpdate(row, done) {
      updateSystemFunction(this.systemFunction)
        .then(res => {
          let _data = res.data;
          if (_data.status != 0) {
            this.$errorInfo(_data.errmsg);
          } else {
            this.$successInfo("修改成功");
            this.callback();
          }
          done();
        })
        .catch(error => {
          this.$errorInfo("更新失败");
          done();
        });
    },

    handleUpholdEntitySave(row, done) {
      addSystemFunction(this.systemFunction)
        .then(res => {
          let _data = res.data;
          if (_data.status != 0) {
            this.$errorInfo(_data.errmsg);
          } else {
            this.$successInfo("新增成功");
            this.callback();
          }
          done();
        })
        .catch(error => {
          // this.$errorInfo(error);
          this.$errorInfo("新增失败,错误信息：" + error);
          done();
        });
    },
    callback() {
      this.childMenuBox = false;
      this.$emit("callback", {});
    }
  }
};
</script>
