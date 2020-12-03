<template >
	<div class="main_con_k clearfix" v-if="operation_status <= 1">
		<form target="hidden_iframe"  method="post" :action="upload_url" enctype="multipart/form-data" >
			<div class="main_con_top_k">
			<div class="fl pl10 bold">
			<label v-tr="i18n_menu_upgrade"><!-- 系统升级 --></label>
			</div>
			</div>
			<div class="main_con_mid_k" id="cont">
				<div v-show="operation_status == 0">
			<div class="w100 pt5">
					<div class="fl text_right" style="width:35%">
						<label v-tr="i18n_file"></label>:&nbsp;
						</div>
					<div class="fl" style="width:65%;height:26px;">
							<input type="hidden" name="param" :value="hidden_json">
							<input type="file" id="selfile" name="selfile" style="display: none;" @change="getfile"/> <!---->
							<div>
								<input class="textc" style="width:200px;height:24px; padding-top:0px; padding-bottom:0px" type="text" disabled="disabled" v-model="file_name"/>
								<label :class="button_style" style="display:inline-block; width:68px;height:24px; margin:0;" for="selfile" v-tr="i18n_browse"></label>
							</div>
						</div>
					</div>

				<div class="w100 pt10 text_center">
				      <button :class="button_style"   v-tr="i18n_update" @click="submit_update"></button>
				</div>
				<div class="w100 pt5">
					<div class="fl text_right" style="width:20%"><label style="color:red" v-tr="i18n_sysnotice"></label></div>
					<div class="fl" style="width:80%;">
						<label  style="color:red" v-tr="i18n_notice"></label>

					</div>
				</div>
				</div>
				<div v-show="operation_status == 1" >
                    <!--上传进度显示-->
					<div class="text_center" style="width:80%">
                        <div><label>{{upload_text}}</label></div>
                        <div><progress id="progressBar" value="0" max="100" style="width: 300px;"></progress></div>
                        <div><span id="percentage"></span></div>
                        <div><span id="time"></span></div>
                        <br /><br /> 
					</div>
				</div>
                <div v-show="operation_status == 2" >
                    <!--升级进度显示-->
                    <div class="text_center" style="width:80%">
                        <div><label>{{upload_text}}</label></div>
                    </div>   
                </div>
			</div>
			<div class="main_con_bot_k"></div> 
        
			<iframe id="uploadfile" name="hidden_iframe" style="display:none;visiblity:hidden;width:1px;height:1px;"></iframe><!--display:none;visiblity:hidden;-->
			</form>
		</div>
		<div class="main_con clearfix" style="margin-top:120px;" v-else>
            <!--<div v-show="operation_status == 2">-->
            <!--标题-->
			<div class="main_con_top"><div class="fl pl10 bold"><label v-tr="i18n_menu_upgrade"></label></div></div>
			   <!--内容-->
				<div class="main_con_mid">
					<div id='lbl_progress' class="w100 pt10 text_center">
							<img  id="imgwt" src="static/images/loading.gif" width="260" height="10" />
					</div>
					<div id='text_progress' class="w100 pt10 text_center">
						<span>{{update_progress_text}}</span>
					</div>

				</div>
			<!--底部-->
			<div class="main_con_bot"></div>
		</div>
</template>


