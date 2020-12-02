<template>
  <avue-form
    :option="serviceColumn"
    v-model="service"
    ref="form"
    @submit="handleSave"
  >
    <template slot="tags">
      <item-tags
        :tags="service.tags"
        @sendTag="bindTags"
        name="tags"
        column="tags"
        :mode="mode"
      ></item-tags>
    </template>
    <template slot="client_certificate">
      <select-entity
        @bind="bindTags"
        :value="service.client_certificate"
        column="client_certificate"
        :dic="certificates"
        :props="{ label: 'id', value: 'id' }"
      >
      </select-entity>
    </template>
    <template slot="menuForm" v-if="mode != 'view'">
      <el-button type="primary" class="el-icon-check" @click="handlerSubmit"
        >提 交</el-button
      >
      <el-button @click="handleEmpty" class="el-icon-delete">清 空</el-button>
    </template>
  </avue-form>
</template>
<script>
import { mapGetters } from "vuex";
import { serviceUpdate, serviceSave } from "@/api/gateway/service";
import { findAllEntities } from "@/api/gateway/certificates";
import { get_columns } from "@/const/table/gatewayColumnOption";
import ItemTags from "@/components/ItemTags";
import SelectEntity from "@/components/SelectEntity";
import { DIC } from "@/const/dic.js";
export default {
  components: {
    ItemTags,
    SelectEntity,
  },
  name: "upholdService",
  data() {
    return {
      name: DIC.SERVICES,
      serviceColumn: [],
      certificates: [],
      
    };
  },
  computed: {
    ...mapGetters(["permission", "systemProfile", "kongClient"]),
  },
  props: {
    service: {
      type: Object,
      required: false,
    },
    mode: { required: false },
  },
  created() {
    let version = this.kongClient.version;
    this.serviceColumn = get_columns(version, this.name);
    this.serviceColumn["gutter"] = 0;
    this.initOptions();
    findAllEntities().then((res) => {
      this.certificates = res.data.data;
    });
  },
  methods: {
    initOptions() {
      this.serviceColumn.column.forEach((column) => {
        column["disabled"] = this.mode == "view";
      });
      this.mode == "view" &&
        (this.serviceColumn.group[0]["collapse"] = this.mode == "view");
    },
    handlerSubmit() {
      this.$refs.form.submit();
    },
    bindTags(data) {
      this.service = Object.assign(this.service, data);
    },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/

    handleSave(row, done) {
      this.mode == "add" &&
        serviceSave(row).then((res) => {
          let _data = res.data;
          if (_data.status != 0) {
            this.$errorInfo(_data.errmsg);
          } else {
            this.service = _data.data;
            this.$successInfo("新增成功");
            this.callback();
          }
          done();
        });

      this.mode == "edit" &&
        serviceUpdate(row).then((res) => {
          let _data = res.data;
          if (_data.status != 0) {
            this.$errorInfo(_data.errmsg);
          } else {
            this.service = _data.data;
            this.$successInfo("修改成功");
            this.callback();
          }
          done();
        });
    },
    callback() {
      this.$emit("callback", this.service);
    },
  },
};
</script>