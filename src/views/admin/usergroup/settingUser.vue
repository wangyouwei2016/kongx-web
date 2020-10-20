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
      placeholder="请输入姓名进行检索"
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
    >新增用户</el-button>
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
import { findAllUsers } from "@/api/admin/user";
import { setGroupUser, deleteGroupUser } from "@/api/admin/usergroup";
export default {
  data() {
    return {
      dynamicTags: this.userGroup.userList,
      loading: false,
      options: [],
      state: null,
      userLists: [],
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.init();
  },
  props: {
    mode: {},
    userGroup: {}
  },
  computed: {
    ...mapGetters(["permission"])
  },
  methods: {
    init() {
      findAllUsers().then(res => {
        this.userLists = res.data.data;
        this.options = this.userLists;
      });
      if (!this.permission.usergroup_config) {
        this.mode = "view";
      }
    },
    handleSelect(item) {
      let _index = _.findIndex(this.dynamicTags, user => {
        return item.userId == user.userId;
      });
      if (_index == -1) {
        setGroupUser(this.userGroup.id, item.userId).then(res => {
          if (res.data.status == 0) {
            this.dynamicTags.push(item);
            this.$successInfo("新增用户成功");
          } else {
            this.$errorInfo(res.data.errmsg);
          }
        });
      } else {
        this.$errorInfo(item.name + " 已经设置过了");
      }
    },
    handleClose(tag) {
      deleteGroupUser(this.userGroup.id, tag.userId).then(res => {
        if (res.data.status == 0) {
          this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
          this.$successInfo("删除用户成功");
        } else {
          this.$errorInfo(res.data.errmsg);
        }
      });
    },
    remoteMethod(query, cb) {
      if (query !== "") {
        this.options = this.userLists.filter(item => {
          return item.name.indexOf(query) > -1;
        });
      } else {
        this.options = this.userLists;
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