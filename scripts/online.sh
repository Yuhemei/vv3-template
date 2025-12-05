#!/bin/bash
echo "开始更新..."

# 信大
# scp -r ./dist/dist root@xxx.xxx.xxx.xxx:/opt/html

# 产品
scp -r ./dist/dist root@xxx.xxx.xxx.xxx:/opt/html

echo "Do"

echo "更新完成..." 