<template>
  <div>
    <el-divider></el-divider>
    <avue-form :option="formColumns" v-model="upholdEntity" ref="form" @submit="handleEntity">
      <template slot="menuForm" v-if="mode!='view'">
        <el-button type="primary" class="el-icon-check" @click="handlerSubmit">提 交</el-button>
      </template>
    </avue-form>
  </div>
</template>
<script>
import { userColumn } from "@/const/admin/adminTabelOption";
import { saveUser, updateUser } from "@/api/admin/user";
import ItemTags from "@/components/ItemTags";
export default {
  name: "UpholdUser",
  components: { ItemTags },
  data() {
    return {
      formColumns: userColumn,
      upholdEntity: this.entity,
    };
  },
  props: {
    entity: { type: Object, required: false },
    mode: {
      required: false,
    },
  },
  created() {
    this.initOptions();
  },
  methods: {
    bindTags(data) {
      this.upholdEntity = Object.assign(this.upholdEntity, data);
    },
    initOptions() {
      this.formColumns.column.forEach((column) => {
        column["disabled"] = this.mode == "view";
      });
    },
    handlerSubmit() {
      this.$refs.form.submit();
    },
    handleEntity(row, done) {
      if (this.mode == "edit") {
        this.handleEntityUpdate(row, done);
      }
      if (this.mode == "add") {
        this.handleEntitySave(row, done);
      }
    },
    handleEntityUpdate(row, done) {
      updateUser(this.upholdEntity)
        .then((res) => {
          let _data = res.data;
          if (_data.status != 0) {
            this.$message.error(_data.errmsg);
          } else {
            this.$message.success("修改成功");
            this.callback();
          }
          done();
        })
        .catch((error) => {
          this.$message.error("更新失败");
          done();
        });
    },

    handleEntitySave(row, done) {
      saveUser(this.upholdEntity)
        .then((res) => {
          let _data = res.data;
          if (_data.status != 0) {
            this.$message.error(_data.errmsg);
          } else {
            this.$message.success("新增成功");
            this.callback();
          }
          done();
        })
        .catch((error) => {
          this.$message.error("新增失败,错误信息：" + error);
          done();
        });
    },
    callback() {
      this.$emit("callback", {});
    },
  },
};
</script>
