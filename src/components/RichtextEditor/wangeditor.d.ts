import { SlateDescendant, SlateElement, SlateText } from '@wangeditor/editor';

declare module '@wangeditor/editor' {
  // 扩展 Text
  interface SlateText {
    text: string;
  }
  // 扩展 Element
  interface SlateElement {
    type: string;
    children: SlateDescendant[];
  }
  /** 工具栏配置
   * toolbarKeys: 工具栏按钮的键值
   *    bold: 粗体
   *    underline: 下划线
   * italic: 斜体
   * through: 删除线
   * code: 行内代码
   * sub: 下标
   * sup: 上标
   * clearStyle: 清除格式
   * color: 字体颜色
   * bgColor: 背景色
   * fontSize: 字号
   * fontFamily: 字体
   * indent: 增加缩进
   * delIndent: 减少缩进
   * justifyLeft: 左对齐
   * justifyRight: 右对齐
   * justifyCenter: 居中对齐
   * justifyJustify: 两端对齐
   * lineHeight: 行高
   * insertImage: 插入图片
   * deleteImage: 删除图片
   * editImage: 编辑图片
   * viewImageLink: 查看链接
   * imageWidth30: 图片宽度相对于编辑器宽度的百分比30
   * imageWidth50: 图片宽度相对于编辑器宽度的百分比50
   * imageWidth100: 图片宽度相对于编辑器宽度的百分比100
   * divider: 分割线
   * emotion: 表情
   * insertLink: 插入链接
   * editLink: 修改链接
   * unLink: 取消链接
   * viewLink: 查看链接
   * codeBlock: 代码块
   * blockquote: 引用
   * headerSelect: 标题
   * header1: 标题1
   * header2: 标题2
   * header3: 标题3
   * header4: 标题4
   * header5: 标题5
   * todo: 待办
   * redo: 重做
   * undo: 撤销
   * fullScreen: 全屏
   * enter: 回车
   * bulletedList: 无序列表
   * numberedList: 有序列表
   * insertTable: 插入表格
   * deleteTable: 删除表格
   * insertTableRow: 插入行
   * deleteTableRow: 删除行
   * insertTableCol: 插入列
   * deleteTableCol: 删除列
   * tableHeader: 表头
   * tableFullWidth: 宽度自适应
   * insertVideo: 插入网络视频
   * uploadVideo: 上传视频
   * editVideoSize: 修改视频尺寸
   * uploadImage: 上传图片
   * codeSelectLang: 选择语言
   */
  interface ToolbarConfig {
    toolbarKeys: [
      /** 粗体 */
      'bold',
      /** 下划线 */
      'underline',
      /** 斜体 */
      'italic',
      /** 删除线 */
      'through',
      /** 行内代码 */
      'code',
      /** 下标 */
      'sub',
      /** 上标 */
      'sup',
      /** 清除格式 */
      'clearStyle',
      /** 字体颜色 */
      'color',
      /** 背景色 */
      'bgColor',
      /** 字号 */
      'fontSize',
      /** 字体 */
      'fontFamily',
      /** 增加缩进 */
      'indent',
      /** 减少缩进 */
      'delIndent',
      /** 左对齐 */
      'justifyLeft',
      /** 右对齐 */
      'justifyRight',
      /** 居中对齐 */
      'justifyCenter',
      /** 两端对齐 */
      'justifyJustify',
      /** 行高 */
      'lineHeight',
      /** 网络图片 */
      'insertImage',
      /** 删除图片 */
      'deleteImage',
      /** 编辑图片 */
      'editImage',
      /** 查看链接 */
      'viewImageLink',
      /** 图片宽度相对于编辑器宽度的百分比30 */
      'imageWidth30',
      /** 图片宽度相对于编辑器宽度的百分比50 */
      'imageWidth50',
      /** 图片宽度相对于编辑器宽度的百分比100 */
      'imageWidth100',
      /** 分割线 */
      'divider',
      /** 表情 */
      'emotion',
      /** 插入链接 */
      'insertLink',
      /** 修改链接 */
      'editLink',
      /** 取消链接 */
      'unLink',
      /** 查看链接 */
      'viewLink',
      /** 代码块 */
      'codeBlock',
      /** 引用 */
      'blockquote',
      /** 标题 */
      'headerSelect',
      /** 标题1 */
      'header1',
      /** 标题2 */
      'header2',
      /** 标题3 */
      'header3',
      /** 标题4 */
      'header4',
      /** 标题5 */
      'header5',
      /** 待办 */
      'todo',
      /** 重做 */
      'redo',
      /** 撤销 */
      'undo',
      /** 全屏 */
      'fullScreen',
      /** 回车 */
      'enter',
      /** 无序列表 */
      'bulletedList',
      /** 有序列表 */
      'numberedList',
      /** 插入表格 */
      'insertTable',
      /** 删除表格 */
      'deleteTable',
      /** 插入行 */
      'insertTableRow',
      /** 删除行 */
      'deleteTableRow',
      /** 插入列 */
      'insertTableCol',
      /** 删除列 */
      'deleteTableCol',
      /** 表头 */
      'tableHeader',
      /** 宽度自适应 */
      'tableFullWidth',
      /** 插入网络视频 */
      'insertVideo',
      /** 上传视频 */
      'uploadVideo',
      /** 修改视频尺寸 */
      'editVideoSize',
      /** 上传图片 */
      'uploadImage',
      /** 选择语言 */
      'codeSelectLang',
    ];
  }
}
