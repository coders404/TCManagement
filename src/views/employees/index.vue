<template>
  <div>
<!--? 插槽预留组件 -->
<!--???????????????? -->
    <page-tools :show-before="true">
      <span slot="before">共{{ page.total }}条记录</span>
      <template v-slot:after>
        <el-button type="danger" size="small">普通excel导出</el-button>
        <el-button type="info" size="small">复杂excel表格导出</el-button>
        <el-button type="success" size="small">excel导入</el-button>
        <el-button 
          type="primary" 
          size="small" 
          @click="showDialog = true"
          >新增员工</el-button>
      </template>
    </page-tools>
<!--? table表格架构 -->
<!--????????????????? -->
    <el-card>
      <el-table border :data="list"> 
        <el-table-column label="序号" sortable="" type="index" align="center" width="60px" />
          <el-table-column label="姓名" sortable="" prop="username" align="center" />
          <el-table-column 
            label="工号" 
            sortable="" 
            prop="formOfEmployment" 
            align="center" 
            :formatter="formEmployeeEnum" />
            <el-table-column
              label="手机号"
              sortable=""
              prop="mobile"
              align="center" />
          <el-table-column label="聘用形式" sortable="" prop="workNumber" align="center" />
          <el-table-column label="部门" sortable="" prop="departmentName" align="center" />
          <el-table-column label="入职时间" sortable="" prop="correctionTime" align="center">
            <!--? 作用域插槽格式化日期时间 -->
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="formEmployeeEnum">
            <template slot-scope="{ row }">
              <el-switch 
                active-color="#13ce66"
                inactive-color="#ff4949"
                :value="row.formEmployeeEnum === 1"> 
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column 
            type="flex" 
            label="操作" 
            sortable="" 
            fixed="right"
            width="280px">
            <template slot-scope="{ row }">
<!--? 跳转到详情页面 /employees/detail/:id -->
              <el-button 
                type="text" 
                size="small" 
                @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
      </el-table>
<!--? 分页组件 -->
<!--????????????? -->
      <el-row type="flex" justify="center" align="middle">
        <el-pagination 
          layout="prev,pager,next"
          :page-size="page.pagesize"
          :total="page.total"
          @current-change="currentChange" />
      </el-row>
    </el-card>
<!--?弹层组件 -->
<!--???????????? -->
    <add-employee :show-dialog.sync="showDialog"></add-employee>
<!--? 角色弹层组件 -->
<!--???????????????? -->
    <assign-role 
      :show-role-dialog.sync="showRoleDialog"
      :user-id="userId"
      ref="userRole">
    </assign-role>
  </div>  
</template>
<script>

//! 员工列表整和数据 删除员工
import { getEployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'

//! 引入弹层组件
import addEmployee from '@/components/add-employee'
import AssignRole from './assign-role'
import checkPermission from '@/mixin/checkPermission'

export default {
  name: 'employees',
  components: {
    addEmployee,
    AssignRole
},
  data() {
    return {
      loading: false, //! 加载动画
      list: [], //! 员工列表所有数据整合
      page: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      showDialog: false,
      showRoleDialog: false, //! 传递角色子组件弹窗按钮
      userId: null //! 传递子组件ID值
    }
  },
  created() {
    this.getEployeeList() //! 请求员工列表数据
  },  
  methods: {
    async getEployeeList() {
      const { rows, total } = await getEployeeList(this.page) //! 获取员工数据
      this.loading = true
      this.list = rows
      this.page.total = total
      this.loading = false
    },
    currentChange(newValue) { //! currentChange改变页码触发此事件
      this.page.page = newValue
      this.getEployeeList() //? 重新拉取数据
    },
    formEmployeeEnum( row, column, cellValue, index ) { //? 格式化员工工号 cellValue 就是里面的值 
      const obj = EmployeeEnum.hireType.find( item => item.id === cellValue) //? find返回数组中满足提供函数第一个元素的值 不改变原数组
      return obj ? obj.value : '未知状态'
    },
    async deleteEmployee(id) { //! 删除员工 通过confirm进行判定是否确认删除 取消无法监听 通过try catch 捕获
      try {
        this.$confirm('您确定删除员工吗?')
        await delEmployee(id)
      this.getEployeeList() //? 重新调用员工数据请求
        this.$message.success('删除成功')
      } catch(error) {
        console.log(error)
      }
    },
    async editRole(id) {
      this.userId = id
      await this.$refs.userRole.getUserDetailById(id)
      this.showRoleDialog = true
    }
  }
}
</script>
<style lang="scss" scoped>
</style>