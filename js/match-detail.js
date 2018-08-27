/**
 * Created by cnm on 2016/11/12.
 */
var match_id;
var g_team,office_type,office_group,current_group=0,g_points;
var all_states=["未开始","已结束","上半场","下半场"];
var group_name=["A组","B组","C组","D组","E组","F组","G组","H组","I组","J组"];
var rounds=["零","一","二","三","四","五","六","七","八","九","十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十",
    "二十一","二十二","二十三","二十四","二十五","二十六","二十七","二十八","二十九","三十","三十一","三十二","三十三","三十四","三十五","三十六","三十七","三十八","三十九","四十"];
$(document).ready(function () {
    var Request=new Object();
    Request=GetRequest();
    match_id=Request["match_id"];
    office_type=Request["office_type"];
    office_group=Request["office_group"];
    $(".introduce a").addClass("text-green").removeClass("text-grey");
    $(".introduce").find(".triangle-container").addClass("shift-triangle");
    var current_click=eval(localStorage.getItem("current_click"));
    switch (current_click){
        case 0:
          click_introduce();
          break;
        case 1:
            click_team();
            break;
        case 2:
            click_schedule();
            break;
        case 3:
            click_points();
            break;
        case 4:
            click_billboard();
            break;
        default:
            click_introduce();
    }
});
$(document).on("click",".round-num",function () {
    $(this).closest("li").find(".match-date").toggleClass("hidden");
    $(this).closest("li").find("ul").toggleClass("hidden");
    if($(this).closest("li").find("ul").hasClass("hidden")){
        $(this).attr("src","images/spreed.png");
    }else {
        $(this).attr("src","images/respreed.png");
    }
});
$(document).on("click",".all-matchs li",function () {
    var game_id=$(this).attr("value");
    var flag=$(this).find(".flag").attr("value");
    window.location.href= SERVER_IP + "/efafootball-web/match-each.html?match_id="+match_id+"&game_id="+game_id+"&flag="+flag;
})
$(document).on("click",".shooter",function () {
    $(this).addClass(" background-green text-white");
    $(".redyellow").addClass("text-green").removeClass("background-green text-white");
    AddBillboardContent();
});
$(document).on("click",".redyellow",function () {
    $(this).addClass(" background-green text-white");
    $(".shooter").addClass("text-green").removeClass("background-green text-white");
    AddRedyellowContent();
});
$(document).on("click",".team-ul li",function () {
    var team_id=$(this).attr("id");
    window.location.href= SERVER_IP + "/efafootball-web/team-detail.html?team_id="+team_id;
});
$(document).on("click",".group_ul li",function () {
    current_group=$(this).index();
    $(".group_ul").find(".background-green").removeClass("background-green").addClass("text-grey");
    $(this).addClass("background-green").removeClass("text-grey");
    showPoinits(g_points);
})
$(".introduce a").click(function () {
    localStorage.setItem("current_click",0);
    click_introduce();
});
$(".team a").click(function () {
    localStorage.setItem("current_click",1);
    click_team();
});
$(".schedule a").click(function () {
    localStorage.setItem("current_click",2);
   click_schedule();
});
$(".points a").click(function () {
    localStorage.setItem("current_click",3);
    click_points();
});
$(".billboard a").click(function () {
    localStorage.setItem("current_click",4);
   click_billboard();
});
function click_introduce() {
    $(".title-container").find(".text-green").removeClass("text-green").addClass("text-grey");
    $(".title-container div").find(".triangle-container").removeClass("shift-triangle");
    $(this).addClass("text-green").removeClass("text-grey");
    $(".introduce").find(".triangle-container").addClass("shift-triangle");
    $(".all-profile").removeClass("hidden");
    AddIntroduceContent();
}
function click_team() {
    $(".title-container").find(".text-green").removeClass("text-green").addClass("text-grey");
    $(".title-container div").find(".triangle-container").removeClass("shift-triangle");
    $(this).addClass("text-green").removeClass("text-grey");
    $(".team").find(".triangle-container").addClass("shift-triangle");
    AddTeamContent();
}
function click_schedule() {
    $(".title-container").find(".text-green").removeClass("text-green").addClass("text-grey");
    $(".title-container div").find(".triangle-container").removeClass("shift-triangle");
    $(this).addClass("text-green").removeClass("text-grey");
    $(".schedule").find(".triangle-container").addClass("shift-triangle");
    AddMatchContent();
}
function click_points() {
    $(".title-container").find(".text-green").removeClass("text-green").addClass("text-grey");
    $(".title-container div").find(".triangle-container").removeClass("shift-triangle");
    $(this).addClass("text-green").removeClass("text-grey");
    $(".points").find(".triangle-container").addClass("shift-triangle");
    AddPointsContent();
}
function click_billboard() {
    $(".title-container").find(".text-green").removeClass("text-green").addClass("text-grey");
    $(".title-container div").find(".triangle-container").removeClass("shift-triangle");
    $(this).addClass("text-green").removeClass("text-grey");
    $(".billboard").find(".triangle-container").addClass("shift-triangle");
    AddBillboardContent();
}
function searchTeambyName() {
    //添加商品搜索处理
    var search_content=$(".form-control").val();
    if(search_content==""){
        $(".search-top").removeClass("hidden");
    }else{
        $(".search-top").addClass("hidden");
    }
    Search_Team(search_content);
}
function reset_icon() {
    if($(".form-control").val()==""){
        $(".search-top").removeClass("hidden");
    }
}
function AddIntroduceContent() {
    $(".all-profile").removeClass("hidden");
    $(".all-points").addClass("hidden");
    $(".all-billboard").addClass("hidden");
    $(".all-schedule").addClass("hidden");
    $(".all-team").addClass("hidden");
    var url= SERVER_IP + "/efaleague-web/appPath/appData/officeViewData?id="+match_id;
    $.ajax({
        type:"GET",
        url:url,
        dataType:"json",
        success:function (data) {
            var allcontents=$(".all-profile").empty();
            var obj=data[0];
            var newroll=
            '<div class="all-profile ">'+
                '<div class="profile-img">'+
                '<img src='+obj.details+'  alt="" width="100%" height="100%">'+
                '</div>'+
                '<div class="match-profile-container">'+
                '<div class="match-profile font15pt">赛事简介</div>'+
                '<div style="background-color: white"><div class="match-introduce font14pt">'+obj.caption+'</div></div>'+
            '</div>'+
            '<div class="match-rule-container">'+
                '<div class="match-profile font15pt">规则简介</div>'+
                '<div style="background-color: white"><div class="match-introduce font14pt">'+obj.rule+'</div></div>'+
            '</div>'+
            '<div class="match-referee-container">'+
                '<div class="match-profile font15pt">裁判简介</div>'+
                '<div style="background-color: white"><div class="match-introduce font14pt">'+obj.referee+'</div></div>'+
            '</div>'+
            '<div class="preview hidden">'+
                '<div class="preview-title font15pt">往期回顾</div>'+
                '<ul>'+
                '<li class="each-round">'+
                '<div class="preview-roud font15pt">第一届</div>'+
                '<div class="preview-rank font15pt"> <span style="color: #AEB2B3">冠军</span> 强势表达 / <span style="color: #AEB2B3"> 亚军</span> MIP / <span style="color: #AEB2B3"> 季军</span> 强势表达 </div>'+
                '</li>'+
                '<li class="each-round">'+
                '<div class="preview-roud font15pt">第二届</div>'+
                '<div class="preview-rank font15pt"> <span style="color: #AEB2B3">冠军</span> 强势表达 / <span style="color: #AEB2B3"> 亚军</span> MIP / <span style="color: #AEB2B3"> 季军</span> 强势表达 </div>'+
                '</li>'+
                '</ul>'+
                '</div>'+
            '<div class="famous-people hidden">'+
                '<div class="famous-people-title font15pt">名人堂</div>'+
                '<ul>'+
                '<li class="each-round">'+
                '<div class="preview-roud font15pt">第一届</div>'+
                '<div class="preview-rank font15pt"> <span style="color: #AEB2B3">最佳射手</span> 陈帅 强势表达 / <span style="color: #AEB2B3"> 最佳球员</span> 邓建坤 MIP </div>'+
            '</li>'+
            '<li class="each-round">'+
                '<div class="preview-roud font15pt">第二届</div>'+
                '<div class="preview-rank font15pt"> <span style="color: #AEB2B3">最佳射手</span> 陈帅 强势表达 / <span style="color: #AEB2B3"> 最佳球员</span> 邓建坤 MIP </div>'+
            '</li>'+
            '</ul>'+
            '</div>'+
            '</div>';
            allcontents.append(newroll);
        }
    });
}

