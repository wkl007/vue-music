const connect = require('connect');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const csrf = require('xsrf');
const http = require('http');
const serveStatic = require('serve-static');
const registerRouter = require('./dist/custom-router.cjs');

const port = 9000;

const app = connect();

const csrfProtection = csrf({
  cookie: true,
  ignoreMethods: ['HEAD', 'OPTIONS'],
  checkPathReg: /^\/api/,
});

// 中间件顺序很重要
app.use(cookieParser());
app.use(csrfProtection);

// 自定义中间件设置 CSRF token
app.use((req, res, next) => {
  if (req.url === '/') {
    res.setHeader('Set-Cookie', `XSRF-TOKEN=${req.csrfToken()}; Path=/`);
  }
  next();
});

// 注册路由
registerRouter(app);

// 压缩中间件
app.use(compression());

// 静态文件服务
app.use(serveStatic('dist'));

// 错误处理
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next();
  }

  // 处理 CSRF token 错误
  res.statusCode = 403;
  res.setHeader('Content-Type', 'text/html');
  res.end('<p>接口已经被我用 CSRF 保护了，请使用自己的服务器代理接口</p>');
});

// 创建并启动服务器
http.createServer(app).listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:' + port + '\n');
});
