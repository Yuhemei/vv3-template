/*
 * Copyright (c) 2024  FengTaiSEC Corporation.
 * svg文件批量去色
 * @Author: zhangfei<zhangfei@fengtaisec.com>
 * @Date: 2024-05-20 13:14:99
 */
import fs from 'fs';

const path = '../src/assets/svg_icon';

fs.readdir(path, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach(file => {
    // 排除非.svg结尾的文件
    if (!file.endsWith('.svg')) {
      return;
    }
    const filePath = `${path}/${file}`;
    let fileContent = fs.readFileSync(filePath, 'utf8');

    // 匹配 fill="#0A2A48" 的格式
    const reg = /fill="#[0-9a-fA-F]{3,6}"/g;

    fileContent = fileContent.replace(reg, '');

    fs.writeFileSync(filePath, fileContent);
  });

  console.log(['╦══╔═╦═╗╦ ╦ ═╦═', '╠══  ║	╠╠   ║', '╩    ╩	╩ ╩ ═╝'].join('\n'));
});