function AddTeamContent() {
    $(".all-team").removeClass("hidden");
    $(".all-points").addClass("hidden");
    $(".all-billboard").addClass("hidden");
    $(".all-schedule").addClass("hidden");
    $(".all-profile").addClass("hidden");
    var url= SERVER_IP + "/efaleague-web/appPath/appData/allTeamByOffice?officeId="+match_id;
    $.ajax({
        type:"GET",
        url:url,
        dataType:"json",
        success:function (data) {
            var allcontents=$(".team-ul").empty();
            var obj=eval(data.rows);
            g_team=eval(data.rows);
            for (var i=0;i<obj.length;i++){
                var single=obj[i];
                var photo="images/default_team.png";
                if(single.photo!=""){
                    photo=single.photo+"?imageView2/1/w/100/h/100";
                }
                var newroll=
                    '<li class="single-team background-white" id='+single.id+'>'+
                    '<img class="team-Img" src='+photo+' alt="" width="100%" height="100%">'+
                    '<a class="team-name" href="javascript:;">'+single.name+'</a>'+
                    '<img class="team-detail" src="images/goto_team.png"  alt="" width="100%" height="100%">'+
                    '<a class="team-num" href="javascript:;">'+single.num+'</a>'+
                    '<img class="team-num-img" src="images/player_number.png" alt="" width="100%" height="100%">'+
                    '</li>';
                allcontents.append(newroll);
            }
        }
    });
}

