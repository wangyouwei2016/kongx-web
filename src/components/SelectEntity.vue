<template>
  <div>
    <avue-input-tree
      :disabled="mode == 'view'"
      default-expand-all
      v-model="nvalue"
      placeholder="请选择内容"
      type="tree"
      :dic="dic"
      :props="props"
      @change="sendValue"
    ></avue-input-tree>
  </div>
</template>
<script>
export default {
  data() {
    return {
      nvalue: this.value,
    };
  },
  props: {
    column: {},
    value: {},
    dic: {},
    props: {},
  },
  methods: {
    sendValue() {
      let values = {};
      if (this.nvalue == "") {
        this.nvalue = "";
      }
      values[this.column] = { id: this.nvalue };
      this.$emit("bind", values);
    },
  },
};
</script>