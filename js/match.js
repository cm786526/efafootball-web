/**
 * Created by cnm on 2016/11/7.
 */
var g_matchs;
$(document).ready(function (){
    $('#search').bind('input propertychange', function() {searchTeambyName();});
    ShowAllMatchs();
});
$(document).on("click",".single-match",function () {
    var match_id=$(this).attr("value");
    var click_id=$(this).index();
    var choose_match=g_matchs[click_id];
    var office_type=choose_match.officeType; //联赛类型
    var office_group=choose_match.officeGroup;
    window.location.href= SERVER_IP + "/efafootball-web/match-detail.html?match_id="+match_id+'&office_type='+office_type+'&office_group='+office_group;
});
$(".search-div").click(function () {
    // $(".search-top").addClass("hidden");
    //searchTeambyName();
});
$(".introduce a").click(function () {
    $(".title-container").find(".text-green").removeClass("text-green").addClass("text-black");
    $(".title-container div").find(".triangle-container").removeClass("shift-triangle");
    $(this).addClass("text-green").removeClass("text-black");
    $(".introduce").find(".triangle-container").addClass("shift-triangle");
    //AddIntroduceContent();
});

function searchTeambyName() {
    //添加商品搜索处理
    var search_content=$(".form-control").val();
    if(search_content==""){
        $(".search-top").removeClass("hidden");
    }else{
        $(".search-top").addClass("hidden");
    }
    //添加列表
    var match_list=$(".match-ul");
    match_list.empty();
    for (var i = 0; i < g_matchs.length; i++) {
        var singlematch = g_matchs[i];
        var name = singlematch.name;
        if(name.indexOf(search_content)!=-1){
            var match_id=singlematch.id;
            var imgsrc=singlematch.photo;
            var newroll =
                '<li class="single-match background-white" value='+match_id+'>'+
                '<div>'+
                '<div class="match-img">'+
                '<img src='+imgsrc+' alt="" width="100%" height="100%">'+
                '</div>'+
                '<div class="match-detail">'+
                '<div class="match-title">'+
                '<div class="match-txt ">'+name+'</div>'+
                '</div>'+
                '<div class="match-info">'+
                '<div class="city">'+
                '<img class="city-img" src="images/match_city.png" alt="">'+
                '<a class="city-txt font2pt" href="javascript:;">'+'武汉光谷'+'</a>'+
                '</div>'+
                '<div class="round">'+
                '<img class="round-img" src="images/round.png" alt="">'+
                '<a  class="round-txt font2pt" href="javascript:;">'+'第二轮'+'</a>'+
                '</div>'+
                '<div class="team-num">'+
                '<img class="team-numimg" src="images/match_team.png" alt="">'+
                '<a class="team-numtxt font2pt" href="javascript:;">'+'30'+'</a>'+
                '</div>'+
                '</div>'+
                '</div>'+
                '<div class="match-detail-img">'+
                '<img src="images/goto_team.png" alt="" width="100%" height="100%">'+
                '</div>'+
                '</div>'+
                '</li>';
            match_list.append(newroll);
        }
    }
}
function reset_icon() {
    if($(".form-control").val()==""){
        $(".search-top").removeClass("hidden");
    }
}
function ShowAllMatchs() {
    var url= SERVER_IP + "/efaleague-web/appPath/appData/officeData";
    $.ajax({
        url:url,
        success:function (data) {
            var matchs=eval(data);
            g_matchs=matchs;
            var match_list=$(".match-ul");
            match_list.empty();
            for (var i = 0; i < matchs.length; i++) {
                var singlematch = matchs[i];
                var name = singlematch.name;
                var match_id=singlematch.id;
                var imgsrc=singlematch.photo;
                var newroll =
                    '<li class="single-match background-white" value='+match_id+'>'+
                    '<div>'+
                    '<div class="match-img">'+
                    '<img src='+imgsrc+' alt="" width="100%" height="100%">'+
                    '</div>'+
                    '<div class="match-detail">'+
                    '<div class="match-title">'+
                    '<div class="match-txt ">'+name+'</div>'+
                    '</div>'+
                    '<div class="match-info">'+
                    '<div class="city">'+
                    '<img class="city-img" src="images/match_city.png" alt="">'+
                    '<a class="city-txt font2pt" href="javascript:;">'+singlematch.areaName+'</a>'+
                    '</div>'+
                    '<div class="round">'+
                    '<img class="round-img" src="images/round.png" alt="">'+
                    '<a  class="round-txt font2pt" href="javascript:;">'+singlematch.turn+'</a>'+
                    '</div>'+
                    '<div class="team-num">'+
                    '<img class="team-numimg" src="images/match_team.png" alt="">'+
                    '<a class="team-numtxt font2pt" href="javascript:;">'+singlematch.teamNum+'</a>'+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    '<div class="match-detail-img">'+
                    '<img src="images/goto_team.png" alt="" width="100%" height="100%">'+
                    '</div>'+
                    '</div>'+
                    '</li>';
                match_list.append(newroll);
            }
        }
    });
}