
/**
 * Calendar
 * @param   beginYear           1990
 * @param   endYear             2010
 * @param   language            0(zh_cn)|1(en_us)|2(en_en)|3(zh_tw)|4(jp)
 * @param   patternDelimiter    "-"
 * @param   date2StringPattern  "yyyy-MM-dd"
 * @param   string2DatePattern  "ymd"
 * @version V20060401
 * @version V20061217
 * @version V20080809 add to google project
 * @version V20081226 add language support for japanese 
 * @version V20090104 add fix some bugs in help.html
					  use style.display replace the style.visibility
					  some enhancements and changes
 * @author  KimSoft (jinqinghua [at] gmail.com)
 * NOTE!    you can use it free, but keep the copyright please
 * IMPORTANT:you must include this script file inner html body elment 
 * @see http://code.google.com/p/kimsoft-jscalendar/
 */
// import en from '../language/en_gb.js'
export default function Calendar(beginYear, endYear, language,theme,patternDelimiter, date2StringPattern, string2DatePattern) {
	this.beginYear = beginYear || 1970;
	this.endYear   = endYear   || 2042;
//	this.language  = language  || 0;
//  msg(["Calendar",en]);
	this.language  = language || en;
//  msg(["Calendar lang",en,this.language]);
	Calendar.language = {
  //  "year"   : ["\u5e74", "", "", "\u5e74","\u5e74"],
    "year"   : [""],
    "months" : [
      // ["\u4e00\u6708","\u4e8c\u6708","\u4e09\u6708","\u56db\u6708","\u4e94\u6708","\u516d\u6708","\u4e03\u6708","\u516b\u6708","\u4e5d\u6708","\u5341\u6708","\u5341\u4e00\u6708","\u5341\u4e8c\u6708"],
      //			["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"],
      //			["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"],
      //			["\u4e00\u6708","\u4e8c\u6708","\u4e09\u6708","\u56db\u6708","\u4e94\u6708","\u516d\u6708","\u4e03\u6708","\u516b\u6708","\u4e5d\u6708","\u5341\u6708","\u5341\u4e00\u6708","\u5341\u4e8c\u6708"],
      //			["\u4e00\u6708","\u4e8c\u6708","\u4e09\u6708","\u56db\u6708","\u4e94\u6708","\u516d\u6708","\u4e03\u6708","\u516b\u6708","\u4e5d\u6708","\u5341\u6708","\u5341\u4e00\u6708","\u5341\u4e8c\u6708"]
      			[this.language["i18n_Jan"],this.language["i18n_Feb"],this.language["i18n_Mar"],this.language["i18n_Apr"],this.language["i18n_May"],this.language["i18n_Jun"],
           this.language["i18n_Jul"],this.language["i18n_Aug"],this.language["i18n_Sep"],this.language["i18n_Oct"],this.language["i18n_Nov"],this.language["i18n_Dec"]]
    ],
    "weeks"  : [
      //["\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d"],
      // 	["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
      // 	["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
      // 	["\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d"],
      // 	["\u65e5","\u6708","\u706b","\u6c34","\u6728","\u91d1","\u571f"],
        	[this.language["i18n_Sunday"],this.language["i18n_Monday"],this.language["i18n_Tusday"],this.language["i18n_Wenday"],this.language["i18n_Thusday"],this.language["i18n_Friday"],this.language["i18n_Satday"]],
    ],
    "clear"  : ["\u6e05\u7a7a", "Clear", "Clear", "\u6e05\u7a7a", "\u524a\u9664"],
    "today"  : ["\u4eca\u5929", "Today", "Today", "\u4eca\u5929", "\u4eca\u65e5"],
    "close"  : ["\u5173\u95ed", "Close", "Close", "\u95dc\u9589", "\u623b\u308b"],
    "date2StringPattern" : ["yyyy-MM-dd", "yyyy-MM-dd", "yyyy-MM-dd", "yyyy-MM-dd", "yyyy-MM-dd"],
    "string2DatePattern" : ["ymd","ymd", "ymd", "ymd", "ymd"]
  };
	if(Calendar.language["weeks"][0][0] == "星期日"){
    Calendar.language["weeks"][0] = Calendar.language["weeks"][0].map((item)=>{
        return item.substr(-1);
    });
  }
	this.patternDelimiter = patternDelimiter     || "-";
	this.date2StringPattern = date2StringPattern || Calendar.language["date2StringPattern"][0].replace(/\-/g, this.patternDelimiter);
	this.string2DatePattern = string2DatePattern || Calendar.language["string2DatePattern"][0];
	this.theme = theme || 'default';
	this.dateControl = null;
	this.panel  = this.getElementById("__calendarPanel");
	this.iframe = window.frames["__calendarIframe"];
	this.form   = null;
	
	this.date = new Date();
	this.year = this.date.getFullYear();
	this.month = this.date.getMonth();
	
	this.colors = {"bg_cur_day":"#00CC33","bg_over":"#000000","bg_out":"#FFCC00"}
	if (this.theme == 'gray') {
		this.colors.bg_over = "#FFFFFF";
	}

	//check is alraedy constructed!
	
	if (!this.panel || !this.iframe) {
		var divs = [];
		divs[divs.length] = '<div id="__calendarPanel" style="position:absolute;display:none;border:1px solid #666666;width:200px;z-index: 999;">';
		divs[divs.length] = '<iframe name="__calendarIframe" id="__calendarIframe" width="100%" height="100%" scrolling="no" frameborder="0" style="margin:0px;"><\/iframe>';
		divs[divs.length] = '<\/div>';
		$(document.body).append($(divs.join("")));

		this.panel  = this.getElementById("__calendarPanel");
		this.iframe = window.frames["__calendarIframe"];

	}

	var __ci = window.frames['__calendarIframe'];
	var cis = [];
	cis[cis.length] ='<!DOCTYPE html PUBLIC "-\/\/W3C\/\/DTD XHTML 1.0 Transitional\/\/EN" "http:\/\/www.w3.org\/TR\/xhtml1\/DTD\/xhtml1-transitional.dtd">';
	cis[cis.length] ='<html xmlns="http:\/\/www.w3.org\/1999\/xhtml">';
	cis[cis.length] ='<head>';
	cis[cis.length] ='<meta http-equiv="Content-Type" content="text\/html; charset=utf-8" \/>';
	cis[cis.length] ='<title>Web Calendar(UTF-8) Written By KimSoft<\/title>';
	cis[cis.length] ='<style type="text\/css">';
	cis[cis.length] ='<!--';
	cis[cis.length] ='body {font-size:12px;margin:0px;text-align:center;}';
	cis[cis.length] ='form {margin:0px;}';
	cis[cis.length] ='select {font-size:12px;background-color:#EFEFEF;}';

	cis[cis.length] ='th.theader {font-weight:normal;background-color:#666666;color:#FFFFFF;width:24px;}';
	cis[cis.length] ='select.year {width:64px;}';
	cis[cis.length] ='select.month {width:60px;}';
	if (this.theme == 'gray') {
		$(this.panel).css({
			'height': '175px',
			'background-color':'#FFFFFF'
		});


		cis[cis.length] ='table { border-collapse: collapse;font-size: 0.9em;margin: 0 0 0.4em;}';
		cis[cis.length] ='th {font-size:12px;font-weight:normal;}';
		cis[cis.length] ='th.theader {font-weight:normal;background-color:#666666;color:#FFFFFF;width:24px;}';
		
		cis[cis.length] ='td {font-size:12px;text-align:center; border: 0 none;padding: 1px;}';
		cis[cis.length] ='td a{ display:block; background: #f6f6f6 none repeat scroll 0 0;border: 1px solid #c5c5c5;color: #454545;font-weight: normal;}';
		cis[cis.length] ='tr{  background: #f6f6f6 none repeat scroll 0 0;}';
		/*
		cis[cis.length] ='td.sat {color:#508FC2;background-color:#EFEFEF;}';
		cis[cis.length] ='td.sun {color:#FE8F01;background-color:#EFEFEF;}';
		cis[cis.length] ='td.normal {background-color:#336699;}';*/


	}else{
		$(this.panel).css({
			'height': '216px',
			'background-color': '#000000'
		});

		cis[cis.length] ='table {border:0px solid #CCCCCC;background-color:#343434;color:#808080}';
		cis[cis.length] ='th {font-size:12px;font-weight:normal;background-color:#000000;}';
		
	
		cis[cis.length] ='td {font-size:12px;text-align:center;}';
		cis[cis.length] ='td.sat {color:#508FC2;background-color:#EFEFEF;}';
		cis[cis.length] ='td.sun {color:#FE8F01;background-color:#EFEFEF;}';
		cis[cis.length] ='td.normal {background-color:#336699;}';
	}
	cis[cis.length] ='input.l {border: 1px solid #CCCCCC;background-color:#EFEFEF;width:20px;height:20px;}';
	cis[cis.length] ='input.r {border: 1px solid #CCCCCC;background-color:#EFEFEF;width:20px;height:20px;}';
	cis[cis.length] ='input.b {border: 1px solid #CCCCCC;background-color:#EFEFEF;width:100%;height:20px;}';
	cis[cis.length] ='-->';
	cis[cis.length] ='<\/style>';
	cis[cis.length] ='<\/head>';
	cis[cis.length] ='<body>';
	cis[cis.length] ='<\/body>';
	cis[cis.length] ='<\/html>';
	__ci.document.writeln(cis.join(""));
	__ci.document.close();
};

