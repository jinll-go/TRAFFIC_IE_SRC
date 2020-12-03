<template>
    <div class="main_con clearfix" style="margin-top:100px" v-show="value">
        <!-- <div class="main_con_mid"> -->
            <!-- 中间内容 -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_importpath"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input ref="filElem" type="file" accept="audio/wav" @change="getFile" v-show="isDisable">
                    <input type="text" style="width:200px;" v-model="path" disabled />
                    <button :class="button_style" @click="choiceFile" class="importAudio_selectFile"
                        v-tr="i18n_selectfile"></button>
                </div>
            </div>
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_describe"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="text" v-model="text" class="textc" style="width:200px;" />
                    <span class="fl" style="width:70%"> </span>
                </div>
            </div>
            <!-- 下方确定取消 -->
            <div class="w100 pt10 text_center ">
                <button :class="button_style" style="margin-left: 10px;" @click="confirmBtn" v-tr="i18n_confirm"></button>
                <button :class="button_style" style="margin-left: 10px;" @click="cancelBtn" v-tr="i18n_cancel"></button>
            </div>
        <!-- </div> -->
       <!-- <div class="main_con_bot_k"></div> -->
    </div>
</template>

<script>
    import style from 'mixin/style';

    export default {

        // name: 'CVConfigImportAudio',
        mixins: [style],
        props: {
            value: Boolean,
            scene: Number
        },
        data() {
            return {
                path: '',
                text: '',
                audioFile: null,
                isDisable: false

            }
        },
        watch: {
            value(newVal) {
                if (newVal) {
                    // 初始化
                    this.audioFile = null
                    this.path = ''
                    this.text = ''
                    this.$refs.filElem.value = null
                }
            }
        },
        methods: {
            // 点击浏览
            choiceFile: function () {
                this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
            },
            getFile: function () {
                let file = this.$refs.filElem.files[0]
                if (file.type !== 'audio/wav') {
                    // this.$my_message({
                    //   content: this.$t('deviceConfig.audio.HintFileType'),
                    //   type: 'warning',
                    //   time: 1000,
                    //   hasClose: true
                    // })
                    return
                }
                this.audioFile = file
                this.path = this.audioFile.name
            },
            cancelBtn: function () {
                this.$emit('input', false)
            },
            confirmBtn: function () {
                if (this.path === '') {
                    // this.$my_message({
                    //   content: this.$t('deviceConfig.audio.HintPathIsNull'),
                    //   type: 'warning',
                    //   time: 1000,
                    //   hasClose: true
                    // })
                    return
                }
                if (this.text === '') {
                    // this.$my_message({
                    //   content: this.$t('deviceConfig.audio.HintDescribeIsNull'),
                    //   type: 'warning',
                    //   time: 1000,
                    //   hasClose: true
                    // })
                    return
                }
                this.$emit('importAudioConfirm', this.audioFile, this.text, this.scene)
            }
        }
    }
</script>