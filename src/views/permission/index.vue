<template>
  <div>
    <page-tools>
      <template v-slot:after>
        <el-button 
          type="primary" 
          size="small" 
          @click="addPermission(1,'0')">添加权限</el-button>
      </template>
    </page-tools>
    <el-table :data="list" row-key="id">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column align="center" label="标识" prop="code"></el-table-column>
        <el-table-column align="center" label="描述" prop="description"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <el-button 
              type="text" 
              size="small" 
              v-if="row.type === 1"
              @click="addPermission(row.id, 2)">添加</el-button>
            <el-button 
              type="text" 
              size="small" 
              @click="editPermission(row.id)">编辑</el-button>
            <el-button 
              type="text" 
              size="small" 
              @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="编辑权限" :visible="showPermisssionDialog" @close="btnCancel">
        <el-form label-width="120px" :model="formData" :rules="rules" ref="perForm">
          <el-form-item label="权限名称" prop="name">
            <el-input style="width: 90%" v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input style="width: 90%" v-model="formData.code"></el-input>
          </el-form-item>
          <el-form-item label="权限描述" prop="description">
            <el-input style="width: 90%" v-model="formData.description"></el-input>
          </el-form-item>
          <el-form-item label="开关" prop="enVisible">
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"></el-switch>
          </el-form-item>
        </el-form>
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button type="primary" size="small" @click="btnOK">确定</el-button>
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
  </div>
</template>

<script>
  //! 获取所有权限点
import { getPermissionList, delPermission, addPermission, updatePermission, getPermissionDetail } from '@/api/permission'
  //! 处理树形数据
import { tranListToTreeData } from '@/utils/auth'
export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      formData: { //! 用于弹层表单
        name: '',
        type: '',
        code: '',
        description: '',
        pid: '',
        enVisible: '1'
      },
      rules: {
        name: [
          {required: true, message: '请输入权限名称', trigger: 'blur'},
        ],
        code: [
          { required: true, message: '请输入权限标识', trigger: 'blur' }
        ]
      },
      showPermisssionDialog: false //! 控制新增权限弹层
    }
  },
  created() {
    this.getPermissionList() //!获取权限点数据
  },
  methods: {
    async getPermissionList() { //! 得到的不是树形数据结构 需要处理
      //! 第二个参数不是空串 因为接口数据中是 0
      this.list = tranListToTreeData(await getPermissionList(), '0')
    },
    async delPermission(id) {
      //! 根据传入的id进行删除
      try {
        await this.$confirm('确认删除吗')
        await delPermission(id)
        this.getPermissionList()
        this.$message.success('删除成功')
      } catch(error) {
        console.log(error)
      }
    },
    addPermission(type,pid) { //! 添加数据
      this.formData.type = type
      this.formData.pid = pid
      this.showPermisssionDialog = true
    },
    btnOK() { //! 点击确定进行添加权限
      this.$refs.perForm.validate().then(() => {
        if(this.formData.id) {
          return updatePermission(this.formData)
        }
          return addPermission(this.formData)
      }).then(() => {
        this.$message.success("添加权限成功")
        this.getPermissionList()
        this.showPermisssionDialog = false
      }) 
    },
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.perForm.resetFields() //! 重新开启校验模式
      this.showPermisssionDialog = false //! 设置弹窗为关闭模式
    },
    addPermission(pid, type) {  //! 点击添加的时候在formData中存储要插入的id信息 判断是新增权限 还是新增子节点按钮操作权力
      this.formData.pid = pid
      this.formData.type = type
      this.showPermisssionDialog = true
    },
    async editPermission(id) {
      this.formData = await getPermissionDetail(id)  //! 根据id获取详情数据 回退数据使用
      this.showPermisssionDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>