Calendar.prototype.CalcuValue = function(){
	
	let calendar = this;


	let date2StringPattern = ''
	
	if (!this.isDateOnly) {
		let hour = parseInt(this.form._hour.value,10);
		let min = parseInt(this.form._min.value,10);
		let sec = parseInt(this.form._sec.value,10);

		if (isNaN(hour) || isNaN(min) || isNaN(sec)) {
			return;
		}


		if (hour >23) {hour = 23}
		if (hour < 0) {hour = 0}
		
		if (min >59) {min = 59}
		if (min < 0) {min = 0}
		
		if (sec >59) {sec = 59}
		if (sec < 0) {sec = 0}

		this.date.setHours(hour);
		this.date.setMinutes(min);
		this.date.setSeconds(sec);

		date2StringPattern = this.date2StringPattern + ' hh:mm:ss'
	}else{
		this.date.setHours(0);
		this.date.setMinutes(0);
		this.date.setSeconds(0);
		date2StringPattern = this.date2StringPattern
	}
	if (this.dateControl) {
		this.dateControl.value = this.date.format(date2StringPattern)
	}

}

Calendar.prototype.draw = function() {
	let calendar = this;
	
	var _cs = [];
	_cs[_cs.length] = '<form id="__calendarForm" name="__calendarForm" method="post">';
	_cs[_cs.length] = '<table id="__calendarTable" width="100%" border="0" cellpadding="3" cellspacing="1" align="center">';
	_cs[_cs.length] = ' <tr>';
	_cs[_cs.length] = '  <th><input class="l" name="goPrevMonthButton" type="button" id="goPrevMonthButton" value="&lt;" \/><\/th>';
	_cs[_cs.length] = '  <th colspan="5"><select class="year" name="yearSelect" id="yearSelect"><\/select><select class="month" name="monthSelect" id="monthSelect"><\/select><\/th>';
	_cs[_cs.length] = '  <th><input class="r" name="goNextMonthButton" type="button" id="goNextMonthButton" value="&gt;" \/><\/th>';
	_cs[_cs.length] = ' <\/tr>';
	_cs[_cs.length] = ' <tr>';
	for(var i = 0; i < 7; i++) {
		_cs[_cs.length] = '<th class="theader">';
		_cs[_cs.length] = Calendar.language["weeks"][0][i];
		_cs[_cs.length] = '<\/th>';
	}
	_cs[_cs.length] = '<\/tr>';
	for(var i = 0; i < 6; i++){
		_cs[_cs.length] = '<tr align="center">';
		for(var j = 0; j < 7; j++) {
			switch (j) {
				case 0: _cs[_cs.length] = '<td class="sun">&nbsp;<\/td>'; break;
				case 6: _cs[_cs.length] = '<td class="sat">&nbsp;<\/td>'; break;
				default:_cs[_cs.length] = '<td class="normal">&nbsp;<\/td>'; break;
			}
		}
		_cs[_cs.length] = '<\/tr>';
	}
/*	_cs[_cs.length] = ' <tr>';
	_cs[_cs.length] = '  <th colspan="2"><input type="button" class="b" name="clearButton" id="clearButton" \/><\/th>';
	_cs[_cs.length] = '  <th colspan="3"><input type="button" class="b" name="selectTodayButton" id="selectTodayButton" \/><\/th>';
	_cs[_cs.length] = '  <th colspan="2"><input type="button" class="b" name="closeButton" id="closeButton" \/><\/th>';
	_cs[_cs.length] = ' <\/tr>';
*/	
	if (!this.isDateOnly) {
		_cs[_cs.length] = ' <tr>';
		_cs[_cs.length] = '  <th colspan="5">	\
			<input type="text"  name="_hour"  id="_hour" value="' +this.date.getHours() + '" style="width:21px;height:15px" /> -\
			<input type="text" name="_min" id="_min"  value="' +this.date.getMinutes() + '"  style="width:21px;height:15px" /> - \
			<input type="text"  name="_sec" id="_sec" value="' +this.date.getSeconds() + '"  style="width:21px;height:15px" />   \
			<\/th>';
		_cs[_cs.length] = '  <th colspan="2"><img  id="closeButton" src="static/images/ok.png" width="25" height="25"><\/th>';
		_cs[_cs.length] = ' <\/tr>';
	}


	_cs[_cs.length] = '<\/table>';
	_cs[_cs.length] = '<\/form>';
	
	this.iframe.document.body.innerHTML = _cs.join("");
	this.form = this.iframe.document.forms["__calendarForm"];

/*	this.form.clearButton.value = Calendar.language["clear"][this.language];
	this.form.selectTodayButton.value = Calendar.language["today"][this.language];
	this.form.closeButton.value = Calendar.language["close"][this.language];
*/	
	this.form.goPrevMonthButton.onclick = function () {calendar.goPrevMonth(this);}
	this.form.goNextMonthButton.onclick = function () {calendar.goNextMonth(this);}
	this.form.yearSelect.onchange = function () {calendar.update(this);}
	this.form.monthSelect.onchange = function () {calendar.update(this);}
	if(!this.AlwaysShow){
	    this.form.yearSelect.onblur = function () {calendar.hide();}
	    this.form.monthSelect.onblur = function () {calendar.hide();}
	  }

	if(!this.isDateOnly){
		this.form.closeButton.onclick = function () {
		
			calendar.hide();
		}
	}

/*	this.form.clearButton.onclick = function () {calendar.dateControl.value = "";calendar.hide();}
	this.form.closeButton.onclick = function () {calendar.hide();}
	this.form.selectTodayButton.onclick = function () {
		var today = new Date();
		calendar.date = today;
		calendar.year = today.getFullYear();
		calendar.month = today.getMonth();
		calendar.dateControl.value = today.format(calendar.date2StringPattern);
		calendar.hide();
	}*/
};

