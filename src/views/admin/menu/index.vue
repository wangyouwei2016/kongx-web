<template>
  <basic-container>
    <el-container>
      <el-aside width="300px">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        <el-tree
          :data="menuAll"
          :props="menuOption"
          node-key="id"
          accordion
          highlight-current
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
          :default-expanded-keys="keys"
          :filter-node-method="filterNode"
          ref="menuTree"
        ></el-tree>
      </el-aside>
      <el-main>
        <uphold-menu
          :systemFunction="systemFunction"
          :mode="mode"
          @callback="loadAllMenu"
          v-if="systemFunction.menuType=='menu'"
        ></uphold-menu>
        <uphold-child-menu
          :systemFunction="systemFunction"
          mode="edit"
          :options="functionPointColumn"
          v-if="systemFunction.menuType=='point'"
          @callback="loadAllMenu"
        ></uphold-child-menu>
      </el-main>
    </el-container>
  </basic-container>
</template>
<script>
import { mapGetters } from "vuex";
import { findAllMenu } from "@/api/admin/menu";
import { validatenull } from "@/util/validate";
import {
  menuOption,
  functionPointColumn
} from "@/const/admin/adminTabelOption.js";
import { DIC } from "@/const/dic";
import upholdMenu from "./upholdMenu";
import upholdChildMenu from "./upholdChildMenu";
export default {
  name: "menu",
  components: { upholdMenu, upholdChildMenu },
  data() {
    return {
      filterText: "",
      functionPointColumn: functionPointColumn,
      menuAll: [],
      obj: {},
      keys: [-1],
      systemFunction: {
        parentId: -1,
        useYn: "y",
        sortOrder: 999,
        menuType: "menu"
      },
      menuOption: menuOption,
      USERTYPE: DIC.USERTYPE,
      mode: "add"
    };
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    }
  },
  created() {
    // this.$store.dispatch("GetMenuAll").then(() => {});
    this.loadAllMenu();
  },

  mounted() {},
  computed: {
    ...mapGetters(["permission"])
  },
  methods: {
    loadAllMenu: function() {
      findAllMenu().then(res => {
        var data = res.data;
        this.form = {};
        this.formStatus = "";
        this.menuAll = data.data;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      this.currentType = data.type;
      this.mode = "edit";
      this.systemFunction = { parentId: -1, useYn: "y" };
      this.systemFunction = _.assign({}, data);
      this.keys = [this.systemFunction.id];
    }
  }
};
</script>

<style lang="scss" scoped>
.menu-container {
  padding: 0 20px;
}
.menu-header {
  padding: 8px 0;
}
</style>
m