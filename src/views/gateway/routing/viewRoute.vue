<template>
  <el-form label-width="80px" style="margin-left:10px;">
    <el-form-item label="Host" v-if="route.hosts && route.hosts.length>0">
      <item-tags :tags="route.hosts" name="匹配路径" column="paths" mode="view"></item-tags>
    </el-form-item>
    <el-form-item label="路由PATH">
      <item-tags :tags="route.paths" name="匹配路径" column="paths" mode="view"></item-tags>
    </el-form-item>
    <el-form-item label="插件列表">
      <query-plugins :route="route" mode="view"></query-plugins>
    </el-form-item>
  </el-form>
</template>
<script>
import queryPlugins from "@/views/gateway/plugin/queryPlugins";
import ItemTags from "@/components/ItemTags";
export default {
  name: "viewRoute",
  data() {},
  components: {
    ItemTags,
    queryPlugins
  },
  props: {
    route: { type: Object, required: false }
  },
  created() {}
};
</script>