<template>
  <div class="top-menu">
    <el-menu :default-active="activeIndex" mode="horizontal" text-color="#333">
      <template v-for="(item,index) in items">
        <el-menu-item :index="item.parentId+''" @click.native="openMenu(item)" :key="index">
          <template slot="title">
            <i :class="item.icon"></i>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "top-menu",
  data() {
    return {
      activeIndex: "0",
      items: [
        {
          label: "首页",
          href: "/wel/index",
          icon: "el-icon-menu",
          parentId: 0
        }
      ]
    };
  },
  created() {},
  computed: {
    ...mapGetters(["tagCurrent", "menu", "userInfo"])
  },
  methods: {
    openMenu(item) {
      this.$store.dispatch("GetMenu", item.parentId).then(data => {
        if (data.length === 0) return;
        console.log("top-menu.vue data:", data);
        this.$router.$avueRouter.formatRoutes(data, true);
        let itemActive,
          childItemActive = 0;
        if (item.href) {
          itemActive = item;
        } else {
          if (this.menu[childItemActive].length == 0) {
            itemActive = this.menu[childItemActive];
          } else {
            itemActive = this.menu[childItemActive].children[childItemActive];
          }
        }
        this.$router.push({
          path: this.$router.$avueRouter.getPath({
            name: itemActive.label,
            src: itemActive.href
          })
        });
      });
    }
  }
};
</script>