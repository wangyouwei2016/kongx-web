<template>
  <div>
    <el-divider></el-divider>
    <span>
      <el-button
        v-if="mode=='add'&&permission.role_config"
        type="primary"
        @click="handleGradeUpdate"
        size="small"
        class="el-icon-refresh"
      >修改角色权限</el-button>
    </span>
    <el-tree
      :data="menuAll"
      show-checkbox
      highlight-current
      :props="menuOption"
      default-expand-all
      accordion
      node-key="id"
      :default-expanded-keys="[-1]"
      ref="menuTree"
      @check-change="handleGradeCheckChange"
    ></el-tree>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { menuOption } from "@/const/admin/adminTabelOption.js";
import { findAllMenuByRole } from "@/api/admin/menu";
import { updateRoleMenu, findMenuByRoleId } from "@/api/admin/role";
export default {
  name: "menu",
  data() {
    return {
      filterText: "",
      menuAll: [],
      menuOption: menuOption
    };
  },
  props: {
    systemRole: {},
    mode: {}
  },
  created() {
    // this.$store.dispatch("GetMenuAll").then(() => {});
    this.loadAllMenu();
  },
  computed: {
    ...mapGetters(["permission"])
  },
  methods: {
    loadAllMenu: function() {
      findAllMenuByRole()
        .then(res => {
          var data = res.data;
          this.menuAll = data.data;
          return {};
        })
        .then(() => {
          findMenuByRoleId(this.systemRole).then(res => {
            let data = res.data;
            this.$refs.menuTree.setCheckedKeys(data.data, false);
          });
        });
    },
    handleGradeUpdate() {
      var checkList = this.$refs.menuTree.getCheckedNodes();
      var halfCheckedList = this.$refs.menuTree.getHalfCheckedNodes();
      updateRoleMenu({
        systemRole: this.systemRole,
        items: checkList,
        halfItems: halfCheckedList
      }).then(res => {
        if (res.data.status != 0) {
          this.$successInfo(res.data.errmsg);
        } else {
          this.$successInfo("更新成功");
        }
      });
    }
  }
};
</script>