<template>
    <tabs style="max-width:80%;margin:100px auto;" :tabs="subtabs" @refresh="refresh" @change="change">
        <!-- 人体测温
        <tab :name="$store.getters.current_language.i18n_humantemperature">
          <CVConfigHumanTemperature></CVConfigHumanTemperature>
        </tab>

			<!-- 测温区域（人脸检测）
        <tab :name="$store.getters.current_language.i18n_Temperature_measurement_area">
          <CVConfigFaceDetect></CVConfigFaceDetect>
        </tab>

         测温设置
        <tab :name="$store.getters.current_language.i18n_ThermometrySetting">
          <CVConfigThermometrySet></CVConfigThermometrySet>
        </tab>

       口罩检测
         <tab :name="$store.getters.current_language.i18n_Masks_detect">
          <CVConfigMaskDetect></CVConfigMaskDetect>
			</tab>-->
        <!--v-slot作用域插槽-->>
        <template v-slot:mainfrm="slotProps">
            <div :is="slotProps.activeTabHash" :key="compkey"></div>
        </template>
    </tabs>
</template>

<script>
    import CVConfigHumanTemperature from 'components/temperature/cv-config-humantemperature.vue';
    import CVConfigHumanTempDetectArea from 'components/temperature/cv-config-tempdetectarea.vue';
    import CVConfigThermometrySet from 'components/temperature/cv-config-thermometryset.vue';
    import CVConfigMaskDetect from 'components/temperature/cv-config-maskdetect.vue';
    import style from 'mixin/style';
    //import repos_plugin from 'mixin/repos_plugin';
    import { generate_compkeys } from 'common/util';
    export default {
        name: 'CVConfigTemperatureCfg',
        mixins: [style],
        data() {
            return {
                compkey: '',
                subtabs: [
                    {
                        isActive: true,
                        isDisabled: false,
                        isVisible: true,
                        hash: 'CVConfigHumanTemperature',
                        header: this.$store.getters.current_language.i18n_humantemperature,
                    },
                    {
                        isActive: true,
                        isDisabled: false,
                        isVisible: true,
                        hash: 'CVConfigHumanTempDetectArea',
                        header: this.$store.getters.current_language.i18n_Temperature_measurement_area,
                    },
                    {
                        isActive: true,
                        isDisabled: false,
                        isVisible: true,
                        hash: 'CVConfigThermometrySet',
                        header: this.$store.getters.current_language.i18n_ThermometrySetting,
                    },
                    {
                        isActive: true,
                        isDisabled: false,
                        isVisible: true,
                        hash: 'CVConfigMaskDetect',
                        header: this.$store.getters.current_language.i18n_Masks_detect,
                    },
                ],
            };
        },
        methods: {
            refresh(name) {
                msg('refresh', name);
                this.compkey = generate_compkeys();
            },
        },
        components: {
            CVConfigHumanTemperature,
            CVConfigHumanTempDetectArea,
            CVConfigThermometrySet,
            CVConfigMaskDetect,
        },
    };
</script>