function AddMatchContent() {
    $(".all-schedule").removeClass("hidden");
    $(".all-points").addClass("hidden");
    $(".all-billboard").addClass("hidden");
    $(".all-profile").addClass("hidden");
    $(".all-team").addClass("hidden");
    var url= SERVER_IP + "/efaleague-web/appPath/appData/getScheduleByTurn?officeId="+match_id;
    $.ajax({
        type:"GET",
        url:url,
        dataType:"json",
        success:function (data) {
            var allcontents=$(".all-schedule ul").empty();
            var obj=eval(data);
            for(var key in obj){
                var each_round=obj[key];
                var newroll=
                    '<li value="">'+
                        '<div class="round">'+
                        '<p class="round-num">第'+rounds[key]+'轮</p>'+
                        '<img class="spreed"  src="images/respreed.png" alt="" width="100%" height="100%" >'+
                        '</div>'+
                        '<div class="match-date">'+
                        '<p class="font14pt">'+each_round[0].datetime+'     '+GetWeekday(each_round[0].datetime)+'</p>'+
                        '</div>'+
                        '<div>'+
                        '<ul class="all-matchs">';
                var pre_datetime=each_round[0].datetime;//由于某一轮次的比赛可能会遇到延期举行的 所以同一轮次的时间就会显示不同
                for(var j=0;j<each_round.length;j++){
                    if(pre_datetime!=each_round[j].datetime){  //当同一轮的比赛日期跟前面的不一样的时候 ，添加一栏新的日期和星期
                        newroll+=
                            '</ul>'+
                            '</div>'+
                            '<div class="match-date">'+
                            '<p class="font14pt">'+each_round[j].datetime+'     '+GetWeekday(each_round[j].datetime)+'</p>'+
                            '</div>'+
                            '<div>'+
                            '<ul class="all-matchs">';
                    }
                    var single=each_round[j];
                    var homephoto="images/default_team.png";
                    if(single.homeTeamPhoto!="") homephoto=single.homeTeamPhoto+"?imageView2/1/w/60/h/60";
                    var awayphoto="images/default_team.png";
                    if(single.awayTeamPhoto!="") awayphoto=single.awayTeamPhoto+"?imageView2/1/w/60/h/60";
                    var state,score;
                    state=all_states[single.flag];
                    if(single.flag!=0)
                    {
                        score=single.homescore+':'+single.awayscore;
                    }
                    else if(single.flag==0) {
                        //score=single.time.substr(0,5); //未开始的显示开始时间
                        score=single.time.split("-")[0]; //未开始的显示开始时间
                    }
                    var child=
                        '<li value='+single.id+' >'+
                        '<div class="team-results">'+
                        '<div class="team-a">'+
                        '<a class="team-atxt text-black" href="javascript:;">'+single.homeTeamName+'</a>'+
                        '<img class="team-aimg" src='+homephoto+'  alt="" width="100%" height="100%" >'+
                        '</div>'+
                        '<div class="result">'+
                        '<div class="result-a background-grey93">'+score+'</div>'+
                        '<div class="result-b flag" value='+single.flag+'>'+state+'</div>'+
                        '</div>'+
                        '<div class="team-b">'+
                        '<img class="team-bimg" src='+awayphoto+' alt="" width="100%" height="100%">'+
                        '<a class="team-btxt text-black" href="javascript:;">'+single.awayTeamName+'</a>'+
                        '</div>'+
                        '</div>'+
                        '</li>';
                    newroll+=child;
                    pre_datetime=each_round[j].datetime;
                    }
                    newroll+=
                    '</ul>'+
                    '</div>'+
                '</li>';
            allcontents.append(newroll);
            }
        }
    });
}

