import { throttle, debounce } from 'common/util';

/**
 * 类c的格式化替换函数,简易版
 *
 * @returns
 */
const printf = function() {
    var num = arguments.length;
    var oStr = arguments[0];
    for (var i = 1; i < num; i++) {
        var pattern = '\\{' + (i - 1) + '\\}';
        var re = new RegExp(pattern, 'g');
        oStr = oStr.replace(re, arguments[i]);
    }
    return oStr;
};

/*
var va = {};

function unique(arr){
    var hashTable = {}, newArr = [];
    for(var i = 0;i < arr.length;i++){
        if(!hashTable[arr[i]]){
            hashTable[arr[i]] = true;
            newArr.push(arr[i]);
        }
    }
    return newArr;
}
*/
function addClass(dom, _class) {
    var hasClass = !!dom.className.match(new RegExp('(\\s|^)' + _class + '(\\s|$)'));
    if (!hasClass) {
        dom.className += ' ' + _class;
    }
}
function removeClass(dom, _class) {
    var hasClass = !!dom.className.match(new RegExp('(\\s|^)' + _class + '(\\s|$)'));
    if (hasClass) {
        dom.className = dom.className.replace(_class);
    }
}








import * as RULES from 'common/util';

const CheckRulesMapinfo = {
    NOVOID: {
        beforeCheck: function() {},
        checked: function(current_val) {
            return RULES.CheckNull(current_val);
        },
        afterCheck: function(limit_range, lang) {
            return lang['i18n_notnull_error'];
        },
    },
    IP: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            return RULES.checkIp(current_val);
        },
        afterCheck: function(limit_range, lang) {
            return lang['i18n_ip_error'];
        },
    },
    /* Port: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            // RULES.isPort;
        },
        afterCheck: function(limit_range, lang) {},
    },
    PortV2: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            // RULES.isPortV2;
        },
        afterCheck: function(limit_range, lang) {},
    },*/
    Number: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range) {
            return RULES.isNum(current_val, limit_range);
        },
        afterCheck: function(limit_range, lang) {
            //range detect
            if (limit_range) {
                return `${lang['i18n_number_error']}${lang['i18n_range_error']}[${limit_range.toString()}]`;
            } else {
                return lang['i18n_number_error'];
            }
        },
    },
    //'Range':{beforeCheck:function(){},checked: function(current_val, limit_rangevnode){RULES.Range,
    GeneralPwd: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            return RULES.CheckGeneralPwd(current_val);
        },
        afterCheck: function(limit_range, lang) {
            return lang['i18n_generalpwd_error'];
        },
    },
    TTL: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            return RULES.isTTL(current_val);
        },
        afterCheck: function(lang) {},
    },
    Email: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            return RULES.CheckEmailAddress(current_val);
        },
        afterCheck: function(limit_range, lang) {
            return lang['i18n_email_error'];
        },
    },
    UserName: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            return RULES.CheckUserName(current_val);
        },
        afterCheck: function(limit_range, lang) {
            return lang['i18n_username_error'];
        },
    },
    UserPwd: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            return RULES.CheckPwd(current_val);
        },
        afterCheck: function(limit_range, lang, inputObj) {
            if (parseInt(inputObj.expression) === 1) {
                return lang['i18n_password_error_1'];
            } else if (parseInt(inputObj.expression) === 2) {
                return lang['i18n_password_error_2'];
            } else {
                return lang['i18n_password_error'];
            }
        },
    },
    DateTime: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            return RULES.isDateTimeString(current_val);
        },
        afterCheck: function(limit_range, lang) {
            return lang['i18n_time_error'];
        },
    },
    NameLength: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            return RULES.GetLength_UTF8(current_val);
        },
        afterCheck: function(limit_range, lang) {
            return lang['i18n_namelength_error'];
        },
    },
    MultiOSDLength: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range) {
            return RULES.GetMultiOSDLength(current_val, limit_range);
        },
        afterCheck: function(limit_range, lang) {
            return printf(lang['i18n_multiosdlength_error'], limit_range.max_col_bytes_count, limit_range.max_row_count);
        },
    },
    GMT: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            return RULES.GMT_Check(current_val);
        },
        afterCheck: function(limit_range, lang) {
            return lang['i18n_gmt_error'];
        },
    },
    //liuxin add 时区微调用来过滤有效输入
    UTC: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            return RULES.UTC_Micro(current_val);
        },
        afterCheck: function(limit_range, lang) {
            return lang['i18n_UTC_Micro_error'];
        },
    },
    //liuxin add 时区微调用来过滤有效输入
    MarkText: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            return RULES.checkMarkText(current_val);
        },
        afterCheck: function(limit_range, lang) {
            return lang['i18n_marktext_error'];
        },
    },
    Url: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            return RULES.checkUrl(current_val);
        },
        afterCheck: function(limit_range, lang) {
            return lang['i18n_wrongUrl'];
        },
    },
    MACAddr: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            return RULES.checkMAC(current_val);
        },
        afterCheck: function(limit_range, lang) {
            return lang['i18n_wrongMACAddr'];
        },
    },
    NTPAddr: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            return RULES.checkNTPAddr(current_val);
        },
        afterCheck: function(limit_range, lang) {
            return lang['i18n_wrongNTPAddr'];
        },
    },
    StrLength: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            return RULES.CheckStrLength(current_val, limit_range);
        },
        afterCheck: function(limit_range, lang) {
            return `${lang['i18n_str_range_error']}[${limit_range.toString()}]`;
        },
    },
    DTMFKey: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            return RULES.CheckDTMFKey(current_val);
        },
        afterCheck: function(limit_range, lang) {
            return lang['i18n_DTMFKey_error'];
        },
    },
    DomainName: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            return RULES.CheckDomainName(current_val);
        },
        afterCheck: function(limit_range, lang) {
            return lang['i18n_DomainName_error'];
        },
    },
    Float: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            msg('Float checked!!!!!!');
            return RULES.isFloat(current_val, limit_range);
        },
        afterCheck: function(limit_range, lang) {
            {
                if (limit_range) {
                    return `${lang['i18n_number_error']}${lang['i18n_range_error']}[${limit_range.toString()}]`;
                } else {
                    return lang['i18n_number_error'];
                }
            }
        },
    },
    Separator: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            return RULES.CheckNameSeparator(current_val);
        },
        afterCheck: function(limit_range, lang) {
            return lang['i18n_Separator_error'];
        },
    },
    FlieName: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            return RULES.CheckFileName(current_val);
        },
        afterCheck: function(limit_range, lang) {
            return lang['i18n_FlieName_error'];
        },
    },
    CallNum: {
        beforeCheck: function() {},
        checked: function(current_val, limit_range, vnode) {
            return RULES.CheckcallNumber(current_val);
        },
        afterCheck: function(limit_range, lang) {
            return lang['i18n_CallNum_error'];
        },
    },
};

