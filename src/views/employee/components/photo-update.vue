<template>
  <el-upload
    class="avatar-uploader"
    action=""
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :http-request="uploadImage"
  >
    <!-- (自动上传)action是上传地址 人资项目不需要 人资项目(手动上传)  -->
    <img v-if="value" :src="value" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>
<script>
import COS from 'cos-js-sdk-v5' // 脚手架安装
export default {
  props: ['value'],
  methods: {
    beforeAvatarUpload(file) {
      // 所有图片
      const isValidFormat = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isValidFormat) {
        this.$message.error('上传头像图片只能是 JPG / PNG / GIF / BMP 格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isValidFormat && isLt5M
    },
    // 选择图片上传
    uploadImage(params) {
      console.log(process.env.VUE_APP_SECRET_ID)
      const cos = new COS({
        SecretId: process.env.VUE_APP_SECRET_ID, // 腾讯云的SecretId
        SecretKey: process.env.VUE_APP_SECRET_KEY // 腾讯云的SecretKey
      }) // 完成cos对象的初始化
      cos.putObject({
        Bucket: 'hrmi-1328155764', // 存储桶名称
        Region: 'ap-nanjing', // 地域名称
        Key: params.file.name, // 文件名称
        StorageClass: 'STANDARD', // 固定值
        Body: params.file // 文件对象
      }, (err, data) => {
        console.log(err, data)
        if (data.statusCode === 200 && data.Location) {
          // 拿到了腾讯云返回的地址
          // 通过input自定义事件将地址传出去
          this.$emit('input', 'http://' + data.Location) // 将地址返回了
        } else {
          this.$message.error(err.Message) // 上传失败提示消息
        }
      })
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
