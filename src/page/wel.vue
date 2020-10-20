<template>
  <div>
    <!-- 对内首页-->
    <in-home v-if="kongClient && kongClient.id!=-1"></in-home>
    <client-info v-else></client-info>
  </div>
</template>

<script>
import { findActiveClient } from "@/api/operating/systemProfile";
import { mapGetters } from "vuex";

export default {
  name: "wel",
  components: {
    InHome: () => import("./inHome"),
    clientInfo: () => import("./client-info"),
    
  },
  data() {
    return {
      // kongClient: {}
    };
  },
  computed: {
    ...mapGetters(["userInfo", "kongClient"])
  },
  created() {
    this.findActiveKongclient();
  },
  methods: {
    findActiveKongclient() {
      this.$store.dispatch("FindActiveClient", this.userInfo).then(res => {
        // this.kongClient = res;
      });
    }
  }
};
</script>