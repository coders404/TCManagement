<template>
  <div class="app-container">
<!--? 表单弹层组件 -->
<!--??????????????????? -->
    <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
      <el-form label-width="120px" :model="formData" :rules="rules" ref="formData">
      <el-form-item label="姓名" prop="username">
        <el-input 
          style="width:50%" 
          placeholder="请输入姓名"
          v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input 
          style="width:50%" 
          placeholder="请输入手机号"
          v-model="formData.mobile"></el-input>
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker 
          style="width:50%" 
          placeholder="请选择日期"
          v-model="formData.timeOfEntry"></el-date-picker>
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          style="width:50%"
          placeholder="请选择"
          v-model="formData.formOfEmployment">
          <el-option v-for="item in Employees.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input 
          style="width:50%" 
          placeholder="请输入工号"
          v-model="formData.workNumber"></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input 
          style="width:50%" 
          placeholder="请选择部门"
          v-model="formData.departmentName"
          @focus="department" />
          <!--? 在input下面进行显示 -->
          <el-tree
            v-if="showTree"
            v-loading="loading"
            :data="treeData"
            :props="{label: 'name'}"
            default-expand-all=""
            @node-click="changeNode"
             />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker 
          style="width:50%" 
          placeholder="请选择时间"
          v-model="formData.correctionTime"></el-date-picker>
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
  </div>
</template>

<script>
//! 导入部门负责人信息
import { department } from '@/api/department'
//! 导入树状解构递归处理方法
import { tranListToTreeData } from '@/utils/auth'
//! 导入聘用形式的工具方法
import Employees  from '@/api/constant/employees'
//! 新增员工API
import { addEmployee } from '@/api/employees'
export default {
  name: 'addEmployee',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //* 聘用形式的数据导入
      Employees,
      //* 添加校验规则
      formData:{
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: { //* 表单校验规则
        username: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
          {min:2, max: 4, message: '用户姓名1-4位', trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {pattern: /^1[3-9]\d{9}$/, message: '手机格式不正确', trigger: 'blur'}
        ],
        timeOfEntry: [
          {required: true, message: '请输入入职时间', trigger: 'blur'}
        ],
        formOfEmployment: [
          {required: true, trigger: 'blur'}
        ],
        workNumber: [
          {required: true, message: '请输入工号', trigger: 'blur'}
        ],
        departmentName: [
          {required: true, message: '请选择部门', trigger: 'change'}
        ],
        correctionTime: [
          {required: true, message: '请选择时间', trigger: 'blur'}
        ]
      },
      //* 定义接收树状解构的参数
      treeData: [],
      loading: false,
      showTree: false //* 控制el-tree的显示和隐藏
    }
  },
  methods: {
    async department() { //* 
      this.showTree = true
      this.loading = true
      const { depts } = await department()
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    changeNode(node) {  //*节点选中变化时候的回调
      console.log(node);
      this.formData.departmentName = node.name
      this.showTree = false
    },
    async btnOK() {
      try {
        await addEmployee(this.formData)
        this.$message.success('新增员工成功')
        this.$parent.getEployeeList() //* 通知父组件更新数据
        this.$refs.formData.resetFields() //* 重置校验规则
        this.$parent.showDialog = false //* 通知父组件关闭弹层
      } catch(error) { 
        console.log(error)
      }
    },
    btnCancel() {
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.formData.resetFields() //* 重置校验规则
      this.$emit("update:showDialog",false) //* update后面是需要修改的属性 后面属于是你要修改的值 父组件修改的化可以直接通过 sync直接获取到
    }
  }
}
</script>

<style lang="scss" scoped>
</style>