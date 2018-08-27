/**
 * Created by cnm on 2016/11/6.
 */

$(document).ready(function (){
    SetSwiper();
    SetContentOld();
});
$(document).on("click",".swiper-slide",function () {
    window.location.href=$(this).attr("value");
});
$(document).on("click",".news_ul li",function () {
    console.log($(this).attr("url"));
    var url= SERVER_IP + "/efaleague-web/appPath/appData/addViewNum?news_id="+$(this).attr("value");
    $.ajax(
        {
            url: url,
            success: function (data){}
        });
    window.location.href=$(this).attr("url");
});
$(".join-team").click(function () {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        webkit.messageHandlers.callbackHandler.postMessage({functionToRun: "joinTeam"});
    } else if (/(Android)/i.test(navigator.userAgent)) {
        android.JoinTeam();
    } else {
        //window.location.href ="pc.html";
    };
});
$(".match-apply").click(function () {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        webkit.messageHandlers.callbackHandler.postMessage({functionToRun: "matchSignUp"});
    } else if (/(Android)/i.test(navigator.userAgent)) {
        android.MatchSignUp();
    } else {
        //window.location.href ="pc.html";
    };
});
function SetSwiper() {
    var url= SERVER_IP + "/efaleague-web/appPath/appData/bulletinData";
    $.ajax({
        url:url,
        success:function (data) {
            var myobject=eval(data);
            var swipercontent=$(".swiper-wrapper");
            swipercontent.empty();
            var content='';
            //增加首页滑动页面
            for (var i=0;i<myobject.length;i++){
                var singleobj=myobject[i];
                content+=
                    '<div class="swiper-slide" id="swiper" value='+singleobj.url+'>'+
                        '<img src='+singleobj.photo+"?imageView2/1/w/360/h/174"+' alt="" width="100%" height="100%">'+
                    '</div>';
            }
            swipercontent.append(content);
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                paginationClickable: true,
                spaceBetween: 30,
                centeredSlides: true,
                autoplay: 2500,
                autoplayDisableOnInteraction: false
            });
        }
    })
}
function SetContentOld() {
    //拉数据
    var url= SERVER_IP + "/efaleague-web/appPath/appData/newsData?id=1";
    $.ajax(
        {
            url: url,
            success: function (data) {
                // 解析json
                var obj = (data);
                var addcontent=$(".news_ul").empty();
                for (var i = 0; i < obj.length; i++) {
                    var single=obj[i];
                    var newroll =
                        '<li value='+single.id+' url='+single.url+'>'+
                        '<div class="single_new background-white">'+
                        '<div class="news_img">'+
                        '<img  class="img-attr" src='+single.photo+"?imageView2/1/w/200/h/180"+' alt="" width="100%" height="100%">'+
                        '</div>'+
                        '<div class="news_info">'+
                        '<div class="news_title text-space">'+single.title+'</div>'+
                        '<div class="news_time">'+
                        '<div class="time_icon">'+
                        '<img src="images/notice_time.png" alt="">'+
                        '</div>'+
                        '<div class="real-time">'+single.date+'</div>'+
                        '<div class="viewNum"><a class="read_count">阅读 '+single.viewNum+'</a></div>'+
                        '</div>'+
                        '</div>'+
                        '</div>'+
                        '</li>'
                    addcontent.append(newroll);
                }
            }
        }
    )
}
