<template>
  <div>
    <template v-if="mode=='edit'||mode=='add'">
      <el-tag
        v-for="tag in tags"
        :key="tag"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
      >{{tag}}</el-tag>
      <el-input
        class="input-new-tag"
        v-model="inputValue"
        ref="saveTagInput"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
        :placeholder="'新增'+name+',支持批量添加，请以逗号、分号或空格分隔即可'"
      ></el-input>
    </template>
    <template v-if="mode=='view'">
      <el-tag
        v-for="tag in tags"
        :key="tag"
        :disable-transitions="false"
        @close="handleClose(tag)"
      >{{tag.constructor==Object?tag[column]:tag}}</el-tag>
    </template>
  </div>
</template>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
  margin-top: 5px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  /* width: 90px; */
  margin-top: 2px;
  margin-left: 0px;
  vertical-align: bottom;
}
</style>

<script>
export default {
  name: "ItemTags",
  data() {
    return {
      inputValue: "",
      inputVisible: false
    };
  },
  props: {
    name: { required: true },
    column: { required: false },
    //view,edit,add
    mode: { required: false },
    tags: { type: Array, required: true }
  },
  created() {
    if (!this.tags) {
      this.tags = [];
    }
  },
  methods: {
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
      this.sendTag();
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (!this.tags) this.tags = [];
      if (inputValue) {
        inputValue = inputValue.replace(/;/g, ",");
        inputValue = inputValue.replace(/ /g, ",");
        let _arr = inputValue.split(",");

        _arr.forEach(item => {
          if (item.trim()) {
            this.tags.push(item.trim());
          }
        });
      }
      this.inputVisible = false;
      this.inputValue = "";
      this.sendTag();
    },
    sendTag() {
      let values = {};
      values[this.column] = this.tags;
      this.$emit("sendTag", values);
    }
  }
};
</script>