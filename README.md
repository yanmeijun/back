# 说明文档

## 项目：新媒体监测平台

cd /usr/local/redis/bin
./redis-cli
flushall 回车

### 框架: PigX + [Avue](https://avuejs.com/doc/installation) + [vex-talbe](https://xuliangzhan_admin.gitee.io/vxe-table/#/table/start/install)

## 部署

> ### 一、手动部署

1. 新媒体监测 --服务器

   ```
     120.27.244.31 22 root hadoop_super_1 -- 测试
     172.16.132.24 22 root hadoop_super_1 -- 生产
   ```

2. 服务器-对应目录
   将打包之后的 `/dist/**` 拷贝到服务器 `/data/webapps/ucap-user-ui/` 目录下

3. [测试地址](http://120.27.244.31/#/login)
   账号密码:admin 123456

> ### 二、bash 脚本部署: 需要手动输入`密码`两次
>
> 开发服务器
> 120.27.244.31 root/hadoop_super_1
> 测试服务器
> 47.99.85.139 root YCJ_media_20210311

1. 打开 bash 窗口;
2. 输入命令:

```
  sh deloy.sh
```

3. 根据提示，输入密码: hadoop_super_1

## 开发说明

1. 开发目录创建: 相关项放入统一目录下管理
   如:

   1. 订单 -> views/order 目录->包含所有跳转子页面;
   2. [***]如果有其他平台使用共用页面，请复制一份文件到相应平台相关目录下，避免不必要 bug;

2. 提取共用样式到 common.scss

3. UI 组件使用顺序: avue 组件 > element-ui > 其他...

4. 各个平台对应开发文件目录:
   【PS】 内部页面不可重复使用，如果重复请`复制一份到对应平台或者抽出组件`引用。不可以直接相互引用

- new-media ---------------- 新媒体监测
- website ------------------ 网站监测
- cloud-analysis ----------- 云分析
- content-security --------- 内容安全
- performance-evaluation --- 绩效考评

# VScode 开发工具配置：代码格式化 shift + alt + f

- 1. 文件 -> 首选项 -> 设置 -> prettier -> Prettier: Require Config 打钩
- 2. 文件 - 首选项 - 设置 - prettier - Prettier: Require Config 之后的包含 format 的下拉全部改成 prettier
- 3. 代码片段 - 文件 -> 首选项 -> 用户片段 -> vue.json
  ```
    {
  "create-vue": {
  "scope": "",
  "prefix": "vue",
  "body": [
  	"<template>",
  	"\t<div class='$1'></div>",
  	"</template>",
  	"",
  	"<script>",
  	"export default {",
  	"\tname: '$1',",
  	"\tprops: {",
  	"\t},",
  	"\tsetup() {},",
  	"}",
  	"</script>",
  	"",
  	"<style scoped lang=scss>",
  	"/* ~@/styles/variables.scss; 引入css类 */",
  	".$1{}",
  	"</style>"
  ],
  "description": "Log output to console"
  },
  "create-vue-dialog": {
  "scope": "",
  "prefix": "vued",
  "body": [
  	"<template>",
  	"\t<el-dialog class='$1' title='' :visible.sync='isOpen' :append-to-body='true' :before-close='onCloseDialog' :close-on-click-modal='false'>",
  	"\t\t<div class='form-main'>",
  	"\t\t\t<el-form :key='isLoad' :model='form' :rules='rules' ref='refForm' label-width='120px'>",
  	"\t\t\t</el-form>",
  	"\t\t</div>",
  	"\t\t<div slot='footer'>",
  	"\t\t\t<div class='footer-btn'>",
  	"\t\t\t\t<el-button @click='onCancle'>取消</el-button>",
  	"\t\t\t\t<el-button type='primary' @click='onSubmit'>提交</el-button>",
  	"\t\t\t</div>",
  	"\t\t</div>",
  	"\t</el-dialog>",
  	"</template>",
  	"",
  	"<script>",
  	"import { reactive, ref, toRefs, nextTick, onMounted } from '@vue/composition-api';",
  	"export default {",
  	"\tname: '$1',",
  	"\tprops: {",
  	"\t\tisOpen: {type: Boolean, default: false}",
  	"\t},",
  	"\tsetup(props, { root, emit }) {",
  	"\t\t// data",
  	"\t\tconst refForm = ref(null)",
  	"\t\tconst state = reactive({form: {}, isLoad: false})",
  	"",
  	"\t\t// 属性",
  	"\t\tonMounted(() => {",
  	"\t\t\t// 防止 - 初次提交refs 为null",
  	"\t\t\tstate.isLoad = false;",
  	"\t\t\tnextTick(() => {",
  	"\t\t\t\tstate.isLoad = true;",
  	"\t\t\t});",
  	"\t\t});",
  	"",
  	"\t\t// 方法",
  	"\t\tconst onSubmit = () => { refForm.value.validate(async valid => {if (valid) {console.log(state.form);} else {console.log('$1 err');}}); };",
  	"\t\tconst onCloseDialog = () => { emit('closeDialog') }",
  	"\t\tconst onCancle = () => { onCloseDialog(); };",
  	"",
  	"\t\t// 返回",
  	"\t\treturn { refForm, ...toRefs(state), isLoad, onSubmit, onCancle, onCloseDialog }",
  	"\t},",
  	"}",
  	"</script>",
  	"",
  	"<style scoped lang=scss>",
  	"/* ~@/styles/variables.scss; 引入css类 */",
  	".$1{}",
  	"</style>"
  ],
  "description": "Log output to console"
  },
  "create-vue-drawer": {
  "scope": "",
  "prefix": "vuer",
  "body": [
  	"<template>",
  	"\t<el-drawer class='$1' title='' :visible.sync='isLoad' :append-to-body='true' :before-close='onCloseDialog' :wrapperClosable='false' :size='`740px`'>",
  	"\t\t<div class='main'>",
  	"\t\t\t<el-form :key='isLoad' :model='form' :rules='rules' ref='refForm' label-width='120px'>",
  	"\t\t\t</el-form>",
  	"\t\t</div>",
  	"\t\t<div class='footer-btn'>",
  	"\t\t\t<el-button @click='onCancle'>取消</el-button>",
  	"\t\t\t<el-button type='primary' @click='onSubmit'>提交</el-button>",
  	"\t\t</div>",
  	"\t</el-drawer>",
  	"</template>",
  	"",
  	"<script>",
  	"import { reactive, ref, toRefs, nextTick, onMounted } from '@vue/composition-api';",
  	"export default {",
  	"\tname: '$1',",
  	"\tprops: {",
  	"\t\tisOpen: {type: Boolean, default: false}",
  	"\t},",
  	"\tsetup(props, { root, emit }) {",
  	"\t\t// data",
  	"\t\tconst refForm = ref(null)",
  	"\t\tconst state = reactive({form: {}, isLoad: false})",
  	"",
  	"\t\t// 属性",
  	"\t\tonMounted(() => {",
  	"\t\t\t// 防止 - 初次提交refs 为null",
  	"\t\t\tstate.isLoad = false;",
  	"\t\t\tnextTick(() => {",
  	"\t\t\t\tstate.isLoad = true;",
  	"\t\t\t});",
  	"\t\t});",
  	"",
  	"\t\t// 方法",
  	"\t\tconst onSubmit = () => { refForm.value.validate(async valid => {if (valid) {console.log(state.form);} else {console.log('$1 err');}}); };",
  	"\t\tconst onCloseDialog = () => { emit('closeDialog') }",
  	"\t\tconst onCancle = () => { onCloseDialog(); };",
  	"",
  	"\t\t// 返回",
  	"\t\treturn { refForm, ...toRefs(state), onSubmit, onCancle, onCloseDialog }",
  	"\t},",
  	"}",
  	"</script>",
  	"",
  	"<style scoped lang=scss>",
  	"/* ~@/styles/variables.scss; 引入css类 */",
  	".$1{}",
  	"</style>"
  ],
  "description": "Log output to console"
  }
  }
  ```

#### 目录

```
api： 存放所有请求 service
components
  base ------ 基础共用组件
  business-components ------ 业务组件
    -- new-media 新媒体监测-相关业务组件
    -- website   网站监测-相关业务组件
  echarts --- 所有图表组件
  dialog ------- 所有弹框组件
    -- new-media 新媒体监测-相关弹框
    -- website   网站监测-相关弹框
  no-register -- 不需要注册，直接使用的组件
    --包名->即是组件名: 固定写法
      -- index.vue
styles
  -- common.scss 共用样式
  -- element-ui element 组件覆盖文件
  -- element-variables 覆盖 element scss 变量文件
  -- media.scss 共用-媒体查询
  -- variables.scss 共用-变量文件
...
util： 工具
views： 页面
  -- new-media 新媒体监测
  -- website   网站监测
```

## 弹框 --- 共用代码块

#### 1. 标准: vue

#### 2. 弹框: vued

#### 3. 侧边抽屉: vuer

#### 公共样式

```
.flex {
  .center
  .justify-between
  .justify-center
  .justify-end
  .align-center
}
.kp-disabled      -- 禁用样式
.table-no-menu    -- avue表格去掉表头
.kp-block-title   -- 标题样式
.word-ellipsis-1  -- 超出一行...
.word-ellipsis-2  -- 超出两行...
.kp-text-left {
  text-align: left;
}
.kp-text-right {
  text-align: right;
}
.kp-text-center {
  text-align: center;
}
// 主体颜色
.kp-color-main {
  color: $mainBg !important;
}
// 鼠标滑过字体颜色
.kp-hover {
  cursor: pointer;
  &:hover {
    color: $mainBg !important;
  }
}
.kp-hover-line {
  cursor: pointer;
  &:hover {
    color: $mainBg;
    border-bottom: 1px solid $mainBg;
  }
}
// 错误/警示颜色
.kp-color-error {
  color: $mainDanger !important;
}
.kp-color-success {
  color: $mainSuccess !important;
}
.el-switch--label-inside  -- el-switch扩展激活文字内部显示样式
.el-radio-button--plain -- 单选按钮扩展朴素镂空样式
.kp-select-multiple -- 多选select 一行文本
.kp-opacity -- 透明度
```

### 前端开发规范

#### 一、代码编写规范

##### 1. 代码格式

```
  1. 对齐方式：缩进TAB - 2个空格；
  2. 引号：javascript单引号，HTML双引号；
  3. less/scss 层级不宜太深，自行掌控；
```

##### 2. css 规范

```
  1. 除非特殊，禁止使用float布局，改用flex;
  2. 能用flex布局解决尽量不使用定位;
  3. 绝对定位absolute永远相对于父级元素relative/fixed/absolute;
  4. 圆角、渐变色等优先使用css3实现;
  5. 尽量减少Dom元素数量，实现效果...;
  6. 非特殊，禁止使用行内样式`style="..."` 改用class等;
  7. class类名命名规范: 小写字母-小写字母,`name | depart-name`, 禁止用驼峰、大驼峰命名: `Name|departName等`
```

##### 3. js 规范

    1. 使用 === 或 !==

##### 3. 提交规范

    1. 禁止提交 - 遵守jsLint/esLint开发规范，有警告、错误代码；
    2. 禁止提交 - 浏览器console有报错代码；

#### 二、推荐开发

1. TypeScript 开发 - 【根据项目而定】;
2. 遵循 eslint/jsLint 开发;

#### 三、写好项目说明文档

> README.md - 项目介绍、目录结构说明、注意事项、开发环境、正式环境...

## 接口名称: \*\*\*

- ### Methods: GET|PUT|POST...
- ### 开发人员: \*\*\*
- ### 地址: url
- ### 查询参数: 注解
  ```
    {
      taskId: '订单id | required',
      taskName: '订单名称',
      ...
    }
  ```
- ### 返回值: 注解
  ```
    {
      data: {
        taskName: '微信',         // 任务名称
        status: 'jsdfkljdsklfd'  // 状态
      },
      mdg: '',
      code: 0
    }
  ```
- ### 示例
  - ### url: **\*\*\***
  - #### 返回值:
  ```
    {
      data: {
        taskName: '微信',
        status: 'jsdfkljdsklfd'
      },
      mdg: '',
      code: 0
    }
  ```
