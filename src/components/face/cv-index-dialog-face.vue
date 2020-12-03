<template>
    <div class="hide_div" style="height:100%">
        <div class="div_opacity"></div>
        <div class="text_center bkcolor" :class="Mode ? 'div_info_facedb' : 'div_info_import'">
            <div class="text_right">
                <img src="static/images/17.gif" @click="exit" />
            </div>
            <FaceDialogWrapper :dialogmode="dialogmode"></FaceDialogWrapper>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import CVDialogFaceAddGroup from 'components/face/dialogs/cv-dlg-addgroup';
    import CVDialogFacecomparisonExport from 'components/face/dialogs/cv-dlg-facecomparison-export';
    import CVDialogFacecomparisonDetail from 'components/face/dialogs/cv-dialog-facecomparison-detail';
    import CVDialogFaceImport from 'components/face/dialogs/cv-dialog-face-import';

    const compmap = {
        CVDialogFaceAddGroup,
        CVDialogFacecomparisonExport,
        CVDialogFacecomparisonDetail,
        CVDialogFaceImport,
    };

Vue.component('FaceDialogWrapper', {
	functional: true,
	render(h, context) {
		return context.parent.$createElement(compmap[context.props.dialogmode], { ref: 'subdlg' });
	},
});

    export default {
        name: 'CVIndexDialogFace',
        props: {
            dialogmode: {
                type: String,
                default: '',
            },
        },

        computed: {
            Mode() {
                return this.dialogmode == 'CVDialogFaceAddGroup';
            },
        },
        methods: {
            exit() {
                this.$refs.subdlg.hide();
            },
        },
    };
</script>
