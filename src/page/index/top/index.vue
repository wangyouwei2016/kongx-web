<template>
  <div class="avue-top">
    <div class="top-bar__left">
      <div class="avue-breadcrumb">
        <i
          class="icon-navicon avue-breadcrumb_collapse"
          :class="[{ 'avue-breadcrumb_collapse--right': isCollapse }]"
          @click="setCollapse"
        ></i>
      </div>
    </div>
    <h1 class="top-bar__title">
      <div class="top-bar__item top-bar__item--show">
        <top-menu></top-menu>
      </div>
      <span class="top-bar__item">
        <top-search></top-search>
      </span>
    </h1>

    <div class="top-bar__right">
      <!-- <el-tooltip effect="dark" v-if="showColor" content="主题色" placement="bottom">
        <div class="top-bar__item">
          <top-color></top-color>
        </div>
      </el-tooltip> -->
      <!-- <el-tooltip effect="dark" :content="logsFlag?'没有错误日志':`${logsLen}条错误日志`" placement="bottom">
        <div class="top-bar__item">
          <top-logs></top-logs>
        </div>
      </el-tooltip>-->
      <!-- <el-tooltip
        effect="dark"
        content="锁屏"
        placement="bottom"
        v-if="showLock"
      >
        <div class="top-bar__item">
          <top-lock></top-lock>
        </div>
      </el-tooltip> -->
      <!-- <el-tooltip
        effect="dark"
        content="特色主题"
        placement="bottom"
        v-if="showTheme"
      >
        <div class="top-bar__item top-bar__item--show">
          <top-theme></top-theme>
        </div>
      </el-tooltip> -->
      <div class="top-bar__item">
        <span style="cursor: pointer">
          <font size="2"
            >工作台：{{ kongClient.name }}/{{ kongClient.version }}, 切换</font
          >
          <i class="el-icon-arrow-right el-icon--right"></i>
        </span>
        <transfer-client :activeClient="kongClient"></transfer-client>
      </div>
      <el-tooltip
        effect="dark"
        :content="isFullScren ? '退出全屏' : '全屏'"
        placement="bottom"
        v-if="showFullScren"
      >
        <div class="top-bar__item">
          <i
            :class="isFullScren ? 'icon-tuichuquanping' : 'icon-quanping'"
            @click="handleScreen"
          ></i>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="用户头像" placement="bottom">
        <img class="top-bar__img" :src="userInfo.avatar" />
      </el-tooltip>

      <el-dropdown>
        <span class="el-dropdown-link" style="cursor: pointer">
          {{ userInfo.name }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/">首页</router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/info">个人信息</router-link>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout" divided
            >退出系统</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <el-tooltip effect="dark" content="系统设置" placement="bottom">
        <top-setting></top-setting>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { fullscreenToggel, listenfullscreen } from "@/util/util";
import topLock from "./top-lock";
import topMenu from "./top-menu";
import topSearch from "./top-search";
import topBreadcrumb from "./top-breadcrumb";
import topColor from "./top-color";
import topTheme from "./top-theme";
import topLogs from "./top-logs";
import topSetting from "./top-setting";
import topMsg from "./top-msg";
import transferClient from "./transfer-client";
export default {
  components: {
    topLock,
    topMenu,
    topSearch,
    topBreadcrumb,
    topColor,
    topTheme,
    topLogs,
    topSetting,
    topMsg,
    transferClient,
  },
  name: "top",
  data() {
    return {};
  },
  filters: {},
  created() {},
  mounted() {
    listenfullscreen(this.setScreen);
  },
  computed: {
    ...mapState({
      showDebug: (state) => state.common.showDebug,
      showColor: (state) => state.common.showColor,
      showTheme: (state) => state.common.showTheme,
      showLock: (state) => state.common.showLock,
      showFullScren: (state) => state.common.showFullScren,
      showCollapse: (state) => state.common.showCollapse,
      showSearch: (state) => state.common.showSearch,
      showMenu: (state) => state.common.showMenu,
    }),
    ...mapGetters([
      "userInfo",
      "isFullScren",
      "tagWel",
      "tagList",
      "isCollapse",
      "tag",
      "logsLen",
      "logsFlag",
      "kongClient",
    ]),
  },
  methods: {
    handleScreen() {
      fullscreenToggel();
    },
    setCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
    setScreen() {
      this.$store.commit("SET_FULLSCREN");
    },
    logout() {
      this.$confirm("是否退出系统, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          this.$router.push({ path: "/login" });
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

