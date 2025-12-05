/*
 * @Description: 记录版本信息
 */
// 定义模块和变量
import fs from 'fs'; // 文件读取模块
import { execSync } from 'child_process';

const getCommandRetVal = command => {
  return execSync(command).toString('utf8').trim();
};
// 获取到待提交文件名列表
const branchName = getCommandRetVal('git name-rev --name-only HEAD');
const commitId = getCommandRetVal('git rev-parse --short HEAD');
const remoteArr = getCommandRetVal('git remote get-url origin').split('/');
const node = getCommandRetVal('node -v');
const remote = remoteArr[remoteArr.length - 1];
const json = {
  node,
  remote,
  branch: branchName,
  version: commitId,
};
const versionPath = 'version.json'; // 打包后生成的文件
const buildPath = 'dist/manager'; // 打包的路径 必须与 项目打包路径和名称一致
console.log(JSON.stringify(json));

if (fs.existsSync(buildPath)) {
  fs.writeFileSync(`${buildPath}/${versionPath}`, JSON.stringify(json));
}
console.log(['╦══╔═╦═╗╦ ╦ ═╦═', '╠══  ║	╠╠   ║', '╩    ╩	╩ ╩ ═╝'].join('\n'));