function AddPointsContent(){
    $(".all-points").removeClass("hidden");
    $(".all-billboard").addClass("hidden");
    $(".all-schedule").addClass("hidden");
    $(".all-profile").addClass("hidden");
    $(".all-team").addClass("hidden");
    var allcontents=$("table").empty();
    if(office_type==1){
        $(".group-container").removeClass("hidden");
        var group_title=$(".group_ul").empty();
        var new_group="";
        for(var i=0;i<office_group;i++){
            if(i==0){
                new_group+=
                    '<li class="background-green">'+
                    '<a class="text-black "  href="javascript:;">'+group_name[i]+'</a>'+
                    '</li>';
            }else{
                new_group+=
                    '<li class="text-grey">'+
                    '<a class="text-black "  href="javascript:;">'+group_name[i]+'</a>'+
                    '</li>';
            }
        }
        group_title.append(new_group);
    }
    var tablehead=
        '<tr class="table-head">'+
        '<th style="width: 10%;text-align: center">排名</th>'+
        '<th style="width: 20%;text-align: center">球队</th>'+
        '<th style="width: 11%;text-align: center">场次</th>'+
        '<th style="width: 6%;text-align: center">胜</th>'+
        '<th style="width: 6%;text-align: center">平</th>'+
        '<th style="width: 6%;text-align: center">负</th>'+
        '<th style="width: 6%;text-align: center">进</th>'+
        '<th style="width: 6%;text-align: center">失</th>'+
        '<th style="width: 6%;text-align: center">净</th>'+
        '<th style="width: 11%;text-align: center">积分</th>'+
        '<th style="width: 6%;text-align: center">红</th>'+
        '<th style="width: 6%;text-align: center">黄</th>'+
        '</tr>';
    allcontents.append(tablehead);
    var url= SERVER_IP + "/efaleague-web/appPath/appData/leagueIntegral?officeId="+match_id;
    $.ajax({
        type:"GET",
        url:url,
        dataType:"json",
        success:function (data) {
            console.log(data);
            var obj=eval(data.rows);
            g_points=obj;
            showPoinits(obj); //显示积分榜
        }
    });
}

function AddBillboardContent() {
    $(".all-billboard").removeClass("hidden");
    $(".all-points").addClass("hidden");
    $(".all-schedule").addClass("hidden");
    $(".all-profile").addClass("hidden");
    $(".all-team").addClass("hidden");
    var allcontents=$("table").empty();
    var tablehead=
        '<tr class="table-head">'+
            '<th class="rank ">排名</th>'+
            '<th class="player-name ">球员</th>'+
            '<th class="player-team ">球队</th>'+
            '<th class="main-goal ">总进球</th>'+
            '<th class="main-penalty ">点球</th>'+
        '</tr>';
    allcontents.append(tablehead);
    var url= SERVER_IP + "/efaleague-web/appPath/appData/getAllGoal?officeId="+match_id;
    $.ajax({
        type:"GET",
        url:url,
        dataType:"json",
        success:function (data) {
            console.log(data);
            var obj=eval(data.rows);
            for(var i=0;i<obj.length;i++){
                var rank=i+1;
                var single=obj[i];
                var photo="images/default_head.png";
                if(single.photo!="") photo=single.photo;
                if(i==0){
                    var newroll=
                        '<tr class="first-tr font14pt">'+
                            '<td>'+rank+'</td>'+
                            '<td colspan="2">'+
                            '<img style="float: left;margin-left: 10px;" class="first-shooter" src='+photo+' alt="" width="100%" height="100%">'+
                            '<div style="float: left;text-align: left;height: 56px;">'+
                            '<div style="height: 36px;line-height: 36px;margin-left: 5px">'+single.name+'</div>'+
                            '<div class="text-grey" style="height: 20px;line-height: 20px;text-align: end;margin-left: 5px;">'+single.teamName+'</div>'+
                            '</div>'+
                            '</td>'+
                            '<td>'+single.num+'</td>'+
                            '<td>'+0+'</td>'+
                        '</tr>';
                }
                else{
                    var newroll=
                        '<tr class="single-tr font14pt">'+
                            '<td>'+rank+'</td><td>'+single.name+'</td><td class="text-grey">'+single.teamName+'</td><td>'+single.num+'</td><td>'+0+'</td>'+
                        '</tr>';
                }
                allcontents.append(newroll);
            }
        }
    });

}

