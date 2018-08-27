/**
 * Created by 晴识明月 on 2016/12/27.
 */
var current_choose; //标记当前所设置的属性，0 表示设置性别 1表示设置位置
var token,xval;
$(document).ready(function (){
    //从服务器获取domain和token
    $.ajax({
        url: SERVER_IP + "/efaleague-web/appPath/appData/getImageByToken",
        success:function (data) {
            if(data.result=="success"){
                token=data.message;
                // domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取
                // uploader 为一个plupload对象，继承了所有plupload的方法，参考http://plupload.com/docs
                //引入Plupload 、qiniu.js后
                var uploader = Qiniu.uploader({
                    runtimes: 'html5,flash,html4',    //上传模式,依次退化
                    browse_button: 'loadfile',       //上传选择的点选按钮，**必需**
                    //uptoken_url: '/token',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                    uptoken : token, //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                    // unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
                    // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
                    domain: 'http://obxgaesml.bkt.clouddn.com/',   //bucket 域名，下载资源时用到，**必需**
                    get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
                    container: 'loadfile-container',           //上传区域DOM ID，默认是browser_button的父元素，
                    max_file_size: '100mb',           //最大文件体积限制
                    flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
                    max_retries: 3,                   //上传失败最大重试次数
                    dragdrop: true,                   //开启可拖曳上传
                    drop_element: 'loadfile-container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    chunk_size: '4mb',                //分块上传时，每片的体积
                    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    init: {
                        'FilesAdded': function(up, files) {
                            plupload.each(files, function(file) {
                                // 文件添加进队列后,处理相关的事情
                                plupload.each(files, function(file) {
                                });
                            });
                        },
                        'BeforeUpload': function(up, file) {
                            $.ajax({
                                beforeSend:function(){
                                    xval=getBusyOverlay('viewport',{color:'gray', opacity:0.75, text:'viewport: loading...', style:'text-shadow: 0 0 3px black;font-size:12px;color:white'},{color:"#ffffff", size:80, type:'o'});
                                    if(xval) {
                                        xval.settext("正在上传图片，请稍后。。。");
                                    }
                                }
                            });
                            // 每个文件上传前,处理相关的事情
                        },
                        'UploadProgress': function(up, file) {
                            // 每个文件上传时,处理相关的事情
                        },
                        'FileUploaded': function(up, file, info) {
                            // 每个文件上传成功后,处理相关的事情
                            // 其中 info 是文件上传成功后，服务端返回的json，形式如
                            // {
                            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                            //    "key": "gogopher.jpg"
                            //  }
                            // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                            xval.ramove();
                            var domain = up.getOption('domain');
                            var res = JSON.parse(info);
                            var sourceLink = domain + res.key;   //获取上传成功后的文件的Url
                            $("#profile-img").attr("src",sourceLink);
                        },
                        'Error': function(up, err, errTip) {
                            //上传出错时,处理相关的事情
                        },
                        'UploadComplete': function() {
                            //队列文件处理完毕后,处理相关的事情
                        },
                        'Key': function(up, file) {
                            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                            // 该配置必须要在 unique_names: false , save_key: false 时才生效
                            var key = file.id+".jpg";
                            return key;
                            // do something with key here
                        }
                    }
                });
// domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取
// uploader 为一个plupload对象，继承了所有plupload的方法，参考http://plupload.com/docs
            }
        }
    });
});
$(".sign-btn").click(function () {
    var loginName=$("#loginName").val();
    var password=$("#password").val();
    if(loginName==""||password==""){
        $(".Tip").removeClass("hidden");
        $(".Tip span").html("用户名和密码不能为空!")
        setTimeout('$(".Tip").addClass("hidden")',1500);
        return;
    }
    var reg=/^[a-zA-Z0-9]+$/;
    if(!reg.test(loginName)){
        $(".Tip").removeClass("hidden");
        $(".Tip span").html("用户名必须为数字字母的组合!")
        setTimeout('$(".Tip").addClass("hidden")',1500);
        return;
    }
    var Name=$("#Name").val();
    var ID_Number=$("#ID_Number").val();
    var sex=$("#sex").text();
    var position=$("#position").text();
    var city=$("#City").text();
    var url= SERVER_IP + "/efaleague-web/appPath/appData/createUser?loginName="+loginName+"&password="+password+"&name="+name+"&userType=1";
    Sign_Up(url);
});
$(".position-ul li").click(function () {
    $(".position-ul").find(".text-green").removeClass("text-green");
    $(this).addClass("text-green");
});
$(".sex-ul li").click(function () {
    $(".sex-ul").find(".text-green").removeClass("text-green");
    $(this).addClass("text-green");
});
$(".save-item").click(function () {
    if(current_choose==0){
        var choose_content=$(".sex-ul").find(".text-green table tr td div").text();
        if(choose_content=="") {
            TIP_ERROR("请选择性别");
            return;
        }
        $("#sex").text(choose_content);
    }else if(current_choose==1){
        var choose_content=$(".position-ul").find(".text-green table tr td div").text();
        $("#position").text(choose_content);
        if(choose_content=="") {
            TIP_ERROR("请选择位置");
            return;
        }
    }
    $(".top-div").addClass("hidden");
    $(".sex-ul").addClass("hidden");
    $(".position-ul").addClass("hidden");
});
$(".cancel-item").click(function () {
    $(".top-div").addClass("hidden");
    $(".sex-ul").addClass("hidden");
    $(".position-ul").addClass("hidden");
    current_choose=-1;
});
$(document).on("click","#viewport",function () {
    xval.remove(); //点击屏幕 进度条消失
})
function Sign_Up(url) {
    $.ajax({
        url:url,
        success:function (data) {
            var result=(data.result);
            console.log(data);
            if(result=="repeat"){
                $(".Tip").removeClass("hidden");
                $(".Tip span").html("注册失败,该用户名已经存在!")
                setTimeout('$(".Tip").addClass("hidden")',1500);
            }else if(result=="fail"){
                $(".Tip").removeClass("hidden");
                $(".Tip span").html("注册失败!")
                setTimeout('$(".Tip").addClass("hidden")',1500);
            }else if(result=="success"){
                localStorage.setItem("have_logined",1);
                //把json数据转换成字符串格式存储
                localStorage.setItem("loginId",data.message);
                window.location.href= SERVER_IP + "/efafootball-web/mine.html";
            }
        }
    })
}
function checkFile(){
    var file = document.getElementById("loadfile").value;
    //console.log(file);
    if(file){
        document.getElementById("profile-img").src=file;
    }
}

function choose_sex() {
    $(".top-div").removeClass("hidden");
    $(".sex-ul").removeClass("hidden");
    current_choose=0;
}

function choose_position() {
    $(".top-div").removeClass("hidden");
    $(".position-ul").removeClass("hidden");
    current_choose=1;
}

function choose_city() {
    //to do
}