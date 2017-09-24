var commonUrl = {
    logout: "http://39.108.191.122/Portal/login/logout", //退出登陆
    askuser: "http://39.108.191.122/Portal/User/askuser", //基本信息
    confintentions: "http://39.108.191.122/Consumer/Intentions/confintentions", //确认意向单
    recom: "http://39.108.191.122/Portal/User/recom" //广告位
}

function Common() {
    this.ajaxFun = function(url, types, option, callback, asyncType) { //  路径，数据，正确的回调，
            var async = asyncType ? asyncType : true;
            $.ajax({
                url: url,
                type: types,
                dataType: "json",
                data: option,
                async: async,
                success: function(rs) {
                    if ($.isFunction(callback)) callback(rs)
                },
                error: function(rs) {
                    console.log(rs)
                }
            })
        },
        this.Geturl = function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        this.showOrHide = function(res) {
            $("#telescopic").click(function() {
                $(this).toggleClass("shrink");
                $("#leftMenu").toggleClass("shrinkMenu");
                $("#logo").toggleClass("shrinklogo");
                $("#rightMain").toggleClass("shrinkrightMain")
            })
        },
        this.setCookie = function(name, value, days) {
            var date = new Date().getTime();
            days ? days : 7;
            date += days * 24 * 60 * 60 * 1000;
            document.cookie = name + "=" + escape(value) + ";path=/;expires=" + new Date(date).toUTCString();
        },
        this.getCookie = function(name) {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr != null) return unescape(arr[2]);
            return "";
        },
        this.removeCookie = function(name) {
            common.setCookie(name, 1, -1);
        },
        this.recomFun = function(types) {
            common.ajaxFun(commonUrl.recom, "GET", {
                type: types
            }, function(res) {
                if (res.status == 1) {
                    if (types == 1) {
                        $("#loginImg a img").attr({
                            "src": res.img,
                            "alt": res.tit
                        });
                        $("#loginImg a").attr("href", res.url)
                    } else if (types == 2) {
                        $("#advertisementImg a img").attr({
                            "src": res.img,
                            "alt": res.tit
                        });
                        $("#advertisementImg a").attr("href", res.url)
                    }
                } else if (res.status == -1) {
                    alert("广告接口出错了！")
                }
            });

        },
        this.logoutFun = function() {
            $("#quit").click(function() {
                common.ajaxFun(commonUrl.logout, "GET", {}, function(res) {
                    if (res.status == 1) {
                        window.location.href = "http://www.jixieshigong.com";
                    } else {
                        alert("退出失败")
                    }
                });
            })
        },

        /**
         * 
         * 
         * @param {res} res 
         * @param {ele} ele 
         * @param {onlyOne} onlyOne  true 只显示第一条 false 
         */
        this.intentionsStr = function(res, ele, onlyOne) {
            var result1 = (onlyOne) ? [res.data[0]] : res.data,
                str = "";
            $.each(result1, function(i, v) {
                str += ' <div class="everyList">'
                str += '<div class="topInfor">'
                str += '<div class="firstInfor fl">'
                str += '<div class="times fl">' + v.addtime + '</div>'
                str += '<div class="orderId fl">订单号：<span>' + v.intionsid + '</span></div>'
                if (res.type == 2) {
                    str += ' <div class="brandName fl"><a href="' + v.purl + '">' + v.entname + '</a></div>'
                }
                str += '</div>'
                str += '<div class="secondInfor fr">买家：<span>' + v.contact + '&nbsp;&nbsp;&nbsp;&nbsp;' + v.telphone + '&nbsp;&nbsp;&nbsp;&nbsp;' + v.email + '</span>'
                str += '</div>'
                str += '</div>'
                str += '<div class="goodsInfor">'
                str += ' <div class="goodsImg fl"><img src="' + v.images + '" alt="' + v.proname + '"></div>'
                str += ' <div class="goodsName fl">' + v.proname + '</div>'
                str += '<div class="goodsModel fl">' + v.promodel + '</div>'
                str += '<div class="goodsNumber fl">×' + v.count + '</div>'
                str += '<div class="goodsPrice fl">¥' + v.price + '</div>'
                str += ' <div class="goodsBtn fl">'
                if (res.type == 1) {
                    if (v.status == 1) {
                        str += '<p data_id=' + v.id + '>确认</p><span class="none"></span>'
                    } else if (v.status == 2) {
                        str += '<span>已确认：' + v.confirmtime + '</span>'
                    }
                } else if (res.type == 2) {
                    if (v.status == 1) {
                        str += '<span>等待商家确认</span>'
                    } else if (v.status == 2) {
                        str += '<span>商家已确认</span>'
                    }

                }
                str += ' </div>'
                str += '</div>'
                str += '<div class="comment">留言： <span>' + v.comment + '</span></div>'
                str += '</div>';
            });
            if (onlyOne) {
                ele.append($(str));
            } else {
                ele.html($(str));
            }


            $("#unconfirmedOrder").on("click", ".goodsBtn p", function() {
                var data_id = $(this).attr("data_id"),
                    that = $(this);
                common.ajaxFun(commonUrl.confintentions, "GET", {
                    "id": data_id
                }, function(res) {
                    if (res.status == -1) {
                        alert("确认接口出错了！")
                    } else if (res.status == 1) {
                        that.next("span").show().html("已确认 " + res.data.time);
                        that.hide();
                    }
                    console.log(res)
                })
            })
        },
        /**
         * 
         * 
         * @param {res} res 
         * @param {ele} ele 
         * @param {len} len  需要显示的条数，全部显示什么也不传
         */
        this.IndexfavoritesStr = function(res, ele, len) {
            var str = "",
                len = (len) ? len : res.length,
                result = res.slice(0, len);
            $.each(result, function(i, v) {
                str += '<div class="everyCollection">'
                str += '<div class="imgBox">'
                str += '<a href="' + v.purl + '">'
                str += '<img src=' + v.images_Show + ' alt="">'
                str += '<div class="shop">进入店铺</div>'
                str += '</a>'
                str += '</div>'
                str += '<div class="DeviceName">' + v.model + ' ' + v.name_Chn + '</div>'
                str += '<div class="priceBox">'
                str += '<div class="price fl">¥' + v.price + '</div>'
                str += '<div class="priceType fl">参考价</div>'
                str += '</div>'
                str += '</div>';
            })
            ele.prepend(str);
        },
        /**
         * 
         * 
         * @param {totalpage} totalpage 分页总页数
         * @param {oldObj} oldObj 传给后台的对象
         * @param {url} url  ajax请求的地址
         * @param {from} from  渲染的字符串调用 1:收藏 
         */
        this.laypageFun = function(totalpage, oldObj, url, from) {
            laypage({
                cont: 'page', //容器。值支持id名、原生dom对象，jquery对象,
                pages: totalpage, //总页数
                skip: true,
                skin: '#FF8A38', //皮肤
                first: '首页', //若不显示，设置false即可
                last: totalpage, //若不显示，设置false即可
                prev: '<', //若不显示，设置false即可
                next: '>', //若不显示，设置false即可
                groups: 5, //连续显示分页数
                curr: location.hash.replace('#!fenye=', ''), //获取hash值为fenye的当前页
                hash: 'fenye', //自定义hash值
                jump: function(obj, first) {
                    if (!first) {
                        oldObj.page = obj.curr;
                        common.ajaxFun(url, "GET", oldObj, function(res) {
                            if (from == 1) {
                                common.getFavoritesStr(res);
                            } else if (from == 2) {
                                common.intentionsStr(res, $("#OrderList"), false);
                            }

                        })
                    }
                }

            });
        },
        this.getFavoritesStr = function(res) {
            var str = "";
            $.each(res.data, function(i, v) {
                str += '<div class="everyList">'
                str += ' <div class="topInfor">'
                str += '<div class="firstInfor fl">'
                str += '<div class="times fl">' + '2017.09.22 12:30:00' + '</div>'
                str += '<div class="brandName fl">' + v.entname + '</div>'
                str += '</div>'
                str += '</div>'
                str += ' <div class="goodsInfor">'
                str += '<div class="goodsImg fl"><img src="' + v.images_Show + '" alt="' + v.name_Chn + '"></div>'
                str += '<div class="goodsName fl">' + v.name_Chn + '</div>'
                str += '<div class="goodsModel fl">' + v.model + '</div>'
                str += '<div class="goodsNumber fl">' + '1' + '</div>'
                str += '<div class="goodsPrice fl">' + v.price + '</div>'
                str += '<div class="cancelCollectionBtn fl">'
                str += '<p data_pid="' + v.pid + '" data_type="' + v.type + '">取消收藏</p>'
                str += '</div>'
                str += ' </div>'
                str += '</div>'
            });
            $("#collectionList").html(str)
        }
    this.topNavInfor = function() {
        common.ajaxFun(commonUrl.askuser, "GET", { type: 1 }, function(res) { //暂时的 上线前把type去掉
            if (res.status == 1) {
                $(".namePic img,#headerImg").attr({ "src": res.data.header, "alt": res.data.username });
                $(".name a").html(res.data.username);
                $("#oldNum").html(res.data.tel);
                $("#oldEmail").html(res.data.email);
                $("#userName").html(res.data.username);
                $("#changeuserName").val(res.data.username);
                if (res.data.email == "") { //自己加的判断
                    $("#oldEmail").html("没填邮箱");
                }
                if (res.type == 1) {
                    $(".name a").attr("href", res.data.url);
                    if (res.data.status == 0) {
                        $("#Authentication").html("未认证");
                        $("#vip").attr({ "src": "./../images/vip2.png" });
                    } else if (res.data.status == 1) {
                        $("#Authentication").html("待审核");
                        $("#vip").attr({ "src": "./../images/vip2.png" });
                    } else if (res.data.status == 2) {
                        $("#Authentication").html("审核通过");
                        $("#vip").attr({ "src": "./../images/vip.png" });
                    } else if (res.data.status == 3) {
                        $("#Authentication").html("审核失败");
                        $("#vip").attr({ "src": "./../images/vip2.png" });
                    }
                } else if (res.type == 2) {
                    if (res.data.status == 0) {
                        $("#Authentication").html("未实名");
                        $("#vip").attr({ "src": "./../images/vip2.png" });
                    } else if (res.data.status == 1) {
                        $("#Authentication").html("已认证");
                        $("#vip").attr({ "src": "./../images/vip.png" });
                    }
                }
            } else {
                alert("获取导航基本信息出错了！")
            }
        })
    }
}
common = new Common();
common.showOrHide(); //左边导航展开和收缩
common.logoutFun(); //退出
common.topNavInfor(); //顶部导航的用户名和头像