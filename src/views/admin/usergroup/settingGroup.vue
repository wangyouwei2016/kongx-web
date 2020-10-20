<template>
  <div class="avue-data-cardText">
    <div>
      <el-tabs>
        <el-tab-pane>
          <span slot="label">
            <i class="icon-quanxian"></i>
            设置角色
          </span>

          <!-- <el-divider>设置全局角色</el-divider>
          <div class="item" style="margin-top:20px;">
            <setting-role
              :userGroup="userGroup"
              :option="{profiles:profiles,roleList:roleList,data:[]}"
              :mode="mode"
            ></setting-role>
          </div>-->

          <el-alert title="未设置角色的环境，则默认角色为普通用户（可查看网关、服务降级、作业管理、告警记录及审计日志等功能）" type="success" show-icon></el-alert>
          <div style="margin-top:20px;">
            <query-env
              :userGroup="userGroup"
              :option="{envs:envs,roleList:roleList,data:[]}"
              :mode="mode"
            ></query-env>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label">
            <i class="el-icon-user"></i>
            设置用户
          </span>
          <el-form>
            <el-form-item>
              <div class="item" style="margin-top:20px;">
                <setting-user :userGroup="userGroup" :data="userInfos" :mode="mode"></setting-user>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { findEnvs } from "@/api/operating/systemProfile";
import { findAllRoles } from "@/api/admin/role";
import settingUser from "./settingUser";
import settingRole from "./settingRole";
import queryEnv from "./queryEnv";
export default {
  name: "message-template",
  components: { settingUser, settingRole, queryEnv },
  data() {
    return {
      activeNames: [],
      userList: [],
      envs: [],
      roleList: [],
      userInfos: [],
      profiles: []
    };
  },
  computed: {
    data() {
      return this.option.data || [];
    }
  },
  created() {
    this.init();
  },
  props: {
    mode: {},
    userGroup: {}
  },
  methods: {
    init() {
      findEnvs().then(res => {
        this.envs = res.data;
        _.forEach(this.envs, item => {
          _.forEach(item.groups, profile => {
            this.profiles.push(profile);
          });
        });
      });
      findAllRoles().then(res => {
        this.roleList = res.data.data.items;
      });
    },
    handlerClose() {
      this.callback();
    },
    callback() {
      this.$emit("callback", {});
    },
    getUsers() {
      return _.map(this.userList || [], user => {
        return user.userId;
      });
    }
  }
};
</script>