<script>

	import Vue from 'vue'
	import {wsseHeader,wsse_allstring} from 'common/wsse'
	import {getFileName} from 'common/util'
	import style from 'mixin/style'
	export default {
		name:'CVConfigUpdate',
		mixins:[style],
		data(){
			return {
				//liuxin add file size
				file_size:0,
				//liuxin add file size
				operation_status:0,
				update_progress:0,
				upload_text:'',
				tid:null,
				file_name: ""
			}
		},
		mounted(){
			if (this.operation_status == 0) {

				/*this.$store.dispatch("request",{url:"digest/frmSysUpdate",Type:0,Ch:1,Data:{}}).then(r=>{
				//	msg(r)
					if (r.Result == -655365) {
            			this.$store.dispatch('config_no_right');
					}else{
						if (r.Result == 0) {
							this.d = r.Data;
				            this.$notify.success(this.$store.getters.current_language["i18n_getok"]);
			            }else {
			            	this.$notify.error(this.$store.getters.current_language["i18n_getfailed"]);
			            }
			        }
			        this.file_name = "";
				});*/
			}
		},
		methods:{
            sleep(time) {
                return new Promise((resolve) => setTimeout(resolve, time));
            },
            async change_to_show_update_stat() {
                //this.sleep(2000).then()
                this.sleep(5).then(() => {
                    // 这里写sleep之后需要去做的事情
                    msg("---liuxin add debug sleep 2s : ");
                    this.operation_status = 2;
                    this.upload_text = this.$store.getters.current_language['i18n_upload_bd_ing'];
                    this.BroadcastReceiver();
                });
            },
            getIP(json) {
		        return localStorage.setItem('Ip', json.ip);
	        },
            BroadcastReceiver(context,intent){
                var TAG = "MyReceiver"; 
                var br_url= "ws://"+window.location.host+":30000";
                msg("---liuxin add debug BroadcastReceiver url: "+br_url);
                var dgram = require("dgram");
                var server = dgram.createSocket("udp4");
                server.on("error", function (err) {
                    //console.log("server error:\n" + err.stack);
                    msg("---liuxin add debug BroadcastReceiver error:"+err.stack);
                    server.close();
                });
                server.on("message", function (msg, rinfo) {
                    //console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
                    msg("---liuxin add debug BroadcastReceiver message:"+msg);
                    msg("---liuxin add debug BroadcastReceiver from:"+rinfo.address);
                    msg("---liuxin add debug BroadcastReceiver from port:"+rinfo.port);
                });
                server.on("listening", function () {
                    var address = server.address();
                    //console.log("server listening " + address.address + ":" + address.port);
                    msg("---liuxin add debug BroadcastReceiver listening:"+address.address+":"+address.port);
                });
                server.bind(30000);
                //var socket = __import__('Socket', null, {});
                /*var client = new socket.Socket(window.location.host,30000);
                client.on('read', function(socket){    //注册读数据的事件
                    var echo = socket.read();           //读收到的数据,,返回的结果为string对象
                    print('echo from server:' + echo)
                    msg("---liuxin add debug BroadcastReceiver msg: "+echo);
                    //socket.write("Bye!")                      
                    //socket.close()      //关闭socket.
                });
                client.on('connect', function(socket){       //注册连接成功时事件
                    //print('connectted....')
                    msg("---liuxin add debug BroadcastReceiver connectted.... ");
                    //socket.write("Hello server, i'm a client!")  
                });
                client.on('closed', function(socket){    //socket 关闭后的事件.
                    //client.write("Bye!")    
                    //print('Bye!')
                    msg("---liuxin add debug BroadcastReceiver closed");
                })             
                client.connect();*/
                /*const ws = new WebSocket(br_url);
                ws.onopen=()=>{
                     ws.onmessage=(e)=>{
                        //msg("---liuxin add debug BroadcastReceiver 连接到服务器 ");
                        msg("---liuxin add debug BroadcastReceiver msg: "+e.toString());
                    }
                };
                ws.onclose=()=>{
                    //console.log('断开连接');
                     msg("---liuxin add debug BroadcastReceiver end ");
                };*/
                /*var net = new require('net');
                var client = net.connect({port:3000},function(){
                    //console.log('连接到服务器！');  
                    msg("---liuxin add debug BroadcastReceiver 连接到服务器 ");
                });
                client.on('data', function(data) {
                    //console.log(data.toString());
                    msg("---liuxin add debug BroadcastReceiver msg: "+data.toString());
                    context.update_progress = r.Data.Progress;
                    //client.end();
                });
                client.on('end', function() { 
                    //console.log('断开与服务器的连接');
                    msg("---liuxin add debug BroadcastReceiver end ");
                });
                var msg = intent.getStringExtra("msgContent");  
                msg("---liuxin add debug BroadcastReceiver : "); */
            },
            LX_updata_file(context) {
                var fileObj = document.getElementById("selfile").files[0]; // js 获取文件对象
                //var fileObj = document.getElementById('selfile').parentNode;
                //var pic = document.getElementById('selfile').parentNode;
                //var pic = document.getElementsByTagName('selfile')[0].files[0];
                var fd = new FormData();
                fd.append('selfile',fileObj);
                var xhr = new XMLHttpRequest();
                var ot;//
                var oloaded;
                xhr.open('post', '/goform/upldForm',true);
                xhr.setRequestHeader('content-type', 'application/octet-stream');
                msg("---liuxin debug --- LX_updata_file: ");
                xhr.onload = function(){//请求完成
                    msg("---liuxin debug --- onload: success");
                    context.$store.commit('config/is_uploading_file',false);
                    context.upload_text = context.$store.getters.current_language['i18n_upload_ok'];
                    context.change_to_show_update_stat();
                    //context.operation_status = 2; //上传完成，直接切到 升级状态，显示升级进度
                };
                xhr.onerror = function(){//请求失败
                    msg("---liuxin debug --- onerror: ERR");
                    context.$store.commit('config/is_uploading_file',false);
                    context.upload_text = context.$store.getters.current_language['i18n_upload_err'];
                };
                xhr.upload.onprogress = function(evt){ //【上传进度调用方法实现】
                    var progressBar = document.getElementById("progressBar");
                    var percentageDiv = document.getElementById("percentage");
                    // event.total是需要传输的总字节，event.loaded是已经传输的字节。如果event.lengthComputable不为真，则event.total等于0
                    if (evt.lengthComputable) {//
                        progressBar.max = evt.total;
                        progressBar.value = evt.loaded;
                        percentageDiv.innerHTML = Math.round(evt.loaded / evt.total * 100) + "%";
                        //msg("---liuxin debug --- percent: "+ (evt.loaded/evt.total));
                        if((evt.loaded / evt.total)>=1){
                            msg("---liuxin debug --- percent: "+ (evt.loaded/evt.total)*100 + "%");
                            context.operation_status = 1;
                            //context.operation_status = 2; //上传完成，直接切到 升级状态，显示升级进度
                        }
                    }
                    
                    var time = document.getElementById("time");
                    var nt = new Date().getTime();//获取当前时间
                    var pertime = (nt-ot)/1000; //计算出上次调用该方法时到现在的时间差，单位为s
                    ot = new Date().getTime(); //重新赋值时间，用于下次计算
                    
                    var perload = evt.loaded - oloaded; //计算该分段上传的文件大小，单位b       
                    oloaded = evt.loaded;//重新赋值已上传文件大小，用以下次计算
                
                    //上传速度计算
                    var speed = perload/pertime;//单位b/s
                    var bspeed = speed;
                    var units = 'b/s';//单位名称
                    if(speed/1024>1){
                        speed = speed/1024;
                        units = 'k/s';
                    }
                    if(speed/1024>1){
                        speed = speed/1024;
                        units = 'M/s';
                    }
                    speed = speed.toFixed(1);
                    //剩余时间
                    var resttime = ((evt.total-evt.loaded)/bspeed).toFixed(1);
                    time.innerHTML = '速度：'+speed+units+'，剩余时间：'+resttime+'s';
                    if(bspeed==0)
                        time.innerHTML = '上传已取消';
                };
                xhr.upload.onloadstart = function(){//上传开始执行方法
                    ot = new Date().getTime();   //设置上传开始时间
                    oloaded = 0;//设置上传开始时，以上传的文件大小为0
                };
                xhr.send(fd);//开始上传，发送form数据
            },
		    getfile(e) {
				this.file_name = getFileName(e.target.value);
				this.file_size = e.target.files[0].size;
				msg("---liuxin debug ---e.target.value : "+e.target.value);
				msg("---liuxin debug ---e.target.files[0].name : "+e.target.files[0].name);
				msg("---liuxin debug ---file_size : "+this.file_size);
				this.$store.dispatch("request",{
					url:"digest/frmSysUpdate",
					Type:0,
					Ch:1,
					Data:{
						FileSize:this.file_size
					}})
				.then(r=>{
					if (r.Result == -655365) {
            		this.$store.dispatch('config_no_right');
					}else{
						if (r.Result == 0) {
							this.d = r.Data;
							msg("---liuxin add debug submit_update  PermitUpdate : "+ this.d.PermitUpdate);
				           	this.$notify.success(this.$store.getters.current_language["i18n_getok"]);
			           	}else {
			           		this.$notify.error(this.$store.getters.current_language["i18n_getfailed"]);
			           	}
			       	}
				});
			},
			checkSubForm(){
				//msg(this.$el.children)
				msg("---liuxin add debug fileType : "+ fileType);
				let form = this.$el.children[0].selfile;
				msg("---liuxin add debug checkSubForm form : "+ form);
				msg("---liuxin add debug checkSubForm PermitUpdate : "+ this.d.PermitUpdate);
				if (!this.d) {
					return false;
				}
				/*msg("---liuxin add debug checkSubForm RemoteRight : "+ this.d.RemoteRight);
				if (this.d.RemoteRight == 0) {
					//msg(g_login_4);
          			this.$notify.error(this.$store.getters.current_language["i18n_no_updateright"]);
					return false;
				}*/
				msg("---liuxin add debug checkSubForm form.value : "+ form.value);
				if (form.value == "") {
					//alert(v_update_7);
         			this.$notify.error(this.$store.getters.current_language["i18n_nofile"]);
					form.focus();
					return false;
				}

				let fileType = form.value.substr(form.value.length - 6).toUpperCase();
				msg("---liuxin add debug fileType : "+ fileType);
				if (fileType.toUpperCase() != "UPDATE") {
					//alert(v_update_8);
          			this.$notify.info(this.$store.getters.current_language["i18n_update_error"]);
					form.select();
					return false;
				}
				else {

					this.fileName = getFileName(form.value);
					msg("---liuxin add debug checkSubForm  fileName : "+ this.fileName);
					//msg(this.fileName);
					return true;
				}
			},
			submit_update(e){
				msg("---liuxin add debug  submit !!!---");
				if (this.checkSubForm())
				{
					this.operation_status = 1;
					this.upload_text = this.$store.getters.current_language['i18n_start_upload'];
					this.$store.dispatch('request',{
						url:"digest/frmSysUpdate",
						Type:0,
						Ch:1,
						Data:{
							FileSize:this.file_size
						}}).then(r=>{
						if (r.Result == -655365) {
              				this.$store.dispatch('config_no_right');
						}else{
							if (r.Result == 0) {
                                //msg(Vue.$upload)
                                //var form = new FormData(); // FormData 对象
                                var that = this;
                                this.LX_updata_file(that);
								//msg("---liuxin add debug  bind_fileElement :"+document.getElementById('uploadfile').parentNode);
								//Vue.$upload.bind_fileElement(document.getElementById('uploadfile').parentNode);
                                //var that = this;
                                //that.upload.onprogress = this.progressFunction;
                                /*onUploadProgress(progressEvent){
                                    if (progressEvent.lengthComputable) {
                                        let val = (progressEvent.loaded / progressEvent.total * 100).toFixed(0);
                                        that.formData.showProgress = true;
                                        that.formData.startValue = parseInt(val)
                                    }
                                }*/
								/*Vue.$upload.submit(function(info_text){
										that.upload_text = info_text;
									},*/
									/*function(progressEvent){
										if (progressEvent.lengthComputable) {
											let val = (progressEvent.loaded / progressEvent.total * 100).toFixed(0);
											msg("---liuxin add debug  progressEvent :" +val);
											that.formData.showProgress = true;
											that.formData.startValue = parseInt(val)
										}
									}
								)*/
								/*function(){
                  					that.$store.commit('config/is_uploading_file',true);
									that.operation_status = 2;
									
								    /*that.tid = setInterval(()=>{
					                    that.$store.dispatch("request",{url:"goform/GetProgress",Type:0,Data:{}}).then(r=>{
					                        if (r.Result == 0) {
					                            that.update_progress = r.Data.Progress;
					                            msg(r.Data.Progress)
					                            if(r.Data.Progress < 0){
					                                msg('unexpected progress:' + r.Data.Progress);
					                                that.$store.commit('config/is_uploading_file',false);
					                                clearInterval(that.tid);
					                                that.tid = null;

					                            }else{
					                                msg(r.Data.Progress == 100)
					                                if (r.Data.Progress == 100) {
					                                	msg("clear setInterval")
					                                    clearInterval(that.tid);
					                                    that.tid = null;
					                                    that.$store.commit('config/is_uploading_file',false);
					                                    //reboot
					                                    that.$store.dispatch('request',{
					                                    	url:"goform/frmDeviceReboot",
					                                    	Type:0,
					                                    	Data:{}
					                                    });
					                                }
					                            }
					                        }
					                    })
					                },5000);*/
								//})
							}else{
								msg('frmChangeFileName/Set Failed!Upload stop!');
							}
						}

					})
				}
				//阻止默认的 点击form内的button，表单就会自动提交
				e.preventDefault();
				return false;


			}
		},
		computed:{

			hidden_list(){
				return wsseHeader(this.$store.getters.tokenA,this.$store.getters.tokenB,{uploadType:"Update"});
			},
			hidden_json(){
				return JSON.stringify($.extend(true,wsseHeader(this.$store.getters.tokenA,this.$store.getters.tokenB),{uploadType:"Update"}));
			},
			update_progress_text(){
				let str = '';
				if (this.update_progress == -1) {
					str =  this.$store.getters.current_language['i18n_update_failed'];
				}else if(this.update_progress == 100){
					str =  this.$store.getters.current_language['i18n_update_ok'];
				}else{
					str = this.update_progress + '%';
				}
				msg(str)
				return str;
			},
		  upload_url(){
			  return /*this.$store.getters.is_dongshun?"/t8s/upload":*/"/goform/upldForm";
			}
		}
    }
</script>
