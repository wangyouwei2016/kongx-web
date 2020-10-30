<template>
  <div>
    <i class="icon-plus-copy" style="cursor: pointer" @click="copyValue()">{{
      value
    }}</i>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: { value: {} },
  methods: {
    copyValue() {
      let oInput = document.createElement("textarea");
      oInput.value = this.value;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message({
        message: "复制成功",
        type: "success",
      });
      oInput.remove();
    },
  },
};
</script>