Calendar.prototype.bindYear = function() {
	var ys = this.form.yearSelect;
	ys.length = 0;
	for (var i = this.beginYear; i <= this.endYear; i++){
		ys.options[ys.length] = new Option(i + Calendar.language["year"][0], i);
	}
};

Calendar.prototype.bindMonth = function() {
	var ms = this.form.monthSelect;
	ms.length = 0;
	for (var i = 0; i < 12; i++){
		ms.options[ms.length] = new Option(Calendar.language["months"][0][i], i);
	}
};

Calendar.prototype.goPrevMonth = function(e){
	if (this.year == this.beginYear && this.month == 0){return;}
	this.month--;
	if (this.month == -1) {
		this.year--;
		this.month = 11;
	}
	this.date = new Date(this.year, this.month, 1);
	this.changeSelect();
	this.bindData();
};

Calendar.prototype.goNextMonth = function(e){
	if (this.year == this.endYear && this.month == 11){return;}
	this.month++;
	if (this.month == 12) {
		this.year++;
		this.month = 0;
	}
	this.date = new Date(this.year, this.month, 1);
	this.changeSelect();
	this.bindData();
};

Calendar.prototype.changeSelect = function() {
	var ys = this.form.yearSelect;
	var ms = this.form.monthSelect;
	for (var i= 0; i < ys.length; i++){
		if (ys.options[i].value == this.date.getFullYear()){
			ys[i].selected = true;
			break;
		}
	}
	for (var i= 0; i < ms.length; i++){
		if (ms.options[i].value == this.date.getMonth()){
			ms[i].selected = true;
			break;
		}
	}
};

