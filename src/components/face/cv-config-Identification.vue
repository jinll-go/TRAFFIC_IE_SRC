<template>
    <div>
        <tabs style="width:60%;margin:0 auto;padding-top:100px" :tabs="subtabs" @refresh="refresh">
            <!-- 识别配置
			<tab :name="$store.getters.current_language.i18n_FaceRecgConfig" style="margin-top: -70px">
				<CVConfigRecongizeCfg></CVConfigRecongizeCfg>
			</tab>

			<!-- 联动设置
			<tab :name="$store.getters.current_language.i18n_linkType">
				<CVConfigLinkSet></CVConfigLinkSet>
			</tab>

			<!-- 人脸曝光策略

			<tab :name="$store.getters.current_language.i18n_exposureControl">
				<CVConfigFaceExposure></CVConfigFaceExposure>
			</tab>

			<!-- FTP设置
			<tab :name="$store.getters.current_language.i18n_ftp">
				<CVConfigFtp></CVConfigFtp>
			</tab>-->
            <template v-slot:mainfrm="slotProps">
                <div :is="slotProps.activeTabHash" :key="compkey"></div>
            </template>
        </tabs>
    </div>
</template>

<script>
    import CVConfigFtp from 'components/config/upload/cv-config-ftpupload';
    import CVConfigRecongizeCfg from 'components/face/cv-config-recognizeCfg.vue';
    import CVConfigLinkSet from 'components/face/cv-config-LinkSet.vue';
    import CVConfigFaceExposure from 'components/face/cv-config-faceExposure.vue';

    import style from 'mixin/style';

    import { generate_compkeys } from 'common/util';
    export default {
        name: 'CVConfigIdentification',
        mixins: [style],
        data() {
            return {
                compkey: '',
                subtabs: [
                    {
                        isActive: true,
                        isDisabled: false,
                        isVisible: true,
                        hash: 'CVConfigRecongizeCfg',
                        header: this.$store.getters.current_language.i18n_FaceRecgConfig,
                    },
                    {
                        isActive: true,
                        isDisabled: false,
                        isVisible: true,
                        hash: 'CVConfigLinkSet',
                        header: this.$store.getters.current_language.i18n_linkType,
                    },
                    {
                        isActive: true,
                        isDisabled: false,
                        isVisible: true,
                        hash: 'CVConfigFaceExposure',
                        header: this.$store.getters.current_language.i18n_exposureControl,
                    },
                    {
                        isActive: true,
                        isDisabled: false,
                        isVisible: true,
                        hash: 'CVConfigFtp',
                        header: this.$store.getters.current_language.i18n_ftp,
                    },
                ],
            };
        },
        methods: {
            refresh() {
                this.compkey = generate_compkeys();
            },
        },

        components: {
            CVConfigFtp,
            CVConfigRecongizeCfg,
            CVConfigLinkSet,
            CVConfigFaceExposure,
        },
    };
</script>
<style scoped>
    .head_lb_text_w {
        /*overflow: hidden;*/
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 120px;
        text-align: right;
        display: inline-block;
    }

    .ipt_w {
        width: 80px;
    }

    .tail_lb_text_w {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 100px;
        text-align: left;
        display: inline-block;
    }

    .chk_wrapper {
        text-align: left;
        display: inline-block;
        width: 120px;
    }
</style>
