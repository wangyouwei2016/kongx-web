<template>
  <div>
    <el-tag
      :key="tag"
      v-for="tag in dynamicTags"
      :closable="mode=='view'?false:true"
      :disable-transitions="false"
      @close="handleClose(tag)"
    >{{tag.name}}</el-tag>

    <el-autocomplete
      ref="saveTagInput"
      v-if="inputVisible"
      popper-class="my-autocomplete"
      v-model="state"
      :fetch-suggestions="remoteMethod"
      placeholder="请输入角色名称检索"
      @select="handleSelect"
      style="margin-left:10px;"
    >
      <i class="el-icon-edit el-input__icon" slot="suffix"></i>
      <template slot-scope="{ item }">
        <div class="name">{{ item.name }}</div>
        <span class="addr">{{ item.mobile }}</span>
      </template>
    </el-autocomplete>
    <el-button
      v-else
      class="button-new-tag el-icon-plus"
      v-show="mode=='add'"
      size="small"
      @click="showInput"
    >新增角色</el-button>
  </div>
</template>
<style>
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }
    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>
<script>
import { mapGetters } from "vuex";
import { findAllRoles } from "@/api/admin/role";
import { setGroupRole, deleteGroupRole } from "@/api/admin/usergroup";
export default {
  data() {
    return {
      dynamicTags: [],
      loading: false,
      options: [],
      state: null,
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.init();
  },
  props: {
    option: {},
    mode: {},
    userGroup: {}
  },
  computed: {
    ...mapGetters(["permission"])
  },
  methods: {
    init() {
      let profile = this.option.profiles[0];
      if (!this.permission.usergroup_config) {
        this.mode = "view";
      }
      _.forEach(this.userGroup.profileRoles, item => {
        if (item.profile == profile.label) {
          this.dynamicTags = item.roleList;
        }
      });
    },
    handleSelect(item) {
      let _index = _.findIndex(this.dynamicTags, user => {
        return item.id == user.id;
      });
      if (_index == -1) {
        setGroupRole(this.userGroup.id, item.id, this.option.profiles).then(
          res => {
            if (res.data.status == 0) {
              this.dynamicTags.push(item);
              this.$successInfo("新增角色成功");
            } else {
              this.$errorInfo(res.data.errmsg);
            }
          }
        );
      } else {
        this.$errorInfo(item.name + " 已经设置过了");
      }
    },

    handleClose(tag) {
      deleteGroupRole(this.userGroup.id, tag.id, this.option.profiles).then(
        res => {
          if (res.data.status == 0) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            this.$successInfo("删除角色成功");
          } else {
            this.$errorInfo(res.data.errmsg);
          }
        }
      );
    },
    remoteMethod(query, cb) {
      if (query !== "") {
        this.options = this.option.roleList.filter(item => {
          return item.name.indexOf(query) > -1;
        });
      } else {
        this.options = this.option.roleList;
      }
      cb(this.options);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    }
  }
};
</script>