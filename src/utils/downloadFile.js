// 引入需要的依赖，比如FileSaver和Vue的message组件（如果你使用的是Vue）
import FileSaver from 'file-saver'
// 假设你有一个Vue实例或类似的全局对象来访问$message
// import Vue from 'vue';
// const { $message } = Vue.prototype; // 这取决于你的Vue配置

/**
 * 通用的文件下载方法
 * @param {Function} exportFunction - 执行导出操作的异步函数
 * @param {String} filename - 导出的文件名
 * @param {Vue} vueInstance - Vue实例，用于访问$message方法
 * @returns {Promise} - 返回一个Promise，以便在调用时处理异步操作
 */
export async function downloadFile(exportFunction, filename, vueInstance) {
  // 显示加载提示
  const messageInstance = vueInstance.$message({
    message: '正在导出，请稍候...',
    type: 'info',
    duration: 0 // 设置为0表示不自动关闭
  })

  try {
    const res = await exportFunction()
    // 使用FileSaver保存文件
    FileSaver.saveAs(res, filename)

    // 导出完成后关闭加载提示并显示成功消息
    messageInstance.close()
    vueInstance.$message({
      type: 'success',
      message: '导出成功!'
    })
  } catch (error) {
    // 出错处理
    vueInstance.$message({
      type: 'error',
      message: '导出失败!'
    })
    console.error(error)
  }
}
