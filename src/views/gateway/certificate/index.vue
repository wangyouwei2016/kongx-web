<template>
  <div>
    <basic-container v-if="systemProfile.version.indexOf('1.2') == 0">
      <certificate></certificate
    ></basic-container>
    <basic-container v-if="systemProfile.version.indexOf('1.2') == -1">
      <el-tabs ref="upstreamTabs" type="card">
        <el-tab-pane>
          <span slot="label"> <i class="icon-sni"></i> Certificate </span>
          <certificate></certificate>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label">
            <i class="icon-certificate"></i> Ca Certificate
          </span>
          <ca-certificate></ca-certificate>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import certificate from "./certificateList";
import caCertificate from "../cacertificate/ca_certificate";
export default {
  name: "certificate-tabs",
  components: { certificate, caCertificate },
  data() {
    return {};
  },
  created() {
    if (this.systemProfile.id == -1) {
      this.$nextTick((_) => {
        this.$router.push("/wel/index");
      });
    }
  },
  computed: {
    ...mapGetters([
      "permission",
      "isDevProfile",
      "isProdProfile",
      "systemProfile",
    ]),
  },
};
</script>