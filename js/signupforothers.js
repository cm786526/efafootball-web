/**
 * Created by 晴识明月 on 2017/5/25.
 */
var team_id,match_id,g_signup;
$(document).ready(function () {
    var Request=new Object();
    Request=GetRequest();
    team_id=Request["team_id"];
    match_id=Request["match_id"];
    // SetMember();
    SetMemberNew();
});
$(".chooseStartFirst").click(function () {
    var obj = document.getElementsByName("member");
    var memberIds ="";
    for(k in obj){
        if(obj[k].checked)
            memberIds+=(obj[k].value)+";";
    }
    if(memberIds==""){
        TIP_ERROR("选择的报名球员不能为空");
        return;
    }
    var url= SERVER_IP + "/efaleague-web/appPath/appData/signUpMatchForOther?matchId="+match_id+"&&teamId="+team_id+"&&memberIds="+memberIds;
    $.ajax({
        url:url,
        success:function (data) {
            TIP_ERROR(data.message);
            if(data.result=="success"){
            }
        }
    });
})
function SetMemberNew() { //暂时该球队的所有球员
    var url= SERVER_IP + "/efaleague-web/appPath/appData/memberListNotLeave?teamId="+team_id+"&matchId="+match_id;
    $.ajax({
        url:url,
        success:function (data) {
            if(data!=null){
                var datas=JSON.parse(data);
                var obj=new Array();
                for (var key in datas){
                    var single=datas[key];
                    for(var i=0;i<single.length;i++){
                        obj.push(single[i]);
                    }
                }
                var signup_members=$(".member-ul").empty();
                for(var i=0;i<obj.length;i++) {
                    var player = obj[i];
                    g_signup=player;
                    if(player.flag==0) continue;
                    var photo="images/default_head.png";
                    if(player.photo!="") photo=player.photo
                    var newroll=
                        '<li class="each-member" id=' + player.id + '>' +
                        '<a class="number text-black" href="javascript:;">' + player.number + '</a>' +
                        '<div class="member-info">' +
                        '<img class="person-img" src=' + photo + '  alt="" width="1005" height="100%">' +
                        '<a class="name font10pt text-black" href="javascript:;">' + player.name + '</a>' +
                        '<input  type="checkbox" name="member" value=' + player.id + ' style="width: 15px;height: 15px;float: right;margin-right: 33px;margin-top: 10px;" />' +
                        '</div>' +
                        '</li>';
                    signup_members.append(newroll);
                }
            }
            SetCheckbox();
        }
    });
}
function SetCheckbox() { //根据数据库查询当前比赛已经报名的球员 来填充选择的复选框
    var url= SERVER_IP + "/efaleague-web/appPath/appData/viewSignUp?matchId="+match_id+"&&teamId="+team_id;
    $.ajax({
        url:url,
        success:function (data) {
            if(data.result=="success"){
                var obj=(data.rows);
                var newroll="";
                if(data.rows==null) return;
                var startingIds="";
                for(var i=0;i<obj.length;i++) {
                    startingIds+=obj[i].memberId+";";
                }
                console.log(startingIds);
                $(".member-ul li").each(function () {
                    if(startingIds.indexOf($(this).attr("id"))!=-1){
                        $(this).find("input").attr("checked",true);
                    }
                })
            }
        }
    })
}