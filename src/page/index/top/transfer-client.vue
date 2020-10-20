<template>
  <el-popover placement="top-end" width="500" trigger="hover">
    <avue-crud :data="tableData" :option="option">
      <template slot="id" slot-scope="{ row }">
        <el-button
          v-if="activeClient && activeClient.id != row.id"
          type="info"
          size="mini"
          @click="handActiveClient(row)"
          plain
          >激活</el-button
        >
        <el-button
          v-if="activeClient && activeClient.id == row.id"
          type="success"
          size="mini"
          @click="handActiveClient(row)"
          tips="点击可重新激活"
          >已激活</el-button
        >
      </template>
    </avue-crud>
    <div style="fixed: right">
      <el-button type="danger" size="mini" @click="handList">刷新</el-button>
    </div>
    <div slot="reference" class="top-bar__item top-bar__item--show">
      <el-badge is-dot>
        <i class="icon-system"></i>
      </el-badge>
    </div>
  </el-popover>
</template>

<script>
import {
  findAll,
  findActiveClient,
  setActiveClient,
} from "@/api/operating/systemProfile";
import { mapGetters, mapState } from "vuex";
export default {
  name: "kong-client",
  data() {
    return {
      tableData: [],
      cardoption: {
        // addBtn:false,
        props: {
          img: "img",
          title: "title",
          info: "text",
        },
      },
      data: [],
      option: {
        size: "mini",
        index: false,
        addBtn: false,
        page: false,
        menu: false,
        header: false,
        simplePage: true,
        column: [
          {
            width: 100,
            label: "Name",
            prop: "name",
            overHidden: true,
          },
          {
            label: "Admin URL",
            prop: "url",
          },
          {
            label: "Version",
            prop: "version",
          },
          {
            label: "Active",
            width: 80,
            prop: "id",
            slot: true,
          },
        ],
      },
    };
  },
  created() {
    this.findActiveKongclient();
    this.handList();
  },
  mounted() {
    const timer = setInterval(() => {
      this.handList();
    }, 60 * 1000);
    // 在beforeDestroy钩子触发时清除定时器
    this.$once("hook:beforeDestroy", () => {
      clearInterval(timer);
    });
  },
  components: {
    ...mapGetters(["userInfo", "kongClient"]),
  },
  props: {
    activeClient: { type: Object, required: false },
  },
  methods: {
    findActiveKongclient() {
      this.$store.dispatch("FindActiveClient", this.userInfo).then((res) => {
        this.activeClient = res;
        this.$nextTick((_) => {
          this.$router.push("/wel/index");
        });
      });
    },
    handList() {
      findAll().then((res) => {
        this.tableData = res.data.data;
      });
    },
    handActiveClient(client) {
      //todo 设置到系统环境中
      setActiveClient("client", client).then((res) => {
        this.findActiveKongclient();
        window.location.reload();
      });
    },
    callback() {
      this.$emit("callback", {});
    },
  },
};
</script>

<style lang="scss">
.top-mag {
  &__menu {
    float: right;
  }
}
</style>
