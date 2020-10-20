<template>
  <el-form
    class="login-form"
    status-icon
    :rules="loginRules"
    ref="loginForm"
    :model="loginForm"
    label-width="0"
  >
    <el-form-item prop="username">
      <el-input
        size="small"
        @keyup.enter.native="handleLogin"
        v-model="loginForm.username"
        auto-complete="off"
        ref="userName"
        placeholder="请输入用户名"
      >
        <i slot="prefix" class="icon-yonghu"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        size="small"
        @keyup.enter.native="handleLogin"
        :type="passwordType"
        v-model="loginForm.password"
        auto-complete="off"
        placeholder="请输入密码"
      >
        <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword"></i>
        <i slot="prefix" class="icon-mima"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="code" v-if="codeDisplay">
      <el-row :span="24">
        <el-col :span="16">
          <el-input
            size="small"
            @keyup.enter.native="handleLogin"
            :maxlength="code.len"
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="请输入验证码"
          >
            <i slot="prefix" class="icon-yanzhengma"></i>
          </el-input>
        </el-col>
        <el-col :span="8">
          <div class="login-code">
            <el-button @click="refreshCode" :disabled="btnDisabled">{{btnName}}</el-button>
            <i class="icon-shuaxin login-code-icon" @click="refreshCode"></i>
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <!-- <el-checkbox v-model="checked">记住账号</el-checkbox> -->
    <el-form-item>
      <el-button
        type="primary"
        size="small"
        @click.native.prevent="handleLogin"
        class="login-submit"
      >登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { randomLenNum } from "@/util/util";
import { getErrorTimes, getValidateCode } from "@/api/authorize";
import { mapGetters } from "vuex";
export default {
  name: "userlogin",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
        code: "",
        redomStr: ""
      },
      codeDisplay: false,
      isFirst: true,
      times: 60,
      btnDisabled: false,
      btnName: "获取验证码",
      checked: false,
      code: {
        src: "",
        value: "",
        len: 6,
        type: "text"
      },
      loginRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度最少为6位", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 6, max: 6, message: "验证码长度为6位", trigger: "blur" },
          { required: true, trigger: "blur" }
        ]
      },
      passwordType: "password"
    };
  },
  created() {},
  mounted() {
    this.$nextTick(function() {
      this.$refs.userName.focus();
    });
  },
  computed: {
    ...mapGetters(["tagWel"])
  },
  props: [],
  methods: {
    refreshCode() {
      getValidateCode(this.loginForm).then(res => {
        var _data = res.data;
        var _status = _data.status;
        this.times = 60;
        this.btnDisabled = false;
        if ("1" == _status) {
          this.$message({
            showClose: true,
            message: _data.errmsg,
            type: "error"
          });
        } else {
          let clock = window.setInterval(() => {
            this.times--;
            if (this.times < 0) {
              this.btnName = "获取验证码";
              this.btnDisabled = false;
              window.clearInterval(clock);
            } else {
              this.btnName = this.times + "秒后重新获取";
              this.btnDisabled = true;
            }
          }, 1000);
          this.$message({
            showClose: true,
            message: _data.errmsg,
            type: "success"
          });
        }
      });
    },
    showPassword() {
      this.passwordType == ""
        ? (this.passwordType = "password")
        : (this.passwordType = "");
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store.dispatch("LoginByUsernameDis", this.loginForm).then(
            () => {
              // return
              this.$router.push({ path: this.tagWel.value });
            },
            error => {
              this.$message({
                showClose: true,
                message: error.errmsg,
                type: "error"
              });
            }
          );
        }
      });
    }
  }
};
</script>
