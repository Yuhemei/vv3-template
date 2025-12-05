interface ToolbarKeys {}
export interface toolbarConfig {
  toolbarKeys: ToolbarKeys[];
}

export const toolbarConfig: toolbarConfig = {
  toolbarKeys: [
    'bold', // 粗体
    'underline', // 下划线
    'italic', // 斜体
    'through', // 删除线
    'code', // 行内代码
    'sub', // 下标
    'sup', // 上标
    'clearStyle', // 清除格式
    'color', // 字体颜色
    'bgColor', // 背景色
    'fontSize', // 字号
    'fontFamily', // 字体
    'indent', // 增加缩进
    'delIndent', // 减少缩进
    'justifyLeft', // 左对齐
    'justifyRight', // 右对齐
    'justifyCenter', // 居中对齐
    'justifyJustify', // 两端对齐
    'lineHeight', // 行高
    'insertImage', // 网络图片
    'deleteImage', // 删除图片
    'editImage', // 编辑图片
    'viewImageLink', // 查看链接
    'imageWidth30', // 图片宽度相对于编辑器宽度的百分比30
    'imageWidth50', // 图片宽度相对于编辑器宽度的百分比50
    'imageWidth100', // 图片宽度相对于编辑器宽度的百分比100
    'divider', // 分割线
    'emotion', // 表情
    'insertLink', // 插入链接
    'editLink', // 修改链接
    'unLink', // 取消链接
    'viewLink', // 查看链接
    'codeBlock', // 代码块
    'blockquote', // 引用
    'headerSelect', // 标题
    'header1', // 标题1
    'header2', // 标题2
    'header3', // 标题3
    'header4', // 标题4
    'header5', // 标题5
    'todo', // 待办
    'redo', // 重做
    'undo', // 撤销
    'fullScreen', // 全屏
    'enter', // 回车
    'bulletedList', // 无序列表
    'numberedList', // 有序列表
    'insertTable', // 插入表格
    'deleteTable', // 删除表格
    'insertTableRow', // 插入行
    'deleteTableRow', // 删除行
    'insertTableCol', // 插入列
    'deleteTableCol', // 删除列
    'tableHeader', // 表头
    'tableFullWidth', // 宽度自适应
    'insertVideo', // 插入网络视频
    'uploadVideo', // 上传视频
    'editVideoSize', // 修改视频尺寸
    'uploadImage', // 上传图片
    'codeSelectLang', // 选择语言
  ],
};
