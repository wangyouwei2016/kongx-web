<template>
  <div>
    <avue-form
      :option="consumersColumn"
      v-model="upholdEntity"
      ref="form"
      @submit="handleEntity"
    >
      <template slot="tags">
        <item-tags
          :tags="upholdEntity.tags"
          @sendTag="bindTags"
          name="tags"
          column="tags"
          :mode="mode"
        ></item-tags>
      </template>
      <template slot="certificate">
        <select-entity
          @bind="bindTags"
          :value="upholdEntity.certificate.id"
          column="certificate"
          :dic="certificates"
          :props="{ label: 'id', value: 'id' }"
        >
        </select-entity>
      </template>
      <template slot="menuForm" v-if="mode != 'view'">
        <el-button type="primary" class="el-icon-check" @click="handlerSubmit"
          >提 交</el-button
        >
      </template>
    </avue-form>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { get_columns } from "@/const/table/gatewayColumnOption";
import { DIC } from "@/const/dic";
import { entitySave, entityUpdate } from "@/api/gateway/sni";
import { findAllEntities } from "@/api/gateway/certificates";
import ItemTags from "@/components/ItemTags";
import SelectEntity from "@/components/SelectEntity";
export default {
  name: DIC.SNIS + "_uphold",
  components: { ItemTags, SelectEntity },
  data() {
    return {
      consumersColumn: [],
      upholdEntity: this.entity,
      certificates: [],
      entityName: DIC.SNIS,
    };
  },
  computed: {
    ...mapGetters(["permission", "systemProfile", "kongClient"]),
  },
  props: {
    entity: { type: Object, required: false },
    mode: {
      required: false,
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.consumersColumn = get_columns(
        this.kongClient.version,
        this.entityName
      );
      this.initOptions();
      findAllEntities().then((res) => {
        this.certificates = res.data.data;
      });
    },
    bindTags(data) {
      this.upholdEntity = Object.assign(this.upholdEntity, data);
    },
    initOptions() {
      this.consumersColumn.column.forEach((column) => {
        column["disabled"] = this.mode == "view";
      });
    },
    handlerSubmit() {
      this.$refs.form.submit();
    },
    handleEntity(row, done) {
      if (this.mode == "edit") {
        this.handleEntityUpdate(row, done);
      }
      if (this.mode == "add") {
        this.handleEntitySave(row, done);
      }
    },
    handleEntityUpdate(row, done) {
      entityUpdate(this.upholdEntity)
        .then((res) => {
          let _data = res.data;
          if (_data.status != 0) {
            this.$message.error(_data.errmsg);
          } else {
            this.$message.success("修改成功");
            this.callback();
          }
          done();
        })
        .catch((error) => {
          this.$message.error("更新失败");
          done();
        });
    },

    handleEntitySave(row, done) {
      entitySave(this.upholdEntity)
        .then((res) => {
          let _data = res.data;
          if (_data.status != 0) {
            this.$message.error(_data.errmsg);
          } else {
            this.$message.success("新增成功");
            this.callback();
          }
          done();
        })
        .catch((error) => {
          this.$message.error("新增失败,错误信息：" + error);
          done();
        });
    },
    callback() {
      this.$emit("callback", {});
    },
  },
};
</script>
