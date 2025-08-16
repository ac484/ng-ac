module.exports = {
  // 引號設置
  singleQuote: true,
  jsxSingleQuote: true,

  // 縮進設置
  useTabs: false,
  tabWidth: 2,

  // 行寬設置
  printWidth: 100, // 與 package.json 保持一致

  // 分號設置
  semi: true,

  // 箭頭函數括號
  arrowParens: 'avoid',

  // 對象括號間距
  bracketSpacing: true,
  bracketSameLine: false,

  // 尾隨逗號
  trailingComma: 'es5', // 更適合現代 JavaScript

  // HTML 空白敏感度
  htmlWhitespaceSensitivity: 'css', // 更適合 Angular 模板

  // 散文換行
  proseWrap: 'preserve',

  // 行尾符號
  endOfLine: 'lf',

  // 文件覆蓋配置
  overrides: [
    {
      files: '*.html',
      options: {
        parser: 'angular',
        htmlWhitespaceSensitivity: 'strict'
      }
    },
    {
      files: '*.component.ts',
      options: {
        // 組件文件特殊處理
        printWidth: 120
      }
    },
    {
      files: '*.service.ts',
      options: {
        // 服務文件特殊處理
        printWidth: 120
      }
    },
    {
      files: '*.entity.ts',
      options: {
        // 實體文件特殊處理
        printWidth: 120
      }
    },
    {
      files: '*.dto.ts',
      options: {
        // DTO 文件特殊處理
        printWidth: 120
      }
    },
    {
      files: '*.less',
      options: {
        // Less 文件特殊處理
        singleQuote: false,
        printWidth: 120
      }
    }
  ]
};
