<template>
  <el-dialog
    width="500px"
    title="员工导入"
    :visible="showExcelDialog"
    @close="$emit('update:showExcelDialog', false)"
  >
    <el-upload
      class="upload-demo"
      :action="uploadAction"
      :on-success="handleSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
      :file-list="fileList"
      accept=".xlsx, .xls"
      :http-request="customUpload"
    >
      <el-row type="flex" justify="center">
        <div class="upload-excel">
          <div class="drop">
            <i class="el-icon-upload" />
            <el-button type="text" @click.stop="btnGetTemp">下载导入模板</el-button>
            <!-- 加上stop阻止upload事件冒泡 -->
            <span>将文件拖到此处或点击上传</span>
          </div>
        </div>
      </el-row>
    </el-upload>
    <el-row type="flex" justify="end">
      <el-button size="mini" type="primary" @click="$emit('update:showExcelDialog', false)">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { getExcelTemplate, uploadExcel } from '@/api/employee';
import { downloadFile } from '@/utils/downloadFile';

export default {
  props: {
    showExcelDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fileList: [],
      uploadAction: '', // 这里实际上不需要设置action，因为我们会使用customUpload
    };
  },
  methods: {
    async btnGetTemp() {
      // event.stopPropagation();// 阻止upload事件冒泡
      await downloadFile(getExcelTemplate, '员工导入模版.xlsx', this);
    },
    handleSuccess(response, file, fileList) {
      this.$emit('update:showExcelDialog', false);
      this.$emit('updateSuccess');
      this.fileList = []; // 清空文件列表
    },
    handleError(err, file, fileList) {
      this.$message.error('上传失败');
      this.fileList = []; // 出错时也可以清空文件列表
    },
    beforeUpload(file) {
      // 在这里可以进行文件校验，比如文件大小、类型等
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
      if (!isExcel) {
        this.$message.error('上传文件只能是 xlsx/xls 格式!');
        return false;
      }
      return true;
    },
    customUpload(file) {
      const formData = new FormData();
      formData.append('file', file.file);
      uploadExcel(formData).then((response) => {
        this.handleSuccess(response, file, this.fileList);
      }).catch((error) => {
        this.handleError(error, file, this.fileList);
      });
    },
  },
};
</script>

<style scoped lang="scss">
    .upload-excel {
      display: flex;
      justify-content: center;
      margin: 20px;
      width: 360px;
      height: 180px;
      align-items: center;
      color: #697086;
      .excel-upload-input {
        display: none;
        z-index: -9999;
      }
      .btn-upload,
      .drop {
        border: 1px dashed #dcdfe6;
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 160px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .drop {
        line-height: 40px;
        color: #bbb;
        i {
          font-size: 60px;
          display: block;
          color: #c0c4cc;
        }
      }
    }
</style>
