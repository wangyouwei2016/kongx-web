<template>
  <div>
    <el-tabs @tab-click="checkUpstream" ref="upstreamTabs">
      <el-tab-pane>
        <span slot="label"> <i class="el-icon-info"></i> 基本信息 </span>
        <avue-form
          :option="upstreamColumn"
          ref="form"
          v-model="upstream"
          @submit="handleSave"
        >
          <template slot="tags">
            <item-tags
              :tags="upstream.tags"
              @sendTag="bindTags"
              name="tags"
              column="tags"
              :mode="mode"
            ></item-tags>
          </template>
          <template slot="hash_on">
            <el-radio-group
              v-model="upstream.hash_on"
              :disabled="mode == 'view'"
            >
              <el-radio-button
                v-for="item in hashOnType"
                :key="item.value"
                :label="item.value"
                :value="item.value"
                >{{ item.label }}</el-radio-button
              >
            </el-radio-group>
          </template>
          <template slot="hash_fallback">
            <el-radio-group
              v-model="upstream.hash_fallback"
              :disabled="mode == 'view'"
            >
              <el-radio-button
                v-for="item in hashOnType"
                :key="item.value"
                :label="item.value"
                :value="item.value"
                >{{ item.label }}</el-radio-button
              >
            </el-radio-group>
          </template>
          <template slot="menuForm" v-if="mode != 'view'">
            <el-button
              type="primary"
              class="el-icon-check"
              @click="handlerSubmit"
              >提 交</el-button
            >
            <el-button @click="handleEmpty" class="el-icon-delete"
              >清 空</el-button
            >
          </template>
        </avue-form>
      </el-tab-pane>
      <el-tab-pane label="代理列表" v-if="mode != 'add'">
        <span slot="label"> <i class="icon-fuzaijunheng"></i> Targets </span>
        <targets :upstream="upstream" ref="targets" :mode="mode"></targets>
      </el-tab-pane>
      <el-tab-pane label="设置健康检查" v-if="mode != 'add'" lazy>
        <span slot="label">
          <i class="icon-healthactive"></i> 主动健康检查(Active)
        </span>
        <active-health-check
          :upstream="upstream"
          :mode="mode"
        ></active-health-check>
      </el-tab-pane>
      <el-tab-pane label="设置健康检查" v-if="mode != 'add'" lazy>
        <span slot="label">
          <i class="icon-jiankangjiancha"></i> 被动健康检查(Passive)
        </span>
        <passive-health-check
          :upstream="upstream"
          :mode="mode"
        ></passive-health-check>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style>
.avue-group__title {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin: 10px;
}
</style>
<script>
import { mapGetters } from "vuex";
import { get_columns } from "@/const/table/gatewayColumnOption";
import { DIC } from "@/const/dic";
import targets from "./targets";
import activeHealthCheck from "./activeHealthCheck";
import passiveHealthCheck from "./passiveHealthCheck";
import ItemTags from "@/components/ItemTags";
import { upstreamUpdate, upstreamSave } from "@/api/gateway/upstream";
export default {
  components: {
    targets,
    activeHealthCheck,
    passiveHealthCheck,
    ItemTags,
  },
  name: "upholdUpstream",
  data() {
    return {
      hashOnType: DIC.HASH_ON_TYPE,
      entityName: DIC.UPSTREAMS,
      upstreamColumn: [],
    };
  },
  computed: {
    ...mapGetters(["permission", "systemProfile", "kongClient"]),
  },
  props: {
    upstream: {
      type: Object,
      required: false,
    },
    mode: { required: false },
  },
  created() {
    let version = this.kongClient.version;
    this.upstreamColumn = get_columns(version, this.entityName);
    this.initOptions();
  },
  methods: {
    initOptions() {
      this.upstreamColumn.column.forEach((column) => {
        if (column.prop == "algorithm") {
          return;
        }
        column["disabled"] = this.mode == "view";
      });

      this.mode == "view" &&
        (this.upstreamColumn.group[0]["collapse"] = this.mode == "view");
    },
    bindTags(data) {
      this.upstream = Object.assign(this.upstream, data);
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