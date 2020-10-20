<template>
  <div>
    <avue-form
      :option="envColumn"
      v-model="client"
      @submit="handleClient"
    ></avue-form>
  </div>
</template>
<script>
import { envColumn } from "@/const/table/operatingOption.js";
import {
  findClientByProfile,
  addClient,
  updateClient,
  probingClient,
} from "@/api/operating/systemProfile";
export default {
  name: "upholdEnv",
  components: {},
  data() {
    return {
      envColumn: envColumn, //表格设置属性
    };
  },
  props: { client: { type: Object, required: true } },
  created() {
    this.findByProfile();
  },
  methods: {
    findByProfile() {
      findClientByProfile(this.client.profileCode).then((res) => {
        this.client = res.data.data;
      });
    },
    handleClient(row, done) {
      probingClient(this.client).then((res) => {
        const _data = res.data;
        if (_data.status == 0) {
          let version = _data.data;
          this.client["version"] = version;
          if (this.client && this.client.id) {
            updateClient(this.client).then((res) => {
              const _data = res.data;
              if (_data.status == 0) {
                this.$successInfo("更新成功");
                this.handleList();
                this.grade.box = false;
              } else {
                this.$errorInfo("更新失败");
              }
            });
          } else {
            addClient(this.client).then((res) => {
              const _data = res.data;
              if (_data.status == 0) {
                this.$successInfo("更新成功");
                this.handleList();
                this.grade.box = false;
              } else {
                this.$errorInfo("更新失败");
              }
            });
          }
        } else {
          this.$errorInfo(res.data.errmsg);
        }
        done();
      });
    },
  },
};
</script>