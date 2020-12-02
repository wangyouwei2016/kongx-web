<template>
  <div>
    <!-- <el-button @click="selectAllNode" type="primary" size="mini"
      >全选</el-button
    >
    <el-button @click="handlerPipeline" type="primary" size="mini"
      >保存</el-button
    > -->

    <div class="super-flow-base-demo">
      <super-flow
        ref="superFlow"
        :node-list="nodeList"
        :link-list="linkList"
        :origin="origin"
        :graph-menu="graphMenuList"
        :node-menu="nodeMenuList"
        :link-menu="linkMenuList"
        :enter-intercept="enterIntercept"
        :output-intercept="outputIntercept"
        :link-desc="linkDesc"
      >
        <template v-slot:node="node">
          <div :class="`flow-node flow-node-${node.meta.ready}`">
            <header class="ellipsis">
              <i
                class="el-icon-view"
                v-if="node.meta.ready && node.meta.prop != 'targets'"
                @click="viewEntityNode(node)"
                style="cursor: pointer"
                >&nbsp;</i
              >
              <i
                v-if="
                  node.meta.prop != 'paths' &&
                  !(node.meta.prop == 'targets' && node.meta.ready) &&
                  pipelineMode != 'view'
                "
                class="el-icon-edit"
                @click="editEntityNode(node)"
                style="cursor: pointer"
                >&nbsp;</i
              >
              <i
                class="el-icon-delete"
                v-if="pipelineMode != 'view'"
                @click="removeGraphNode(node)"
                style="cursor: pointer"
              ></i>
              <el-tooltip
                effect="dark"
                :content="node.meta.prop"
                placement="right-start"
              >
                <span
                  >&nbsp;&nbsp;{{ node.meta.prop }}: {{ node.meta.name }}</span
                >
              </el-tooltip>
            </header>
            <section>
              <span v-if="node.meta.prop == 'services' && node.meta.ready">{{
                node.meta.entity.host
              }}</span>

              <span v-if="node.meta.prop == 'routes' && node.meta.ready">
                <item-tags
                  :tags="node.meta.entity.hosts"
                  name="hosts"
                  mode="view"
                ></item-tags>
                <item-tags
                  :tags="node.meta.entity.paths"
                  name="paths"
                  mode="view"
                ></item-tags>
              </span>
              <span>
                <!-- {{ node.meta.entity.target }}/{{ node.meta.entity.weight }} -->
                <health-target
                  v-if="node.meta.prop == 'targets' && node.meta.ready"
                  :target="node"
                  >ddd</health-target
                >
              </span>
              <span v-if="node.meta.prop == 'plugins' && node.meta.ready">
                {{ node.meta.entity.name }}<br />
                <el-button
                  v-show="node.meta.entity.enabled"
                  plain
                  size="mini"
                  type="success"
                  title="点击关闭插件"
                  @click="handlerPluginUpdate(node, false)"
                  >已启用</el-button
                >
                <el-button
                  v-show="!node.meta.entity.enabled"
                  plain
                  size="mini"
                  type="danger"
                  title="点击开启插件"
                  @click="handlerPluginUpdate(node, true)"
                  >未启用</el-button
                >
              </span>
              <span v-if="!node.meta.ready">
                请完善信息
                <!-- <copy-item :value="node.meta.id"></copy-item> -->
              </span>
            </section>
          </div>
        </template>
      </super-flow>
      <el-drawer
        v-if="currentNode.meta.prop != 'plugins'"
        size="40%"
        :title="currentNode.meta.name"
        :visible.sync="upholdEntityBox"
        :close-on-click-modal="false"
      >
        <div style="height: 90%; width: 100%; overflow: auto">
          <uphold-service
            v-if="currentNode.meta.prop == 'services'"
            :service="upholdEntity"
            :mode="entityMode"
            @callback="callback"
          ></uphold-service>
          <uphold-route
            v-if="currentNode.meta.prop == 'routes'"
            :route="upholdEntity"
            :mode="entityMode"
            @callback="callback"
          ></uphold-route>
          <uphold-upstream
            v-if="
              currentNode.meta.prop == 'upstreams' && healthType == 'upstreams'
            "
            :upstream="upholdEntity"
            :mode="entityMode"
            @callback="callback"
          ></uphold-upstream>
          <targets
            v-if="currentNode.meta.prop == 'targets'"
            :upstream="upholdEntity"
            :mode="entityMode"
            @callback="callback"
          ></targets>
          <uphold-consumer
            v-if="currentNode.meta.prop == 'consumers'"
            :entity="upholdEntity"
            :mode="entityMode"
            @callback="callback"
          ></uphold-consumer>

          <active-health-check
            v-if="
              currentNode.meta.prop == 'upstreams' && healthType == 'active'
            "
            :upstream="upholdEntity"
            :mode="entityMode"
            type="drawer"
          ></active-health-check>
          <passive-health-check
            v-if="
              currentNode.meta.prop == 'upstreams' && healthType == 'passsive'
            "
            :upstream="upholdEntity"
            :mode="entityMode"
            type="drawer"
          ></passive-health-check>
        </div>
      </el-drawer>

      <el-dialog
        v-if="currentNode.meta.prop == 'plugins'"
        :title="currentNode.meta.name"
        :visible.sync="upholdEntityBox"
        width="90%"
      >
        <list-plugin
          v-if="!currentNode.meta.ready"
          :service="
            currentNode.meta.parent.prop == 'services' ? upholdEntity : null
          "
          :route="
            currentNode.meta.parent.prop == 'routes' ? upholdEntity : null
          "
          :consumer="
            currentNode.meta.parent.prop == 'consumers' ? upholdEntity : null
          "
          @callback="callback"
        ></list-plugin>
        <uphold-plugins
          v-if="currentNode.meta.ready && upholdEntityBox"
          :fields="pluginFields"
          :plugin="upholdEntity"
          @callback="callback"
          :edit="entityMode"
          :key="upholdEntity.name"
        ></uphold-plugins>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import upholdService from "./upholdService";
