/**
 * Created by 晴识明月 on 2016/12/27.
 */
$(document).ready(function (){

});
$(".forget-password").click(function () {
    $(".getBackPassword-container").removeClass("hidden");
});
$(".close-reset").click(function () {
    $("#userName").val("");
    $("#telephone").val("");
    $(".getBackPassword-container").addClass("hidden");
})
$(".reset-btn").click(function () {
    if(confirm("密码重置后将会发送到手机号上，是否确定重置？")){
        var loginName=$("#userName").val();
        var phone=$("#telephone").val();
        var url= SERVER_IP + "/efaleague-web/appPath/appData/getBackPassword?loginName="+loginName+"&phone="+phone;
        $.ajax({
            url:url,
            success:function (data) {
                TIP_ERROR(data.message);
                if(data.result=="success"){
                    $("#userName").val("");
                    $("#telephone").val("");
                    $(".getBackPassword-container").addClass("hidden");
                }
            }
        })
    }
})
$(".login-btn").click(function () {
    $(this).addClass("background-green text-white");
    $(".sign-btn").removeClass("background-green text-white").addClass("background-greyf2");
    var loginName=$("#loginName").val();
    var password=$("#password").val();
    var url= SERVER_IP + "/efaleague-web/appPath/appData/checkLogin?loginName="+loginName+"&password="+password;
    $.ajax({
        url:url,
        success:function (data) {
            var login_success=eval(data.result);
            if(login_success){            //login success
                try{
                    localStorage.setItem("have_logined",1);
                    //把json数据转换成字符串格式存储
                    localStorage.setItem("mine_info",JSON.stringify(data.rows[0]));
                    localStorage.setItem("loginId",data.rows[0].id);
                    window.location.href= SERVER_IP + "/efafootball-web/mine.html";
                }
                catch (err){
                    TIP_ERROR("无法写localstorage...");
                }
            }else{                       //login failed
                $(".Tip").removeClass("hidden");
                setTimeout('$(".Tip").addClass("hidden")',1500);
            }
        }
    })
});
$(".sign-btn").click(function () {
    $(this).addClass("background-green text-white");
    $(".login-btn").removeClass("background-green text-white").addClass("background-greyf2");
    window.location.href= SERVER_IP + "/efafootball-web/mine-sign.html";
});