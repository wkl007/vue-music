> 该项目功能上实现了歌手页面、歌手详情页、播放器内核、搜索页面等。项目采用的技术栈主要有Vue.js+vuex+vue-router+axios等。

### 项目技术架构
***
*  vue-cli
*  vue
*  vuex
*  vue-router
*  axios
*  stylus
*  webpack
## Build Setup

###安装
***
项目地址：（`git clone`）
```shell
git@github.com:wkl007/vue-music.git
```
通过`npm`安装本地服务第三方依赖模块(需要已安装[Node.js](https://nodejs.org/))

```
npm install
```
启动服务(http://localhost:8080)

```
npm run dev
```

###目录结构
***
<pre>
├── build              // 构建服务和webpack配置
├── config             // 项目不同环境的配置
├── index.html         // 项目入口文件
├── package.json       // 项目配置文件
├── src                // 生产目录
│   ├── api            // 数据交互相关
│   ├── base           // 基础组件
│   ├── common         // 公共的css js 资源
│   ├── components     // 业务组件
│   ├── router         // 路由配置
│   ├── store          // vuex配置
│   ├── App.vue        // 主页面 
│   └── main.js        // Webpack 预编译入口
</pre>

###实现的功能
***
* 推荐页面
* 歌手页面
* 排行页面
* 搜索页面
* 播放器内核实现
* 个人歌曲管理
* 等等
###项目预览
***
**路由主页面**

![这里写图片描述](http://img.blog.csdn.net/20170626101322976?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzU4NDQxNzc=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

**播放器页面**

![这里写图片描述](http://img.blog.csdn.net/20170626095429589?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzU4NDQxNzc=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
