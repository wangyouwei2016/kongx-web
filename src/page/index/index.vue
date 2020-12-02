<template>
  <div class="avue-contail" :class="{ 'avue--collapse': isCollapse }">
    <div class="avue-header">
      <!-- 顶部导航栏 -->
      <top />
    </div>

    <div class="avue-layout">
      <div class="avue-left">
        <!-- 左侧导航栏 -->
        <sidebar />
      </div>
      <div class="avue-main">
        <!-- 顶部标签卡 -->
        <tags />{{ showTag }}
        <!-- 主体视图层 -->
        <el-scrollbar style="height: 100%">
          <keep-alive>
            <router-view class="avue-view" v-if="$route.meta.$keepAlive" />
          </keep-alive>
          <router-view class="avue-view" v-if="!$route.meta.$keepAlive" />
        </el-scrollbar>
        <tools
          :position="position"
          :actions="fabActions"
          main-tooltip="工具箱"
          icon-size="small"
          @cache="cache"
          @computer="computer"
        ></tools>
      </div>
    </div>
    <div class="avue-shade" @click="showCollapse"></div>
    <el-dialog
      title="Kong shell"
      :close-on-click-modal="false"
      :visible.sync="dialogbox"
      width="92%"
      class="shell"
    >
      <shell v-if="dialogbox" @callback="callback"></shell>
      <div slot="title" class="dialog-footer">
        <span><strong>Kong shell</strong></span>
      </div>
    </el-dialog>

    <el-dialog
      title="工作台切换"
      :close-on-click-modal="false"
      :visible.sync="transferbox"
      width="92%"
      class="shell"
    >
      <client-info v-if="transferbox" @callback="callback"></client-info>
      <div slot="title" class="dialog-footer">
        <span><strong>工作台切换</strong></span>
      </div>
    </el-dialog>
  </div>
</template>
<style>
.shell {
  margin-top: -8vh !important;
}
</style>
<script>
import { mapGetters } from "vuex";
import tags from "./tags";
import top from "./top/";
import shell from "./shell";
import sidebar from "./sidebar/";
import admin from "@/util/admin";
import tools from "@/components/tools/";
import { validatenull } from "@/util/validate";
import { calcDate } from "@/util/date.js";
import { getStore } from "@/util/store.js";
import Shell from "./shell.vue";
import topSetting from "./top/top-setting";
import clientInfo from "../client-info";
export default {
  components: {
    top,
    tags,
    sidebar,
    tools,
    shell,
    clientInfo,
    topSetting,
  },
  name: "index",
  data() {
    return {
      dialogbox: false,
      transferbox: false,
      //刷新token锁
      refreshLock: false,
      //刷新token的时间
      refreshTime: "",
      position: "bottom-right",
      fabActions: [
        {
          name: "cache",
          icon: "cached",
          tooltip: "切换工作台",
        },
        {
          name: "computer",
          icon: "computer",
          tooltip: "Kong Shell",
        },
      ],
    };
  },
  created() {
    //实时检测刷新token
    // this.refreshToken();
  },
  mounted() {
    this.init();
  },
  computed: mapGetters(["isLock", "isCollapse", "website", "kongClient"]),
  props: [],
  methods: {
    callback() {
      this.dialogbox = false;
      this.transferbox = false;
    },
    showCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
    // 屏幕检测
    init() {
      this.$store.commit("SET_SCREEN", admin.getScreen());
      window.onresize = () => {
        setTimeout(() => {
          this.$store.commit("SET_SCREEN", admin.getScreen());
        }, 0);
      };
    },
    cache() {
      this.transferbox = true;
    },
    computer() {
      this.dialogbox = true;
      // alert("Clicked on alert icon");
    },
    // 实时检测刷新token
    refreshToken() {
      this.refreshTime = setInterval(() => {
        const token = getStore({
          name: "token",
          debug: true,
        });
        const date = calcDate(token.datetime, new Date().getTime());
        if (validatenull(date)) return;
        if (!(date.seconds >= this.website.tokenTime) && !this.refreshLock) {
          this.refreshLock = true;
          this.$store
            .dispatch("RefeshToken")
            .then(() => {
              clearInterval(this.refreshTime);
            })
            .catch(() => {
              this.refreshLock = false;
            });
        }
      }, 3000);
    },
  },
};
</script>