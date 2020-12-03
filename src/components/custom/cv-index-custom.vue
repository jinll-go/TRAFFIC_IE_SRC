<template>
    <iframe id="ai_iframe" :src="custom_src" style="width: 100%;height: auto;border: none"></iframe>
</template>

<script>
export default {
    name: "CVFrameCustom",
    data() {
        return {
            custom_src: "",
        };
    },
    mounted() {
        let iframe = document.getElementById("ai_iframe");
        if (iframe.attachEvent) {
            iframe.attachEvent("onload", () => {
                this.contentLoaded();
            });
        } else {
            iframe.onload = () => {
                this.contentLoaded();
            };
        }

        this.getSrc();

        //use PostMessage to send encode string
    },
    computed: {
        activated() {
            return this.$store.getters.custom_activated;
        },
    },
    methods: {
        contentLoaded() {
            msg("custom iframe contentLoaded");
            document.getElementById("ai_iframe").contentWindow.postMessage(window.EncInfoToken, this.custom_src);
        },
        getSrc() {
            if (this.para_custom.custom_src) {
                this.custom_src = `${this.para_custom.custom_src}?EncInfoToken=${window.EncInfoToken}&Lang=${this.$store.getters.base.selected_language}&PluginType=${this.$store.getters.plugin_type}`;
            } else {
                this.custom_src = `http://${this.$store.getters.ip}:7100/page?EncInfoToken=${window.EncInfoToken}`;
            }
        },
    },
    watch: {
        activated(newVal, oldVal) {
            msg(["custom", newVal, oldVal]);
            if (newVal == false) {
                this.custom_src = "";
            } else {
                this.getSrc();
            }
        },
    },
};
</script>

