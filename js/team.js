/**
 * Created by cnm on 2016/11/12.
 */
var g_team;
$(document).ready(function (){
    SetContent();
});
$(".search-div").click(function () {
        $(".search-top").addClass("hidden");
});
$("#choose-team").click(function () {
    $(this).addClass("background-green text-white").removeClass("text-green light-white");
    $("#create-team").removeClass("background-green text-white").addClass("text-green light-white");
});
$("#create-team").click(function () {
    $(this).addClass("background-green text-white").removeClass("text-green light-white");
    $("#choose-team").removeClass("background-green text-white").addClass("text-green light-white");
    //根据localStorage缓存看是否登录
    var have_logined=localStorage.getItem("have_logined");
    if(have_logined==1) {
        var mine_info = JSON.parse(localStorage.getItem("mine_info"));
        if(mine_info.team.id!=""){
            // TIP_ERROR("你已经加入了球队，不能新建球队！")
            window.location.href= SERVER_IP + "/efafootball-web/team-edit.html?team_id="+mine_info.team.id;
            return;
        }
        else window.location.href= SERVER_IP + "/efafootball-web/team-new.html?";
    }else TIP_ERROR("未登陆，请先登陆");
});
$(document).on("click",".team-ul li",function () {
    var team_id=$(this).attr("id");
    window.location.href= SERVER_IP + "/efafootball-web/team-detail.html?team_id="+team_id;
})
function searchTeambyName() {
    //添加商品搜索处理
    var search_content=$(".form-control").val();
    if(search_content==""){
        $(".search-top").removeClass("hidden");
    }else{
        $(".search-top").addClass("hidden");
    }
    var addcontent=$(".team-ul").empty();
    for (var i = 0; i < g_team.length; i++) {
            var single = g_team[i];
            if (single.name.indexOf(search_content) != -1) {
            var photo="images/default_team.png";
            if(single.photo!="") photo=single.photo;
            var newroll =
                '<li class="single-team background-white" id=' + single.id + '>' +
                '<img class="team-Img" src='+photo+' alt="" width="100%" height="100%">' +
                '<a class="team-name" href="javascript:;">' + single.name + '</a>' +
                '<img class="team-detail" src="images/goto_team.png" alt="" width="100%" height="100%">' +
                '<a class="team-num" href="javascript:;">' + single.num + '</a>' +
                '<img class="team-num-img" src="images/player_number.png" alt="" width="100%" height="100%">' +
                '</li>';
            addcontent.append(newroll);
        }
    }
}
function reset_icon() {
    if($(".form-control").val()==""){
        $(".search-top").removeClass("hidden");
    }
}
function SetContent() {
    //拉数据
    var url= SERVER_IP + "/efaleague-web/appPath/appData/allTeam?companyId=1";
    $.ajax(
        {
            url: url,
            success: function (data) {
                // 解析json
                var obj = eval(data.rows);
                console.log(obj);
                g_team=eval(data.rows);
                var addcontent=$(".team-ul").empty();
                for (var i = 0; i < obj.length; i++) {
                    var single=obj[i];
                    var photo="images/default_team.png";
                    if(single.photo!="") photo=single.photo;
                    var newroll =
                        '<li class="single-team background-white" id='+single.id+'>'+
                            '<img class="team-Img" src= '+photo+' alt="" width="100%" height="100%">'+
                            '<a class="team-name" href="javascript:;">'+single.name+'</a>'+
                            '<img class="team-detail" src="images/goto_team.png" alt="" width="100%" height="100%">'+
                            '<a class="team-num" href="javascript:;">'+single.num+'</a>'+
                            '<img class="team-num-img" src="images/player_number.png" alt="" width="100%" height="100%">'+
                        '</li>';
                    addcontent.append(newroll);
                }
            }
        }
    );
}
