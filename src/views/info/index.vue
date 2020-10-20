<template>
  <div>
    <basic-container>
      <avue-tabs :option="option" v-model="form" @change="handleChange" @submit="handleSubmit"></avue-tabs>
    </basic-container>
  </div>
</template>

<script>
import option from "@/const/info/form";
import { mapGetters } from "vuex";
import { updateUser, modifypwd } from "@/api/admin/user";
import { encryption } from "@/util/util";
export default {
  data() {
    return {
      type: "info",
      option: option,
      form: {},
    };
  },
  created() {
    this.handleWitch();
  },
  computed: {
    ...mapGetters(["permission", "userInfo"]),
  },
  methods: {
    handleSubmit() {
      if (this.type == "info") {
        this.handleEntityUpdate();
      }
      if (this.type == "password") {
        this.handlerModifyPwd();
      }
    },
    handlerModifyPwd() {
      const user = encryption({
        data: this.form,
        type: "Base64",
        key: "avue",
        param: ["oldpassword", "newpassword"],
      });

      modifypwd({
        userId: this.userInfo.userId,
        oldpassword: user.oldpassword,
        newpassword: user.newpassword,
      }).then((res) => {
        let _data = res.data;
        if (_data.status != 0) {
          this.$message.error(_data.errmsg);
        } else {
          this.$message.success("修改成功，退出后重新登录");
          this.$store.dispatch("LogOut").then(() => {
            this.$router.push({ path: "/login" });
          });
        }
      });
    },
    handleEntityUpdate() {
      updateUser(this.form)
        .then((res) => {
          let _data = res.data;
          if (_data.status != 0) {
            this.$message.error(_data.errmsg);
          } else {
            this.$store.dispatch("GetUserInfo").then(() => {});
            this.$message.success("修改成功");
          }
        })
        .catch((error) => {
          this.$message.error("更新失败");
        });
    },
    handleWitch() {
      if (this.type === "info") {
        this.form = _.cloneDeep(this.userInfo);
      } else if (this.type === "password") {
        this.form = _.cloneDeep({});
      }
    },
    handleChange(item) {
      this.type = item.prop;
      this.handleWitch();
    },
  },
};
</script>
<style>
</style>