Calendar.prototype.update = function (e){
	this.year  = e.form.yearSelect.options[e.form.yearSelect.selectedIndex].value;
	this.month = e.form.monthSelect.options[e.form.monthSelect.selectedIndex].value;
	this.date = new Date(this.year, this.month, 1);
	this.changeSelect();
	this.bindData();
};

Calendar.prototype.bindData = function () {
	var calendar = this;
	var dateArray = this.getMonthViewDateArray(this.date.getFullYear(), this.date.getMonth());
	var tds = this.getElementsByTagName("td", this.getElementById("__calendarTable", this.iframe.document));
	for(var i = 0; i < tds.length; i++) {
  		tds[i].style.backgroundColor = calendar.colors["bg_over"];
		tds[i].onclick = null;
		tds[i].onmouseover = null;
		tds[i].onmouseout = null;
		if (calendar.theme == 'gray') {
			tds[i].innerHTML = dateArray[i]?('<a>'+dateArray[i]+'</a>') : "&nbsp;";
		}else{
			tds[i].innerHTML = dateArray[i] || "&nbsp;";
		}
		
		
		if (i > dateArray.length - 1) continue;
		let day = dateArray[i];
		if (dateArray[i]){
			tds[i].onclick = function () {
		
				calendar.date.setDate(parseInt(day,10))

				if(calendar.hide_cb){
					if($('#__calendarPanel').is(":visible")){calendar.hide();}
				}else{
					calendar.CalcuValue()
				}
				
			}
			tds[i].onmouseover = function () {this.style.backgroundColor = calendar.colors["bg_out"];}
			tds[i].onmouseout  = function () {this.style.backgroundColor = calendar.colors["bg_over"];}
			var today = new Date();
			if (today.getFullYear() == calendar.date.getFullYear()) {
				if (today.getMonth() == calendar.date.getMonth()) {
					if (today.getDate() == dateArray[i]) {
						tds[i].style.backgroundColor = calendar.colors["bg_cur_day"];
						tds[i].onmouseover = function () {this.style.backgroundColor = calendar.colors["bg_out"];}
						tds[i].onmouseout  = function () {this.style.backgroundColor = calendar.colors["bg_cur_day"];}
					}
				}
			}
		}//end if
	}//end for
};

