<template>
  <div class="container">
    <div class="app-container">
      <div class="role-operate">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="showDialog = true">添加角色</el-button>
      </div>
      <el-table :data="list">
        <el-table-column prop="name" label="角色" align="center" width="200">
          <template v-slot="{ row }">
            <span v-if="!row.isEdit">{{ row.name }}</span>
            <el-input v-else v-model="row.editRow.name" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="启用" width="200">
          <template v-slot="{ row }">
            <span v-if="!row.isEdit">{{ row.state === 1 ? "已启用" : row.state === 0 ? "未启用" : "未知" }}</span>
            <el-switch v-else v-model="row.editRow.state" :active-value="1" :inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" align="center">
          <template v-slot="{ row }">
            <span v-if="!row.isEdit">{{ row.description }}</span>
            <el-input v-else v-model="row.editRow.description" type="textarea" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="{ row }">
            <template v-if="!row.isEdit">
              <el-button type="text" size="mini" @click="btnPermission(row.id)">分配权限</el-button>
              <el-button type="text" size="mini" @click="btnEditRow(row)">编辑</el-button>
              <template>
                <el-popconfirm title="你确定要删除吗?" @onConfirm="btnDelete(row.id)">
                  <template #reference>
                    <el-button type="text" size="mini" style="margin-left: 10px">删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </template>

            <template v-else>
              <el-button type="text" size="mini" @click="btnEditOK(row)">确定</el-button>
              <el-button type="text" size="mini" @click="btnEditCancel(row)">取消</el-button>
            </template>
          </template>

        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" align="middle" style="height: 60px;">
        <el-pagination background layout="prev, pager, next" :total="PageParams.total" :current-page="PageParams.page"
          :page-size="PageParams.pagesize" @current-change="changePage" />
      </el-row>
      <el-dialog :visible="showDialog">
        <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
          <el-form-item prop="name" label="角色名称">
            <el-input v-model="roleForm.name"></el-input>
          </el-form-item>
          <el-form-item prop="state" label="启用">
            <el-switch v-model="roleForm.state" active-value="1" inactive-value="0" />
          </el-form-item>
          <el-form-item prop="description" label="角色描述">
            <el-input type="textarea" v-model="roleForm.description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="btnOK">确定</el-button>
            <el-button size="mini" @close="btnCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 放置权限弹层 -->
      <el-dialog :visible.sync="showPermissionDialog" title="分配权限">

        <!-- 放置权限数据 -->
        <el-tree
        ref="permTree"
        check-strictly
        node-key="id"
        :data="permissionData"
        :props="{ label: 'name' }"
        show-checkbox
        default-expand-all
        :default-checked-keys="permIds"
  />
  <template #footer>
      <el-row type="flex" justify="center">
        <el-col :span="9">
          <el-button type="primary" size="mini" @click="btnPermissionOK">确定</el-button>
          <el-button size="mini" @click="showPermissionDialog = false">取消</el-button>
        </el-col>
      </el-row>
    </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getRoleList, addRole, updateRole, deleteRole,assignPerm,getRoleDetail } from '@/api/role'
import { getPermissionList } from '@/api/permission'
import { list2tree } from '@/utils'
export default {
  name: 'Role',
  data() {
    return {
      PageParams: {
        page: 1,
        pagesize: 5,
        total: 0
      },
      roleForm: {
        name: '',
        state: 0,
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
      },
      list: [],
      showDialog: false,
      showPermissionDialog: false,
      permissionData: [],
      currentRoleId: null,
      permIds: []
    }
  },
  created() {
    this.getRoleList()

  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleList(this.PageParams)
      this.list = rows
      this.PageParams.total = total
      this.list.forEach(item => {
        this.$set(item, 'isEdit', false)
        this.$set(item, 'editRow', {
          name: item.name,
          state: item.state,
          description: item.description
        })
      })
    },
    changePage(newPage) {
      this.PageParams.page = newPage
      this.getRoleList()
    },
    btnCancel() {
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    async btnOK() {
      this.$refs.roleForm.validate(async (isOK) => {
        if (isOK) {
          await addRole(this.roleForm)
          this.$message.success('添加成功')
          this.getRoleList()
          this.btnCancel()
        }
      })
    },
    btnEditRow(row) {
      row.isEdit = true
      row.editRow.name = row.name
      row.editRow.state = row.state
      row.editRow.description = row.description
    },
    async btnEditOK(row) {
      if (row.editRow.name && row.editRow.description) {
        await updateRole({ ...row.editRow, id: row.id })
        row.isEdit = false
        Object.assign(row, { ...row.editRow, isEdit: false })
        this.$message.success('修改成功')
      } else {
        this.$message.error('请输入角色名称和角色描述')
      }
    },
    btnEditCancel(row) {
      row.isEdit = false
    },
    async btnDelete(id) {
      await deleteRole(id)
      // 如果删除的为最后一页，则页码减一
      if (this.list.length === 1 && this.PageParams.page > 1) this.PageParams.page--
      this.getRoleList()
    },
    async btnPermission(id) {
      this.currentRoleId = id
      const { permIds } = await getRoleDetail(id)
      this.permIds = permIds
      this.permissionData = list2tree(await getPermissionList(), 0)
      this.showPermissionDialog = true
    },
    async  btnPermissionOK() {
      await assignPerm({
        id: this.currentRoleId,
        permIds: this.$refs.permTree.getCheckedKeys()
      })
      this.$message.success('角色分配权限成功')
      this.showPermissionDialog = false
    }
  }

}
</script>
<style lang="scss"></style>
