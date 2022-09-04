<template>
  <div class="app-container">
    <el-card>
      <el-tabs>
<!--? 角色管理 -->
<!--??????????????????????? -->
        <el-tab-pane label="角色管理">
          <!--? 按钮 -->
          <el-button 
            type="primary" 
            height="60"
            @click="showDialog = true">新增角色</el-button>
          <!--? 表格 -->
          <el-table
            border="" 
            style="margin-top: 60px"
            :data="list">
            <!--? 列 -->
            <el-table-column label="序号" width="120" align="center" type="index" />
            <el-table-column label="名称" width="240" align="center" prop="name" />
            <el-table-column label="描述" align="center" prop="description" />
            <el-table-column label="操作" align="center">
              <template slot-scope="{ row }">  
                <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                <el-button size="small" type="danger" @click=deleteRole(row.id)>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--? 分页组件 -->
          <el-row
            type="flex"
            justify="center"
            align="middle"
            style="height: 60px"
          >
            <!--? 分页组件 -->
            <el-pagination 
              layout="prev,pager,next"
              :total="page.total"
              :current-page="page.page"
              :page-size="page.pagesize"
              @current-change="changePage"></el-pagination>
          </el-row>
        </el-tab-pane>
<!--? 公司信息 -->
<!--??????????????????????? -->
        <el-tab-pane label="公司信息">
          <!--? 提示信息-->
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            show-icon
            type="info"
            :closable="false"
          ></el-alert>
          <!--? 表单数据 -->
          <el-form label-width="120px" style="margin-top:50px" >
            <el-form-item label="公司名称">
              <el-input disabled style="width: 400px" v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input disabled style="width: 400px" v-model="formData.companyAddress"></el-input>
            </el-form-item>
            <el-form-item label="公司邮箱">
              <el-input disabled style="width: 400px" v-model="formData.mailbox"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                disabled
                style="width: 400px"
                type="textarea"
                :row="3"
                v-model="formData.remarks"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
<!--? 定义弹层信息 -->
<!--??????????????????????? -->
    <el-dialog :visible="showDialog" title="编辑弹层" @close="btnCancel">
<!--* 表单验证的先决条件 1 form动态绑定model 绑定rules form-item绑定prop el-input绑定model下面的属性-->
      <el-form 
       :model="ruleForm" 
       :rules="rules" 
       label-width="120px"
       ref="ruleForm">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="ruleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center" align="middle">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
<!--? 定义权限分配弹层 -->
<!--???????????????????????? -->
    <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermOK">
      <el-tree
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :default-expand-all="true"
        :check-strictly="true"
        :default-checked-keys="selectCheck"
        node-key="id"
        ref="premsRole"
        >
      </el-tree>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button 
            type="primary" 
            size="small"
            @click="btnPermOK">确认</el-button>
          <el-button 
            size="small"
            @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
//* 导入api
import { 
    getRoleList, getCompanyInfo, deleteRole, 
    getRoleDetail, upDateRole, addRole, assignPerm} from "@/api/setting"
//* 引入获取权限api
import { getPermissionList } from "@/api/permission" 
import { tranListToTreeData } from "@/utils/auth"
//* 导入vuex
import { mapGetters } from "vuex"
export default {
  name: "setting",
  data() {
    return {
      list: [], //! 承接数组数据
      page: {
        page: 1,
        pagesize: 10,
        total: 0 //! 记录总数
      },
      formData: {}, //! 公司信息
      showDialog: false, //! 显示弹层
      ruleForm: {}, //! 专门接收新增或者编辑的表单数据
      rules: {  //!定义校验规则
        name: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ]
      },
      //! 定义权限分配数据
      permData: [],  //! 用来接收权限数据 树形数据
      showPermDialog: false, //! 控制弹层数据
      defaultProps: {
        label: 'name'
      },
      roleId: null, //! 应该获取这个id的权限点 有这个角色的id就应该记录下来
      selectCheck: []  //! 用于记录当前权限点的标识
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList() //! 获取角色列表
    this.getCompanyInfo() //! 获取公司信息
  },
  methods: {
    async getRoleList() { //! 获取角色列表 
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },  
    async getCompanyInfo() { //! 获取公司信息
      this.formData = await getCompanyInfo(this.companyId)
      console.log(this.formData);
    },
    //* @current-change 当current-size改变的时候调用钩子！
    changePage(newValue) {
      this.page.page = newValue
      //* 重新调用api渲染
      this.getRoleList()
    },
    async deleteRole(id) { //! 删除角色信息 id 是row里面解析出来的数据 解析list里面的
      try {
        await this.$confirm('您确认删除该角色吗')
        deleteRole(id)
        this.getRoleList()
        this.$message('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) { //! 编辑角色
      this.ruleForm = await getRoleDetail(id) //* 实现数据的回写 先获取数据 弹层 没有一闪而过的场景
      this.showDialog = true
    },
    async btnOK() { //! 确定弹层
      try {
        await this.$refs.ruleForm.validate() //* validate()传入一个回调 不传默认Promise 可用try catch()
      if (this.ruleForm.id) { //* 有id 编辑
        await upDateRole(this.ruleForm) //* 传递已经编辑好的数据 
      } else { //* 无id 新增
        await addRole(this.ruleForm) 
      }
      this.getRoleList() //* 重新拉取数据
      this.showDialog = false //* 关闭弹层
      this.$message.success('编辑角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() { //! 取消弹层
      this.roleForm = {
        name: '',
        description: '' 
      }
      this.$refs.ruleForm.resetFields()
      this.showDialog = false
    },
    async assignPerm(id) {
      this.roleId = id
      //! 点击的时候把id存下来 后面分配权限知道是给谁分配的
      this.permData = tranListToTreeData(await getPermissionList(), '0')
      const { permIds } = await getRoleDetail(id) //! 获取当前角色的权限点
      this.selectCheck = permIds
      this.showPermDialog = true
    },
    async btnPermOK() {
      await assignPerm({permIds: this.$refs.premsRole.getCheckedKeys(), id: this.roleId})
      this.$message.success('设置权限成功')
      this.showPermDialog = false
    },
    btnPermCancel() {
      this.selectCheck = []
      this.showPermDialog = false
    }
  }
}
</script>
<style lang="scss" scoped></style>
