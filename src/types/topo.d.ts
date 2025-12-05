export interface IframeMessage {
  /** 任务id */
  task_id: string;
  /** 场景类型 */
  scence_type: string;
  /** 场景id */
  scene_id: string;
  /** 场景副本id */
  scene_duplication_id: string;
  /** 系统名称 */
  sysName: string;
  /** 是否显示顶部右侧工具栏 */
  isTopRightShow: boolean;
  /** 是否显示顶部锁定工具栏 */
  isTopLockShow: boolean;
  /** 是否显示顶部返回工具栏 */
  isTopReturnShow: boolean;
  /** 是否显示左侧侧边栏 */
  isSliderBarShow: boolean;
  /** 是否显示右侧右键菜单栏 */
  isContextMenuBarShow: boolean;
  /** 是否显示节点点击事件 */
  isNodeClickShow: boolean;
  /** 是否显示节点删除事件 */
  isNodeDeleteShow: boolean;
  /** 是否显示节点连接事件 */
  isNodeConnectShow: boolean;
  /** 补充信息 */
  message: any;
}
