<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-if="avatar" :src="avatar" class="user-avatar">
          <span v-else class="username">{{firstChar }}</span>
          <span class="name">{{ name }}</span>
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a  href="#">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
            <el-dropdown-item @click.native="updatePassword">修改密码</el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;" >登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dialog @close="resetForm" :visible.sync="dialogVisible" title="修改密码" width="50%">
        <!-- 修改密码 -->
        <el-form ref="passwordForm" :model="formData" label-width="100px" :rules="rules">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input type="password" v-model="formData.oldPassword"></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input type="password" v-model="formData.newPassword"></el-input>
    </el-form-item>
    <el-form-item label="重复密码" prop="repeatPassword">
      <el-input type="password" v-model="formData.repeatPassword"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">确认</el-button>
      <el-button @click="resetForm">取消</el-button>
    </el-form-item>
  </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword } from '@/api/user';
import { resetRouter } from '@/router'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      dialogVisible: false,
      formData: {
        oldPassword: '',
        newPassword: '',
        repeatPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        repeatPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: this.validateRepeatPassword, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ]),
    firstChar() {
      // 如果name存在并且是一个非空字符串，则返回第一个字符，否则返回空字符串
      return this.name?.charAt(0)
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
      resetRouter()
    },
    updatePassword(){
      this.dialogVisible = true
    },
    validateRepeatPassword(rule, value, callback) {
      if (value !== this.formData.newPassword) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    },
    submitForm () {
      this.$refs.passwordForm.validate(async(valid) => {
        if (valid) {
          // 提交修改密码请求
          console.log('表单验证通过，提交修改密码请求');
          await updatePassword(this.formData)
          this.success('修改成功');
        }
      });
    },
    resetForm() {
      this.$refs.passwordForm.resetFields();
      this.dialogVisible = false;
    }
  },
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;
        .name {
          //  用户名称距离右侧距离
          margin-right: 10px;
          margin-left: 10px
        }
         .username {
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          border-radius: 50%;
          background: #04c9be;
          color: #fff;
          margin-right: 4px;
        }
        .el-icon-setting{
          font-size: 20px
        }
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
