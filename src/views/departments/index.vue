<template>
  <div class="app-container">
    <el-card class="tree-card">
      <!--! 上插槽内容 -->
      <tree-tools 
        :tree-node="company" 
        :is-root="true"
        @addDepts="addDepts"></tree-tools>
      <!--! 右侧插槽内容 -->
    <el-tree 
      :data="departs" 
      :props="defaultprops" 
      :default-expand-all="true">
    <!--! 解构出来插槽中内容 传递给子组件 -->
      <tree-tools 
        slot-scope="{ data }" 
        :tree-node="data"
        @deletement="department"
        @addDepts="addDepts"
        @btnEdit="btnEditClose"></tree-tools>
    </el-tree>
    <!--* 传递属性咯控制组件弹窗 -->
    <add-tools 
      :show-dialog="showDialog"
      :tree-node="node"
      @addDepts="department"
      :showDialog.sync="showDialog"
      ref="addDart"></add-tools>
    </el-card>
  </div>
</template>

<script>
//* 组件
import TreeTools from './components/TreeTools'
import addTools from './components/addTools.vue'

//* 接口 方法
import { department } from '@/api/department'
import { tranListToTreeData } from '@/utils/auth'
export default {
  name: 'departments',
  components: {
    TreeTools,
    addTools
  },
  data() {
    return {
      company: {},
      defaultprops: {
        label: 'name'
      },
      departs: [],
      showDialog: false, //! 新增弹窗组件 默认隐藏
      //! node就是当前点击的对象 发送给子组件 当判定条件
      node: null
    }
  },
  created(){
    this.department()
  },
  methods:{
    async department() {
      const result = await department()
      console.log(result)
      this.company = { name: result.companyName, manager: '负责人', pid: ''} // 这里定义一个空串  因为 它是根 所有的子节点的数据pid 都是 ""
      //* 请求的树状解构的数据 面试亮点 递归解析树状解构
      this.departs = tranListToTreeData(result.depts, "")
    },
    addDepts(node) {
      this.showDialog = true
      this.node = node
    },
    //! 点击显示编辑处弹层
    btnEditClose(node) {
      this.showDialog = true,
      this.node = node
      //* props传递的数据是异步的 有可能参数还没传递过去 就已经显示了 所以通过$refs方式 这里必穿参数是id 也就是node.id
      this.$refs.addDart.getDepartDetail(this.node.id)
    }
  }
}
</script>
<style lang="scss" scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>