var PageSdK = function (window, document) {
    var _stop = true;
    var _timer = null
    var mainlink = '//sandbox-h5sdk.gamdream.com'
    var dataUrl = {
        index: '/platform/index',
    }
    return {
        isIos: /iphone|ipad/i.test(navigator.userAgent.toLowerCase()),
        isAndroid: /android/i.test(navigator.userAgent.toLowerCase()),
        isWx: /micromessenger/i.test(navigator.userAgent.toLowerCase()),
        init: function () {
            if (this.getUrlString('l') == 1) {
                mainlink = '//sandbox-h5sdk.gamdream.com'
            }
            this.index()
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
                url: mainlink + opt.url,
                dataType: 'json',
                data: opt.data,
                async: opt.async || true,
                success: function (data) {
                    _this.loading('close')
                    opt.stop = true;
                    opt.callback && opt.callback(data);
                },
                error: function (err) {
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
            let _this = this;
            let page = 1;
            let stop = false;
            if (!$('.index-page').length) {
                return false
            }

            loadHtml('one')

            function loadHtml(type) {
                if (stop) {
                    return false
                }
                stop = true
                _this.$ajax({
                    url: dataUrl.index,
                    type: 'post',
                    data: {
                        page: page
                    },
                    callback: function (data) {
                        if (data.error_code == 0) {
                            addHtml(data.data, type)
                            if (data.data.playing_list.length >= 10) {
                                stop = false
                            }
                        } else {
                            _this.onMsg(data.msg)
                        }
                        $('.index-page').css('opacity', 1)
                    }
                })
            }

            function addHtml(data, type) {
                const {
                    banner,
                    recommend,
                    playing_list
                } = data
                if (type === 'one') {
                    if (banner.length) {
                        let bannerHtml = ''
                        banner.forEach(key => {
                            bannerHtml += `<li><a class="pic" href="${key.jump_url || 'javascript:;'}"><img src="${key.img_url}" /></a></li>`
                        })
                        $('#slideBox .bd ul').html(bannerHtml)
                        if (banner.length > 1) {
                            TouchSlide({
                                slideCell: "#slideBox",
                                titCell: ".hd ul",
                                mainCell: ".bd ul",
                                effect: "leftLoop",
                                autoPage: true,
                                autoPlay: true
                            })
                        }
                    } else {
                        $('#slideBox').hide()
                    }
                    if (recommend.length) {
                        let recommendHtml = ''
                        recommend.forEach(key => {
                            recommendHtml += `<li><a href="${key.jump_url || 'javascript:;'}"><img src="${key.img_url}" /><p>${key.title}</p></a></li>`
                        })
                        $('.hot-box .hot').html(recommendHtml)
                    } else {
                        $('.hot-box').hide()
                    }
                }
                if (playing_list.length) {
                    let html = ''
                    playing_list.forEach(key => {
                        let tags = key.tags.map(el => {
                            return `<span class="tag" style="background:${el.color}">${el.name}</span>`
                        })
                        html += `
                            <li>
                                <a href="${key.jump_url || 'javascript:;'}">
                                    <img class="pic" src="${key.img_url}" alt="">
                                </a>
                                <a href="${key.jump_url || 'javascript:;'}" class="text">
                                    <h3 class="tit"><span class="name">${key.title}</span>${tags}</h3>
                                    <p class="info">${key.sub_title}</p>
                                    <p>${key.description}</p>
                                </a>
                                <a href="${key.jump_url || 'javascript:;'}" class="link">进入</a>
                            </li>
                        `
                    })
                    $('.list-box .list').append(html)
                }
            }

            window.onscroll = function () {
                let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
                let winHeight = document.documentElement.clientHeight || document.body.clientHeight
                let allHeigth = document.documentElement.scrollHeight || document.body.scrollHeight
                if (scrollTop + winHeight >= allHeigth && !stop) {
                    page++
                    loadHtml()
                }
            }

        }
    };
}(window, document);

PageSdK.init()