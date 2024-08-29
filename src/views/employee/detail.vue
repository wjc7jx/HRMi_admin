<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div class="edit-form">
        <el-form ref="userForm" :model="formData" :rules="rules" label-width="220px">
          <!-- 姓名 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="username">
                <el-input v-model="formData.username" size="mini" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 工号 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="工号" prop="workNumber">
                <el-input v-model="formData.workNumber" size="mini" class="inputW" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 手机 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="formData.mobile" size="mini" class="inputW" :disabled="!!$route.params.id" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 部门 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="部门" prop="departmentId">
                <!-- 放置及联部门组件，并绑定v-model -->
                <select-tree v-model="formData.departmentId" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 聘用形式 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="聘用形式" prop="formOfEmployment">
                <el-select v-model="formData.formOfEmployment" size="mini" class="inputW">
                  <!-- 选项 -->
                  <el-option label="正式" :value="1" />
                  <el-option label="非正式" :value="2" />
                </el-select>
              </el-form-item>

            </el-col>
          </el-row>
          <!-- 入职时间 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="入职时间" prop="timeOfEntry">
                <el-date-picker v-model="formData.timeOfEntry" size="mini" type="date" value-format="yyyy-MM-dd"
                  class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 转正时间 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="转正时间" prop="correctionTime">
                <el-date-picker v-model="formData.correctionTime" size="mini" type="date" value-format="yyyy-MM-dd"
                  class="inputW"
                  :picker-options="{ disabledDate(time) { return time.getTime() < new Date(formData.timeOfEntry).getTime(); } }" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 员工照片 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="员工头像">
                <!-- 放置上传图片 -->
                <photo-update v-model="formData.staffPhoto" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 保存个人信息 -->
          <el-row type="flex">
            <el-col :span="12" style="margin-left:220px">
              <el-button size="mini" type="primary" @click="submitForm">保存更新</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import PhotoUpdate from './components/photo-update.vue';
import selectTree from './components/select-tree.vue';
import { addEmployee, getEmployeeDetail, updateEmployee } from '@/api/employee';
export default {
  components: {
    selectTree,
    PhotoUpdate
  },
  data() {
    return {
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        workNumber: '', // 工号
        formOfEmployment: null, // 聘用形式
        departmentId: null, // 部门id
        timeOfEntry: '', // 入职时间
        correctionTime: '', // 转正时间
        staffPhoto: '',
        id: null,
        // "id": 0,
        // "departmentName": "string",
      },
      rules: {
        username: [
          { required: true, message: '姓名是必填项', trigger: 'blur' },
          { min: 1, max: 4, message: '姓名长度在 1 到 4 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号是必填项', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        departmentId: [
          { required: true, message: '部门是必填项', trigger: 'change' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式是必填项', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '入职时间是必填项', trigger: 'change' }
        ],
        correctionTime: [
          { required: true, message: '转正时间是必填项', trigger: 'change' }
        ]
      },
    };
  },
  created() {
    if (this.$route.params.id) this.getEmployeeDetail()//调用函数
  },
  methods: {
    submitForm() {
      console.log(this.formData);
      this.$refs.userForm.validate(async (valid) => {
        if (valid) {
          if (this.$route.params.id) {
            await updateEmployee(this.formData)
          } else {
            await addEmployee(this.formData)
          }
          this.$message.success('保存成功')
          this.$router.push('/employee')
        } else {
          console.log('表单验证失败!');
          return false;
        }
      });
    },
    async getEmployeeDetail() {
      this.formData = await getEmployeeDetail(this.$route.params.id)
    }
  }
};
</script>

<style scoped lang="scss">
.edit-form {
  background: #fff;
  padding: 20px;

  .inputW {
    width: 380px;
  }

  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
