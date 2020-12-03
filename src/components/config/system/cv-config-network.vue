<template>
    <div class="main_con_k clearfix" style="width:850px;margin: 95px auto 0">
        <div class="main_con_top_ss" style="width:500px;background-size:100% 100%">
            <div class="fl pl10 bold"><label v-tr="i18n_multicard"></label></div>
        </div>

        <div class="main_con_mid_ss" style="width:478px">
            <div class="w100 pt1">
                <div style="float: left;height:95%;width: 100%;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">

                        <!--liuxin add 增加网卡选项 && 网络状态 && 调整 mac 显示位置-->
                        <tr v-show="ui_custom.netIndex.visible">
                            <td align="right"><label v-tr="i18n_netIndex"></label>:&nbsp;</td>
                            <td align="left" colspan="2">
                                <select style="width:200px;" class="textc" id="selNI" v-model="changeNetIndex"> <!--v-model="d_cap.current_index"-->
                                    <option v-for="item in d_cap.net_info" :value="item[1]">{{item[0]}}</option>
                                </select>
                            </td>
                        </tr>
                        <tr v-show="ui_custom.netStat.visible">
                            <td align="right"><label v-tr="i18n_netStat"></label>:&nbsp;</td>
                            <td align="left" colspan="2">
                                <input type="text" disabled="true" class="textc" style="width: 220px" v-model="d_cap.net_info_all[d_cap.current_index].NetInterface" />
                            </td>
                        </tr>
                        <tr v-show="ui_custom.mac.visible">
                            <td align="right"><label v-tr="i18n_mac"></label>:&nbsp;</td>
                            <td align="left" colspan="2">
                                <input type="text" disabled="true" class="textc" style="width: 220px" v-model="d_cap.net_info_all[d_cap.current_index].MACAddr" />
                            </td>
                        </tr>
                        <!--liuxin add 增加网卡选项 && 网络状态 && 调整 mac 显示位置-->
                        <tr>
                            <td align="right" width="20%">&nbsp;</td>
                            <td width="33%">IPv4&nbsp;DHCP<input type="radio" :value="1" v-model="d.UseDhcp" /></td>
                            <td align="left" width="33%">
                                <label v-tr="i18n_staticIP"></label>
                                <input type="radio" :value="0" v-model="d.UseDhcp" />
                            </td>
                        </tr>
                        <tr v-show="ui_custom.ipaddr.visible">
                            <td align="right"><label v-tr="i18n_ipAddr"></label>:&nbsp;</td>
                            <td align="left" colspan="2">
                                <input
                                    type="text"
                                    class="textc tip"
                                    data-title="i18n_ip_error"
                                    style="width: 220px"
                                    v-model="d_cap.net_info_all[d_cap.current_index].DVRIP"
                                    :disabled="!!d_cap.net_info_all[d_cap.current_index].UseDhcp"
                                    v-validator:NOVOID:IP
                                />
                            </td>
                        </tr>

                        <tr v-show="ui_custom.netmask.visible">
                            <td align="right"><label v-tr="i18n_netMask"></label>:&nbsp;</td>
                            <td align="left" colspan="2">
                                <input
                                    type="text"
                                    class="textc tip"
                                    data-title="i18n_ip_error"
                                    style="width: 220px"
                                    v-model="d_cap.net_info_all[d_cap.current_index].DVRIPMask"
                                    :disabled="!!d_cap.net_info_all[d_cap.current_index].UseDhcp"
                                    v-validator:NOVOID:IP
                                />
                            </td>
                        </tr>
                        <tr v-show="ui_custom.gateway.visible">
                            <td align="right"><label v-tr="i18n_gateWay"></label>:&nbsp;</td>
                            <td align="left" colspan="2">
                                <input
                                    type="text"
                                    class="textc tip"
                                    data-title="i18n_ip_error"
                                    style="width: 220px"
                                    v-model="d_cap.net_info_all[d_cap.current_index].GatewayIpAddr"
                                    :disabled="!!d_cap.net_info_all[d_cap.current_index].UseDhcp"
                                    v-validator:NOVOID:IP
                                />
                            </td>
                        </tr>
                        <!--liuxin add 增加自动DNS 选项-->
                        <tr>
                            <td align="right" width="20%">&nbsp;</td>
                            <td align="left" width="33%">
                                <label v-tr="i18n_dynamicDNS"></label>
                                <input type="radio" :value="1" v-model="d.AutoGetDnsAddr" />
                            </td>
                            <td align="left" width="33%">
                                <label v-tr="i18n_staticDNS"></label>
                                <input type="radio" :value="0" v-model="d.AutoGetDnsAddr" />
                            </td>
                        </tr>
                        <!--liuxin add 增加自动DNS 选项-->
                        <tr v-show="ui_custom.dns1.visible">
                            <td align="right"><label v-tr="i18n_dns1"></label>:&nbsp;</td>
                            <td align="left" colspan="2">
                                <input
                                    type="text"
                                    class="textc tip"
                                    data-title="i18n_ip_error"
                                    style="width: 220px"
                                    v-model="d_cap.net_info_all[d_cap.current_index].DnsServer1IpAddr"
                                    :disabled="!!d_cap.net_info_all[d_cap.current_index].AutoGetDnsAddr" 
                                    v-validator:NOVOID:IP
                                />
                            </td>
                        </tr>
                        <tr v-show="ui_custom.dns2.visible">
                            <td align="right"><label v-tr="i18n_dns2"></label>:&nbsp;</td>
                            <td align="left" colspan="2">
                                <input
                                    type="text"
                                    class="textc tip"
                                    data-title="i18n_ip_error"
                                    style="width: 220px"
                                    v-model="d_cap.net_info_all[d_cap.current_index].DnsServer2IpAddr"
                                    :disabled="!!d_cap.net_info_all[d_cap.current_index].AutoGetDnsAddr" 
                                    v-validator:NOVOID:IP
                                />
                            </td>
                        </tr>
                        <!--liuxin add 增加网卡选项 && 网络状态 && 调整 mac 显示位置-->
                        <!--<tr v-show="ui_custom.mac.visible">
                            <td align="right"><label v-tr="i18n_mac"></label>:&nbsp;</td>
                            <td align="left" colspan="2">
                                <input type="text" disabled="true" class="textc" style="width: 220px" v-model="d.MACAddr" />
                            </td>
                        </tr>-->
                        <!--liuxin add 增加网卡选项 && 网络状态 && 调整 mac 显示位置-->
                        <!-- IPV4 end -->
                        <!-- IPv6 -->
                        <!--<tr v-show="ui_custom.EnableDhcpV6.visible">
                            <td align="right">&nbsp;</td>
                            <td>IPv6&nbsp;DHCP<input type="radio" :value="1" v-model="d_cap.net_info_all[d_cap.current_index].EnableDhcpV6" /></td>
                            <td>
                                <label v-tr="i18n_staticIP"></label>
                                <input type="radio" :value="0" v-model="d_cap.net_info_all[d_cap.current_index].EnableDhcpV6" />
                            </td>
                        </tr>-->
                        <!-- IPv6 IP -->
                        <!--<tr v-show="ui_custom.IpV6Config.visible">
                            <td align="right"><label v-tr="i18n_ipAddr">IP</label>:&nbsp;</td>
                            <td align="left" colspan="2">
                                <input
                                    type="text"
                                    class="textc tip"
                                    data-title="i18n_ip_error"
                                    style="width: 220px"
                                    v-model="d_cap.net_info_all[d_cap.current_index].IpAddrV6"
                                    :disabled="!!d_cap.net_info_all[d_cap.current_index].EnableDhcpV6"
                                    v-validator:NOVOID:IP
                                />
                            </td>
                        </tr>-->
                        <!-- IPv6 子网前缀长度-->
                        <!--<tr v-show="ui_custom.IpV6Config.visible">
                            <td align="right"><label v-tr="i18n_subcode_prefix_length"></label>:&nbsp;</td>
                            <td align="left" colspan="2">
                                <input
                                    type="text"
                                    class="textc tip"
                                    data-title="i18n_ip_error"
                                    style="width: 220px"
                                    v-model="d.IpAddrV6PrefixLen"
                                    v-validator:NOVOID:Number="[0, 128]"
                                />
                            </td>
                        </tr>-->
                        <!-- IPv6 子网掩码-->
                        <!--<tr v-show="ui_custom.IpV6Config.visible">
                            <td align="right"><label v-tr="i18n_netMask">子网掩码</label>:&nbsp;</td>
                            <td align="left" colspan="2">
                                <input
                                    type="text"
                                    class="textc tip"
                                    data-title="i18n_ip_error"
                                    style="width: 220px"
                                    v-model="d_cap.net_info_all[d_cap.current_index].IpMaskV6"
                                    :disabled="!!d_cap.net_info_all[d_cap.current_index].EnableDhcpV6"
                                    v-validator:NOVOID:IP
                                />
                            </td>
                        </tr>-->
                        <!-- IPv6 网关地址-->
                        <!--<tr v-show="ui_custom.IpV6Config.visible">
                            <td align="right"><label v-tr="i18n_gateWay">网关地址</label>:&nbsp;</td>
                            <td align="left" colspan="2">
                                <input
                                    type="text"
                                    class="textc tip"
                                    data-title="i18n_ip_error"
                                    style="width: 220px"
                                    v-model="d_cap.net_info_all[d_cap.current_index].GatewayV6"
                                    :disabled="!!d_cap.net_info_all[d_cap.current_index].EnableDhcpV6"
                                    v-validator:NOVOID:IP
                                />
                            </td>
                        </tr>-->
                        <!-- IPv6 mac-->
                        <!--<tr v-show="ui_custom.IpV6Config.visible">
                            <td align="right"><label v-tr="i18n_mac"></label>:&nbsp;</td>
                            <td align="left" colspan="2">
                                <input type="text" disabled="true" class="textc" style="width: 220px" v-model="d_cap.net_info_all[d_cap.current_index].MACAddr" />
                            </td>
                        </tr>-->
                        <!--
                  <tr v-show="ui_custom.snmp_enable.visible">
                    <td align=right><label>SNMP</label>:&nbsp;</td>
                    <td align=left colspan="2">
                      <input type='checkbox' v-model="d.EnableSnmp"/>				</td>
                  </tr>
                  <tr v-show="ui_custom.snmp_hostip.visible">
                    <td align=right><label v-tr="i18n_snmpHostIp"></label>:&nbsp;</td>
                    <td align=left colspan="2">
                      <input type='text'  class="textc tip" data-title="i18n_ip_error" style="width:220px;" v-model="d.SnmpHostIp" :disabled="!d.EnableSnmp" v-validator:NOVOID:IP/>				</td>
                  </tr>
                  <tr v-show="ui_custom.snmp_count.visible">
                    <td align=right><label v-tr="i18n_snmpCount"></label>:&nbsp;</td>
                    <td align=left colspan="2">
                      <input type='text' class="textc tip" data-title="i18n_number_error" style="width:220px;" v-model="d.SnmpCount" :disabled="!d.EnableSnmp" v-validator:NOVOID:Number="[1,250]"/>				</td>
                  </tr>
                  <tr v-show="ui_custom.snmp_interval.visible">
                    <td align=right><label v-tr="i18n_snmpInterval"></label>:&nbsp;</td>
                    <td align=left colspan="2">
                      <input type='text'  class="textc tip" data-title="i18n_number_error" style="width:220px;" v-model="d.SnmpInterval" :disabled="!d.EnableSnmp" v-validator:NOVOID:Number="[2,250]"/>
                      <label>(2-250)</label></td>
                  </tr>
                -->
                    </table>
                </div>

                <!--<div style="float: right;height:95%;width: 50%;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%"> -->
                        <!--
                  <tr v-show="ui_custom.httpport.visible">
                    <td align=right><label v-tr="i18n_httpPort"></label>:&nbsp;</td>
                    <td align=left colspan="2" >

                      <input type='text' class='textc tip' data-title="i18n_port_error" style="width:220px;"  v-model="d.HttpPortNo" v-validator:NOVOID:Number="[1,65535]"/>

                    </td>

                  </tr>
                  <tr  v-show="ui_custom.httpsport.visible">
                    <td align=right><label v-tr="i18n_httpsPort"></label>:&nbsp;</td>
                    <td align=left >

                      <input type='text' class='textc tip' data-title="i18n_port_error"  v-model="d.HttpsPort" v-validator:NOVOID:Number="[1,65535]"/>
                      &nbsp;
                      <label v-tr="i18n_enableHttps"></label><input type='checkbox' v-model="d.EnableHttps"/>
                    </td>

                  </tr>
                  <tr  v-show="ui_custom.rtspport.visible">
                    <td align=right><label v-tr="i18n_rtspPort"></label>:&nbsp;</td>
                    <td align=left >

                      <input type='text' class='textc tip' data-title="i18n_number_error" style="width:220px;"  v-model="d.RtspPort" v-validator:NOVOID:Number="[1,65535]"/>
                    </td>

                  </tr>


                  <tr  v-show="ui_custom.rtspauth.visible">
                      <td align=right><label v-tr="i18n_rtspAuth"></label>:&nbsp;</td>
                      <td align=left >
                          <input type='checkbox' v-model="rtsp_auth_base64"/>
                          <label>HTTP-Base64</label>

                          <input type='checkbox' v-model="rtsp_auth_digest"/>
                          <label>HTTP-Digest</label>
                      </td>

                  </tr>


                  <tr v-show="ui_custom.rtmpport.visible">
                    <td align=right><label v-tr="i18n_rtmpPort"></label>:&nbsp;</td>
                    <td align=left >

                      <input type='text' class='textc tip' data-title="i18n_number_error" style="width:220px;"  v-model="d.RTMPPort" v-validator:NOVOID:Number="[1,65535]"/> 			</td>
                  </tr>
