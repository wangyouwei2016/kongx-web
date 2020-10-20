<template>
  <div>
    <el-collapse v-model="activeNames">
      <avue-form
        :option="activeHealthCheckOption"
        v-model="activeHealthForm"
        ref="form"
        @submit="handleUpstreamUpdate"
      >
        <template slot="fail_http_statuses" slot-scope="scope">
          {{scope}}
          <item-tags
            :tags="activeHealthForm.fail_http_statuses"
            @sendTag="bindTags"
            name
            column="fail_http_statuses"
            :mode="mode"
          ></item-tags>
        </template>
        <template slot="http_statuses" slot-scope="scope">
          {{scope}}
          <item-tags
            :tags="activeHealthForm.http_statuses"
            @sendTag="bindTags"
            name
            column="http_statuses"
            :mode="mode"
          ></item-tags>
        </template>
        <template slot="menuForm" v-if="mode!='view'">
          <el-button type="primary" class="el-icon-check" @click="handlerSubmit">提 交</el-button>
          <el-button @click="handleEmpty" class="el-icon-delete">清 空</el-button>
        </template>
      </avue-form>
      <!-- </el-collapse-item> -->
      <!-- <el-collapse-item name="passive">
        <template slot="title">
          <i class="header-icon el-icon-info"></i>被动健康检查
        </template>
        <avue-form
          :option="passiveHealthCheckOption"
          v-model="passiveHealthForm"
          @submit="handleUpstreamUpdate"
        ></avue-form>
      </el-collapse-item>-->
    </el-collapse>
  </div>
</template>
<script>
import {
  activeHealthCheckOption,
  passiveHealthCheckOption,
  targetColumn,
} from "@/const/table/gatewayOption";
import { upstreamUpdate, addTargets, targetDel } from "@/api/gateway/upstream";
import ItemTags from "@/components/ItemTags.vue";
export default {
  name: "healthCheck",
  components: { ItemTags },
  data() {
    return {
      activeHealthCheckOption: activeHealthCheckOption,
      passiveHealthCheckOption: passiveHealthCheckOption,
      targetColumn: targetColumn,
      activeHealthForm: {
        http_statuses: ["200", "304"],
        fail_http_statuses: [
          "429",
          "404",
          "500",
          "501",
          "502",
          "503",
          "504",
          "505",
        ],
      },
      passiveHealthForm: {},
      activeNames: "active",
      grade: {
        box: true,
      },
    };
  },
  props: {
    upstream: {
      type: Object,
      required: false,
    },
    mode: { required: true },
  },
  created() {
    console.log(this.upstream);
    this.initform(this.upstream);
    this.initOptions();
  },
  methods: {
    initOptions() {
      this.activeHealthCheckOption.group.forEach((group) => {
        group.column.forEach((column) => {
          column["disabled"] = this.mode == "view";
        });
      });
    },
    bindTags(data) {
      this.activeHealthForm = Object.assign(this.activeHealthForm, data);
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
        var _active = _.cloneDeep(form.healthchecks.active);
        var _passive = _.cloneDeep(form.healthchecks.passive);
        this.activeHealthForm = _active;
        this.activeHealthForm.http_statuses = _active.healthy.http_statuses;
        this.activeHealthForm.successes = _active.healthy.successes;
        this.activeHealthForm.fail_http_statuses =
          _active.unhealthy.http_statuses;
        this.activeHealthForm.http_failures = _active.unhealthy.http_failures;
        this.activeHealthForm.tcp_failures = _active.unhealthy.tcp_failures;
        this.activeHealthForm.timeouts = _active.unhealthy.timeouts;
        this.activeHealthForm.interval = _active.unhealthy.interval;
        this.activeHealthForm.healthy_interval = _active.healthy.interval;
      }
    },
    handleUpstreamUpdate(row, done) {
      this.upstream.healthchecks.active.healthy.http_statuses = this.activeHealthForm.http_statuses;
      this.upstream.healthchecks.active.healthy.successes = this.activeHealthForm.successes;
      this.upstream.healthchecks.active.healthy.interval = this.activeHealthForm.healthy_interval;

      this.upstream.healthchecks.active.unhealthy.http_statuses = this.activeHealthForm.fail_http_statuses;
      this.upstream.healthchecks.active.unhealthy.http_failures = this.activeHealthForm.http_failures;
      this.upstream.healthchecks.active.unhealthy.tcp_failures = this.activeHealthForm.tcp_failures;
      this.upstream.healthchecks.active.unhealthy.timeouts = this.activeHealthForm.timeouts;
      this.upstream.healthchecks.active.unhealthy.interval = this.activeHealthForm.interval;
      this.upstream.healthchecks.active.type = this.activeHealthForm.type;
      this.upstream.healthchecks.active.http_path = this.activeHealthForm.http_path;
      this.upstream.healthchecks.active.timeout = this.activeHealthForm.timeout;
      this.upstream.healthchecks.active.https_sni = this.activeHealthForm.https_sni;
      this.upstream.healthchecks.active.concurrency = this.activeHealthForm.concurrency;
      this.upstream.healthchecks.active.https_verify_certificate = this.activeHealthForm.https_verify_certificate;
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
