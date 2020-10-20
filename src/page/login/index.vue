

<template>
  <div class="login-container">
    <div class="login-weaper animated bounceInDown">
      <div>
        <img class="img" src="/svg/logo.png" alt />
      </div>
      <p class="login-tip">Kongx-网关kong服务管理平台-v1.2.x</p>
      <div class="login-border">
        <div class="login-main">
          <userLogin v-if="activeName === 'user'"></userLogin>
        </div>
      </div>
      <div class="login-copyright">
        Copyright © 2020 raoxiaoyan. All rights reserved.
      </div>
    </div>
  </div>
</template>

<script>
import "@/styles/login.scss";
import userLogin from "./userlogin";
import topColor from "../index/top/top-color";
import color from "@/mixins/color";
import { mapGetters } from "vuex";
import { validatenull } from "@/util/validate";
export default {
  name: "login",
  mixins: [color()],
  components: {
    topColor,
    userLogin,
  },
  data() {
    return {
      activeName: "user",
    };
  },
  watch: {
    $route() {
      const params = this.$route.query;
      this.socialForm.state = params.state;
      this.socialForm.code = params.code;
      if (!validatenull(this.socialForm.state)) {
        const loading = this.$loading({
          lock: true,
          text: `${
            this.socialForm.state === "WX" ? "微信" : "QQ"
          }登录中,请稍后。。。`,
          spinner: "el-icon-loading",
        });
        setTimeout(() => {
          loading.close();
        }, 2000);
      }
    },
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["website"]),
  },
  props: [],
  methods: {},
};
</script>
