<template>
    <table width="100%" border="0" cellspacing="0" cellpadding="0" class="tab1" id="tab">
        <tr>
            <th class="td-title"><label v-tr="i18n_NO"></label></th>
            <th class="td-title"><label v-tr="i18n_logTime"></label></th>
            <th class="td-title"><label v-tr="i18n_logType"></label></th>
            <th class="td-title"><label v-tr="i18n_logTheme"></label></th>
            <th class="td-title"><label v-tr="i18n_log_usrname"></label></th>
            <th class="td-title"><label v-tr="i18n_userAddress"></label></th>
        </tr>
        <tr v-for="(n, $index) of da">
            <td :class="$index % 2 === 0 ? '' : 'td-1'">
                <label>{{ da[$index].No }}</label>
            </td>
            <td :class="$index % 2 === 0 ? '' : 'td-1'">
                <label>{{ da[$index].LogDateTime }}</label>
            </td>
            <td :class="$index % 2 === 0 ? '' : 'td-1'">
                <label>{{ MajorType(da[$index].MajorType) }}</label>
            </td>
            <td :class="$index % 2 === 0 ? '' : 'td-1'">
                <label>{{ MinorType(da[$index].MinorType, da[$index].MajorType, da[$index].Status) }}</label>
            </td>
            <td :class="$index % 2 === 0 ? '' : 'td-1'">
                <label>{{ da[$index].UserName }}</label>
            </td>
            <td :class="$index % 2 === 0 ? '' : 'td-1'">
                <label>{{ da[$index].IP }}</label>
            </td>
        </tr>
    </table>
</template>

<script>
    export default {
        name: 'CVLogTable',
        props: ['da'],
        methods: {
            MajorType: function(type) {
                let str = '';
                switch (type) {
                    case 1:
                        str = this.lang.i18n_alarm; //报警
                        break;
                    case 2:
                        str = this.lang.i18n_exception; //异常
                        break;
                    case 3:
                        str = this.lang.i18n_operation; //操作
                        break;
                    case 4:
                        str = this.lang.i18n_config; //参数
                        break;
                    default:
                        break;
                }
                return str;
            },
            MinorType: function(minorType, majorType, status) {
                msg("minorType = ",minorType);
                msg("majorType = ",majorType);
                msg("status = ",status);
                let str = '';
                switch(minorType)
                {
                    case 0:
                        str = this.lang.i18n_new_log_0;
                        break;
                    case 1:
                        str = this.lang.i18n_new_log_1;
                        break;
                    case 2:
                        str = this.lang.i18n_new_log_2;
                        break;
                    case 3:
                        str = this.lang.i18n_new_log_3;
                        break;
                    case 4:
                        str = this.lang.i18n_new_log_4;
                        break;
                    case 5:
                        str = this.lang.i18n_new_log_5;
                        break;
                    case 6:
                        str = this.lang.i18n_new_log_6;
                        break;
                    case 9:
                        str = this.lang.i18n_new_log_9;
                        break;
                    case 10: 
                        str = this.lang.i18n_new_log_10; 
                        break;
                    case 25:
                        str = this.lang.i18n_new_log_25;
                        break;
                    case 26:
                        str = this.lang.i18n_new_log_26;
                        break;
                    case 27:
                        str = this.lang.i18n_new_log_27;
                        break;
                    case 28:
                        str = this.lang.i18n_new_log_28;
                        break;
                    case 29:
                        str = this.lang.i18n_new_log_29;
                        break;
                    case 30:
                        str = this.lang.i18n_new_log_30;
                        break;
                    case 31:
                        str = this.lang.i18n_new_log_31;
                        break;
                    case 32:
                        str = this.lang.i18n_new_log_32;
                        break;  
                    case 33:
                        str = this.lang.i18n_new_log_33;
                        break;
                    case 36:
                        str = this.lang.i18n_new_log_36;
                        break;
                    case 39:
                        str = this.lang.i18n_new_log_39;
                        break;
                    case 40:
                        str = this.lang.i18n_new_log_40;
                        break;
                    case 47:
                        str = this.lang.i18n_new_log_47;
                        break;
                    case 48:
                        str = this.lang.i18n_new_log_48;
                        break;
                    case 49:
                        str = this.lang.i18n_new_log_49;
                        break;
                    case 50:
                        str = this.lang.i18n_new_log_50;
                        break;
                    case 51:
                        str = this.lang.i18n_new_log_51;
                        break;
                    case 52:
                        str = this.lang.i18n_new_log_52;
                        break;
                    case 53:
                        str = this.lang.i18n_new_log_53;
                        break;
                    case 60:
                        str = this.lang.i18n_new_log_60;
                        break;
                    case 61:
                        str = this.lang.i18n_new_log_61;
                        break;
                    case 73:
                        str = this.lang.i18n_new_log_73;
                        break;
                    case 74:
                        str = this.lang.i18n_new_log_74;
                        break;
                    case 81:
                        str = this.lang.i18n_new_log_81;
                        break;
                    case 82:
                        str = this.lang.i18n_new_log_82;
                        break;
                    case 83:
                        str = this.lang.i18n_new_log_83;
                        break;
                    case 84:
                        str = this.lang.i18n_new_log_84;
                        break;
                    default: 
                        str = this.lang.i18n_new_log_0;
                        break;
                }

                return str;
            },
            TransCh(v) {
                if (v <= 0) return '';
                let low = 0x0000ffff & v;
                let high = (0xffff0000 & v) >> 16;
                return high ? low + '_' + high : low;
            },
        },
    };
</script>
