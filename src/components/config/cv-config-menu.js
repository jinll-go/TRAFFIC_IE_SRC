import CVConfigMenuLink from 'components/config/cv-config-menu-link.vue';
import CVConfigMenuFlat from 'components/config/cv-config-menu-flat.vue';
import CVConfigMenuClassic from 'components/config/cv-config-menu-classic.vue';
export default {
    functional: true,
    render(h, context) {
        let paramconfig = context.parent.$Param;
        if (!paramconfig.ConfigMenuListType) {
            paramconfig.ConfigMenuListType = 'flat';
        }
	
        paramconfig.ConfigMenuListType = 'classic';
        if (paramconfig.ConfigMenuListType == 'flat') {
            return context.parent.$createElement(CVConfigMenuFlat, { ref: 'menulist' });
        } else if (paramconfig.ConfigMenuListType == 'link') {
            return context.parent.$createElement(CVConfigMenuLink, { ref: 'menulist' });
        } else if (paramconfig.ConfigMenuListType == 'classic') {
            return context.parent.$createElement(CVConfigMenuClassic, { ref: 'menulist' });
        }
    },
};
