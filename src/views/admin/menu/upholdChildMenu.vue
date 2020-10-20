<template>
  <div>
    <avue-form :option="options" v-model="systemFunction" ref="form" @submit="handleUpholdEntity">
      <template slot="visitView">
        <el-form-item>
          <el-input v-model="systemFunction.visitView" placeholder="例如：views/admin/user/index"></el-input>
        </el-form-item>
      </template>
      <template slot="useYn">
        <el-form-item>
          <el-switch
            v-model="systemFunction.useYn"
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
          <el-input-number v-model="systemFunction.sortOrder" :min="1"></el-input-number>
        </el-form-item>
      </template>
      <template slot="menuForm" v-if="mode!='view'">
        <el-button
          v-if="permission.menu_update"
          type="primary"
          class="el-icon-check"
          @click="handlerSubmit"
        >提 交</el-button>
      </template>
    </avue-form>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { functionColumn } from "@/const/admin/adminTabelOption";
import { addSystemFunction, updateSystemFunction } from "@/api/admin/menu";
export default {
  name: "Route",
  data() {
    return {
      formColumns: functionColumn,
      parentId: "-1",
      childMenuBox: false
    };
  },
  props: {
    systemFunction: { type: Object, required: false },
    mode: {
      required: false
    },
    options: {}
  },
  created() {
    this.initOptions();
  },
  computed: {
    ...mapGetters(["permission"])
  },
  methods: {
    initOptions() {
      this.options.column.forEach(column => {
        column["disabled"] = this.mode == "view";
      });
    },
    toAddChildMenu(parentId) {
      this.parentId = parentId;
      this.mode = "add";
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
      this.$emit("callback", {});
    }
  }
};
</script>
