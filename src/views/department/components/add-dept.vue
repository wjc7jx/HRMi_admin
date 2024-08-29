<template>
  <el-dialog :title="title" :visible="showDialog" @close="close">
    <el-form ref="addDept" :model="formData" :rules="rules" label-width="120px">
      <el-form-item prop="name" label="部门名称">
        <el-input v-model="formData.name" placeholder="2-10个字符" style="width: 80%" size="mini" />
      </el-form-item>
      <el-form-item prop="code" label="部门编码">
        <el-input v-model="formData.code" placeholder="2-10个字符" style="width: 80%" size="mini" />
      </el-form-item>
      <el-form-item prop="managerId" label="部门负责人">
        <el-select v-model="formData.managerId" placeholder="请选择负责人" style="width: 80%" size="mini">
          <el-option v-for="item in managerList" :key="item.id" :label="item.username" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍">
        <el-input v-model="formData.introduce" placeholder="1-100个字符" type="textarea" size="mini" :rows="4"
          style="width: 80%" />
      </el-form-item>
      <el-form-item>
        <!-- 按钮 -->
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button size="mini" type="primary" @click="btnOK">确定</el-button>
            <el-button size="mini" @click="close">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import {getDepartment,getManagerName,addDepartment,getDepartmentDetail, updateDepartment} from '@/api/department'
export default {

  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentNodeId:{
      type: Number,
      default: null
    }
  },
  data() {
    return {
      managerList:[],
      formData: {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        managerId: '', // 部门负责人id
        name: '', // 部门名称
        pid: '' // 父级部门的id
      },
      rules: {
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
        {
          min: 2, max: 10, message: '部门编码的长度为2-10个字符', trigger: 'blur'
        },
        //需要获取到部门列表，判断是否重复
        {
          trigger: 'blur',
          validator:async(rule, value, callback)=> {
            let res=await getDepartment()
            if(this.formData.id){
              res=res.filter(item => item.id !== this.formData.id) //将获取到的数据排除自身
            }
            if (res.some(item => item.code === value)) {
              callback(new Error('部门编码不能重复'));
            }else{
              callback()
            }
          }
        }
        ], // 部门编码
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' }, {
          min: 1, max: 100, message: '部门介绍的长度为1-100个字符', trigger: 'blur'
        }], // 部门介绍
        managerId: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }], // 部门负责人id
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
        {
          min: 2, max: 10, message: '部门名称的长度为2-10个字符', trigger: 'blur'
        },
      //需要获取到部门列表，判断是否重复
      {
          trigger: 'change',
          validator:async(rule, value, callback)=> {
            let res=await getDepartment()
            if(this.formData.id){
              res=res.filter(item => item.id !== this.formData.id) //将获取到的数据排除自身
            }
            if (res.some(item => item.name === value)) {
              callback(new Error('部门介绍不能重复'));
            }else{
              callback()
            }
          }
        }] // 部门名称
        // pid: '' // 父级部门的id 不需要做校验
      },

    }
  },
  computed: {
    title() {
      return this.formData.id ? '修改部门' : '添加部门'
    }
  },
created(){
  this.getManagerName()
},
  methods: {
    close() {
      this.formData={
        code: '', // 部门编码
        introduce: '', // 部门介绍
        managerId: '', // 部门负责人id
        name: '', // 部门名称
        pid: '' // 父级部门的id
      }
      this.$refs.addDept.resetFields() // 重置表单
      this.$emit('update:showDialog', false)
    },
    async getManagerName() {
      this.managerList= await getManagerName()
    },
    btnOK(){
      this.$refs.addDept.validate(async(isOK) => {
        if (isOK) {
          if (this.formData.id) {
            await updateDepartment(this.formData)
          }else{
            await addDepartment({ ...this.formData, pid: this.currentNodeId })
          }
          this.$emit('updateDepartment')
          this.$message.success(this.formData.id?'修改成功':'添加成功')
          this.close()
        }
      })
    },
    async getDepartmentDetail() {
      // alert(this.currentNodeId)
      this.formData = await getDepartmentDetail(this.currentNodeId)// 获取部门详情此处formdata内容包含id
    },
  }
}
</script>