import upholdRoute from "./upholdRoute";
import upholdUpstream from "./upholdUpstream";
import upholdConsumer from "./upholdConsumer";
import healthTarget from "./healthTarget";
import listPlugin from "../plugin/listPlugin";
import upholdPlugins from "../plugin/upholdPlugins";
import activeHealthCheck from "../upstream/activeHealthCheck";
import passiveHealthCheck from "../upstream/passiveHealthCheck";
import targets from "./targets";
import {} from "@/const/table/gatewayFlowOption";
import {
  savePipeline,
  updatePipeline,
  truncatePipeline,
  queryEntity,
} from "@/api/gateway/pipeline";
import { findPluginSchema, pluginUpdate } from "@/api/gateway/plugins";
import ItemTags from "../../../components/ItemTags.vue";
import ListPlugin from "../plugin/listPlugin.vue";
import UpholdPlugins from "../plugin/upholdPlugins.vue";
import CopyItem from "@/components/CopyItem";
import UpholdConsumer from "../consumer/uphold-consumer.vue";
const drawerType = {
  node: 0,
  link: 1,
};
const default_width = 200;
const default_height = 120;

export default {
  components: {
    upholdService,
    upholdUpstream,
    targets,
    upholdRoute,
    listPlugin,
    ItemTags,
    ListPlugin,
    UpholdPlugins,
    CopyItem,
    upholdConsumer,
    UpholdConsumer,
    healthTarget,
    activeHealthCheck,
    passiveHealthCheck,
  },
  data() {
    return {
      currentNode: { meta: { prop: "" } },
      upholdEntityBox: false,
      flowStatus: { newstatus: 0, editstatus: 0 },
      entityMode: "add",
      upholdEntity: {},
      healthType: "upstreams",
      pipelineMode: this.mode,
      pluginFields: [],
      origin: [681, 465],
      nodeList: [],
      linkList: [],
      graphMenuList: [
        [
          {
            label: "Services",
            disable: (graph) => {
              return (
                !!graph.nodeList.find(
                  (node) => node.meta.prop === "services"
                ) || this.pipelineMode == "view"
              );
            },
            selected: (graph, coordinate) => {
              const start = graph.nodeList.find(
                (node) => node.meta.prop === "services"
              );
              if (!start) {
                this.addGraphNode(graph, coordinate, {
                  prop: "services",
                  name: "Services",
                  ready: false,
                });
              }
            },
          },
          // {
          //   label: "Upstreams",
          //   disable(graph) {
          //     return !!graph.nodeList.find(
          //       (node) => node.meta.prop === "upstreams"
          //     );
          //   },
          //   selected: (graph, coordinate) => {
          //     let upstreamNode = this.addGraphNode(graph, coordinate, {
          //       prop: "upstreams",
          //       name: "Upstreams",
          //     });

          //     let serviceNode = _.find(graph.nodeList, (node) => {
          //       return node.meta.prop == "services";
          //     });
          //     serviceNode && this.addNodeLink(serviceNode, upstreamNode);
          //   },
          // },
          // {
          //   label: "Consumers",
          //   disable: false,
          //   selected: (graph, coordinate) => {
          //     this.addGraphNode(graph, coordinate, {
          //       prop: "consumers",
          //       name: "Consumers",
          //     });
          //   },
          // },
        ],
        [
          {
            label: "全选",
            selected: (graph, coordinate) => {
              graph.selectAll();
            },
          },
        ],
      ],
      nodeMenuList: [
        [
          {
            label: "删除",
            disable: false,
            hidden: (node) => {
              return (
                node.meta.prop === "services" || this.pipelineMode == "view"
              );
            },
            selected: (node, coordinate) => {
              this.removeGraphNode(node);
            },
          },
          {
            label: "编辑",
            hidden: (node) => {
              return this.pipelineMode == "view";
            },
            selected: (node, coordinate) => {
              this.healthType = node.meta.prop;
              this.editEntityNode(node);
              //   this.drawerConf.open(drawerType.node, node);
            },
          },
          {
            label: "主动健康检查",
            hidden: (node) => {
              return (
                node.meta.prop != "upstreams" || this.pipelineMode == "view"
              );
            },
            selected: (node, coordinate) => {
              this.sethealthType(node, "active");
            },
          },
          {
            label: "被动健康检查",
            hidden: (node) => {
              return (
                node.meta.prop != "upstreams" || this.pipelineMode == "view"
              );
            },
            selected: (node, coordinate) => {
              this.sethealthType(node, "passsive");
            },
          },
        ],
        [
          {
            label: "新增路由",
            disable: false,
            hidden: (node) => {
              return (
                node.meta.prop != "services" || this.pipelineMode == "view"
              );
            },
            selected: (node, coordinate) => {
              if (!!!node.meta.ready) {
                this.$message.warning("请完善服务信息后，再添加路由");
                return;
              }
              let _entity = node.meta.entity;
              _entity &&
                this.addGraphNode(
                  node.graph,
                  coordinate,
                  {
                    prop: "routes",
                    ready: false,
                    name: "Routes-Node",
                    parent: node.meta,
                    entity: { service: { id: node.meta.id } },
                  },
                  node
                );
            },
          },
          {
            label: "新增Upstreams",
            disable: false,
            hidden: (node) => {
              return (
                node.meta.prop != "services" ||
                !!node.graph.nodeList.find(
                  (node) => node.meta.prop === "upstreams"
                ) ||
                this.pipelineMode == "view"
              );
            },
            selected: (node, coordinate) => {
              let meta = {
                prop: "upstreams",
                ready: false,
                parent: node.meta,
                name: "upstreams-Node",
              };
              if (node.meta.entity) {
                meta["entity"] = { name: node.meta.entity.host };
              }
              this.addGraphNode(node.graph, coordinate, meta, node);
            },
          },
          {
            label: "新增Targets",
            disable: false,
            hidden: (node) => {
              return (
                node.meta.prop != "upstreams" || this.pipelineMode == "view"
              );
            },
            selected: (node, coordinate) => {
              let _entity = node.meta.ready;
              !!!_entity &&
                this.$message.warning("请完善上游信息后，再添加Targets");
              _entity &&
                this.addGraphNode(
                  node.graph,
                  coordinate,
                  {
                    prop: "targets",
                    name: _entity.name,
                    ready: false,
                    parent: node.meta,
                    entity: { id: node.meta.id },
                  },
                  node
                );
            },
          },

          {
            label: "新增插件",
            disable: false,
            hidden: (node) => {
              return (
                (node.meta.prop != "services" && node.meta.prop != "routes") ||
                this.pipelineMode == "view"
              );
            },
            selected: (node, coordinate) => {
              if (!node.meta.ready) {
                this.$message.warning("请完善信息后，再添加插件");
                return;
              }
              let _entity = node.meta.entity;
              _entity &&
                this.addGraphNode(
                  node.graph,
                  coordinate,
                  {
                    prop: "plugins",
                    name: "plugins-Node",
                    ready: false,
                    parent: node.meta,
                    entity: { id: node.meta.id },
                  },
                  node
                );
            },
          },
        ],
      ],
      linkMenuList: [
        // [
        //   {
        //     label: "删除",
        //     disable: false,
        //     selected: (link, coordinate) => {
        //       link.remove();
        //     },
        //   },
        // ],
        // [
        //   {
        //     label: "编辑",
        //     disable: false,
        //     selected: (link, coordinate) => {
        //       this.drawerConf.open(drawerType.link, link);
        //     },
        //   },
        // ],
      ],
      graphChanaged: false,
      graphNodes: {},
    };
  },
  created() {
    setTimeout(() => {
      this.nodeList = _.cloneDeep(this.pipeline.nodeList);
      this.linkList = _.cloneDeep(this.pipeline.linkList);
      if (this.pipeline.origin.length > 0) {
        this.origin = _.cloneDeep(this.pipeline.origin);
      }
      this.graphChanaged = false;
      window.document.onmouseup = (event) => {
        if (this.graphChanaged && this.pipelineMode != "view") {
          this.handlerPipeline();
          this.graphChanaged = false;
        }
      };
    }, 100);
  },
  props: { pipeline: {}, mode: {} },
  mounted() {
    this.$watch(
      "graphNodes",
      () => {
        this.graphChanaged = true;
      },
      { immediate: false, deep: true }
    );
    this.graphNodes = this.$refs.superFlow.graph;
  },
  methods: {
    callback(data) {
      let meta = {
        prop: this.currentNode.meta.prop,
        name: data.name,
        entity: data,
        id: data.id,
        ready: true,
        parent: this.currentNode.meta.parent,
      };
      let graphNode = this.queryGraphNode(this.currentNode);
      graphNode.meta = _.cloneDeep(meta);
      this.currentNode = { meta: { prop: "" } };
      this.upholdEntityBox = false;
      if (graphNode.meta.prop == "targets") {
        setTimeout(() => {
          this.clearSameTargets(graphNode);
        }, 100);
      } else {
        this.handlerPipeline();
      }
    },
    handlerPluginUpdate(node, enabled) {
      let _entity = node.meta.entity;
      _entity.enabled = enabled;
      pluginUpdate(_entity).then((res) => {
        node.meta.entity = res.data.data;
      });
    },
    sethealthType(node, type) {
      this.healthType = type;
      this.editEntityNode(node);
    },
    clearSameTargets(graphNode) {
      let _parentNode = graphNode.meta.parent;
      //1. 查找同级节点
      let childList = [];
      let _nodeList = this.getNodeList();
      _.forEach(_nodeList, (item) => {
        if (item.meta.prop == "targets") {
          if (item.meta.parent.id == _parentNode.id) {
            childList.push(item);
          }
        }
      });
      _.forEach(childList, (item) => {
        if (
          item.meta.entity.target == graphNode.meta.entity.target &&
          item.meta.id != graphNode.meta.id
        ) {
          let childNode = this.queryGraphNode(item);
          childNode && childNode.remove();
        }
      });

      this.handlerPipeline();
    },
    viewEntityNode(node) {
      this.currentNode = node;
      this.entityMode = "view";
      if (node.meta.ready) {
        this.upholdEntity = node.meta.entity;
        if (this.currentNode.meta.prop == "plugins") {
          findPluginSchema(this.currentNode.meta.entity.name).then((res) => {
            let _data = res.data;
            this.pluginFields = _data.fields || [];
          });
        }
      }
      setTimeout(() => {
        this.upholdEntityBox = true;
      }, 100);
    },
    editEntityNode(node) {
      this.currentNode = _.cloneDeep(node);
      this.entityMode = "add";
      let _entity = node.meta.entity;
      this.upholdEntity = _entity || {};
      console.log(_entity);
      this.pluginFields = [];
      this.upholdEntityBox = false;
      if (node.meta.ready) {
        this.entityMode = "edit";
        this.upholdEntity = queryEntity(node)
          .then((res) => {
            console.log("1");
            let _data = res.data;
            if (_data.status == 404) {
              node.meta.ready = false;
              this.currentNode = _.cloneDeep(node);
              this.$errorInfo(_data.errmsg);
              return true;
            }
            if (_data.status == 500) {
              this.$errorInfo(_data.errmsg);
              return true;
            }
            this.upholdEntity = _data.data;
            return false;
          })
          .then((res) => {
            console.log("2", res);
            if (!res && this.currentNode.meta.prop == "plugins") {
              findPluginSchema(_entity.name).then((res) => {
                let _data = res.data;
                this.pluginFields = _data.fields || [];
                this.upholdEntityBox = true;
              });
            } else {
              this.upholdEntityBox = true && !res;
            }
          });
      } else {
        this.upholdEntityBox = true;
      }
    },
    //查询graph的节点
    queryGraphNode(node) {
      let _nodeList = this.$refs.superFlow.graph.nodeList;
      let _realNode = _.find(_nodeList, (_node) => {
        return node.meta.id == _node.meta.id;
      });
      return _realNode;
    },
    // 删除节点
    removeGraphNode(node) {
      let children = this.getChildren(node);
      console.log("children: ", children);
      if (children.length > 0) {
        this.$errorInfo("当前节点存在子节点，不允许删除");
        return;
      }
      let _realNode = this.queryGraphNode(node);
      if (!!!node.meta.ready && _realNode) {
        _realNode.remove();
        setTimeout(() => {
          this.handlerPipeline();
        }, 100);
        return;
      }

      this.$confirm(`是否确认删除?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //todo 调用接口删除
        truncatePipeline(_realNode).then((res) => {
          let _data = res.data;
          if (_data.status != 0) {
            this.$errorInfo(_data.errmsg);
          } else {
            _realNode.remove();
            setTimeout(() => {
              this.handlerPipeline();
            }, 100);
            this.$successInfo("操作成功");
          }
        });
      });
    },
    //新增流程图节点
    addGraphNode(graph, coordinate, meta, node) {
      meta["id"] = this.newId(meta.prop);
      let newnode = graph.addNode({
        width: default_width,
        height: meta.prop == "targets" ? 80 : default_height,
        coordinate: coordinate,
        meta: meta,
      });
      node && this.addNodeLink(node, newnode);

      return newnode;
    },
    getChildren(parent) {
      let nodeList = this.getNodeList();
      return _.filter(nodeList, (item) => {
        console.log(parent, item);

        return item.meta.parent && parent.meta.id == item.meta.parent.id;
      });
    },
    getNodeList() {
      return this.$refs.superFlow.graph.nodeList;
    },
    //新增两个节点之间的连接线
    addNodeLink(src, dest) {
      this.$refs.superFlow.linkList.push({
        id: dest.id,
        startId: src.id,
        endId: dest.id,
        startAt: [200, 75],
        endAt: [0, 75],
        meta: null,
      });
    },
    //全选所有节点
    selectAllNode() {
      this.$refs.superFlow.selectedAll();
    },
    handlerPipeline() {
      this.pipeline = _.assign(
        this.pipeline,
        this.$refs.superFlow.graph.toJSON()
      );
      if (this.pipeline && this.pipeline.id) {
        updatePipeline(this.pipeline).then((res) => {
          console.log(res.data.data);
        });
      } else {
        savePipeline(this.pipeline).then((res) => {
          console.log(res.data.data);
        });
      }
    },
    //生成节点id
    newId(type) {
      var timestamp = new Date().getTime();
      return type + timestamp;
    },
    enterIntercept(formNode, toNode, graph) {
      const formType = formNode.meta.prop;
      switch (toNode.meta.prop) {
        case "upstreams":
          return ["services"].includes(formType);
        case "services":
          return false;
        case "consumers":
          return ["certificate"].includes(formType);
        case "routes":
          return ["services"].includes(formType);
        case "plugins":
          // todo 只允许一个进入，不允许多个路由或服务指向连接
          let access = ["routes", "consumers", "services"].includes(formType);
          if (access) {
            let linkList = graph.linkList;
            let linkNode = _.find(linkList, (node) => {
              return node.end.id == toNode.id;
            });
            if (linkNode && formNode.meta.id == linkNode.start.meta.id) {
              return true;
            }
            access = !!!linkNode;
          }
          return access;
        default:
          return true;
      }
    },
    outputIntercept(node, graph) {
      return !(node.meta.prop === "targets");
    },
  },
};
</script>

<style lang="less">
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
}

.super-flow-base-demo {
  position: absolute;
  background-size: 20px 20px, 20px 20px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0),
    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 0);
  width: 100%;
  height: 800px;
  margin: -20px 0px 0px -20px;
  background-color: #f5f5f5;
  overflow: scroll;

  .super-flow__node {
    .flow-node {
      > header {
        font-size: 14px;
        height: 32px;
        line-height: 32px;
        padding: 0 12px;
        color: #ffffff;
      }

      > section {
        text-align: center;
        line-height: 20px;
        overflow: hidden;
        padding: 6px 12px;
        word-break: break-all;
      }

      &.flow-node-true {
        > header {
          background-color: #0689e0;
        }
      }
      &.flow-node-services {
        > header {
          background-color: #55abfc;
        }
      }

      &.flow-node-false {
        > header {
          background-color: #bc1d16;
        }
      }

      &.flow-node-plugins {
        > header {
          background-color: rgb(32, 145, 4);
        }
      }

      &.flow-node-approval {
        > header {
          background-color: rgba(188, 181, 58, 0.76);
        }
      }

      &.flow-node-cc {
        > header {
          background-color: #30b95c;
        }
      }

      &.flow-node-end {
        > header {
          height: 50px;
          line-height: 50px;
          background-color: rgb(0, 0, 0);
        }
      }
    }
  }
}
</style>