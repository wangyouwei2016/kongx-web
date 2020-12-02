<template>
  <div>
    <basic-container v-if="pathKey != entityName">
      <inner-breadcrumb
        v-model="pathKey"
        showBack="true"
        :path="path"
        :labelArgs="labelArgs"
      ></inner-breadcrumb>
    </basic-container>
    <basic-container>
      <div v-if="pathKey === entityName">
        <avue-card
          :option="cardoption"
          :data="pipelineList"
          @row-click="tip"
          @row-add="toEditPipeline({}, 'add')"
        >
          <template slot="menu" slot-scope="scope">
            <span
              @click="toDesignPipeline(scope.row, 'view')"
              type="primary"
              v-if="permission.view_config_pipeline"
              >查看</span
            >
            <span
              @click="toDesignPipeline(scope.row, 'edit')"
              type="primary"
              v-if="permission.config_pipeline"
              >配置</span
            >
            <span
              @click="toEditPipeline(scope.row, 'edit')"
              type="primary"
              v-if="permission.update_pipeline"
              >编辑</span
            >
            <span
              @click="toRemovePipeline(scope.row)"
              type="primary"
              v-if="permission.remove_pipeline"
              >删除</span
            >
          </template>
        </avue-card>
        <el-dialog
          :title="mode == 'add' ? '新建pipeline' : '编辑pipeline'"
          :visible.sync="pipelineBox"
          width="50%"
        >
          <uphold-pipeline
            v-if="pipelineBox"
            :entity="pipelineEntity"
            :mode="mode"
            @callback="handlerList"
          ></uphold-pipeline>
        </el-dialog>
      </div>
      <div v-if="pathKey === entityName + '_' + mode">
        <pipeline :pipeline="pipelineEntity" :mode="mode"></pipeline>
      </div>
    </basic-container>
  </div>
</template>
<style>
.el-dialog__body {
  padding: 0px 20px 20px;
}
.center-block {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.panel-footer {
  padding: 10px 15px;
}
.max-2-lines {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  min-height: 34px;
  text-align: center;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
}
.button {
  /* padding: 0; */
  /* float: right; */
  float: right;
}
.avue-card__avatar {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  overflow: hidden;
  margin-right: 12px;
}
</style>
<script>
import { mapGetters } from "vuex";
import { get_columns } from "@/const/table/gatewayColumnOption";
import { DIC } from "@/const/dic";
import {
  findAllPipeline,
  deletePipeline,
  findPipelineById,
} from "@/api/gateway/pipeline";
import pipeline from "./pipeline";
import InnerBreadcrumb from "@/components/InnerBreadcrumb";
import upholdPipeline from "./upholdPipeline";

const PIPELINE = "pipeline";
export default {
  components: { pipeline, InnerBreadcrumb, upholdPipeline },
  data() {
    return {
      pipelineBox: false,
      entityName: PIPELINE,
      pipelineEntity: {},
      mode: "add",
      pipelineList: [],
      cardoption: {
        addBtn: false,
        span: 6,
        props: {
          img: "img",
          title: "name",
          info: "remark",
        },
      },
      pathKey: PIPELINE,
      labelArgs: {},
      path: {
        label: PIPELINE,
        key: PIPELINE,
        children: [
          {
            key: PIPELINE + "_add",
            label: "新建" + PIPELINE,
          },
          {
            key: PIPELINE + "_edit",
            label: "修改" + PIPELINE,
          },
          {
            key: PIPELINE + "_view",
            label: "查看" + PIPELINE,
          },
        ],
      },
    };
  },
  created() {
    if (this.systemProfile.id == -1) {
      this.$nextTick((_) => {
        this.$router.push("/wel/index");
      });
    } else {
      this.cardoption["addBtn"] =
        this.permission && !!this.permission["add_pipeline"];
      this.handlerList();
    }
  },
  mounted() {
    this.initOptions();
  },
  computed: {
    ...mapGetters([
      "permission",
      "isDevProfile",
      "isProdProfile",
      "systemProfile",
      "kongClient",
    ]),
  },

  methods: {
    initOptions() {},
    toEditPipeline(entity, mode) {
      this.pipelineEntity = entity;
      this.pipelineBox = true;
      this.mode = mode;
    },
    toDesignPipeline(entity, mode) {
      findPipelineById(entity).then((res) => {
        this.pipelineEntity = res.data.data;
        this.mode = mode;
        this.pathKey = this.entityName + "_" + this.mode;
      });
    },
    toRemovePipeline(entity) {
      this.$confirm(`是否确认删除?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deletePipeline(entity).then((res) => {
          if (res.data.status == 0) {
            this.handlerList();
          } else {
            this.$errorInfo(res.data.errmsg);
          }
        });
      });
    },
    handlerList() {
      findAllPipeline().then((res) => {
        this.pipelineList = res.data;
        this.pipelineBox = false;
      });
    },
    callback() {
      this.$emit("callback", {});
    },
  },
};
</script>