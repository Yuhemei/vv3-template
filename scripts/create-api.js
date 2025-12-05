/*
 * Copyright (c) 2024  FengTaiSEC Corporation.
 * @Description: 通过yapi导出的swagger.json文件，自动生成API接口文件
 * @Author: zhangfei<zhangfei@fengtaisec.com>
 * @Date: 2024-05-20 13:14:99
 */
import fs from 'fs';
const jsonUrl = 'scripts/datang.swagger.json'; // swagger.json文件路径
const fileName = 'index.ts'; // 打包后生成的文件
const interfaceName = 'type.ts'; // 打包后生成的类型接口文件
const apiPath = './src/api'; // 打包后生成的文件夹
// 读取 Swagger API 定义文件
const swaggerApiJson = JSON.parse(fs.readFileSync(jsonUrl, 'utf8'));

const indexHeaderStr = `import http from '@/utils/request';`; //  头部引入文件

const templateParams = `export const apiNameTemp = (paramsTemp) => {
  return http.methodTemp<TTemp>(\`newPath\`, params);
}`;
const templateData = `export const apiNameTemp = (paramsTemp) => {
  return http.methodTemp<TTemp>(\`newPath\`, data);
}`;

// 根据tags创建文件夹
//  [{"name": "首页", "description": "home" }, {"name": "总体管控模块-内容管理", "description": "content_manager" }, ...]
let tags = swaggerApiJson.tags;
const filesJson = {}; //  {name: {index: indexHeaderStr, type: ''}, ...}

//没有分组的都存在在common文件夹下
// tags = tags.map(item => {
//   if (!item.description) {
//     item.description = 'common';
//   }
//   return item;
// });

for (let i = 0; i < tags.length; i++) {
  const tagEnName = getMatchName(tags[i].name);
  filesJson[tagEnName] = {
    index: '',
    type: '',
    interfaceNameArr: [],
  };
}

