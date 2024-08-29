<template>
  <div class="container">
    <div class="app-container">
      <el-button class="btn-add" size="mini" type="primary" @click="dialogVisible=true">添加权限</el-button>
      <el-table :data="list" row-key="id" default-expand-all>
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="code" label="标识" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作">
          <template v-slot="{row}">
          <el-button v-if="row.type===1" size="mini" type="text">添加</el-button>
          <el-button size="mini" type="text">编辑</el-button>
          <el-button size="mini" type="text">删除</el-button>
        </template>
        </el-table-column>
      </el-table>
      <edit-dialog title="新增" :dialog-visible.sync="dialogVisible" @getPermissionList="this.getPermissionList"/>
    </div>
  </div>
</template>
<script>
import { getPermissionList } from '@/api/permission';
import { list2tree } from '@/utils';
import EditDialog from './components/EditDialog.vue'
export default {
  name: 'Permission',
  components: {
    EditDialog
  },
data() {
  return {
    list: [],
    dialogVisible:false
  }
},
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList(){
      console.log(getPermissionList());
      this.list = list2tree(await getPermissionList(),0)
      console.log(this.list);
    }
  }
}
</script>
<style>
.btn-add {
  margin: 10px;
}
</style>
