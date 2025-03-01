<template>
  <div>
    <el-cascader size="mini" :props="defaultProps" :options="options" separator="-" :value="value" @change="changeValue" />
  </div>
</template>

<script>
import { getDepartment } from '@/api/department'

import { list2tree } from '@/utils/index'
export default {
  props: ['value'],
  data() {
    return {
      options: [],
      defaultProps: {
        label: 'name',
        value: 'id'
      }
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      this.options = list2tree(await getDepartment(), 0)
    },
    changeValue(list) {
      // 取到数组的最后一次
      console.log(list)
      if (list.length > 0) {
        this.$emit('input', list[list.length - 1]) // 将最后一位的id取出来 传出去
      } else {
        this.$emit('input', null) // 如果长度为0 说明值为空
      }
    }
  }
}

</script>

<style lang="scss" scoped></style>
