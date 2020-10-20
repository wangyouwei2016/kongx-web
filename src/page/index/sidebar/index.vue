<template>
  <div class="avue-sidebar">
    <logo></logo>
    <el-scrollbar style="height:100%">
      <el-menu unique-opened
               :default-active="nowTagValue"
               mode="vertical"
               :show-timeout="200"
               background-color="#20222a"
               text-color="rgba(255,255,255,0.7)"
               :collapse="keyCollapse">
        <sidebar-item :menu="menu | menuFilter(developerId)"
                      first
                      :screen="screen"
                      :props="website.menu.props"
                      :collapse="keyCollapse"></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import logo from '../logo';
import sidebarItem from './sidebarItem'
export default {
  name: 'sidebar',
  components: { sidebarItem, logo },
  data () {
    return {}
  },
  filters: {
    menuFilter (value,devId) {
      /**
       * 过滤
       * 是否是开发者判断
       * @param value
       * @returns {*}
       */
      if(!devId) {
        let data = [];
        value.filter(item => {
          if(!(item.path.includes('ctrl'))) {
            data.push(item);
          }
        });
        return data;
      }else{
        return value;
      }
    }
  },
  created () {
    this.$store.dispatch("GetMenu").then(data => {
      if (data.length === 0) return
      this.$router.$avueRouter.formatRoutes(data, true);
    })
  },
  computed: {
    ...mapGetters(['website', 'menu', 'tag', 'keyCollapse', 'screen', 'developerId']),
    nowTagValue: function () { return this.$router.$avueRouter.getValue(this.$route) }
  },
  mounted () { },
  methods: {}
}
</script>
<style lang="scss" scoped>
</style>

