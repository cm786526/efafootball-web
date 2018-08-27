/**
 * Created by 晴识明月 on 2017/4/27.
 */
var player_id,team_id;
$(document).ready(function () {
    //向后台请求数据刷新缓存信息
    var Request=new Object();
    Request=GetRequest();
    player_id=Request["player_id"];
    team_id=Request["team_id"];
    SetContent(player_id);
})
$(document).on("click",".editNumber",function () {
    CheckLeader();
});
$(".close-edit").click(function(){
    $("#password1").val("");
    $("#myModal").modal("hide");
});
$(".editpassword-btn").click(function () {
    var number=$("#password1").val();
    if(number==""){
        TIP_ERROR("号码不能为空!");
        return;
    }
    if (isNaN(number)||number.indexOf('.')!=-1) {
        TIP_ERROR("号码必须为整型数字!");
        return;
    }
    if(confirm("是否确认修改号码？")){
        var loginId=localStorage.getItem("loginId");
        var url= SERVER_IP + "/efaleague-web/appPath/appData/updateMemberNumber?member_id="+player_id+"&number="+number;
        $.ajax({
            url:url,
            success:function (data) {
                TIP_ERROR(data.message);
                if(data.result=="success"){
                    $("#password1").val("");
                    $("#myModal").modal("hide");
                    $(".number").html(number);
                }
            }
        })
    }
})
//向后台请求数据刷新缓存信息
function SetContent(id) {
    var url= SERVER_IP + "/efaleague-web/appPath/appData/viewMemberById?id="+id;
    //拉数据
    $.ajax(
        {
            url: url,
            success: function (data) {
                // 解析json
                var obj = eval(data["player_profile"][0]);
                var other_info=eval(data["other_info"]);
                console.log(data);
                var addcontent=$(".player_profile").empty();
                var photo="images/default_head.png";
                var team_name="暂无球队";
                if(obj.team.id!="") team_name=obj.team.name;
                if(obj.photo!="") photo=obj.photo;
                var newroll =
                    '<div class="player-img"> <img src='+photo+' alt="" class="player-head" width="100%" height="100%"> </div>'+
                    '<div class="team-guide">'+
                    '<div class="team-guide-title font15pt">所属球队</div>'+
                    '<ul>'+
                    '<li class="team-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name own-team-img"><img src="images/default_team.png"  alt="" width="100%" height="100%"></div></td>'+
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
                    '<td width="30%"><div class="attr-name">年龄</div></td>'+
                    '<td width="70%"><div class="attr-txt ">'+obj.age+'</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '<li class="each-item editNumber">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">球衣号码</div></td>'+
                    '<td width="70%"><div class="attr-txt "><span class="number">'+obj.number+'</span><img src="images/goto_player.png" alt="" class="goto-img" width="100%" height="100%"></div></td>'+
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
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">进球数</div></td>'+
                    '<td width="70%"><div class="attr-txt ">'+other_info[0]+'</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '<li class="each-item">'+
                    '<table width="100%">'+
                    '<tr class="font15pt">'+
                    '<td width="30%"><div class="attr-name">比赛场数</div></td>'+
                    '<td width="70%"><div class="attr-txt ">'+other_info[1]+'</div></td>'+
                    '</tr>'+
                    '</table>'+
                    '</li>'+
                    '</li>'+
                    '</ul>'+
                    '</div>';
                addcontent.append(newroll);
            }
        }
    );
}
function CheckLeader() {
    //根据localStorage缓存看是否登录
    var have_logined=localStorage.getItem("have_logined");
    if(have_logined==1){
        login_id=localStorage.getItem("loginId");
        var url= SERVER_IP + "/efaleague-web/appPath/appData/checkLeader?teamId="+team_id+"&loginId="+login_id;
        $.ajax({
            url:url,
            success:function (data) {
                var result=data.result;
                TIP_ERROR(data.message);
                if(result=="success"){
                    var X=100;
                    $("#myModal").modal("show");
                    $("#myModal").css("top",X);
                    return true;
                }
            }
        });
    }else{
        TIP_ERROR("未登陆,无法操作");
        return false;
    }
}