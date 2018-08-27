/**
 * Created by 晴识明月 on 2017/3/2.
 */
var mine_info;
var current_moment_id;
var current_moment,have_logined,loginId;
var startpage=0,numberperpage=5,owner_id;
$(document).ready(function (){
    //根据localStorage缓存看是否登录
    have_logined=localStorage.getItem("have_logined");
    if(have_logined==1){
        mine_info=JSON.parse(localStorage.getItem("mine_info"));
        loginId=localStorage.getItem("loginId");
    }
    owner_id=GetRequest()["owner_id"];
    SetContent_new();
    //初始化emoji控件
    $('.emotion').qqFace({

        id : 'facebox',

        assign:'commenttext',

        path:'third-plugin/qqFace/arclist/' //表情存放的路径

    });
});
$(document).on("click",".moment-ul .comment-div",function () {
    if(have_logined!=1){
        TIP_ERROR("未登录，不能操作")
        return;
    }
    $("#myModal").modal("show");
    var commenttext=$(this).closest("li").find(".comment-text").attr("id");
    // var X = $(this).offset().top+38; //当前点击控件的位置 动态设置modal的位置
    var X=100;
    current_moment_id=$(this).closest("li").attr("id");
    current_moment=$(this).closest("li");
    $("#myModal").css("top",X);
});
$(document).on("click",".delete-moment",function () {
    var r=confirm("你确定删除这条动态吗？")
    if (r==true) {
        var moment_id=$(this).closest("li").attr("id");
        var mythis=$(this).closest("li");
        var url= SERVER_IP + "/efaleague-web/appPath/appData/Moment/delete?id="+moment_id;
        $.ajax({
            url:url,
            success:function (data) {
                if(data.result=="success"){
                   mythis.remove();
                }else TIP_ERROR("删除失败！");

            }
        })
    }
});
$(document).on("click",".delete-comment",function () {
    var r=confirm("你确定删除这条评论吗？")
    if (r==true) {
        var comment_id=$(this).closest("li").attr("id");
        var mythis=$(this).closest("li");
        var moment_id=$(this).closest(".each-moment").attr("id");
        var url= SERVER_IP + "/efaleague-web/appPath/appData/Moment/delete-comment?id="+comment_id+"&moment_id="+moment_id;
        $.ajax({
            url:url,
            success:function (data) {
                if(data.result=="success"){
                    mythis.closest(".each-moment").find("#comment-num").text(eval(mythis.closest(".each-moment").find("#comment-num").text())-1);
                    mythis.remove();
                }else TIP_ERROR("删除失败！");
            }
        })
    }
});
$(document).on("click",".loadmore",function () {
    SetContent_new();
});
$(document).on("click",".comment-confirm",function () {
    var r=confirm("你确定发表评论吗？")
    if (r==true) {
        var content=$("#commenttext").html();
        var url= SERVER_IP + "/efaleague-web/appPath/appData/Moment/comment?user_id="+loginId+"&content="+content+"&moment_id="+current_moment_id;
        $.ajax({
            url:url,
            success:function (data) {
                if(data.result=="success"){
                    var neeroll=
                        '<li>'+
                        '<div class=" font12pt"><a href="javascript:;">'+mine_info.name+'</a>:'+content+'<a href="javascript:;" class="delete-comment"><i class="icon-delete-com"></i></a>'+
                        '</div>' +
                        '</li>';
                    current_moment.find(".comment-ul").append(neeroll);
                    current_moment.find("#comment-num").text(eval(current_moment.find("#comment-num").text())+1); //评论数量加1
                    current_moment.find(".no-comment").remove();
                }else TIP_ERROR("评论失败！");
                $("#commenttext").empty();
            }
        })
    }
    $("#myModal").modal("hide");
});
$(document).on("click",".close_modal",function () {//关闭模态框
    $("#commenttext").empty();
    $("#myModal").modal("hide");
})
$(document).on("click","#praise",function () {
        if(have_logined!=1){
            TIP_ERROR("未登录，不能操作")
            return;
        }
        if($(this).hasClass("on")) return;
        $(this).addClass("on");
        var moment_id=$(this).closest("li").attr("id");
        var mythis=$(this);
        var url= SERVER_IP + "/efaleague-web/appPath/appData/Moment/praise?user_id="+loginId+"&moment_id="+moment_id;
        $.ajax({
            url:url,
            success:function (data) {
                mythis.removeClass("on");
                if(data.result=="praise success"){ //点赞成功
                    // mythis.find("i").removeClass("icon-praise").addClass("icon-comment");
                    mythis.find("#praise-num").text(eval(mythis.find("#praise-num").text())+1);
                    mythis.find(".praise-status").html("取消赞");

                }else if(data.result=="cancel success"){//取消点赞成功
                    // mythis.find("i").css("background-image","../images/icon_praise.png");
                    mythis.find("#praise-num").text(eval(mythis.find("#praise-num").text())-1);
                    mythis.find(".praise-status").html("赞");
                }else
                    TIP_ERROR("点赞失败！");

            }
        })
});
function SetContent_new() {
    var url;
    if(typeof(owner_id)=="undefined"){
        url= SERVER_IP + "/efaleague-web/appPath/appData/Moment/getallmomentbypage?startpage="+startpage+"&numberperpage="+numberperpage;
    }else
        url= SERVER_IP + "/efaleague-web/appPath/appData/Moment/getonemomentbypage?owner_id="+owner_id+"&startpage="+startpage+"&numberperpage="+numberperpage;
    var allcontent=$(".moment-ul");
    $.ajax({
        url:url,
        success:function (data) {
            var all_moment=eval(data["moment"]);
            var all_comment=eval(data["comment"]);
            console.log(all_moment);
            console.log(all_comment);
            if(all_moment.length==0){
                TIP_ERROR("没有更多了呢");
                return;
            }
            startpage+=all_moment.length; //分页请求页面加上实际返回的数量
            for (var i=0;i<all_moment.length;i++){
                var single=all_moment[i];
                var head_photo="images/default_head.png";
                var name="匿名用户";
                if(single.user.photo!="") head_photo=single.user.photo;
                if(single.user.name!="") name=single.user.name;
                var newroll=
                    '<li class="each-moment" id='+single.id+'>'+
                    '<div class="co-head">'+
                    '<div class="img-div">'+
                    '<img src='+head_photo+' alt="" class="head-img">'+
                    '</div>'+
                    '<div class="info-div">'+
                    '<div class="name-div font14pt"><a href="javascript:;">'+name+'</a></div>'+
                    '<div class="time-div font12pt"><span>'+single.date+'</span></div>'+
                    '</div>';
                if(single.user.id==loginId){
                    newroll+= '<div class="delete-moment"><i class="icon-delete"></i></div>';
                }
                    newroll+=
                    '</div>'+
                    '<div>'+
                    '<div class="show-text">'+single.content+'</div>'+
                    '<div class="img-box">'+single.photo+'</div>'+
                    '</div>'+
                    '<div class="comment-list">'+
                    '<ul  class="comment-ul">';
                if(all_comment[i].length==0){
                    newroll+=
                        '<li class="no-comment">'+
                        '<div class=" font12pt">暂时还没有任何评论，快去评论吧！</div>'+
                        '</li>';
                }else {
                    for(var j=0;j<all_comment[i].length;j++){
                        var single_comment=all_comment[i][j];
                        var comment_name="匿名用户";
                        if(single_comment.user.name!="") comment_name=single_comment.user.name;
                        newroll+=
                            '<li id='+single_comment.id+'>'+
                            '<div class=" font12pt"><a href="javascript:;">'+comment_name+'</a>:'+single_comment.content+ ' ';
                        if(single_comment.user.id==loginId){
                            newroll+= '<a href="javascript:;" class="delete-comment"><i class="icon-delete-com"></i></a>';
                        }
                          newroll+=
                            '</div>'+
                            '</li>';
                    }
                }
                newroll+=
                    '</ul>'+
                    '</div>'+
                    '<div>'+
                    '<div class="f-detail font12pt">'+
                    '<a href="javascript:;" class="comment-div" data-toggle="modal" data-target="#myModal2"><i class="icon-comment"></i>评论（<span id="comment-num">'+single.commentNum+'</span>）</a>';
                if(single.praiseList.indexOf(loginId)==-1){
                     newroll+=
                         '<a href="javascript:;" class="praise-div" id="praise"><i class="icon-praise"></i><span class="praise-status">赞</span>（<span id="praise-num">'+single.praiseNum+'</span>）</a>'+
                         '</div>'+
                         '</div>'+
                         '</li>';
                 }else{
                     newroll+=
                         '<a href="javascript:;" class="praise-div" id="praise"><i class="icon-praise"></i><span class="praise-status">取消赞</span>（<span id="praise-num">'+single.praiseNum+'</span>）</a>'+
                         '</div>'+
                         '</div>'+
                         '</li>';
                 }

                allcontent.append(newroll);
            }
            $("img.lazy").lazyload();
        }
    })
}