Calendar.prototype.getMonthViewDateArray = function (y, m) {
	var dateArray = new Array(42);
	var dayOfFirstDate = new Date(y, m, 1).getDay();
	var dateCountOfMonth = new Date(y, m + 1, 0).getDate();
	for (var i = 0; i < dateCountOfMonth; i++) {
		dateArray[i + dayOfFirstDate] = i + 1;
	}
	return dateArray;
};

Calendar.prototype.show = function (dateControl,hide_cb) {

/*	if (this.panel.style.display == "block") {
		this.panel.style.display = "none";
	}*/ 
	setTimeout(function () {

		if (!dateControl){
			throw new Error("arguments[0] is necessary!")
		}

		if($('#__calendarPanel').is(":visible") == false || dateControl != this.dateControl){

			this.dateControl = dateControl;
			let string2DatePattern = ''
			if (dateControl.value.length > 0)
			{
				if (dateControl.isDateOnly) {
					this.isDateOnly = true;
					string2DatePattern = this.date2StringPattern;
				}else{

					this.isDateOnly = false;
					string2DatePattern = this.date2StringPattern + ' hh:mm:ss';
				}
				this.AlwaysShow = dateControl.AlwaysShow?true:false;

				this.date = dateControl.value.toDate(string2DatePattern)

			}else{
				return;
			}

			this.year = this.date.getFullYear();
			this.month = this.date.getMonth();
			this.day = this.date.getDay();

			this.draw();
			this.bindYear();
			this.bindMonth();

			this.changeSelect();
			this.bindData();

			this.repos();

			this.panel.style.display = "block";

			this.hide_cb = hide_cb;

			if(hide_cb){
				/*$(dateControl).bind('blur',(e)=>{
                    msg([e,e.target]);
                    this.hide();
                })*/

				var timer;
				$(dateControl).bind('blur', (e)=>{
					//msg('blur')
					//   timer = setTimeout(function(){
					this.hide();
					//    }.bind(this),250);
				});
				addWheelListener(dateControl, ev => {
					this.hide();
				});
				$('#__calendarPanel').bind('mouseenter',()=>{
					if(timer) {
						msg("clear hide timer!")
						clearTimeout(timer);

					}
					$(dateControl).unbind("blur");
				});

				$('#__calendarPanel').bind('mouseleave',(e)=>{
					msg([e,e.target]);
					var o = e.relatedTarget || e.toElement;
					if (!o) return; //增加移动到的对象判断
					if(!this.AlwaysShow) {
						this.hide();
					}
				})
			}
		}else{

			this.repos();
		}
	}.bind(this),200)


    
        
};
function addWheelListener(elem, callback, useCapture = false) {
	var prefix = "",
		_addEventListener,
		support;
	// detect event model
	if (window.addEventListener) {
		_addEventListener = "addEventListener";
	} else {
		_addEventListener = "attachEvent";
		prefix = "on";
	}
	// detect available wheel event
	support =
		"onwheel" in document.createElement("div")
			? "wheel" // 各个厂商的高版本浏览器都支持"wheel"
			: document["onmousewheel"] !== undefined
			? "mousewheel" // Webkit 和 IE一定支持"mousewheel"
			: "DOMMouseScroll"; // 低版本firefox
	_addWheelListener(elem, support, callback, useCapture);
	// handle MozMousePixelScroll in older Firefox
	if (support == "DOMMouseScroll") {
		_addWheelListener(elem, "MozMousePixelScroll", callback, useCapture);
	}
	function _addWheelListener(elem, eventName, callback, useCapture) {
		elem[_addEventListener](
			prefix + eventName,
			support == "wheel"
				? callback
				: function(originalEvent) {
					!originalEvent && (originalEvent = window.event);
					// create a normalized event object
					var event = {
						// keep a ref to the original event object
						originalEvent: originalEvent,
						target: originalEvent.target || originalEvent.srcElement,
						type: "wheel",
						deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
						deltaX: 0,
						deltaZ: 0,
						preventDefault: function() {
							originalEvent.preventDefault ? originalEvent.preventDefault() : (originalEvent.returnValue = false);
						},
					};
					// calculate deltaY (and deltaX) according to the event
					if (support == "mousewheel") {
						event["deltaY"] = (-1 / 40) * originalEvent.wheelDelta;
						// Webkit also support wheelDeltaX
						originalEvent.wheelDeltaX && (event.deltaX = (-1 / 40) * originalEvent.wheelDeltaX);
					} else {
						event["deltaY"] = originalEvent.detail;
					}
					// it's time to fire the callback
					return callback(event);
				},
			useCapture || false,
		);
	}
}
//new add
Calendar.prototype.repos = function() {

	//this.panel.style.left = xy.x + "px";
	var p = this.dateControl;
	if(!p)return;
	/*while(p = p.parentNode){
		
		if(p.className == 'main_right_mid' && p.tagName.toUpperCase() != 'BODY'){
			break;
		}
	}*/
	var _left = this.getAbsPoint(p).x;
	//var padpixel = (p.getBoundingClientRect().width - 202)/2;
	//console.log([_left,this.dateControl.style.left,padpixel]);
		
	var _top = this.getAbsPoint(p).y;
	//pos the control
	this.panel.style.left = (_left) +"px";
	this.panel.style.top = (_top + p.offsetHeight+2) + "px";


};
Calendar.prototype.hide = function() {

	if(this.panel.style.display == "none")return;

	this.CalcuValue();

	this.iframe.document.body.innerHTML = "";

	this.panel.style.display = "none";

	if (this.hide_cb) {
		$('#__calendarPanel').unbind('mouseleave mouseenter');
		this.hide_cb(this.dateControl);
	}
	$(this.dateControl).focus();

};

