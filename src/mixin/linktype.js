/*
c所有 包含 联动设置ui的公用代码
 */
import CVConfigPTZLinkType from 'components/config/channels/cv-config-ptzlinktype';
export default {
    data() {
        return {
            linktype: undefined, //触发props 默认值
        };
    },

    components: {
        CVConfigPTZLinkType,
    },
};
