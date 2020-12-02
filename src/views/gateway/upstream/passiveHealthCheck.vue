<template>
  <div>
    <avue-form
      :option="passiveHealthCheckOption"
      v-model="passiveHealthForm"
      ref="form"
      @submit="handleUpstreamUpdate"
    >
      <template slot="fail_http_statuses" slot-scope="scope">
        <item-tags
          :tags="passiveHealthForm.fail_http_statuses"
          @sendTag="bindTags"
          name
          column="fail_http_statuses"
          :mode="mode"
        ></item-tags>
      </template>
      <template slot="http_statuses" slot-scope="scope">
        <item-tags
          :tags="passiveHealthForm.http_statuses"
          @sendTag="bindTags"
          name
          column="http_statuses"
          :mode="mode"
        ></item-tags>
      </template>
      <template slot="menuForm" v-if="mode != 'view'">
        <el-button type="primary" class="el-icon-check" @click="handlerSubmit"
          >提 交</el-button
        >
        <el-button @click="handleEmpty" class="el-icon-delete">清 空</el-button>
      </template>
    </avue-form>
  </div>
</template>
<script>
import { passiveHealthCheckOption } from "@/const/table/gatewayOption";
import { upstreamUpdate } from "@/api/gateway/upstream";
import ItemTags from "@/components/ItemTags.vue";
export default {
  name: "passiveHealthCheck",
  components: { ItemTags },
  data() {
    return {
      passiveHealthCheckOption: _.cloneDeep(passiveHealthCheckOption),
      passiveHealthForm: {
        http_statuses: [
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          226,
          300,
          301,
          302,
          303,
          304,
          305,
          306,
          307,
          308,
        ],
        fail_http_statuses: [429, 500, 503],
      },
    };
  },
  props: {
    upstream: {
      type: Object,
      required: false,
    },
    mode: { required: true },
    type: {},
  },
  created() {
    this.initOptions();
    this.initform(this.upstream);
  },
  methods: {
    initOptions() {
      this.passiveHealthCheckOption.column.forEach((column) => {
        column["disabled"] = this.mode == "view";
      });
      if (this.type && this.type == "drawer") {
        this.passiveHealthCheckOption["gutter"] = 0;
      }
    },
    bindTags(data) {
      this.passiveHealthForm = Object.assign(this.passiveHealthForm, data);
    },
    handlerSubmit() {
      this.$refs.form.submit();
    },
    /**
     * @title 获取数据
     * @detail 赋值为tableData表格即可
     *
     **/
    initform(form) {
      if (form.healthchecks) {
        var _passive = _.cloneDeep(form.healthchecks.passive);
        this.passiveHealthForm = _passive;
        this.passiveHealthForm.http_statuses = _passive.healthy.http_statuses;
        this.passiveHealthForm.successes = _passive.healthy.successes;
        this.passiveHealthForm.fail_http_statuses =
          _passive.unhealthy.http_statuses;
        this.passiveHealthForm.http_failures = _passive.unhealthy.http_failures;
        this.passiveHealthForm.tcp_failures = _passive.unhealthy.tcp_failures;
        this.passiveHealthForm.timeouts = _passive.unhealthy.timeouts;
      }
    },
    handleUpstreamUpdate(row, done) {
      this.upstream.healthchecks.passive.healthy.http_statuses = this.passiveHealthForm.http_statuses;
      this.upstream.healthchecks.passive.healthy.successes = this.passiveHealthForm.successes;

      this.upstream.healthchecks.passive.unhealthy.http_statuses = this.passiveHealthForm.fail_http_statuses;
      this.upstream.healthchecks.passive.unhealthy.http_failures = this.passiveHealthForm.http_failures;
      this.upstream.healthchecks.passive.unhealthy.tcp_failures = this.passiveHealthForm.tcp_failures;
      this.upstream.healthchecks.passive.unhealthy.timeouts = this.passiveHealthForm.timeouts;
      this.upstream.healthchecks.passive.type = this.passiveHealthForm.type;
      upstreamUpdate(this.upstream).then((res) => {
        let _data = res.data;
        if (_data.status != 0) {
          this.$errorInfo(_data.errmsg);
        } else {
          this.$successInfo("修改成功");
        }
        done();
      });
    },
  },
};
</script>