function AddRedyellowContent() {
    var allcontents=$("table").empty();
    var tablehead=
        '<tr class="table-head">'+
        '<th class="rank ">排名</th>'+
        '<th class="player-name ">球员</th>'+
        '<th class="player-team ">球队</th>'+
        '<th class="main-goal ">红牌</th>'+
        '<th class="main-penalty ">黄牌</th>'+
        '</tr>';
    allcontents.append(tablehead);
    var url= SERVER_IP + "/efaleague-web/appPath/appData/getAllCard?officeId="+match_id;
    $.ajax({
        type:"GET",
        url:url,
        dataType:"json",
        success:function (data) {
            console.log(data);
            var obj=eval(data.rows);
            for(var i=0;i<obj.length;i++){
                var rank=i+1;
                var single=obj[i];
                var newroll=
                    '<tr class="single-tr">'+
                    '<td>'+rank+'</td><td>'+single.memberName+'</td><td style="color: #BBBEBD overflow:hidden">'+single.teamName+'</td><td>'+single.red+'</td><td>'+single.yellow+'</td>'+
                    '</tr>';
                allcontents.append(newroll);
            }
        }
    });
}
function Search_Team(search_content) {
   var allcontents=$(".team-ul").empty();
    for (var i=0;i<g_team.length;i++){
        var single=g_team[i];
        if(single.name.indexOf(search_content)!=-1){
            var single=g_team[i];
            var photo="images/default_team.png";
            if(single.photo!=""){
                photo=single.photo;
            }
            var newroll=
                '<li class="single-team background-white" id='+single.id+'>'+
                '<img class="team-Img" src='+photo+' alt="" width="100%" height="100%">'+
                '<a class="team-name" href="javascript:;">'+single.name+'</a>'+
                '<img class="team-detail" src="images/goto_team.png"  alt="" width="100%" height="100%">'+
                '<a class="team-num" href="javascript:;">'+single.num+'</a>'+
                '<img class="team-num-img" src="images/player_number.png" alt="" width="100%" height="100%">'+
                '</li>';
            allcontents.append(newroll);
        }
    }
}
function SpreedMatch() {
    $()
}
function hidden_icon() {
    $(".search-top").addClass("hidden");
}
function showPoinits(obj) {
    var allcontents=$("table");
    for(var i=0;i<obj.length;i++){
        var single=obj[i];
        var total=eval(single.won)+eval(single.even)+eval(single.beaten);
        var realball=eval(single.goal)-eval(single.lost);
        var rank=i+1;
        var newroll="";
        if(office_type==1 && single.team.groupId!==current_group) continue; //当前赛事为杯赛的时候 如果该队伍的分组不是选定的分组 则不展示出来
        if(i==5){
            newroll=
                // '<tr class="single-tr Sperate-line">'+
                '<tr class="single-tr " style="color:#D0D5D6 ">'+
                // '<td ><div class="up-grade"></div>'+
                '<td >'+
                '<a style="text-align:center; color: black;padding: 6px 0;" href="">'+rank+'</a>'+
                '</td ><td  style="font-weight: 700;overflow:hidden ;color: black">'+single.team.name+'</td><td>'+total+'</td><td>'+single.won+'</td>'+
                '<td>'+single.even+'</td><td>'+single.beaten+'</td><td>'+single.goal+'</td><td>'+single.lost+'</td><td>'+realball+'</td><td style="font-weight: 800;color: black">'+single.point+'</td><td>'+single.red+'</td><td>'+single.yellow+'</td>'+
                '</tr>';
        }
        else{
            newroll=
                '<tr class="single-tr "style="color:#D0D5D6 ">'+
                // '<td ><div class="up-grade"></div>'+
                '<td >'+
                '<a style="text-align:center; color: black;padding: 6px 0;" href="">'+rank+'</a>'+
                '</td ><td  style="font-weight: 700;overflow: hidden;color: black">'+single.team.name+'</td><td>'+total+'</td><td>'+single.won+'</td>'+
                '<td>'+single.even+'</td><td>'+single.beaten+'</td><td>'+single.goal+'</td><td>'+single.lost+'</td><td>'+realball+'</td><td style="font-weight: 800 ;color: black">'+single.point+'</td><td>'+single.red+'</td><td>'+single.yellow+'</td>'+
                '</tr>';
        }
        allcontents.append(newroll);
    }
}