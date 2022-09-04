<template>
    <!--* data 展示的数据 :props label指定节点标签为节点对象的某个属性值 -->
        <el-row
          type="flex" 
          justify="space-between" 
          align="middle"
          style="height:40px;width: 100%;" 
          :default-expand-all="true">
        <el-col>
          <span>{{ TreeNode.name }}</span>
        </el-col>
        <el-col :span="4">
          <el-row type="flex" justify="end">
            <el-col>{{ TreeNode.manager }}</el-col>
            <el-col>
              <el-dropdown @command="handleCommand">
                <span>
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item 
                    command="add">添加部门</el-dropdown-item>
                  <el-dropdown-item 
                    v-if="!isRoot" 
                    command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item 
                    v-if="!isRoot" 
                    commadn="dele">删除部门</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
</template>

<script>
import { deleteDepartment } from '@/api/department'
export default {
  name: 'Treeools',
  props:{
    //! 父组件传递slot-scope插槽对象
    TreeNode:{
      type: Object,
      required: true
    },
    //! 负责人展示一条 剩余展示三条
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {      
    }
  },
  methods: {
    handleCommand(type) {
      if(type === 'add') {
        //! 点击告诉父组件 显示弹窗 为什么传递TreeNode 因为是添加子部门 需要当前部门的数据
        this.$emit('addDepts',this.TreeNode)
      } else if (type === 'edit') {
        //! 编辑
        this.$emit('btnEdit',this.TreeNode)
      } else {
        //! type != 以上 则 删除 使用ElementUI 提示框 这里只是把后台数据删掉了 重新调用一下接口就行了
        this.$confirm('确定删除组织架构信息吗?').then(() => {
          //!传入参数ID 点击确认返回promise对象 进入then 
          return deleteDepartment(this.TreeNode.id)
        }).then(() => {
          this.$emit('deletement')
          this.$message('删除组织架构成功')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>