Calendar.prototype.getElementById = function(id, object){
	object = object || document;
	return document.getElementById ? object.getElementById(id) : document.all(id);
};

Calendar.prototype.getElementsByTagName = function(tagName, object){
	object = object || document;
	return document.getElementsByTagName ? object.getElementsByTagName(tagName) : document.all.tags(tagName);
};

Calendar.prototype.getAbsPoint = function (e){

	var x = $(e).offset().left;//e.offsetLeft;
	var y = $(e).offset().top;//e.offsetTop;
	// while(e = e.offsetParent){
	// 	x += e.offsetLeft;
	// 	y += e.offsetTop;
	// }
	return {"x": x, "y": y};
};

/**
 * @param   d the delimiter
 * @param   p the pattern of your date
 * @author  meizz
 * @author  kimsoft add w+ pattern
 */
/*
Date.prototype.format = function(style) {
	var o = {
		"M+" : this.getMonth() + 1, //month
		"d+" : this.getDate(),      //day
		"h+" : this.getHours(),     //hour
		"m+" : this.getMinutes(),   //minute
		"s+" : this.getSeconds(),   //second
		"w+" : "\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".charAt(this.getDay()),   //week
		"q+" : Math.floor((this.getMonth() + 3) / 3),  //quarter
		"S"  : this.getMilliseconds() //millisecond
	}
	if (/(y+)/.test(style)) {
		style = style.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for(var k in o){
		if (new RegExp("("+ k +")").test(style)){
			style = style.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return style;
};*/