<!--
                  <tr v-show="ui_custom.upnp_enable.visible">
                    <td align=right><label v-tr="i18n_enableUPnp"></label>:&nbsp;</td>
                    <td align=left>
                      <input type='checkbox'   v-model="d.EnableUPNP"/>
                    </td>
                  </tr>



                  <tr v-show="ui_custom.devport.visible">
                    <td align=right><label v-tr="i18n_devPort"></label>:&nbsp;</td>
                    <td align=left>
                      <input type='text' class='textc tip' data-title="i18n_dvrport_error" style="width: 220px" v-model="d.DvrPort" v-validator:NOVOID:Number="[1024,65535]"/>
                    </td>
                  </tr>
-->

                    <!--    <tr v-show="ui_custom.pppoe_enable.visible">
                            <td align="right"><label v-tr="i18n_enablePPPoe"></label>:&nbsp;</td>
                            <td align="left">
                                <input type="checkbox" v-model="d_cap.net_info_all[d_cap.current_index].EnablePPPOE" />
                            </td>
                        </tr>
                        <tr v-show="ui_custom.pppoe_username.visible">
                            <td align="right"><label v-tr="i18n_username"></label>:&nbsp;</td>
                            <td align="left">
                                <input
                                    type="text"
                                    class="textc tip"
                                    data-title="i18n_generalpwd_error"
                                    style="width: 220px"
                                    v-model="d_cap.net_info_all[d_cap.current_index].PPPoEUser"
                                    :disabled="!d_cap.net_info_all[d_cap.current_index].EnablePPPOE"
                                />
                            </td>
                        </tr>

                        <tr v-show="ui_custom.pppoe_password.visible">
                            <td align="right"><label v-tr="i18n_password"></label>:&nbsp;</td>
                            <td align="left">
                                <input
                                    type="password"
                                    class="textc tip"
                                    data-title="i18n_generalpwd_error"
                                    style="width: 220px"
                                    v-model="d_cap.net_info_all[d_cap.current_index].PPPoEPassword"
                                    :disabled="!d_cap.net_info_all[d_cap.current_index].EnablePPPOE"
                                />
                            </td>
                        </tr>

                        <tr v-show="ui_custom.pppoe_confirm_pwd.visible">
                            <td align="right"><label v-tr="i18n_confirmPwd"></label>:&nbsp;</td>
                            <td align="left">
                                <input
                                    type="password"
                                    class="textc tip"
                                    data-title="i18n_generalpwd_error"
                                    style="width: 220px"
                                    v-model="PPPoEconfirmPwd"
                                    :disabled="!d_cap.net_info_all[d_cap.current_index].EnablePPPOE"
                                />
                            </td>
                        </tr>
                        <tr v-show="ui_custom.pppoe_addr.visible">
                            <td align="right"><label v-tr="i18n_PPPoeAddr"></label>:&nbsp;</td>
                            <td align="left">
                                <input
                                    type="text"
                                    class="textc tip"
                                    data-title="i18n_ip_error"
                                    style="width: 220px"
                                    v-model="d_cap.net_info_all[d_cap.current_index].PPPoEIP"
                                    :disabled="!d_cap.net_info_all[d_cap.current_index].EnablePPPOE"
                                    v-validator:NOVOID:IP
                                />
                            </td>
                        </tr>

                        <tr v-show="ui_custom.GatewayMACAddr.visible">
                            <td align="right">
                                <label v-tr="i18n_EnableBindGateway"><!-- 启用 --><!--</label>:&nbsp; -->
                           <!-- </td>
                            <td align="left" colspan="2"><input type="checkbox" v-model="d_cap.net_info_all[d_cap.current_index].EnableBindGateway" />&nbsp;</td>
                        </tr>

                        <tr v-show="ui_custom.GatewayMACAddr.visible">
                            <td align="right">
                                <label v-tr="i18n_GatewayMACAddr"><!-- 获取Mac地址 --><!--</label>:&nbsp; -->
                           <!-- </td>
                            <td align="left" colspan="2">
                                <input
                                    type="text"
                                    class="textc tip"
                                    data-title="i18n_ip_error"
                                    style="width: 220px"
                                    v-model="d_cap.net_info_all[d_cap.current_index].GatewayMacAddr"
                                    :disabled="!d_cap.net_info_all[d_cap.current_index].EnableBindGateway"
                                    v-validator:MACAddr
                                />
                            </td>
                        </tr>
                    </table>
                </div>  -->

                <div class="w100 text_center">
                    <button :class="button_style" style="width:88px;" v-tr="i18n_save" @click="save()"></button>
                </div>
            </div>
        </div>
        <div class="main_con_bot_ss" style="width:500px;background-size:100% 100%" ></div>
    </div>
