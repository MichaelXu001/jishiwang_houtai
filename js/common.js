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
        }
}
common = new Common();
common.showOrHide(); //左边导航展开和收缩