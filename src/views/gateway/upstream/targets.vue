<template>
  <div>
    <avue-form
      :option="targetColumn"
      v-model="targetForm"
      @submit="handleTargetSave"
      v-if="mode!='view'"
    ></avue-form>
    <avue-crud :option="targetOption" :data="targetData" @row-del="handleTargetDel">
      <template slot="empty">暂无服务代理，请添加服务代理</template>
      <template slot="health" slot-scope="{row}">
        <img
          :src="'/svg/'+row.health.toLowerCase()+'.svg'"
          class="image"
          style="width:20px;height:20px;"
          :title="row.health"
        />
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          icon="el-icon-delete"
          size="small"
          plain
          @click="handleTargetDel(scope.row,scope.$index)"
          type="danger"
        >删除</el-button>
      </template>
    </avue-crud>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { targetOption, targetColumn } from "@/const/table/gatewayOption";
import { findTargets, addTargets, targetDel } from "@/api/gateway/upstream";
export default {
  name: "targets",
  data() {
    return {
      targetOption: targetOption,
      targetColumn: targetColumn,
      targetForm: {},
      targetData: [],
      grade: {
        box: true
      }
    };
  },
  props: {
    upstream: {
      type: Object,
      required: false
    },
    mode: { required: true },
    client: { type: Object, required: true, id: -1 }
  },
   computed: {
    ...mapGetters([
      "permission",
      "isDevProfile",
      "isProdProfile",
      "systemProfile"
    ])
  },
  mounted() {
    const timer = setInterval(() => {
      this.handleList(this.upstream);
    }, 100000);
    // 在beforeDestroy钩子触发时清除定时器
    this.$once("hook:beforeDestroy", () => {
      clearInterval(timer);
    });
  },
  created() {
    this.handleList(this.upstream);
    this.initOptions();
  },
  methods: {
    initOptions() {
      this.targetOption["menu"] = this.mode != "view";
    },
    toEditTarget(row, index) {
      this.targetForm = row;
    },
    /**
     * @title 获取数据
     * @detail 赋值为tableData表格即可
     *
     **/
    handleList(form) {
      this.tableLoading = true;
      if (form.id) {
        this.client = this.client || {};
        findTargets(form, this.client).then(res => {
          this.targetData = res.data.data;
        });
      }
    },

    handleTargetSave(row, done) {
      this.targetForm = row;
      this.targetForm.upstream = { id: this.upstream.id };
      delete this.targetForm.id;
      addTargets(row).then(res => {
        let _data = res.data;
        if (_data.status != 0) {
          this.$errorInfo(_data.errmsg);
        } else {
          this.$successInfo("新增成功");
          this.handleList(this.upstream);
          this.targetForm = {};
          this.targetForm.upstream = { id: this.upstream.id };
        }
        done();
      });
    },

    handleTargetDel(row, index) {
      var _message = "";
      this.isProdProfile && (_message = "当前为生产环境，请谨慎操作! ");
      this.$confirm(_message + `是否确认删除?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          targetDel({ upstream: this.upstream, id: row.id }).then(res => {
            let _data = res.data;
            if (_data.status != 0) {
              this.$errorInfo(_data.errmsg);
            } else {
              this.handleList(this.upstream);
              this.targetForm = {};
              this.targetForm.upstream = { id: this.upstream.id };
              this.$successInfo("删除成功");
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
