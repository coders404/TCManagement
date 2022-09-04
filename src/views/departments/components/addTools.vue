<template>
  <el-dialog 
    :title="showTitle"   
    :visible="showDialog" 
    @close="btnCancel">
    <el-form  
      lable-width= "120px" 
      :model="formData" 
      :rules="rules" 
      ref="deptForm">
      <el-form-item 
        label="部门名称" 
        prop="name">
        <el-input
          style="width:80%" 
          placeholder="1-50个字符" 
          v-model="formData.name">
        </el-input>
      </el-form-item>
      <el-form-item 
        label="部门编码" 
        prop="code">
        <el-input 
          style="width:80%" 
          placeholder="1-50个字符" 
          v-model="formData.code"></el-input>
      </el-form-item>
      <el-form-item 
        label="部门负责人"
        prop="manager">
        <!--* 多选框 -->
        <el-select 
          style="width:80%" 
          placeholder="1-50个字符" 
          v-model="formData.manager" 
          @focus="getEmployeeSimple">
          <el-option 
            v-for="item in peoples" 
            :key="item.id" 
            :label="item.username" 
            :value="item.username"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input 
          style="width:80%" 
          placeholder="1-300个字符"
          type="textarea" 
          :row="3"
          v-model="formData.introduce"></el-input>
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
//! 弹层组件
import { department, addDeparment, getDepartDetail, updateDepartments} from '@/api/department'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: "addTools",
  //! 传递控制弹窗显示 隐藏
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    //! 自定义事件名称
    //! 现在定义一个函数 这个函数的目的是 去找 同级部门下 是否有重复的部门名称  
    const checkNameRepeat = async( rule, value, callback ) => {
      //! 先要获取最新的组织架构数据
      const { depts } = await department()
      //! depts是所有的部门数据
      //! 如何去找技术部所有的子节点
      let isRepeat = false
      if ( this.formData.id ) {
        //! 思路提示 -> this.formData.id = 我的id this.formData.pid = 我的pid 我也是数据库中的数据 去除我自己
        isRepeat = depts.filter( item => item.pid === this.formData.pid && item.id !== this.formData.id ).some( item => item.name === value)
      } else {
        isRepeat = depts.filter( item => item.pid === this.formData.id ).some(item => item.name === value)
      }
        isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }

    const checkCodeRepeat = async ( rule,value,callback ) => {
      const { depts } = await department()
      let isRepeat = false
      if ( this.formData.id ) {
        //! 不能算我自己 因为我也是数据库中的数据
        isRepeat = depts.filter( item => item.id !== item.formData.id ).some( item => item.code === value && value )
      } else {
        isRepeat = depts.some( item => item.code === value && value )
      }
        isRepeat ? callback(new Error(`您输入的${value}代码编号重复`)) : callback()
    }

    return {
      //! select 负责人数据
      peoples: [],
      //! 表单校验先决条件
      formData: {
        name: '', //? 部门名称 必填 1-50个字段/ 禁止出现同级部门
        code: '', //? 部门编码 必填 1-50个字段/ 禁止出现同级部门
        manager: '', //? 部门负责人 必填
        introduce: '' //? 部门介绍 必填 1-300个字段/
      },
      //* 表单校验条件 自定义校验规则 vilidator rule value callback  
      rules: {
        name: [
          {required: true, message: '请输入部门名称',trigger: 'blur'},
          {min:1, max: 50, message: '请输入1-50个字段',trigger: 'blur'},
          {
            trigger: 'blur',
            validator: checkNameRepeat // 自定义函数的形式校验
          }
        ],
        code: [
          {required: true, message: '请输入部门编码',trigger: 'blur'},
          {min:1, max: 50, message: '请输入1-50个字段',trigger: 'blur'},
          {validator: checkCodeRepeat, trigger: 'blur'}
        ],
        manager: [
          {required: true, message: '请输入部门负责人',trigger: 'blur'}
        ],
        introduce: [
          {required: true, message: '请输入部门介绍',trigger: 'blur'},
          {min:1, max: 300, message: '请输入1-300个字段',trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    //! 计算属性动态决定标题 
    showTitle() {
      return this.formData.id ? '编辑部门': '新增部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    //! 定义确认
    btnOK() {
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          if(this.formData.id) {
            //* 编辑的时候传递formData的id 
            await updateDepartments(this.formData.id)
          } else {
            //* 为新增部门设置pid 新增部门等于子部门 接口格式 子部门 pid 等于部门 id
            await addDeparment({...this.formData, pid: this.treeNode.id})
          }
          //* 现在只是后台数据改变了 前台并没有渲染
          this.$emit('addDepts')
          this.$emit('update:showDialog',false)
        }
      })
    },
    //* 定义取消弹层 弹层控制手段是父组件进行传递的 所以要发射到父组件 父组件通知子组件 重置弹层方法resetFields X号 @clos就是触发了resetfields
    btnCancel() {
      this.formData = {
        name: '', 
        code: '', 
        manager: '', 
        introduce: '' 
      }
      this.$emit('update:showDialog',false)
      this.$refs.deptForm.resetFields()
    },
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>

<style lang="scss" scoped></style>
