import {isNum} from "./util";

const PLUGIN_CHECK = (function(){
	// var currentVersion = window.pluginVersion;
	var plugin;
	/**
	 * [compare_version 比较版本]
	 * @param  {[Array]} require_min_version [description]
	 * @param  {[Array]} current_version     [description]
	 * @return {[bool]}                     [description]
	 */
	var compare_version = function(require_min_version,current_version){
			var totalVal1 =  parseInt(require_min_version[0],10)*1000 + parseInt(require_min_version[1],10)*100 + parseInt(require_min_version[2],10)*10 + parseInt(require_min_version[3],10);
			var totalVal2 = parseInt(current_version[0],10)*1000 + parseInt(current_version[1],10)*100 + parseInt(current_version[2],10)*10 + parseInt(current_version[3],10);
		     msg([totalVal1,totalVal2])
		      if(isNum(totalVal1)&&isNum(totalVal2)){
		        
		        if (totalVal2 >= totalVal1) {
		          return true;
		        }
		      }
    
				return false;

	}

	/**
	 * [isPluginInstalled 检测本机是否安装了插件]
	 * @return {Boolean} [description]
	 */
	var isPluginInstalled = function(type)
	{

		if (window.ActiveXObject || "ActiveXObject" in window) {
			// We're running IE
			return _isIEPluginInstalled(type);
		}else if (navigator.plugins) {
			// We're running something else
			return _isNpapiPluginInstalled(type);
		}
	};

	var _isIEPluginInstalled = function(type)
	{

		//check if plugin exists
		try {
			plugin = new ActiveXObject("Universe.RtspVideoPlugin");
			var require_min_version = window.pluginVersion.split(".");
			var current_version = plugin.version.split(".");
			if(!type){
				plugin = null;
			}
		} catch (e) {
			plugin =  null;
			return false;
		}

		return compare_version(require_min_version,current_version);
	};

	var _isNpapiPluginInstalled = function(type) //null : default ; not null: need ClearPlugin
	{
		var mimeType = "application/x-rtspvideoplugin";
		var name = "RtspVideoPlugin";
		
		if (typeof(navigator.plugins[name]) != "undefined")
		{
			if($('#plugin_container').length == 0){
				$(document.body).append('<div id="plugin_container"><object id="npplugin" type="application/x-rtspvideoplugin" \
					width="1" height="1"><param name="onload" value="pluginLoaded" />\
					<param name="TYPE" value="NONE" /><param name="VERSION" value="' + window.pluginVersion +'"/></object></div>');
				plugin = document.getElementById("npplugin");
			}
			var require_min_version = window.pluginVersion.split(".");
			var current_version = /*navigator.plugins[name]*/plugin.version.split(".");

			if(compare_version(require_min_version,current_version)){
				if(!type) {
					$('#plugin_container').remove();
				}
				return true;
			}

		}
		if(!type) {
			$('#plugin_container').remove();
		}
		return false;
	}

	var GetPlugin = function(){
		return plugin;
	}
	var ClearPlugin = function(){
		msg("-------------ClearPlugin")
		if (window.ActiveXObject || "ActiveXObject" in window) {
			// We're running IE
			plugin =null;
		}else if (navigator.plugins) {
			// We're running something else
			$('#plugin_container').remove();
		}
	}

	function isBrowser(name){
		var Sys={};
		var ua=navigator.userAgent.toLowerCase();
		var s;
		(s=ua.match(/msie ([\d.]+)/))?Sys.ie=s[1]:
		(s=ua.match(/firefox\/([\d.]+)/))?Sys.firefox=s[1]:
		(s=ua.match(/chrome\/([\d.]+)/))?Sys.chrome=s[1]:
		(s=ua.match(/opera.([\d.]+)/))?Sys.opera=s[1]:
		(s=ua.match(/version\/([\d.]+).*safari/))?Sys.safari=s[1]:0;
		
		var ret = Sys[name];
		if (typeof ret === "undefined") {
			return false;
		}else{
			return ret;
		}

	}

	var CheckIEPluginStatus = function(){
		if (window.ActiveXObject || "ActiveXObject" in window) {
			//支持Activex的浏览器 如360浏览器兼容模式
			if(typeof window.external.msActiveXFilteringEnabled != 'undefined'){
				// is IE
				if(window.external.msActiveXFilteringEnabled()){
					return -1; //ActiveX Filtering Enabled
				}
			}

			try {
				plugin = new ActiveXObject("Universe.RtspVideoPlugin");
				var require_min_version = window.pluginVersion.split(".");
				var current_version = plugin.version.split(".");
				plugin = null;
			} catch (e) {
				plugin = null;
				return 0; //not installed
			}

			// 1: version is lower; 2: check plugin ok
			return compare_version(require_min_version, current_version) ? 2 : 1;

		}
		else if(typeof(navigator.plugins["RtspVideoPlugin"]) != "undefined"){
			//旧版firefox
			if($('#plugin_container').length == 0){
				$(document.body).append('<div id="plugin_container"><object id="npplugin" type="application/x-rtspvideoplugin" \
					width="1" height="1"><param name="onload" value="pluginLoaded" />\
					<param name="TYPE" value="NONE" /><param name="VERSION" value="' + window.pluginVersion +'"/></object></div>');
				plugin = document.getElementById("npplugin");
			}
			let require_min_version = window.pluginVersion.split(".");
			let current_version = plugin.version.split(".");

			$('#plugin_container').remove();
			return compare_version(require_min_version,current_version)?2:1;

		}
		else{
			return -2; //current browser is not supported Activex
		}
    }

	return {
		"isPluginInstalled":isPluginInstalled,
		"GetPlugin":GetPlugin,
		"ClearPlugin":ClearPlugin,
		"isBrowser":isBrowser,
        "CheckIEPluginStatus":CheckIEPluginStatus
	}

}());

export default PLUGIN_CHECK