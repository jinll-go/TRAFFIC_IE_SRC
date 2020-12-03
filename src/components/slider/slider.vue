<template>
    <input type="hidden" :class="classObj" :value="value" />
</template>

<script>
    export default {
        name: 'CVSlider',
        model: {
            //清除默认的v-model绑定
            prop: 'value',
            event: 'input',
        },
        props: {
            name: {
                type: String,
                default: 'single-silder',
            },
            value: {
                type: [Number, String],
                default: 0,
            },
            max: {
                type: Number,
                default: 100,
            },
            min: {
                type: Number,
                default: 0,
            },
            step: {
                type: Number,
                default: 0.1,
            },
            width: {
                type: [Number],
                default: 75,
            },
            disabled: {
                type: Boolean,
                default: false,
            },
        },
        mounted() {
            let name = '.' + this.name;

            let theme = '';

            if (this.$store.getters.is_honey) {
                theme = 'theme-blue';
            } else if (this.$store.getters.is_tyconew || this.$store.getters.is_dongshun) {
                theme = 'theme-yellow';
            } else {
                theme = 'theme-green';
            }

           // msg(['slider_theme_hh', theme]);

            $(name).jRange({
                from: this.min,
                to: this.max,
                step: this.step,
                // scale: [0,25,50,75,100],
                theme,
                format: '%s',
                width: this.width,
                showLabels: false,
                showScale: false,
                valueChangeCb: (val) => {
                    this.$emit('input', val);
                },
            });

            if (this.disabled) {
                $('.' + this.name).jRange('disable');
            }
        },
        beforeDestroy() {
            let name = '.' + this.name;
            $(name)
                .next('.slider-container')
                .remove();
        },
        methods: {
            setValue(v) {
                $('.' + this.name).jRange('setValue', v);
            },
        },
        watch: {
            value(n) {
                this.setValue(parseInt(n));
            },
            disabled(newVal) {
                if (newVal) {
                    $('.' + this.name).jRange('disable');
                } else {
                    $('.' + this.name).jRange('enable');
                }
            },
        },
        computed: {
            classObj() {
                return {
                    [this.name]: true,
                };
            },
        },
    };
</script>
