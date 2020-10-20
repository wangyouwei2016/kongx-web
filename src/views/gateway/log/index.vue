<template>
  <basic-container style>
    <el-row :gutter="20">
      <el-col>
        <div style="margin-left: 12px">
          <el-row :gutter="20">
            <el-row>
              <el-col>
                <el-alert
                  span="20"
                  type="info"
                  show-icon
                  effect="dark"
                  description="日志控制台方便查看网关运行的访问日志，灵活性高，可查询日志：access.log,error.log,kong.jlog等"
                ></el-alert>
              </el-col>
            </el-row>
            <iframe
              :src="kongClient.url.replace('8001', '8900/log')"
              scrolling="yes"
              frameborder="0"
              style="width: 100%; height: 700px"
            ></iframe>
          </el-row>
        </div>
      </el-col>

      <!-- <el-col>
        <div style="margin-left: 12px;margin-right: 12px;">
          <el-row :gutter="20">
            <el-row :gutter="20">
              <el-col>
                <el-alert
                  :title="kongClient.profile+' 环境网关访问日志'"
                  type="info"
                  show-icon
                  effect="dark"
                  description="此处查询是网关的访问日志，即：tail -f access.log"
                ></el-alert>
              </el-col>
            </el-row>
            <iframe
              :src="kongClient.url.replace('8001','8900/access')"
              scrolling="yes"
              frameborder="0"
              style="width:100%;height:700px;"
            ></iframe>
          </el-row>
        </div>
      </el-col> -->
    </el-row>
  </basic-container>
</template>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
<script>
import { mapGetters } from "vuex";
export default {
  name: "kongshell",
  data() {
    return {
      envs: [],
    };
  },
  created() {},
  watch: {},
  mounted() {},
  computed: {
    ...mapGetters(["permission", "userInfo", "kongClient"]),
  },
  props: [],
  methods: {},
};
</script>

<style lang="scss" scoped>
.table-container {
  padding: 8px 10px;
}
</style>
