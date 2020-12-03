
export default {
    data() {
        return {
            need_restore_loading: false,
        };
    },
    mounted() {
        this.$store.dispatch('facemanage_restore');
    },
    methods: {
    },
    computed: {
        activated() {
            return this.$store.getters.facemanage_activated;
        },
    },
    watch: {
        activated(newVal, oldVal) {
            if (newVal) {
                if (this.need_restore_loading) {
                    this.$loading.show = true;
                    this.need_restore_loading = false;
                }
            } else {
                if ($('#waitDiv').is(':visible')) {
                    this.need_restore_loading = true;
                    this.$loading.show = false;
                }
            }
        },
    },
};
