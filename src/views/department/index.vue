<template>
  <div class="container">
    <div class="app-container">
      <!-- 组织架构 -->
      <el-tree
        :expand-on-click-node="false"
        default-expand-all
        :data="depts"
        :props="defaultProps"
        class="custom-tree"
      >
        <!-- 节点结构 -->
        <template v-slot="{ data }">
          <div class="tree-node">
            <div class="tree-node-info">
              <span>{{ data.name }}</span>
            </div>
            <div class="tree-node-actions">
              <span class="tree-manager">{{ data.managerName }}</span>
              <el-dropdown @command="operateDept($event, data.id)" trigger="click">
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </template>
        <template v-slot:empty>
          <!-- 自定义的空状态内容 -->
          <div class="empty-state">没有找到任何部门</div>
        </template>
      </el-tree>
    </div>
    <add-dept
      ref="addDept"
      :current-node-id="currentNodeId"
      :showDialog.sync="showDialog"
      @updateDepartment="getDepartment"
    />
  </div>
</template>

<script>
import { getDepartment,delDepartment } from '@/api/department'
import { list2tree } from '@/utils/index'
import AddDept from './components/add-dept'
export default {
  name: "Department",
  components: { AddDept },
  data() {
    return {
      depts: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showDialog: false,
      currentNodeId: null,
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      const res = await getDepartment()
      this.depts = list2tree(res, 0)
    },
    operateDept(type, id) {
      switch (type) {
        case 'add':
          this.showDialog = true
          this.currentNodeId = id
          break
        case 'edit':
          this.showDialog = true
          this.currentNodeId = id
          this.$nextTick(() => {
            this.$refs.addDept.getDepartmentDetail()
          })
          break
        case 'del':
          this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(
            async () => {
              await delDepartment(id)
              this.$message.success('删除成功')
              this.getDepartment()
            }
          )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.custom-tree {
  border: none;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
}

.tree-node-info {
  flex-grow: 1;
}

.tree-node-actions {
  display: flex;
  align-items: center;
}

.tree-manager {
  margin-right: 10px;
  font-size: 12px;
  color: #909399;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 20px 0;
  color: #909399;
}
</style>
