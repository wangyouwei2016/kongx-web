<template>
  <div>
    <el-row style="margin-bottom: 5px; margin-left: 5px; margin-right: 5px">
      <el-col :span="24 - span">
        <slot name="menu"></slot>
      </el-col>
      <el-col :span="span">
        <el-input
          clearable
          v-model="searchForm"
          :placeholder="placeholder"
          size="small"
          class="input-with-select"
        >
          <span
            slot="append"
            @click="loadData"
            type="primary"
            plain
            size="small"
            style="cursor: pointer"
          >
            <i class="el-icon-search"></i>
            搜 索
          </span>
        </el-input>
      </el-col>
    </el-row>
  </div>
</template>

<style >
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.input-with-select .el-input-group__append {
  background-color: #fff;
}
</style>
<script>
import { mapGetters } from "vuex";
export default {
  name: "searchBanner",
  data() {
    return {
      showItems: [],
      cacheItems: [],
      searchForm: null,
    };
  },
  props: {
    handleList: { type: Function, default: null },
    placeholder: { required: true },
    data: { required: false },
    searchProps: { required: false },
    page: { required: true },
    span: { default: 12 },
    refreshBtn: { default: true },
  },
  created() {
    if (this.systemProfile.id == -1) {
      this.$nextTick((_) => {
        this.$router.push("/wel/index");
      });
    } else {
      this.loadData();
    }
  },
  computed: {
    ...mapGetters(["systemProfile"]),
  },
  watch: {
    searchForm(val) {
      this.page.currentPage = 1;
      this.refresh(this.page, false);
    },
  },
  methods: {
    loadData() {
      this.searchForm = null;
      this.handleList().then((value) => {
        this.cacheItems = value || [];
        this.showItems = this.cacheItems;
        this.init();
      });
    },
    init() {
      this.page.currentPage = 1;
      this.refresh(this.page, false);
    },
    refresh(page, refresh) {
      if (this.searchForm && this.searchForm.trim() !== "") {
        this.showItems = this.cacheItems.filter((item) => this._filter(item));
      } else {
        this.showItems = this.cacheItems;
      }

      // this.page = page;
      this.callback(this._slice(), refresh);
    },
    _slice() {
      this.page.total = this.showItems.length;
      let _data = this.showItems.slice(
        (this.page.currentPage - 1) * this.page.pageSize,
        this.page.currentPage * this.page.pageSize
      );
      return _data;
    },
    callback(data, refresh) {
      let _results = {
        data: data,
        total: this.showItems.length,
        refresh: refresh,
      };
      this.$emit("search-change", _results);
    },
    _filterArray(prop, values) {
      if (!!!values) return false;
      var exists = false;
      for (var i = 0; i < values.length; i++) {
        var _value = values[i];
        exists = _value && _value.includes(this.searchForm.trim());
        if (exists) break;
      }
      return exists;
    },
    _filter(item) {
      var exists = false;
      // item.name.includes(this.searchForm.trim());
      for (var i = 0; i < this.searchProps.length; i++) {
        let prop = this.searchProps[i];
        var _name = prop.name;
        var _type = prop.type || "string";
        var _value = item[_name];
        switch (_type) {
          case "string":
            exists = _value && _value.includes(this.searchForm.trim());
            break;
          case "array":
            exists = this._filterArray(prop, _value);
            break;
          case "object":
            var _child = prop.childName;
            _value = _value && _value[_child];
            exists = _value && _value.includes(this.searchForm.trim());
            break;
        }
        if (exists) break;
      }
      return exists;
    },
  },
};
</script>