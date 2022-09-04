<template>
  <div>
    <el-dialog title="分配角色" :visible="showRoleDialog">
      <el-checkbox-group v-model="roleIds">
        <el-checkbox 
          v-for="item in list" 
          :key="item.id" 
          :label="item.id">{{item.name}}</el-checkbox>
      </el-checkbox-group>
      <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button type="primary" size="small" @click="btnOK">确认</el-button>
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
    </el-dialog>
  </div>
</template>

<script>
//! 获取当前用户角色
//! 获取所有用户角色信息  
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  name: 'AssignRole',
  props: {
    showRoleDialog: { //! 控制弹层关闭
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [], //! 为所有用户的角色
      roleIds : [] //! 为当前用户拥有的角色
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList()
      this.list = rows
    },
    async getUserDetailById(id) { //! props是异步的
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds 
    },
    async btnOK() { //! 给用户分配角色
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$emit('update:showRoleDialog',false)
      this.$message.success('给用户添加角色成功')
    },
    btnCancel() {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>