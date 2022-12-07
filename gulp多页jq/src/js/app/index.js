var PageSdK = function (window, document) {
    var _stop = true;
    var _timer = null
    var mainlink = '//m.9fresh.vip'
    var dataUrl = {
        captcha: '/exchange/captcha?refresh',
        query: '/exchange/query',
        submit: '/exchange/submit',
        center: '/user/index',
        express: '/user/express',
        share: '/exchange/share'
    }
    return {
        isIos: /iphone|ipad/i.test(navigator.userAgent.toLowerCase()),
        isAndroid: /android/i.test(navigator.userAgent.toLowerCase()),
        isWx: /micromessenger/i.test(navigator.userAgent.toLowerCase()),
        init: function () {
            this.index()
            this.address()
            this.center()
            this.more()
            this.wxShare()
        },
        onMsg: function (msg) {
            if ($("#cmTips").length) {
                clearTimeout(_timer);
                $("#cmTips").remove();
            };
            var oHtml = [];
            oHtml.push('<section id="cmTips" class="cmTips">');
            oHtml.push('    <p class="msg-tx">' + msg + '</p>');
            oHtml.push('</section>');

            $("body").append(oHtml.join("")).find("#cmTips").addClass('show');
            _timer = setTimeout(function () {
                $("#cmTips").remove();
            }, 4000);
        },
        loading: function (option) {
            if (option == 'close') {
                $('#loading').hide()
            } else if (option == 'open') {
                if (!$('#loading').length) {
                    $("body").append('<section class="zz" id="loading"><div class="loading"></div></section>')
                } else {
                    $('#loading').show()
                }
            }
        },
        $ajax: function (opt) {
            var _this = this;
            var _url = ''
            if (opt.stop) {
                return false;
            }
            opt.stop = false
            if (opt.data.load != 1) {
                _this.loading('open')
            }
            $.ajax({
                type: opt.type,
                url: opt.url,
                dataType: 'json',
                data: opt.data,
                async: opt.async || true,
                success: function (data) {
                    _this.loading('close')
                    opt.stop = true;
                    opt.callback && opt.callback(data);
                }, error: function (err) {
                    _this.loading('close')
                    opt.stop = true;
                    _this.onMsg("网络繁忙，请稍后再试");
                }
            });
        },
        getUrlString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        index: function () {
            var _this = this;
            if (!$('.index').length) {
                return false
            }
            console.log("首页")
            function changeCode(){
                var $el = $('.code')
                _this.$ajax({
                    url: dataUrl.captcha,
                    type: 'get',
                    data: {},
                    callback: function (data) {
                        if (data.url) {
                            $el.attr('src', mainlink + data.url)
                        }
                    }
                })
            }
            $('.code').on('click', function () {
                changeCode()
            })
            $('.submit').on('click', function () {
                if (!$('.ins-card').val().trim()) {
                    _this.onMsg('请输入礼品卡号')
                    return false
                }
                if (!$('.ins-pass').val().trim()) {
                    _this.onMsg('请输入礼品卡密码')
                    return false
                }
                if (!$('.ins-code').val().trim()) {
                    _this.onMsg('请输入验证码')
                    return false
                }
                _this.$ajax({
                    url: dataUrl.query,
                    type: 'post',
                    data: {
                        code: $('.ins-card').val(),
                        pwd: $('.ins-pass').val(),
                        captcha: $('.ins-code').val()
                    },
                    callback: function (data) {
                        if (data.code == 0) {
                            location.href = data.data.url
                        } else {
                            changeCode()
                            _this.onMsg(data.msg)
                        }
                    }
                })
            })
        },
        address: function () {
            var _this = this;
            if (!$('.address').length) {
                return false
            }
            if (_this.getUrlString('goods_name')) {
                //$('.ins-title').text(_this.getUrlString('goods_name'))
            }
            $('.pop .close').on('click', function () {
                $('.pop').hide()
            })
            $('.submit').on('click', function () {
                if (!$('.ins-name').val().trim()) {
                    _this.onMsg('请输入收件人姓名')
                    return false
                }
                if (!/^1\d{10}$/.test($('.ins-phone').val())) {
                    _this.onMsg('手机号码不正确')
                    return false
                }
                if (!$('.ins-address').val().trim()) {
                    _this.onMsg('请选择收货地址')
                    return false
                }
                if (!$('.ins-more').val().trim()) {
                    _this.onMsg('请输入详细地址')
                    return false
                }
                if (!$('.ins-time').val().trim()) {
                    _this.onMsg('请选择发货时间')
                    return false
                }
                var city = $('.ins-address').val().split('/')
                _this.$ajax({
                    url: dataUrl.submit,
                    type: 'post',
                    data: {
                        real_name: $('.ins-name').val(),
                        phone: $('.ins-phone').val(),
                        province: city[0],
                        city: city[1],
                        area: city[2],
                        address: $('.ins-more').val(),
                        deliver_date: $('.ins-time').val()
                    },
                    callback: function (data) {
                        if (data.code == 0) {
                            $('.pop').show()
                            setTimeout(() => {
                                location.href = data.data.url
                            }, 2e3)
                        } else {
                            _this.onMsg(data.msg)
                        }
                    }
                })
            })
            var year = new Date().getFullYear()
            var month = new Date().getMonth() + 1
            var day = new Date().getDate() + 1
            var start_time_picker = new mui.DtPicker({ "type": "date", "beginYear": year, "beginMonth": month, "beginDay": day, "endYear": year + 1 });
            $(".ins-time").on("click", function () {
                start_time_picker.show(function (items) {
                    $(".ins-time").val(items.text)
                });
            });
            var city_picker = new mui.PopPicker({ layer: 3 });
            city_picker.setData(init_city_picker);
            $(".ins-address").on("click", function () {
                city_picker.show(function (items) {
                    var text = items[0].text + '/' + items[1].text + ((items[2].text || '') ? ('/' + items[2].text) : '')
                    if (items[0].text == items[1].text) {
                        text = items[1].text + '/' + items[2].text
                    }
                    $(".ins-address").val(text)
                });
            });


        },
        center: function () {
            var _this = this;
            var page = 1;
            var stop = true
            if (!$('.center').length) {
                return false
            }
            getData()
            function getData() {
                if (!stop) {
                    return false
                }
                stop = false
                _this.$ajax({
                    url: dataUrl.center,
                    type: 'post',
                    data: {
                        page: page
                    },
                    callback: function (data) {
                        if (data.code == 0) {
                            addHtml(data.data.order_info)
                            if (data.data.order_info.length >= 10) {
                                stop = true
                            }
                        } else {
                            _this.onMsg(data.msg)
                        }
                    }
                })
            }
            function addHtml(data) {
                var html = ''
                for (var i = 0; i < data.length; i++) {
                    html += `<li>
                                <a href="${data[i].redirect_url}">
                                    <img class="pic" src="${data[i].goods_image}" alt="">
                                    <div class="text">
                                        <h3 class="name">${data[i].title}</h3>
                                        <p>兑换时间：${data[i].exchange_time}</p>
                                        <span>点击查看物流信息</span>
                                    </div>
                                </a>
                            </li>`
                }
                $('.center .list').append(html)
            }

            $(window).scroll(function () {
                let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
                let height = document.documentElement.clientHeight
                let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
                if ((height + scrollTop > scrollHeight - 10) && stop) {
                    page++
                    getData()
                }
            })
        },
        more: function () {
            var _this = this;
            if (!$('.ordermore').length) {
                return false
            }
            $('.back').on('click', function () {
                history.go(-1)
            })
            _this.$ajax({
                url: dataUrl.express,
                type: 'post',
                data: {
                    order_no: _this.getUrlString('order_no')
                },
                callback: function (data) {
                    if (data.code == 0) {
                        addHtml(data.data)
                    } else {
                        _this.onMsg(data.msg)
                    }
                }
            })

            function addHtml(data) {
                var list = ''
                for (var i = 0; i < data.express_info.length; i++) {
                    var text = data.express_info[i].status.split(/(\d{9,14})|(\d{3,4}\-\d{6,11})/).map(i => {
                        if (/^\d+$/.test(i) || /\d{3,4}\-\d{6,11}/.test(i)) {
                            return '<a href="tel:' + i + '" class="tel">' + i + '</a>'
                        }
                        return i
                    })
                    list += `<div class="item">
                                <div class="time"></div>
                                <div class="text">
                                    <p>${text.join('')}</p>
                                    <span>${data.express_info[i].time}</span>
                                </div>
                            </div>`
                }
                var html = `<div class="mt">
                                <img src="${data.goods_image}" alt="" class="pic">
                                <div class="text">
                                    <h3 class="name">物流状态</h3>
                                    <p class="status">${data.express_status}</p>
                                    <span>${data.express_company}：<em class="order">${data.express_no}</em></span>
                                </div>
                            </div>
                            <div class="mc">
                                ${list}
                            </div>`

                $('.main').html(html)
            }

        },
        wxShare: function () {
            var _this = this;
            _this.$ajax({
                url: dataUrl.share,
                type: 'post',
                data: {url: location.href},
                callback: function (data) {
                    if (data.code == 0) {
                        wxEvent(data.data)
                    }
                }
            })
            function wxEvent(config) {
                wx.config({
                    debug: true,
                    appId: config.appId,
                    timestamp: config.timestamp,
                    nonceStr: config.nonceStr,
                    signature: config.signature,
                    jsApiList: [
                        'checkJsApi',
                        'chooseImage',
                        'previewImage',
                        'uploadImage',
                        'downloadImage',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo'
                    ]
                })
                window.shareData = {
                    'img': config.icon,
                    'link': config.url,
                    'title': config.title,
                    'desc': config.desc
                }
                wx.ready(function () {
                    var shareDataLine = {
                        title: window.shareData.title,
                        link: window.shareData.link,
                        imgUrl: window.shareData.img,
                        success: function (res) { }
                    }
                    var shareData = {
                        title: window.shareData.title,
                        desc: window.shareData.desc,
                        link: window.shareData.link,
                        imgUrl: window.shareData.img,
                        success: function (res) { }
                    }
                    wx.onMenuShareAppMessage(shareData)
                    wx.onMenuShareTimeline(shareDataLine)
                    wx.onMenuShareQQ(shareData)
                    wx.onMenuShareWeibo(shareData)
                })
            }
        }
    };
}(window, document);

PageSdK.init()

