const { createProxyMiddleware } = require ('http-proxy-middleware');

const $url = 'http://sandbox-ipggsd.gamdream.com'
const proxylist = [
  '/user', '/config', '/site', '/menu', '/kf', '/ipgapp', '/reservation', '/sys-log'
]

module.exports = function(app) {
  proxylist.forEach(key => {
    app.use(
      key,
      createProxyMiddleware({
        target: $url,
        changeOrigin: true,
      })
    );
  })
};