</template>

<script>
    import Vue from 'vue';
    //  import {GetCustomizeMenu} from 'common/get_customize_menu'
    import { validateip_submask_gateway } from 'common/util';
    import style from 'mixin/style';
    export default {
        name: 'CVConfigNetworkSetting',
        mixins: [style],
        data() {
            return {
                d:{
                    UseDhcp:0,
                    AutoGetDnsAddr:0,
                },
                d_cap: {
                    count:0,
                    current_index:0,
                    //net_info 里面只存放网卡的索引信息 LAN1 -- et0  LAN2 -- et1 这一类
                    net_info:[
                    ],
                    //net_info_all 存放所有的信息，包括 ip netmask  gatway  dhcp  等
                    net_info_all:[
                    ],
                },
                changeNetIndex:"eth0",
            };
        },
        mounted() {
            //       msg("mounted!");

            /*GetCustomizeMenu(20,this.$store.getters.tokenA,this.$store.getters.tokenB).then(r=>{
          if(r.Result != 0)return;
          r = r.Data;

          this.ui_custom = (r.Support == 1)?r.NetSet:[];

        })*/
            this.$store.dispatch('request', { url: '/digest/frmNetWorkCap', 
                    Type : 0,
                    Ch : 1,
                    Data : {}}).then((_) => {
                if (_.Result == -655365) {
                    this.$store.dispatch('config_no_right');
                } else if (_.Result == 0) {
                    var da={};
                    da = _.Data;
                    msg("liuxin add  debug   get  netcount "+ da.NetInterfaceCap.length);
                    this.d_cap.count=da.NetInterfaceCap.length;
                    this.d_cap.net_info=da.NetInterfaceCap;
                    msg("liuxin add  debug   get  net seting count " + this.d_cap.count);
                    let tmp_index;
                    for(var index=0;index < this.d_cap.count;index++)
                    {
                        msg("liuxin add  debug  index 777 " + index);
                        tmp_index=index;
                        msg("liuxin add  debug  index 777 " + index + "   tmp_index  "  + tmp_index);
                        msg("liuxin add  debug   get  net seting "+ this.d_cap.net_info[index][1]);
                        this.$store.dispatch('request', { url: '/digest/frmNetSetting_multi', 
                            Type : 0,
                            Ch : 1,
                            Data : {
                                NetworkCardIdx: this.d_cap.net_info[index][1]
                            }}).then((response) => {
                            if (response.Result == -655365) {
                                //this.$store.dispatch('config_no_right');
                                //msg("liuxin add  debug  current_index 777777 " + index);
                            } else if (response.Result == 0) {
                                msg("liuxin add  debug  index 888 " + index + "tmp_index  "  + tmp_index);
                                this.d_cap.net_info_all[index] = response.Data;
                                msg("liuxin add  debug  index 999 " + index + "tmp_index  "  + tmp_index);
                                msg("liuxin add  debug  test  use index get data  index " + index + "NetInterface  "  +
                                     this.d_cap.net_info_all[index].NetInterface);
                                this.d_cap.current_index=index;
                                msg("liuxin add  debug  current_index 9999999999999 " + this.d_cap.current_index);
                                //let tmp_info=this.d_cap.net_info[index];
                                this.d_cap.current_eth=this.d_cap.net_info[this.d_cap.current_index-1][1];
                                this.d_cap.net_info_all[index].NetworkCardIdx=this.d_cap.current_eth;
                                msg("liuxin add  debug  current_eth 555555555 " + this.d_cap.current_eth);
                                let sta;
                                switch (this.d_cap.net_info_all[this.d_cap.current_index].NetInterface){
                                    case 1:
                                        sta='i18n_netStat_10half';
                                        break;
                                    case 2:
                                        sta='i18n_netStat_10full';
                                        break;
                                    case 3:
                                        sta='i18n_netStat_100half';
                                        break;
                                    case 4:
                                        sta='i18n_netStat_100full';
                                        break;
                                    case 5:
                                        sta='i18n_netStat_auto';
                                        break;
                                    default: 
                                        sta='i18n_netStat_10half';
                                }
                                msg("liuxin add  debug  checkNetStat  sta  "  + sta);
                                msg("liuxin add  debug  checkNetStat "+ this.$store.getters.current_language[sta]);
                                //this.d_cap.net_info_all[this.d_cap.current_index].NetInterface=this.$store.getters.current_language[sta];
                                this.d.AutoGetDnsAddr =this.d_cap.net_info_all[this.d_cap.current_index].AutoGetDnsAddr;
                                this.d.UseDhcp =this.d_cap.net_info_all[this.d_cap.current_index].UseDhcp;
                                this.d_cap.net_info_all[this.d_cap.current_index].NetInterface=this.$store.getters.current_language[sta];
                                //this.$notify.success(this.$store.getters.current_language['i18n_getok']);
                            } else {
                                //this.$notify.error(this.$store.getters.current_language['i18n_getfailed']);
                            }
                        });
                    }
                    this.$notify.success(this.$store.getters.current_language['i18n_getok']);
                } else {
                    this.$notify.error(this.$store.getters.current_language['i18n_getfailed']);
                }
            });
            
        },
        computed: {
            d_UseDhcp() {
                return this.d.UseDhcp;
            },
            d_AutoGetDnsAddr() {
                return this.d.AutoGetDnsAddr;
            },
            rtsp_auth_base64: {
                get: function() {
                    return this.d_cap.net_info_all[this.d_cap.current_index].RtspAuthMode & 0x1 ? true : false;
                },
                set: function(val) {
                    if (val) {
                        this.d_cap.net_info_all[this.d_cap.current_index].RtspAuthMode |= 0x1;
                    } else {
                        this.d_cap.net_info_all[this.d_cap.current_index].RtspAuthMode &= ~0x1;
                    }
                },
            },
            rtsp_auth_digest: {
                get: function() {
                    return (this.d_cap.net_info_all[this.d_cap.current_index].RtspAuthMode >> 1) & 0x1 ? true : false;
                },
                set: function(val) {
                    if (val) {
                        this.d_cap.net_info_all[this.d_cap.current_index].RtspAuthMode |= 0x1 << 1;
                    } else {
                        this.d_cap.net_info_all[this.d_cap.current_index].RtspAuthMode &= ~(0x1 << 1);
                    }
                },
            },
            changeNetIndex: {
                get: function(){
                    return this.d_cap.current_eth;
			    },
                set: function(){
                    this.d_cap.current_eth=v;
			    },
            },
        },
        watch:{
            d_UseDhcp(val){
                msg("liuxin add watch UseDhcp new  " + val);
                this.d_cap.net_info_all[this.d_cap.current_index].UseDhcp=val;
            },
            d_AutoGetDnsAddr(val){
                msg("liuxin add watch AutoGetDnsAddr new  " + val);
                this.d_cap.net_info_all[this.d_cap.current_index].AutoGetDnsAddr=val;
            },
        },
        methods: {
            save() {
                msg("liuxin add  debug  save ");
                if (this.$el.innerHTML.indexOf('input_check_error') > 0) {
                    this.$notify.error(this.$store.getters.current_language['i18n_checkinput']);
                    msg("liuxin add  debug  save err  input_check_error ");
                    return;
                }
                if (!validateip_submask_gateway(this.d_cap.net_info_all[this.d_cap.current_index].DVRIP, 
                        this.d_cap.net_info_all[this.d_cap.current_index].DVRIPMask,
                        this.d_cap.net_info_all[this.d_cap.current_index].GatewayIpAddr)) {
                    this.$notify.error(this.$store.getters.current_language['i18n_ip_mask_gateway_error']);
                    msg("liuxin add  debug  save err  validateip_submask_gateway ");
                    return;
                }
                /* 	if (!validateip_submask_gateway(this.d.IpAddrV6, this.d.IpMaskV6, this.d.GatewayV6)) {
				this.$notify.error(this.$store.getters.current_language['i18n_ip_mask_gateway_error']);
				return;
            } */
                /**** liuxin add 增加自动DNS 选项 ****/
                //this.d.AutoDNS = parseInt(this.d.AutoDNS, 10);
                //this.d.netIndex = parseInt(this.d.netIndex, 10);
                //this.d.netCount = parseInt(this.d.netCount, 10);
                let net_s;
                switch (this.d_cap.net_info_all[this.d_cap.current_index].NetInterface){
                    case this.$store.getters.current_language['i18n_netStat_10half']:
                        net_s=1;
                        break;
                    case this.$store.getters.current_language['i18n_netStat_10full']:
                        net_s=2;
                        break;
                    case this.$store.getters.current_language['i18n_netStat_100half']:
                        net_s=3;
                        break;
                    case this.$store.getters.current_language['i18n_netStat_100full']:
                        net_s=4;
                        break;
                    case this.$store.getters.current_language['i18n_netStat_auto']:
                        net_s=5;
                        break;
                    default: 
                        net_s=1;
                }
                msg("liuxin add  debug  savekNetStat "+ net_s);
                this.d_cap.net_info_all[this.d_cap.current_index].NetInterface=net_s;
                //this.d_cap.net_info_all[this.d_cap.current_index].UseDhcp = parseInt(this.d.dUseDhcp, 10);
                //this.d_cap.net_info_all[this.d_cap.current_index].AutoGetDnsAddr = parseInt(this.d.AutoGetDnsAddr, 10);
                /**** liuxin add 增加自动DNS 选项 ****/
                this.d_cap.net_info_all[this.d_cap.current_index].HttpPortNo = parseInt(this.d_cap.net_info_all[this.d_cap.current_index].HttpPortNo, 10);
                this.d_cap.net_info_all[this.d_cap.current_index].HttpsPort = parseInt(this.d_cap.net_info_all[this.d_cap.current_index].HttpsPort, 10);
                this.d_cap.net_info_all[this.d_cap.current_index].RtspPort = parseInt(this.d_cap.net_info_all[this.d_cap.current_index].RtspPort, 10);
                this.d_cap.net_info_all[this.d_cap.current_index].RTMPPort = parseInt(this.d_cap.net_info_all[this.d_cap.current_index].RTMPPort, 10);
                this.d_cap.net_info_all[this.d_cap.current_index].MultiCastEnable = this.d_cap.net_info_all[this.d_cap.current_index].MultiCastEnable ? 1 : 0;
                this.d_cap.net_info_all[this.d_cap.current_index].MulticastPort = parseInt(this.d_cap.net_info_all[this.d_cap.current_index].MulticastPort, 10);
                this.d_cap.net_info_all[this.d_cap.current_index].EnableSnmp = this.d_cap.net_info_all[this.d_cap.current_index].EnableSnmp ? 1 : 0;
                this.d_cap.net_info_all[this.d_cap.current_index].SnmpCount = parseInt(this.d_cap.net_info_all[this.d_cap.current_index].SnmpCount, 10);
                this.d_cap.net_info_all[this.d_cap.current_index].SnmpInterval = parseInt(this.d_cap.net_info_all[this.d_cap.current_index].SnmpInterval, 10);
                this.d_cap.net_info_all[this.d_cap.current_index].EnableUPNP = this.d_cap.net_info_all[this.d_cap.current_index].EnableUPNP ? 1 : 0;
                this.d_cap.net_info_all[this.d_cap.current_index].EnablePPPOE = this.d_cap.net_info_all[this.d_cap.current_index].EnablePPPOE ? 1 : 0;
                this.d_cap.net_info_all[this.d_cap.current_index].EnableBindGateway = this.d_cap.net_info_all[this.d_cap.current_index].EnableBindGateway ? 1 : 0;

                this.d_cap.net_info_all[this.d_cap.current_index].EnableDhcpV6 = parseInt(this.d_cap.net_info_all[this.d_cap.current_index].EnableDhcpV6, 10);
                this.d_cap.net_info_all[this.d_cap.current_index].IpAddrV6PrefixLen = parseInt(this.d_cap.net_info_all[this.d_cap.current_index].IpAddrV6PrefixLen, 10);

                if (this.d_cap.net_info_all[this.d_cap.current_index].HttpPortNo == this.d_cap.net_info_all[this.d_cap.current_index].HttpsPort 
                    || this.d_cap.net_info_all[this.d_cap.current_index].RtspPort == this.d_cap.net_info_all[this.d_cap.current_index].HttpPortNo 
                    || this.d_cap.net_info_all[this.d_cap.current_index].RtspPort == this.d_cap.net_info_all[this.d_cap.current_index].HttpsPort) {
                    this.$notify.error(this.$store.getters.current_language['i18n_sameport']);
                    return;
                }
                this.$store
                    .dispatch('request', { url: 'goform/frmNetSetting_multi', 
                        Type : 1,
                        Ch : 1,
                        Data: this.d_cap.net_info_all[this.d_cap.current_index], 
                        TimeOut: 3000 })
                    .then((_) => {
                        if (_.Result == 0) {
                            this.$notify.success(this.$store.getters.current_language['i18n_saveok']);
                            this.jump();
                        } else {
                            this.$notify.error(this.$store.getters.current_language['i18n_savefailed']);
                        }
                    })
                    .catch(() => {
                        this.jump();
                    });
            },
            jump() {
                if (this.checkVec[3] != this.d_cap.net_info_all[this.d_cap.current_index].RtspPort 
                    || this.checkVec[4] != this.d_cap.net_info_all[this.d_cap.current_index].RTMPPort) {
                    this.$notify.info(this.$store.getters.current_language['i18n_port_reboot']);
                } else if (this.checkVec[0] != this.d_cap.net_info_all[this.d_cap.current_index].DVRIP 
                            || this.checkVec[1] != this.d_cap.net_info_all[this.d_cap.current_index].HttpPortNo 
                            || this.checkVec[2] != this.d_cap.net_info_all[this.d_cap.current_index].HttpsPort) {
                    if (confirm(this.$store.getters.current_language['i18n_newurl'])) {
                        let flg = window.location.href.indexOf('https') === 0;
                        window.onbeforeunload = null;
                        window.location.href = (flg ? 'https://' : 'http://') + this.d_cap.net_info_all[this.d_cap.current_index].DVRIP + ':' + (flg ? this.d_cap.net_info_all[this.d_cap.current_index].HttpsPort : this.d_cap.net_info_all[this.d_cap.current_index].HttpPortNo);
                    }
                }
            },
        },
    };
</script>
