<template>
  <div>
    <el-dialog :visible="dialogVisible" :title="title" @close="dialogVisible = false">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item prop="name"  label="权限名称">
        <el-input v-model="form.name" placeholder="请输入权限名称" size="mini" />
      </el-form-item>
      <el-form-item prop="code" label="权限标识">
        <el-input v-model="form.code" placeholder="请输入权限标识" size="mini"/>
      </el-form-item>
      <el-form-item prop="description" label="权限描述">
        <el-input v-model="form.description" type="textarea" placeholder="请输入权限描述" size="mini"/>
      </el-form-item>
      <el-form-item label="开启">
        <el-switch v-model="form.enVisible"  size="mini"/>
      </el-form-item>
      <el-form-item>
        <el-row type="flex" justify="center">
          <el-col :span="15">
            <el-button type="primary" size="mini" @click="btnOK">确认</el-button>
            <el-button size="mini" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import{addPermission,getPermissionList} from '@/api/permission'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '添加权限'
    },
  },
  data() {
    return {
      form: {
        name: '',
        code: '',
        description: '',
        enVisible: '0',
        type:'',
        pid:''
      },
      rules: {
        name: [{ required: true, message: '权限名称必填', trigger: 'blur', },
          { validator: this.validateName, trigger: 'blur' }
        ],
        code: [{ required: true, message: '权限标识必填', trigger: 'blur' },
        { validator: this.validateCode, trigger: 'blur' }
        ],
      }
    }
  },
  created() {},
  methods: {
     // 自定义验证器，检查权限名称是否重复
  validateName(rule, value, callback) {
    // 假设 getPermissionList 是一个获取权限列表的方法
    getPermissionList().then(permissions => {
      const isDuplicated = permissions.some(permission => permission.name === value);
      if (isDuplicated) {
        callback(new Error('权限名称已存在，请重新输入'));
      } else {
        callback();
      }
    }).catch(error => {
      // 处理获取权限列表失败的情况
      callback(new Error('验证权限名称时发生错误'));
    });
  },
  // 自定义验证器，检查权限标识是否重复
  validateCode(rule, value, callback) {
  //  通过父组件传入的权限列表判断
  getPermissionList().then(permissions => {
      const isDuplicated = permissions.some(permission => permission.code === value);
      if (isDuplicated) {
        callback(new Error('权限标识已存在，请重新输入'));
      } else {
        callback();
      }
    }).catch(error => {
      // 处理获取权限列表失败的情况
      callback(new Error('验证权限标识时发生错误'));
    });
  },
    // 确认
    btnOK(){
      console.log(this.form);
      this.$refs.form.validate(async(isOK) => {
        if (isOK) {
          await addPermission(this.form)
          this.$emit('update:dialogVisible', false)
          this.$message.success('添加成功')
          this.$emit('getPermissionList')
        }
      })
    },
    btnCancel(){
      this.$emit('update:dialogVisible', false)
    }
  },
}
</script>

<style scoped></style>