/**
 * @param d the delimiter
 * @param p the pattern of your date
 * @rebuilder kimsoft
 * @version build 2006.12.15
 */
/*
String.prototype.toDate = function(delimiter, pattern) {
	delimiter = delimiter || "-";
	pattern = pattern || "ymd";
	var a = this.split(delimiter);
	var y = parseInt(a[pattern.indexOf("y")], 10);
	//remember to change this next century ;)
	if(y.toString().length <= 2) y += 2000;
	if(isNaN(y)) y = new Date().getFullYear();
	var m = parseInt(a[pattern.indexOf("m")], 10) - 1;
	var d = parseInt(a[pattern.indexOf("d")], 10);
	if(isNaN(d)) d = 1;
	return new Date(y, m, d);
};*/


//使用方法：  
//"2015-5-5 9:10:10".toDate("yyyy-M-d hh:mm:ss")  
//"2015/5/5 9:10:10".toDate("yyyy/M/d hh:mm:ss")  
String.prototype.toDate = function(style) {
  var y = this.substring(style.indexOf('y'),style.lastIndexOf('y')+1);//年
  var M = this.substring(style.indexOf('M'),style.lastIndexOf('M')+1);//月
  var d = this.substring(style.indexOf('d'),style.lastIndexOf('d')+1);//日
  var h = this.substring(style.indexOf('h'),style.lastIndexOf('h')+1);//时
  var m = this.substring(style.indexOf('m'),style.lastIndexOf('m')+1);//分
  var s = this.substring(style.indexOf('s'),style.lastIndexOf('s')+1);//秒

  if(s == null ||s == "" || isNaN(s)) {s = new Date().getSeconds();}
  if(m == null ||m == "" || isNaN(m)) {m = new Date().getMinutes();}
  if(h == null ||h == "" || isNaN(h)) {h = new Date().getHours();}
  if(d == null ||d == "" || isNaN(d)) {d = new Date().getDate();}
  if(M == null ||M == "" || isNaN(M)) {M = new Date().getMonth()+1;}
  if(y == null ||y == "" || isNaN(y)) {y = new Date().getFullYear();}
  var dt ;
  eval ("dt = new Date('"+ y+"', '"+(M-1)+"','"+ d+"','"+ h+"','"+ m+"','"+ s +"')");
  return dt;
} 

