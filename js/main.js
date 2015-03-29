$(document).ready(function(){
    zone.init();
});

/**
 * jquery.mousewheel.min.js 的 deltaY 前滚值：1、后滚值：-1；deltaFactor 值是一次滚动距离
 * @type {{dom: (*|jQuery|HTMLElement), nav: (*|jQuery|HTMLElement), page_height: (*|jQuery), init: init, bind_fn: bind_fn}}
 */
var zone = {
    dom : $(".section"),
    nav : $("#nav .nav-item"),
    page_height : $(window).height(),
    scrollDom : $("body"),
    page_index : getHash() || 0,
    url : window.location.protocol + window.location.pathname,
    init : function(){
        var _this = this;
        _this.dom.height(_this.page_height);
        _this.scrollDom.css({"margin-top":-_this.page_height*_this.page_index});
        _this.dom.eq(_this.page_index).addClass("active");
        _this.nav.eq(_this.page_index).addClass("active");
        _this.bind_fn();
    },
    bind_fn : function(){
        var _this = this;
        $(window).resize(function(){
            _this.page_height = $(window).height();
            _this.init();
        });
        _this.scrollDom.on("mousewheel",function(e){
            e.stopPropagation();
            e.preventDefault();
            if(_this.scrollDom.is(":animated")){return}
            var scrollTop = parseInt(_this.scrollDom.css("margin-top")),
                maxTop = _this.scrollDom.height()-_this.page_height;
            if(e.deltaY===1){
                if(Math.abs(scrollTop)>_this.page_height){
                    _this.scrollDom.animate({"margin-top":scrollTop+_this.page_height},function(){
                        if(_this.page_index !=0){
                            _this.page_index -= 1;
                            _this.dom.removeClass("active").eq(_this.page_index).addClass("active");
                            _this.nav.removeClass("active").eq(_this.page_index).addClass("active");
                            window.location.hash = "#page-"+_this.page_index;
                        }
                    });
                }else{
                    _this.scrollDom.animate({"margin-top":0},function(){
                        _this.page_index = 0;
                        _this.dom.removeClass("active").eq(_this.page_index).addClass("active");
                        _this.nav.removeClass("active").eq(_this.page_index).addClass("active");
                        window.location.hash = "#page-0";
                    });
                }
            }else if(e.deltaY===-1){
                if(Math.abs(scrollTop)>=maxTop){
                    _this.scrollDom.animate({"margin-top":-maxTop},function(){
                        _this.page_index = _this.dom.length-1;
                        _this.dom.removeClass("active").eq(_this.page_index).addClass("active");
                        _this.nav.removeClass("active").eq(_this.page_index).addClass("active");
                        window.location.hash = "#page-"+_this.page_index;
                    });
                }else{
                    _this.scrollDom.animate({"margin-top":scrollTop-_this.page_height},function(){
                        if(_this.page_index<_this.dom.length-1){
                            _this.page_index += 1;
                            _this.dom.removeClass("active").eq(_this.page_index).addClass("active");
                            _this.nav.removeClass("active").eq(_this.page_index).addClass("active");
                            window.location.hash = "#page-"+_this.page_index;
                        }
                    });
                }
            }
        });
        _this.nav.on("click","a",function(){
            if(_this.scrollDom.is(":animated")){return}
            _this.page_index = Number($(this).attr("data-toggle"));
            var toTop = _this.page_index*_this.page_height;
            _this.scrollDom.animate({"margin-top":-toTop},function(){
                _this.dom.removeClass("active").eq(_this.page_index).addClass("active");
                _this.nav.removeClass("active").eq(_this.page_index).addClass("active");
                window.location.hash = "#page-"+_this.page_index;
            })
        });
    }
};
function getHash(){
    var hash_num = 0, hash = window.location.hash;
    if(hash){
        hash_num = parseInt(hash.slice(hash.length-1,hash.length));
    }
    return hash_num;
}