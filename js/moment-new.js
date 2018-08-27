/**
 * Created by 晴识明月 on 2017/2/27.
 */
var token;
var select_photo=[];
var login_id;
var xval;
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
                                        xval.settext("正在上传图片");
                                    }
                                }
                            });
                            // 每个文件上传前,处理相关的事情
						},
						'UploadProgress': function(up, file) {
                            if(xval) {
                                xval.settext("正在上传图片,已完成  "+file.percent+ "%");
                            }
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
                            xval.remove(); //删除进度框
							var domain = up.getOption('domain');
							var res = JSON.parse(info);
							var sourceLink = domain + res.key;   //获取上传成功后的文件的Url

							//自定义图片处理
							// photo_num++;
							// var photo_content=$(".img-box").html();
                            // // photo_content+= '<a  href=""><img class="img-three" src='+sourceLink+' alt="" ></a>';
                            // // if(photo_num % 3==0 ){
                            // //     photo_content+='</br>';
                            // // }
							select_photo.push(sourceLink); //保存缩略图
							InsertPhoto();
							// $(".img-box img").attr("src",sourceLink);
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
	//初始化emoji控件
    $('.emotion').qqFace({

        id : 'facebox',

        assign:'saytext',

        path:'third-plugin/qqFace/arclist/' //表情存放的路径

    });
});
$(document).on("click","#delete-photo",function () {
    var r=confirm("你确定删除这张照片吗？")
    if (r==true) {
        select_photo.splice($(this).closest('a').attr("id"),1);
        InsertPhoto(select_photo);
    }
});
$(document).on("click","#viewport",function () {
    xval.remove(); //点击屏幕 进度条消失
})
$(".J_close").click(function () {
	window.history.back();//返回上一条
})
$(document).on("click",".delete-all",function () {
    var r=confirm("你确定删除所有照片吗？")
    if (r==true) {
        select_photo=[];
        InsertPhoto(select_photo);
    }
});
//发表
$(".J_confirm").click(function(){
    //根据localStorage缓存看是否登录
    var have_logined=localStorage.getItem("have_logined");
    if(have_logined==1){
        login_id=localStorage.getItem("loginId");
    }else{
        TIP_ERROR("不能新建,必须先登录！");
        return;
    }
    var text = $("#saytext").html();
    var r=confirm("你确定发表这篇帖子吗？")
    if (r==true) {
    	$("i").remove(".delete-photo");   //删除右上角的小图标
		if($(".img-box a").length<=1){
			$(".img-box img").removeClass("img-three").addClass("img-one");
		}else if($(".img-box a").length==2){
            $(".img-box img").removeClass("img-three").addClass("img-two");
		}
        var imgs=$(".img-box").html();
		var url= SERVER_IP + "/efaleague-web/appPath/appData/Moment/save?user_id="+login_id+"&content="+text+"&photo="+imgs;
		$.ajax({
			url:url,
			type:"post",
			success:function (data) {
				//
				if(data.result=="success"){
                    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                        webkit.messageHandlers.callbackHandler.postMessage({functionToRun: "loadView"});
                    }
                    window.history.go(-1);//返回上一条
				}
			}
		});
    }
});
function InsertPhoto() {
	var old_conten=$(".img-box").empty();
	var newphoto='';
	for (var i=0;i<select_photo.length;i++){
        newphoto+='<a  href="javascript:;" id='+i+'><img class="img-three lazy" src='+select_photo[i]+'?imageView2/1/w/360/h/174'+' alt="" ><i class="delete-photo" id="delete-photo"></i></a>';
        if((i+1) % 3==0 ){
            newphoto+='</br>';
        };
	}
	$(".img-box").html(newphoto);
}