//正则表
const regList = {
    ImgCode: /^[0-9a-zA-Z]{4}$/,
    SmsCode: /^\d{4}$/,
    MailCode: /^\d{4}$/,
    UserName: /^[\w|\d]{4,16}$/,
    Password: /^[\w!@#$%^&*.]{6,16}$/,
    Mobile: /^1[3|5|8]\d{9}$/,
    RealName: /^[\u4e00-\u9fa5 ]{2,10}$/,
    BankNum: /^\d{10,19}$/,
    Money: /^([1-9]\d*|0)$/,
    Answer: /^\S+$/,
    Mail: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
};

function getParentScollTop(p, top) {
    if (p.parentNode) {
        if (p.parentNode.scrollTop) {
            top += p.parentNode.scrollTop;
        }
        return getParentScollTop(p.parentNode, top);
    }
    return top;
}

function show_error_tip(control, errStr) {
    let ctrl = $('.poptip').get(0);
    let p = control;
    let Scolltop = 0;
    let top = getParentScollTop(p, Scolltop);
    let x = p.offsetLeft;
    let y = p.offsetTop - top;
    while ((p = p.offsetParent)) {
        x += p.offsetLeft;
        y += p.offsetTop;
    }

    let direction = $(control).attr('direction') || 'bottom'; //default

    if (!ctrl) {
        $('body').append(
            '<div class="poptip"> <span class="poptip-arrow poptip-arrow-' +
                direction +
                '"><em>◆</em><i>◆</i></span><div style="max-width:200px;white-space:normal;/*word-break:break-all;*/word-wrap:break-word; ">' +
                errStr +
                '</div></div>'
        );

        let w = $('.poptip').outerWidth();
        let h = $('.poptip').outerHeight();
        //       msg([w,h])

        let left = 0;
        let top = 0;
        switch (direction) {
            case 'top':
                left = x;
                top = y + $(control).outerHeight();
                break;
            case 'left':
                top = y;
                left = x + $(control).outerWidth();
                break;
            case 'right':
                top = y;
                left = x - w;
                break;
            case 'bottom':
                left = x;
                top = y - h;
                break;
            default:
                left = x;
                top = y - h;
        }

        $('.poptip').css({
            left: left + 'px',
            top: top + 'px',
        });
    }
}

function remove_error_tip() {
    $('.poptip').remove();
}

export default {
    install(Vue, options) {
        Vue.directive('validator', {
            bind: function(el, binding, vnode) {
                let vm = vnode.context;

                let inputObj = {
                    name: binding.name,
                    value: binding.value,
                    expression: binding.expression,
                    argument: binding.arg,
                    modifiers: binding.modifiers,
                    tag: el.tagName,
                };
                if ($(el).hasClass('el-textarea')) {
                    el = el.children[0];
                }

                $(el).bind('blur', function() {
                    remove_error_tip();
                });

                function check_rules() {
                    let base_rules = inputObj.argument.split(':');

                    let current_val = $(this).val();
                    for (let rulename of base_rules) {
                        //替换
                        let expression = inputObj.expression;
                        if (expression && expression.match(/^\w+/)) {
                            msg([expression, vm[expression]]);
                            expression = vm[expression];
                        }

                        //  let {} = CheckRulesMapinfo[rulename].beforeCheck(el, inputObj, vnode);
                        let limit = undefined;
                        //限制放到modifiers中
                        //兼容以前的写法
                        if (expression) {
                            try {
                                let tmp = JSON.parse(expression);
                                if (Array.isArray(tmp)) {
                                    limit = tmp;
                                }
                            } catch (e) {
                                //显示设置{max_col_bytes_count, max_row_count}
                                if (RULES.is_object(inputObj.value)) {
                                    limit = inputObj.value;
                                }
                            }
                        } else if (inputObj.modifiers.max && inputObj.modifiers.min) {
                            //新的写法
                            limit = [$(this).attr('min'), $(this).attr('max')];
                        }
                        let ret = CheckRulesMapinfo[rulename].checked(current_val, limit);

                        if (!ret) {
                            $(el).addClass('input_check_error');

                            let errStr = CheckRulesMapinfo[rulename].afterCheck(limit, vm.$store.getters.current_language, inputObj);
                            $(el).hover(
                                function(e) {
                                    remove_error_tip();
                                    show_error_tip(el, errStr);
                                },
                                function(e) {
                                    remove_error_tip();
                                }
                            );

                            remove_error_tip();
                            show_error_tip(el, errStr);
                            break;
                        } else {
                            remove_error_tip();
                            $(el).removeClass('input_check_error');
                            $(el)
                                .unbind('mouseenter')
                                .unbind('mouseleave');
                        }
                    }
                }

                let wrapper_fn = debounce(check_rules, 250);

                $(el).bind('input propertychange', wrapper_fn);
                //fuck ie <= 9, texarea 删除字符不能触发input propertychange，用keyup来检测
                if (
                    navigator.appName == 'Microsoft Internet Explorer' &&
                    parseInt(
                        navigator.appVersion
                            .split(';')[1]
                            .replace(/[ ]/g, '')
                            .replace('MSIE', '')
                    ) == 9
                ) {
                    msg('Fucking browser is IE 9!!');

                    $(el).bind('cut keyup paste', wrapper_fn);
                }
            },

            update: function(el, binding, vnode) {
               // msg('update', el, binding, vnode);
            },

            unbind: function(el, binding, vnode) {
                $(el)
                    .unbind('input')
                    .unbind('propertychange')
                    .unbind('keyup')
                    .unbind('cut')
                    .unbind('paste');
            },
        });
    },
};
