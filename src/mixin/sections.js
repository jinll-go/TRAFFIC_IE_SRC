/**
 * 布放时间 7*8的公共代码
 */
import CVConfigSection from 'components/config/channels/cv-config-section';

export default {
    data() {
        return {
            alarmtime: undefined, //触发props的默认值
            weekdayidx: 0,
        };
    },
    components: {
        CVConfigSection,
    },
};
