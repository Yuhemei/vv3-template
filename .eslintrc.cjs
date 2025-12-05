module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-essential', 'plugin:prettier/recommended', 'prettier'],
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  // 指定如何解析语法
  parser: 'vue-eslint-parser',
  // 优先级低于 parse 的语法解析配置
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    ecmaVersion: 'latest',
    sourceType: 'module',
    // No Babel config file detected
    // https://stackoverflow.com/questions/71501892/parsing-error-no-babel-config-file-detected,
    ecmafeatures: {
      globalReturn: false,
      impliedStrict: false,
      jsx: false,
      experimentalObjectRestSpread: false
    }
  },
  plugins: ['prettier', 'vue'],
  rules: {
    // 禁止使用alert confirm prompt
    'no-alert': 0,
    // 在创建对象字面量时不允许键重复 {a:1,a:1}
    'no-dupe-keys': 2,
    // 函数参数不能重复
    'no-dupe-args': 2,
    // switch中的case标签不能重复
    'no-duplicate-case': 2,
    // 禁止对null使用==或!=运算符
    'no-eq-null': 2,
    // 禁止非必要的括号
    'no-extra-parens': 1,
    // 禁止多余的冒号
    'no-extra-semi': 1,
    // 禁止在循环中使用函数（如果没有引用外部变量不形成闭包就以）
    'no-loop-func': 1,
    // 换行风格
    'linebreak-style': [2, 'unix'],
    // 空行最多不能超过2行
    'no-multiple-empty-lines': [1, { max: 2 }],
    // 禁止重复声明变量
    'no-redeclare': 2,
    // 函数调用时 函数名与()之间不能有空格
    'no-spaced-func': 2,
    // 禁止稀疏数组， [1,,2]
    'no-sparse-arrays': 2,
    // 一行结束后面不要有空格
    'no-trailing-spaces': 1,
    // 不能有未定义的变量
    'no-undef': 2,
    // 禁用var，用let和const代替
    'no-var': 2,
    // 必须使用全等
    eqeqeq: 2,
    // 缩进风格
    indent: ['error', 2, { SwitchCase: 1 }],
    // 引号类型
    quotes: [1, 'single'],
    // 语句强制分号结尾
    semi: [2, 'always'],
    // 对象字面量项尾不能有逗号
    'comma-dangle': [1, 'never'],
    // 函数定义时括号前面要不要有空格
    'space-before-function-paren': [0, 'always'],
    // 不能有声明后未被使用的变量或参数
    'no-unused-vars': [1, { vars: 'all', args: 'after-used' }]
  },
  ignorePatterns: ['node_modules/*', 'build/*', 'dist/*', 'lib/*']
};
