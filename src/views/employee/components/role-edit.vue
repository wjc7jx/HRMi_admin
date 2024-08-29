<template>
  <el-dialog width="60%" title="员工导入" :visible="showRoleDialog" @close="$emit('update:showRoleDialog', false)">
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="$emit('update:showRoleDialog', false)">取消</el-button>
        <el-button type="primary" @click="btnOK">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { getEnabledRoleList, getEmployeeDetail,assignRole } from '@/api/employee';
export default {
  props: {
    LoadDialog: {
      type: Boolean,
      default: true,
    },
    CurrentId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      roleList: [],
      roleIds: [],
      showRoleDialog: false,
    };
  },
  watch: {
    // 当showRoleDialog变化时调用这个函数
    LoadDialog(newValue, oldValue) {
      if (newValue === true) {
        this.getEnabledRoles();
      } else {
        this.roleIds = []
        this.showRoleDialog = false
      }
    }
  },

  methods: {
    async getEnabledRoles() {
      const { roleIds } = await getEmployeeDetail(this.CurrentId)
      this.roleIds = roleIds
      this.roleList = await getEnabledRoleList()
      this.showRoleDialog = true
    },
    async btnOK(){

      await assignRole({
        id: this.CurrentId,
        roleIds: this.roleIds
      })

      this.$message.success('分配角色成功')
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style lang="scss"></style>
