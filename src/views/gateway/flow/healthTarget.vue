<template>
  <div>
    <img
      :src="'/svg/' + node.health.toLowerCase() + '.svg'"
      class="image"
      style="width: 20px; height: 20px"
      :title="node.health"
    />{{ node.target }}/{{ node.weight }}
  </div>
</template>
<script>
import { findTargets } from "@/api/gateway/upstream";
export default {
  data() {
    return {
      node: {},
    };
  },
  props: {
    target: {},
  },
  created() {
    this.filterTarget();
  },
  mounted() {
    const timer = setInterval(() => {
      this.filterTarget();
    }, 5000);
    // 在beforeDestroy钩子触发时清除定时器
    this.$once("hook:beforeDestroy", () => {
      clearInterval(timer);
    });
  },
  methods: {
    filterTarget() {
      let id = this.target.meta.parent.id;
      findTargets(this.target.meta.parent, {}).then((res) => {
        _.forEach(res.data.data, (item) => {
          if (this.target.meta.entity.id == item.id) {
            this.node = item;
            return;
          }
        });
      });
    },
  },
};
</script>