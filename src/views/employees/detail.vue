<template>
  <div>
<!--? 详情页面表格数据 -->
<!--???????????????????? -->
<el-card class="app-container">
  <el-tabs>
    <el-tab-pane label="登录账户设置">
      <el-form 
        label-width="120px" 
        style="magin-left:120px;margin-top:50px"
        :model="userInfo"
        :rules="rules"
        ref="formData">
        <el-form-item label="姓名" prop="username">
          <el-input 
            placeholder="管理员" 
            style="width:300px"
            v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password2">
          <el-input 
            placeholder="请输入密码" 
            style="width:300px" 
            type="password"
            v-model="userInfo.password2"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            size="medium"
            @click="saveUser">更新</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <!--? 动态引入组件更换状态 -->
    <el-tab-pane label="个人详情">
      <component :is="userComponents"></component>
    </el-tab-pane>
    <el-tab-pane label="岗位信息">
      <component :is="jobComponents"></component>
    </el-tab-pane>
  </el-tabs>
</el-card>
  </div>
</template>

<script>
//! 获取员工基本信息
import { getUserDetailById } from '@/api/user'
//! 保存个人的基本信息
import { saveUserDetailById } from '@/api/employees'
//! 导入个人信息组件
import userInfo from '@/components/user-info'
import jobInfo from '@/components/job-info'
export default {
  name: 'detail',
  components: {
    userInfo,
    jobInfo
  },
  data() {
    return {
      userComponents: 'userInfo',
      jobComponents: 'jobInfo',
      //* 获取到url路由参数里面的id 给接口中传参
      userId: this.$route.params.id,
      userInfo: {
        username: '',
        password2: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        password2: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 9, message: '密码是6-9位', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    saveUser() {
      // saveUserDetailByid({...this.userInfo}, password: password2)
      this.$refs.formData.validate().then( async () => {
        await saveUserDetailById({...this.userInfo, password: this.userInfo.password2})
        this.$message.success('修改用户信息成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>