/*
var divs = [];
divs[divs.length] = '<div id="__calendarPanel" style="position:absolute;display:none;background-color:#000000;border:1px solid #666666;width:200px;height:200px;z-index: 999;">';
divs[divs.length] = '<iframe name="__calendarIframe" id="__calendarIframe" width="100%" height="100%" scrolling="no" frameborder="0" style="margin:0px;"><\/iframe>';
divs[divs.length] = '<\/div>';
document.write(divs.join(""));
*/
/*
var __ci = window.frames['__calendarIframe'];
var cis = [];
cis[cis.length] ='<!DOCTYPE html PUBLIC "-\/\/W3C\/\/DTD XHTML 1.0 Transitional\/\/EN" "http:\/\/www.w3.org\/TR\/xhtml1\/DTD\/xhtml1-transitional.dtd">';
cis[cis.length] ='<html xmlns="http:\/\/www.w3.org\/1999\/xhtml">';
cis[cis.length] ='<head>';
cis[cis.length] ='<meta http-equiv="Content-Type" content="text\/html; charset=utf-8" \/>';
cis[cis.length] ='<title>Web Calendar(UTF-8) Written By KimSoft<\/title>';
cis[cis.length] ='<style type="text\/css">';
cis[cis.length] ='<!--';
cis[cis.length] ='body {font-size:12px;margin:0px;text-align:center;}';
cis[cis.length] ='form {margin:0px;}';
cis[cis.length] ='select {font-size:12px;background-color:#EFEFEF;}';
cis[cis.length] ='table {border:0px solid #CCCCCC;background-color:#343434;color:#808080}';
cis[cis.length] ='th {font-size:12px;font-weight:normal;background-color:#000000;}';
cis[cis.length] ='th.theader {font-weight:normal;background-color:#666666;color:#FFFFFF;width:24px;}';
cis[cis.length] ='select.year {width:64px;}';
cis[cis.length] ='select.month {width:60px;}';
cis[cis.length] ='td {font-size:12px;text-align:center;}';
/*
cis[cis.length] ='td.sat {color:#508FC2;background-color:#EFEFEF;}';
cis[cis.length] ='td.sun {color:#FE8F01;background-color:#EFEFEF;}';
cis[cis.length] ='td.normal {background-color:#336699;}';*/
/*
cis[cis.length] ='input.l {border: 1px solid #CCCCCC;background-color:#EFEFEF;width:20px;height:20px;}';
cis[cis.length] ='input.r {border: 1px solid #CCCCCC;background-color:#EFEFEF;width:20px;height:20px;}';
cis[cis.length] ='input.b {border: 1px solid #CCCCCC;background-color:#EFEFEF;width:100%;height:20px;}';
cis[cis.length] ='-->';
cis[cis.length] ='<\/style>';
cis[cis.length] ='<\/head>';
cis[cis.length] ='<body>';
cis[cis.length] ='<\/body>';
cis[cis.length] ='<\/html>';
__ci.document.writeln(cis.join(""));
__ci.document.close();
*/
//-->
//
