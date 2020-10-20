<template>
  <div>
    <basic-container>
      <el-tabs>
        <el-tab-pane :index="env.label" v-for="env in option.envs" :key="env">
          <span slot="label">
            <i></i>
            {{env.label}}
          </span>
          <el-tabs type="border-card" tab-position="left">
            <el-tab-pane lazy v-for="(profile) in env.groups" :key="profile">
              <span slot="label">{{profile.label}}</span>
              <uphold-env
                :userGroup="userGroup"
                :option="{profiles:[profile],roleList:option.roleList,data:[]}"
                :mode="mode"
              ></uphold-env>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.avue-group__title {
  margin-left: 10px;
}
</style>
<script>
import { mapGetters } from "vuex";
import { findEnvs } from "@/api/operating/systemProfile";
import { clientOption, clientColumn } from "@/const/table/operatingOption.js";
import upholdEnv from "./settingRole";
export default {
  name: "client",
  components: { upholdEnv },
  data() {
    return {};
  },
  created() {},
  watch: {},
  mounted() {},
  computed: {
    ...mapGetters(["permission", "userInfo"])
  },
  props: {
    userGroup: {},
    mode: {},
    option: {}
  },
  methods: {
    findAllEnvs() {}
  }
};
</script>

<style lang="scss" scoped>
.table-container {
  padding: 8px 10px;
}
</style>
