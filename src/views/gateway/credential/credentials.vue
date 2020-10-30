<template>
  <div>
    <basic-container>
      <el-tabs tab-position="left">
        <el-tab-pane
          :index="env.label"
          v-for="env in credentials"
          :key="env"
          lazy
        >
          <span slot="label">
            {{ env.label }}
          </span>
          <credential
            :params="{ entityName: env.value, customer: customer_id }"
          ></credential>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>
<script>
import credential from "./index";
export default {
  name: "credentials",
  components: { credential },
  data() {
    return {
      credentials: [
        { label: "JWT", value: "jwt" },
        { label: "OAUTH2", value: "oauth2" },
        { label: "API KEYS", value: "key-auth" },
        { label: "BASIC AUTH", value: "basic-auth" },
        { label: "HMAC AUTH", value: "hmac-auth" },
      ],
      customer_id: this.consumer,
    };
  },
  props: { consumer: {} },
};
</script>