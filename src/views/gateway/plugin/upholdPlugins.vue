<template>
  <div>
    <div style="margin-bottom:10px;">
      <el-col span="5"></el-col>启用：
      <el-switch v-model="plugin.enabled"></el-switch>
    </div>
    <avue-form :option="pluginColumn" v-model="pluginForm" @submit="handlePlugin">
      <template v-for="column in slotColumns" :slot="column.slot">
        <el-col :key="column.slot">
          <el-form-item
            v-for="item in column.option.column"
            :key="item.label"
            :label="item.label"
            size="small"
          >
            <el-input :value="item.label"></el-input>
          </el-form-item>
        </el-col>
      </template>
      <template v-for="tagItem in tagsColumn" :slot="tagItem.slot">
        <item-tags
          mode="edit"
          :tags="pluginForm[tagItem.column]"
          @sendTag="bindTags"
          :name="tagItem.name"
          :column="tagItem.column"
          :key="tagItem.name"
        ></item-tags>
      </template>
    </avue-form>
  </div>
</template>
<style>
.avue-group__title {
  margin-left: 10px;
}
</style>
<script>
import { serviceRouteOption, routeColumn } from "@/const/table/gatewayOption";
import {
  findPluginSchema,
  pluginSave,
  pluginUpdate
} from "@/api/gateway/plugins";
import ItemTags from "@/components/ItemTags";
export default {
  name: "plugin",
  components: { ItemTags },
  data() {
    return {
      pluginColumn: { column: [] },
      pluginForm: { enabled: true },
      slotColumns: [],
      tagsColumn: [],
      config: {}
    };
  },
  props: {
    plugin: {
      type: Object,
      required: true,
      config: {}
    },
    edit: { required: false },
    fields: { type: Object }
  },
  created() {
    this.pluginForm = this.plugin["config"] || {};
    this.querySchema();
  },
  methods: {
    bindTags(data) {
      this.config = Object.assign(this.config, data);
    },
    querySchema() {
      this.fields.forEach(item => {
        for (var v in item) {
          let _column = this.createColumn(v, item[v]);
          this.pluginColumn.column.push(_column);
        }
      });

      if (this.slotColumns.length > 0) {
        let _pluginColumns = { group: [], card: true };
        let defaultGroup = { label: "基本信息", column: [] };
        let _slotGroups = [];
        this.pluginColumn.column.forEach(_column => {
          let exists = false;
          this.slotColumns.forEach(slotColumn => {
            if (slotColumn.slot == _column.prop) {
              exists = true;
              var columns = [];
              slotColumn.option.column.forEach(itemColumn => {
                itemColumn.prop = slotColumn.slot + "_" + itemColumn.prop;
                itemColumn["type"] == "array" &&
                  this.createTagColumn(itemColumn.prop);
                columns.push(itemColumn);
                var childRealProp = itemColumn.prop.replace(
                  slotColumn.slot + "_",
                  ""
                );
                console.log(
                  "itemColumn",
                  itemColumn,
                  itemColumn.prop,
                  ",slotColumn.slot",
                  slotColumn.slot
                );
                if (this.plugin.config[slotColumn.slot]) {
                  this.pluginForm[itemColumn.prop] = this.plugin.config[
                    slotColumn.slot
                  ][childRealProp];
                } else {
                  if (itemColumn["type"] == "array") {
                    this.pluginForm[itemColumn.prop] = [];
                  } else {
                    this.pluginForm[itemColumn.prop] = itemColumn.value;
                  }
                }
              });
              _slotGroups.push({
                label: slotColumn.slot,
                column: columns
              });
            }
          });

          if (!exists) defaultGroup.column.push(_column);
        });
        _pluginColumns.group.push(defaultGroup);
        _pluginColumns.group.push(..._slotGroups);
        this.pluginColumn = _pluginColumns;
      }
    },
    createTagColumn(label) {
      let tagItem = {};
      tagItem.slot = label;
      tagItem.tags = this.plugin.config[label] || [];
      tagItem.column = label;
      tagItem.name = label;
      this.tagsColumn.push(tagItem);
    },
    createColumn(label, item, child) {
      let _column = {
        label: label,
        span: 24,
        prop: label,
        labelWidth: 220,
        rules: [],
        value: null
      };
      _column.value = item["default"];
      let _fields = item["fields"];
      if (_fields) {
        _column.formslot = true;
        let children = { option: { column: [] }, slot: "" };
        children.slot = label;
        children.form = {};
        _fields.forEach(item => {
          for (var v in item) {
            children.option.column.push(this.createColumn(v, item[v], true));
          }
        });
        this.slotColumns.push(children);
      } else if (item["type"] == "array") {
        _column.type = "array";
        _column.formslot = true;
        this.createTagColumn(label);
      } else {
        let type = item["type"];
        if (type && type.trim() != "") {
          type = this.getType(type);
        }
        //设置为必填项
        if (item["required"]) {
          _column["rules"].push({
            required: item["required"],
            message: "请填写" + label,
            trigger: "blur"
          });
        }
        //获取默认值
        if (item["default"] && !!!child) {
          this.pluginForm[label] = item["default"];
        }

        _column.type = type;
        //为下拉表时，设置dicData;
        if (item["one_of"]) {
          _column.type = "select";

          var _dics = [];
          item["one_of"].forEach(label => {
            _dics.push({ label: label, value: label });
          });
          _column.dicData = _dics;
        }
      }
      return _column;
    },
    getType(type) {
      switch (type) {
        case "boolean":
          return "switch";
        case "integer":
          return "number";
        case "number":
          return "number";
        case "array":
          return "Array";
      }
      return "string";
    },
    handlePlugin(row, done) {
      var _config = {};
      for (var p in this.pluginForm) {
        let _value = this.pluginForm[p];
        if (p.indexOf("$") == -1 && p != "enabled" && _value != "") {
          _config[p] = _value;
        }
      }
      console.log(_config);
      this.pluginForm = _config;
      this.plugin.config = Object.assign(this.pluginForm, this.config);
      this.slotColumns.forEach(parentColumn => {
        var _column = parentColumn.slot;
        parentColumn.option.column.forEach(childColumn => {
          var _columnConfig = this.plugin.config[childColumn.prop];

          if (_columnConfig === "" || _columnConfig) {
            delete this.plugin.config[childColumn.prop];
            let _parentConfig = this.plugin.config[parentColumn.slot] || {};
            var childRealProp = childColumn.prop.replace(
              parentColumn.slot + "_",
              ""
            );

            _parentConfig[childRealProp] =
              _columnConfig === "" ? null : _columnConfig;
            this.plugin.config[parentColumn.slot] = _parentConfig;
          }
        });
      });
      if (this.edit == "edit") {
        pluginUpdate(this.plugin).then(res => {
          let _data = res.data;
          if (_data.status != 0) {
            this.$errorInfo(_data.errmsg);
          } else {
            this.plugin = _data.data;
            this.$successInfo("修改成功");
            this.callback();
          }
          done();
        });
      } else if (this.edit == "add") {
        this.plugin["enabled"] = true;
        pluginSave(this.plugin).then(res => {
          let _data = res.data;
          if (_data.status != 0) {
            this.$errorInfo(_data.errmsg);
          } else {
            this.plugin = _data.data;
            this.edit = true;
            this.$successInfo("新增成功");
            this.callback();
          }
          done();
        });
      }
    },
    callback() {
      this.$emit("callback", {});
    }
  }
};
</script>