// 遍历每个接口
for (const path in swaggerApiJson.paths) {
  const pathObject = swaggerApiJson.paths[path];

  // 遍历每个请求方法
  for (const method in pathObject) {
    let content = `\n`;
    const methodObject = pathObject[method];

    const { apiName, newPath, params } = formatterPath(path);

    // 输出请求参数
    let curInterfaceName = 'any';
    const tagCnName = methodObject.tags[0];
    // const tagEnName = tags.find(item => item.name === tagCnName)?.description || 'common';
    const tagEnName = getMatchName(tagCnName); // 匹配()里面的内容作为文件夹名称

    if (methodObject.parameters) {
      //  判断是否有body参数
      // in的取值["query", "path", "path", "body"]
      const parametersBody = methodObject.parameters.filter(item => {
        return item.in === 'body' || item.in === 'query';
      });
      //  判断是否有接口类型数据，有的话需要创建TS接口
      let interfaceStr = '';
      let hasInterface = false;
      if (parametersBody.length > 0) {
        //  创建TS接口，TS接口名称首字母大写
        curInterfaceName = capitalizeFirstLetter(method) + apiName + 'Interface';
        interfaceStr += `export interface ${curInterfaceName} {\n`;
        parametersBody.forEach(parameter => {
          //  输出参数名称和类型
          //  ckeditor_type: string
          //  file: file
          if (parameter.name === 'root') {
            //  需要判断query参数和body参数的不同情况
            let object = parameter.schema.properties || parameter.schema;
            for (const key in object) {
              if (Object.hasOwnProperty.call(object, key)) {
                const ele = object[key];
                //  添加字段注释
                if (ele.description) {
                  interfaceStr += `  /* ${ele.description} */\n`;
                }
                interfaceStr += `${parseTypeObject(ele, key, '  ')};\n`;
                hasInterface = true;
              }
            }
          } else {
            //  添加字段注释
            if (parameter.description) {
              interfaceStr += `  /* ${parameter.description} */\n`;
            }
            //  添加字段名称和类型
            if (parameter.required === false) {
              interfaceStr += `  ${parameter.name}?: ${parameter.type};\n`;
            } else {
              interfaceStr += `  ${parameter.name}: ${parameter.type};\n`;
            }
            hasInterface = true;
          }
        });
        interfaceStr += '}\n\n';
      }
      if (hasInterface) {
        filesJson[tagEnName].type += interfaceStr;
        filesJson[tagEnName].interfaceNameArr.push(curInterfaceName);
      } else {
        curInterfaceName = 'any';
      }
    }

    // 输出响应体
    let curInterfaceNameResp = capitalizeFirstLetter(method) + apiName + 'Resp';
    if (methodObject.responses) {
      let hasInterface = false;
      let interfaceStr = '';
      for (const responseCode in methodObject.responses) {
        if (responseCode === '200') {
          interfaceStr += `export interface ${curInterfaceNameResp} {\n`;
          const schema = methodObject.responses[responseCode].schema;
          if (schema.type === 'object') {
            const response = schema.properties;
            for (const key in response) {
              if (Object.hasOwnProperty.call(response, key)) {
                const ele = response[key];
                //  添加字段注释
                if (ele.description) {
                  interfaceStr += `  /* ${ele.description} */\n`;
                }
                interfaceStr += `${parseTypeObject(ele, key, '  ')};\n`;
                hasInterface = true;
              }
            }
          } else if (schema.type === 'array') {
            const response = schema.items;
            interfaceStr += `${parseTypeObject(response, 'data', '  ')}[];\n`;
            hasInterface = true;
          }
          interfaceStr += '}\n\n';
        }
      }
      if (hasInterface) {
        filesJson[tagEnName].type += interfaceStr;
        filesJson[tagEnName].interfaceNameArr.push(curInterfaceNameResp);
      } else {
        curInterfaceNameResp = 'any';
      }
    }

    // 输出请求方法和路径 DELETE /cetc_phase/honorary_qualifications/qualifications/{id}/
    let template = templateData;
    let isGet = false;
    if (method.toLowerCase() === 'get') {
      template = templateParams;
      isGet = true;
    }
    content += template
      .replace('apiNameTemp', `${method + apiName}Api`)
      .replace('methodTemp', method)
      .replace('newPath', newPath)
      .replace('TTemp', curInterfaceNameResp)
      .replace(
        'paramsTemp',
        `${params.length > 0 ? params.join(',') + ', ' : ''}${isGet ? 'params?' : 'data?'}: ${curInterfaceName}`,
      );
    filesJson[tagEnName].index += `\n\n/** ${methodObject.summary} */`;
    filesJson[tagEnName].index += content;

    // console.log('-------------------');
  }
}

/**
 * 处理路径path，得到方法名，参数, 替换路径中的{}为${}
 * @param {*} method
 * @param {*} path
 * 1. /cetc_phase/honorary_qualifications/qualifications/{id}/
 *  想要的结果
 *  export function getAppCaseApi(id, params: any) {
      return http.get('/cetc_phase/honorary_qualifications/qualifications/${id}/', params);
    }
    apiName: 命名规则-method+路径上最后一个可用单词(单词进行首字母大写)+Api后缀：例子：getQualificationsApi
    *需要处理apiName名称重名情况*
    @return {apiName, newPath, params}
 */
function formatterPath(path) {
  let apiName = '';
  let pathArr = getPathArr(path);

  //  获取apiName, 取最后一个没有{}的值
  let pickIdx = pathArr.length - 1; // 获取apiName的索引

  // 需要处理多个{}情况，例如 /snapshot/{scene id}/{snapshot id}，影响到获取apiName
  while (pickIdx > 0) {
    apiName = pathArr[pickIdx];
    if (apiName.indexOf('{') !== -1) {
      pickIdx--;
    } else {
      break;
    }
  }

  //  A:  /cetc_phase/honorary_qualifications/qualifications/
  //  B:  /cetc_phase/honorary_qualifications/qualifications/${id}/
  //  解决方法：最后一项是{}的时候，apiName加上Id后缀
  if (pickIdx < pathArr.length - 1) {
    apiName += 'Id';
  }

  if (['index', 'list', 'sso_token'].indexOf(apiName) !== -1) {
    //  A:  /cetc_phase/application_cases/cases/index
    //  B:  /cetc_phase/honorary_qualifications/qualifications/index/
    //  解决方法：最后一项为特定名称的时候，取后两项名称之和
    apiName = pathArr[pickIdx - 1] + capitalizeFirstLetter(apiName);
  }
  // get_template_select => GetTemplateSelect
  const apiNameArr = apiName.split('_');
  apiName = apiNameArr.map(item => capitalizeFirstLetter(item)).join('');

  //  获取newPath, 替换路径里面的{}为${}
  const newPath = path.replace(/\{([^}]+)\}/g, '${$1}');

  // 匹配路径中的 {} 中的内容
  const matches = path.match(/\{([^}]+)\}/g) || [];
  // 提取 {} 中的内容
  const params = matches.map(match => match.slice(1, -1));

  return {
    apiName,
    newPath,
    params,
  };
}

