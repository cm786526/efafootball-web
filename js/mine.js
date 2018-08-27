/**
 * Created by 晴识明月 on 2016/12/20.
 */
$(document).ready(function (){
    //为了兼容苹果设备由新建帖子返回该页面之后不能刷新特 因此专门在这个地方强制刷新一次
    var reaload_mine=localStorage.getItem("reload_mine");
    if(reaload_mine=="true"){
        location.reload();
        localStorage.setItem("reload_mine","false"); //清空false
    }
    $('#search').bind('input propertychange', function() {searchTeambyName();});
    //根据localStorage缓存看是否登录
    var have_logined=localStorage.getItem("have_logined");
    if(have_logined==1){
        var mine_info=localStorage.getItem("mine_info");
        var loginId=localStorage.getItem("loginId");
        console.log(mine_info);
        SetContent(loginId);
    }else{
        window.location.href= SERVER_IP + "/efafootball-web/mine-login.html";
    }
});
$(".login").click(function () {
    $(this).addClass("background-green ").removeClass("light-white");
    $(".login").addClass("text-white").removeClass("text-green");
    $(".sign-apply").addClass("light-white").removeClass("background-green");
    $(".login-Txt").addClass("text-green").removeClass("text-white");
    $(".edit_profile").removeClass("hidden");
    $(".sign_up").addClass("hidden");
});
$(".sign-apply").click(function () {
    $(this).addClass("background-green ").removeClass("light-white");
    $("sign-Txt").addClass("text-white").removeClass("text-green");
    $(".login").addClass("light-white").removeClass("background-green");
    $(".login-Txt").addClass("text-green").removeClass("text-white");
    $(".edit_profile").addClass("hidden");
    $(".sign_up").removeClass("hidden");
});
$(document).on("click",".logout",function () {
    localStorage.clear();
    window.location.href= SERVER_IP + "/efafootball-web/mine-login.html";
});
$(document).on("click",".edit_info",function () {
    window.location.href= SERVER_IP + "/efafootball-web/mine-edit.html";
});
$(document).on("click",".edit_password",function () {
    var X=100;
    $("#myModal").modal("show");
    $("#myModal").css("top",X);
});
$(document).on("click",".goto-team",function () {
    if($(this).attr("id")==""){
        window.location.href= SERVER_IP + "/efafootball-web/team.html?";
    }else{
        var team_id=$(this).attr("id");
        window.location.href= SERVER_IP + "/efafootball-web/team-detail.html?team_id="+team_id;
    }
})
$(".close-edit").click(function(){
    $("#password1").val("");
    $("#password2").val("");
    $("#myModal").modal("hide");
});
$(".editpassword-btn").click(function () {
    var password1=$("#password1").val();
    var password2=$("#password2").val();
    if(password1==""){
        TIP_ERROR("密码不能为空!");
        return;
    }
    if(password1!=password2){
        TIP_ERROR("两次输入的密码不一样!");
        return;
    }
    if(confirm("是否确认修改密码？")){
        var loginId=localStorage.getItem("loginId");
        var url= SERVER_IP + "/efaleague-web/appPath/appData/editPassword?password="+password1+"&loginId="+loginId;
        $.ajax({
            url:url,
            success:function (data) {
                TIP_ERROR(data.message);
                if(data.result=="success"){
                    $("#password1").val("");
                    $("#password2").val("");
                    $("#myModal").modal("hide");
                }
            }
        })
    }
})
//向后台请求数据刷新缓存信息
function SetContent(loginId) {
    // var loginId=mine_info["id"];
    //拉数据
    var url= SERVER_IP + "/efaleague-web/appPath/appData/viewMember?loginId="+loginId;
    $.ajax(
        {
            url: url,
            success: function (data) {
                // 解析json
                var obj = eval(data.rows[0]);
                localStorage.setItem("mine_info",JSON.stringify(data.rows[0]));
                var addcontent=$(".edit_profile").empty();
                var photo="images/default_head.png";
                var team_name="暂无球队";
                var team_id="";
                if(obj.team!=null){
                    team_id=obj.team.id;
                    team_name=obj.team.name;
                }
                if(obj.photo!="") photo=obj.photo;
                var team_photo="images/default_head.png";
                if(obj.team.photo!="") team_photo=obj.team.photo;
                var newroll =
                '<div class="player-img"> <img src='+photo+' alt="" class="player-head" width="100%" height="100%"> </div>'+
                    '<div class="team-guide">'+
                    '<div class="team-guide-title font15pt">所属球队</div>'+
                    '<ul>'+
                    '<li class="team-item goto-team" id='+team_id+'>'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name own-team-img"><img src='+team_photo+'  alt="" width="100%" height="100%"></div></td>'+
                    '<td width="70%"><div class="attr-txt ">'+team_name+'</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '</ul>'+
                    '</div>'+
                    '<div class="person-guide">'+
                    '<div class="person-title font15pt">个人</div>'+
                    '<ul>'+
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">姓名</div></td>'+
                    '<td width="70%"><div class="attr-txt ">'+obj.name+'</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">身份证</div></td>'+
                    '<td width="70%"><div class="attr-txt ">'+obj.cards+'</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">保单号</div></td>'+
                    '<td width="70%"><div class="attr-txt ">'+obj.policyno+'</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">年龄</div></td>'+
                    '<td width="70%"><div class="attr-txt ">'+obj.age+'</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">球衣号码</div></td>'+
                    '<td width="70%"><div class="attr-txt ">'+obj.number+'</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">性别</div></td>'+
                    '<td width="70%"><div class="attr-txt ">'+obj.sex+'</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '</li>'+
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">身高</div></td>'+
                    '<td width="70%"><div class="attr-txt ">'+obj.height+'</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '</li>'+
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">体重</div></td>'+
                    '<td width="70%"><div class="attr-txt ">'+obj.weight+'</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '<li class="each-item ">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">场上位置 </div></td>'+
                    '<td width="70%"><div class="attr-txt ">'+obj.position+'</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">地区</div></td>'+
                    '<td width="70%"><div class="attr-txt ">'+obj.city+'</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '</li>'+
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">手机号</div></td>'+
                    '<td width="70%"><div class="attr-txt ">'+obj.telephone+'</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                '<li class="each-item edit_info">'+
                '<table width="100%">'+
                '<tr class="font15pt">'+
                '<td width="100%"><div class="" style="text-align: center;cursor:pointer">修改信息</div></td>'+
                '</tr>'+
                '</table>'+
                '</li>'+
                '<li class="each-item edit_password">'+
                '<table width="100%">'+
                '<tr class="font15pt">'+
                '<td width="100%"><div class="" style="text-align: center;cursor:pointer">修改密码</div></td>'+
                '</tr>'+
                '</table>'+
                '</li>'+
                '</ul>'+
                '</div>'+
                    '<div class="person-guide">'+
                    '<div class="person-title font15pt">关于我们</div>'+
                    '<ul>'+
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">意见反馈</div></td>'+
                    '<td width="70%"><div class="attr-txt "><img src="images/goto_player.png" alt="" class="goto-img" width="100%" height="100%"></div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">联系我们</div></td>'+
                    '<td width="70%"><div class="attr-txt "><img src="images/goto_player.png" alt="" class="goto-img" width="100%" height="100%"></div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">版本信息</div></td>'+
                    '<td width="70%"><div class="attr-txt ">V1.1</div></td>'+
                '</tr>'+
                '</table>'+
                '</li>'+
                '<li class="each-item ">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">清除缓存 </div></td>'+
                    '<td width="70%"><div class="attr-txt ">5MB</div></td>'+
                '</tr>'+
                '</table>'+
                '</li>'+
                '<li class="each-item logout">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="100%"><div class="" style="text-align: center;cursor:pointer">退出登录</div></td>'+
                    '</tr>'+
                    '</table>'+
                '</li>'+
                '</ul>'+
                '</div>';
                addcontent.append(newroll);
            }
        }
    );
}
//根据缓存刷新页面
function newSetContent(mine_info) {
    //拉数据
    var url= SERVER_IP + "/efaleague-web/appPath/appData/viewMember?loginId=02ec4fdfcdbc448abb6a5067141b3950";
    $.ajax(
        {
            url: url,
            success: function (data) {
                // 解析json
                var obj = eval(data);
                console.log(obj);
                var addcontent=$(".edit_profile").empty();
                var photo="images/default_head.png";
                // if(obj.photo!="") photo=obj.photo;
                var newroll =
                    '<div class="player-img"> <img src='+photo+' alt="" class="player-head" width="100%" height="100%"> </div>'+
                    '<div class="team-guide">'+
                    '<div class="team-guide-title font15pt">所属球队</div>'+
                    '<ul>'+
                    '<li class="team-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name own-team-img"><img src="images/default_team.png"  alt="" width="100%" height="100%"></div></td>'+
                    '<td width="70%"><div class="attr-txt ">红郡足球俱乐部</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '</ul>'+
                    '</div>'+
                    '<div class="person-guide">'+
                    '<div class="person-title font15pt">个人</div>'+
                    '<ul>'+
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">姓名</div></td>'+
                    '<td width="70%"><div class="attr-txt ">'+name+'</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">年龄</div></td>'+
                    '<td width="70%"><div class="attr-txt ">32</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">性别</div></td>'+
                    '<td width="70%"><div class="attr-txt ">男</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '<li class="each-item ">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">场上位置 </div></td>'+
                    '<td width="70%"><div class="attr-txt ">MC</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">地区</div></td>'+
                    '<td width="70%"><div class="attr-txt ">湖北 武汉</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">修改密码</div></td>'+
                    '<td width="70%"><div class="attr-txt "><img src="images/goto_player.png" alt="" class="goto-img" width="100%" height="100%"></div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '</ul>'+
                    '</div>'+
                    '<div class="person-guide">'+
                    '<div class="person-title font15pt">关于我们</div>'+
                    '<ul>'+
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">意见反馈</div></td>'+
                    '<td width="70%"><div class="attr-txt "><img src="images/goto_player.png" alt="" class="goto-img" width="100%" height="100%"></div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">联系我们</div></td>'+
                    '<td width="70%"><div class="attr-txt "><img src="images/goto_player.png" alt="" class="goto-img" width="100%" height="100%"></div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">版本信息</div></td>'+
                    '<td width="70%"><div class="attr-txt ">V1.1</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '<li class="each-item ">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">清除缓存 </div></td>'+
                    '<td width="70%"><div class="attr-txt ">500MB</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '</ul>'+
                    '</div>';
                addcontent.append(newroll);
            }
        }
    );
}