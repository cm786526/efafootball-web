/**
 * Created by 晴识明月 on 2017/1/5.
 */
var current_choose; //标记当前所设置的属性，0 表示设置性别 1表示设置位置
var token,loginId,id,xval;
$(document).ready(function (){
    localStorage.setItem("reload_mine","true"); //使得返回显示所有帖子的页面的时候能够reload
    //根据localStorage缓存看是否登录
    var have_logined=localStorage.getItem("have_logined");
    if(have_logined==1){
        var mine_info=localStorage.getItem("mine_info");
        loginId=localStorage.getItem("loginId");
        console.log(mine_info);
        SetContent(JSON.parse(mine_info));
    }else{
        window.location.href= SERVER_IP + "/efafootball-web/mine-login.html";
    }
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
                            xval.remove(); //点击屏幕 进度条消失
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
$(".save-edit").click(function () {
    var name=$("#Name").val(); //球员名称
    var number=$("#cloth_number").val(); // 球衣号码
    if(isNaN(number)&&number!=""){
        TIP_ERROR("秋衣号码必须为数字");
        return;
    }
    var position=$("#position").text(); //场上位置 门将 GK 后卫 CB 中场CM 前锋 CF
    if(position.indexOf("CF")!=-1) position="CF";
    else if(position.indexOf("CM")!=-1) position="CM";
    if(position.indexOf("CB")!=-1) position="CB";
    if(position.indexOf("GK")!=-1) position="GK";
    var cards=$("#ID_Number").val(); //身份证
    var reg=/^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;
    if(!reg.test(cards)){
        TIP_ERROR("身份证号码格式不对");
        return;
    }
    var photo=$("#profile-img").attr("src"); //照片 上传七牛服务器返回图片名称传达给服务器
    photo=photo.replace("http://obxgaesml.bkt.clouddn.com/","");
    var telephone=$("#phone").val();//电话号码
    if(isNaN(telephone)&&telephone!=""){
        TIP_ERROR("电话号码格式不对");
        return;
    }
    var sex=0;//'性别 0男 1 女',
    if($("#sex").text()=="女") sex=1;
    var age=$("#age").val();//'年级',
    var city=$("#City").text();//'地区',
    var height=$("#height").val();//'身高',
    if(isNaN(height)&&height!=""){
        TIP_ERROR("身高必须为数字");
        return;
    }
    var weight=$("#weight").val();//'体重',
    if(isNaN(weight)&&weight!=""){
        TIP_ERROR("体重必须为数字");
        return;
    }
    var url= SERVER_IP + "/efaleague-web/appPath/appData/updateMember?id="+id+"&name="+name+"&loginId="+loginId+"&city="+city+
        "&number="+number+"&position="+position+"&cards="+cards+"&photo="+photo+"&telephone="+telephone+"&sex="+sex+"&age="+age+"&height="+height+"&weight="+weight;
    if(confirm("是否保存修改？")==true){{
        $.ajax({
            url:url,
            type:"post",
            success:function (data) {
                TIP_ERROR(data.message);
                if(data.result=="success"){
                    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                        webkit.messageHandlers.callbackHandler.postMessage({functionToRun: "loadView"});
                    }
                    window.history.go(-1);//返回上一条
                }
            }
        })
    }
    }
});

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
function SetContent(mine_info) {
    console.log(mine_info);
    id=mine_info.id;
    if(mine_info.photo!="") $("#profile-img").attr("src",mine_info.photo);
    if(mine_info.name!="") $("#Name").val(mine_info.name);
    if(mine_info.cards!="") $("#ID_Number").val(mine_info.cards);
    $("#age").val(mine_info.age);
    $("#cloth_number").val(mine_info.number);
    if(mine_info.sex!="") $("#sex").text(mine_info.sex);
    $("#height").val(mine_info.height);
    $("#weight").val(mine_info.weight);
    if(mine_info.position!="") $("#position").text(mine_info.position);
    if(mine_info.city!="") $("#City").html(mine_info.city);
    if(mine_info.telephone!="")$("#phone").val(mine_info.telephone);
}