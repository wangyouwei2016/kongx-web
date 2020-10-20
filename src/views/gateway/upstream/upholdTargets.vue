<template>
  <div>
    <el-tabs @tab-click="checkUpstream" ref="upstreamTabs" value="targets">
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-info"></i> 基本信息
        </span>
        <avue-form :option="upstreamColumn" ref="form" v-model="upstream" @submit="handleSave"></avue-form>
      </el-tab-pane>
      <el-tab-pane label="代理列表" v-if="mode!='add'" name="targets">
        <span slot="label">
          <i class="el-icon-success"></i> Targets
        </span>
        <targets :upstream="upstreamEntity" ref="targets" mode="edit"></targets>
      </el-tab-pane>
      <el-tab-pane label="设置健康检查" v-if="mode!='add'">
        <span slot="label">
          <i class="el-icon-warning"></i>  健康检查(ACTIVE)
        </span>
        <health-check :upstream="upstreamEntity" mode="view"></health-check>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { upstreamColumn } from "@/const/table/gatewayOption";
import targets from "./targets";
import healthCheck from "./healthCheck";
import { upstreamUpdate, upstreamSave } from "@/api/gateway/upstream";
export default {
  components: {
    targets,
    healthCheck,
  },
  name: "upholdUpstream",
  data() {
    return {
      upstreamColumn: upstreamColumn,
      upstreamEntity: _.cloneDeep(this.upstream),
    };
  },
  computed: {
    ...mapGetters(["permission", "systemProfile"]),
  },
  props: {
    upstream: {
      type: Object,
      required: false,
    },
    mode: { required: false },
  },
  created() {
    this.initOptions();
  },
  methods: {
    initOptions() {
      this.upstreamColumn.column.forEach((column) => {
        column["disabled"] = true;
      });
    },
    handlerSubmit() {
      this.$refs.form.submit();
    },
    handleSave(row, done) {
      this.mode != "edit" &&
        upstreamSave(row).then((res) => {
          let _data = res.data;
          if (_data.status != 0) {
            this.$errorInfo(_data.errmsg);
          } else {
            this.upstream = _data.data;
            this.$successInfo("新增成功");
            this.callback();
          }
          done();
        });

      this.mode == "edit" &&
        upstreamUpdate(row).then((res) => {
          let _data = res.data;
          if (_data.status != 0) {
            this.$errorInfo(_data.errmsg);
          } else {
            this.upstream = _data.data;
            this.$successInfo("修改成功");
            this.callback();
          }
          done();
        });
    },
    callback() {
      this.$emit("callback", this.upstream);
    },
  },
};
</script>