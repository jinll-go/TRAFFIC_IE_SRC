<template>
    <div>
        <facedatabase v-if="!facedb2model" @pagechanged="pagechanged"></facedatabase>
        <facemodel :show_query_condition="false" @pagechanged="pagechanged" v-else></facemodel>
    </div>
</template>

<script>
    import facedatabase from 'components/face/cv-index-facedatabase';
    import facemodel from 'components/face/cv-index-facemodel';
    export default {
        name: 'CVConfigFaceDBWrapper',

        data() {
            return {
                facedb2model: false,
            };
        },

        methods: {
            pagechanged(pagename) {
                this.facedb2model = pagename == 'facemodel';
            },
        },
        components: {
            facedatabase,
            facemodel,
        },
    };
</script>