//  对path进行剪切处理，去除收尾空的项
function getPathArr(path) {
  let arr = path.trim().split('/'); //  [ '', 'cetc_phase', 'application_cases', 'cases', '' ]
  arr = arr.filter(item => item !== '');
  return arr;
}

// 首字母大写
function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getMatchName(str) {
  return str.match(/\(([^)]+)\)/)[1] || 'common';
}

/**
 * 递归解析类型为object,
 * type为object的时候，需要递归解析里面的属性properties
 * obj = {
    type: 'object',
    properties: {
      document: {
        type: 'array',
        items: {
          type: 'object',
          properties: { name: { type: 'string' }, url: { type: 'string' } }
        }
      }
    }
  }
  name = structure
 */
function parseTypeObject(obj, name, spaceStr) {
  let str = '';
  if (obj.type === 'object') {
    str += `${spaceStr}${name}: {\n`;
    for (const key in obj.properties) {
      if (Object.hasOwnProperty.call(obj.properties, key)) {
        const ele = obj.properties[key];
        if (ele.type === 'object') {
          str += `${parseTypeObject(ele, key, spaceStr + '  ')};\n`;
        } else if (ele.type === 'array') {
          str += `${parseTypeObject(ele.items, key, spaceStr + '  ')}[];\n`;
        } else {
          let eleType = Array.isArray(ele.type) ? ele.type.join(' | ') : ele.type;
          eleType = replaceTye(eleType);
          if (ele.required === false) {
            str += `${spaceStr + '  '}${key}?: ${eleType};\n`;
          } else {
            str += `${spaceStr + '  '}${key}: ${eleType};\n`;
          }
        }
      }
    }
    str += `${spaceStr}}`;
  } else if (obj.type === 'array') {
    str += `${parseTypeObject(obj.items, name, spaceStr)}[]`;
  } else {
    const type = replaceTye(obj.type);
    if (obj.required === false) {
      str += `${spaceStr}${name}?: ${type}`;
    } else {
      str += `${spaceStr}${name}: ${type}`;
    }
  }
  return str;
}

/** 替换类型 */
function replaceTye(type) {
  switch (type) {
    case 'integer':
      return 'number';
  }
  return type;
}

// ========================数据处理好后创建文件夹、创建api文件=============================
//  mkdirSync 同步操作
if (!fs.existsSync(apiPath)) {
  fs.mkdirSync(apiPath);
}

for (const key in filesJson) {
  const itemNameArr = filesJson[key].interfaceNameArr;
  const len = itemNameArr.length;
  let indexHeaderStrAdd = '';
  if (len > 0) {
    indexHeaderStrAdd += '\n';
    indexHeaderStrAdd += 'import {';
    for (let i = 0; i < len; i++) {
      indexHeaderStrAdd += ' ' + itemNameArr[i] + (i < len - 1 ? ',' : ' ');
    }
    indexHeaderStrAdd += `} from './type';`;
  }

  const content = indexHeaderStr + indexHeaderStrAdd + filesJson[key].index;
  const interfaceContent = filesJson[key].type;
  const folderName = 'api_' + key; //  自动生成文件夹名称加api_前缀
  const filePath = `${apiPath}/${folderName}`;
  // 创建文件夹
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath);
  }
  // 写入文件
  fs.writeFileSync(`${filePath}/${fileName}`, content);
  fs.writeFileSync(`${filePath}/${interfaceName}`, interfaceContent);
}

console.log(['╦══╔═╦═╗╦ ╦ ═╦═', '╠══  ║	╠╠   ║', '╩    ╩	╩ ╩ ═╝'].join('\n'));
