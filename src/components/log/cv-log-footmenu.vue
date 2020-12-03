<template>
    <div>
        <table width="100%" align="center" cellpadding="5" cellspacing="0">
            <tr>
                <td width="10%" height="24" align="right" id="td">
                    <!-- style="display: none;"-->

                    <div class="fr" v-show="foot.logitemcount"><label v-tr="i18n_page"></label></div>

                    <div class="fr" v-show="foot.logitemcount">
                        <select v-model="selfpage" @change="newPage(4)">
                            <option v-for="n in foot.totalpages" :value="n">{{ n }}</option>
                        </select>
                    </div>
                    <div class="fr" v-show="foot.logitemcount"><label v-tr="i18n_goto"></label></div>

                    <div class="fr" style="cursor:pointer;" v-show="foot.current_page != foot.totalpages">
                        <label><a @click="newPage(3)" v-tr="i18n_lastPage"></a></label>&nbsp;&nbsp;
                    </div>
                    <div class="fr" style="cursor:pointer;" v-show="foot.current_page < foot.totalpages">
                        <label><a @click="newPage(1)" v-tr="i18n_nextPage"></a></label>&nbsp;&nbsp;
                    </div>
                    <div class="fr" style="cursor:pointer;" v-show="foot.current_page != 1">
                        <label><a @click="newPage(2)" v-tr="i18n_previousPage"></a></label>&nbsp; &nbsp;
                    </div>
                    <div class="fr" style="cursor:pointer;" v-show="foot.current_page != 1">
                        <label><a @click="newPage(0)" v-tr="i18n_firstPage"></a></label>&nbsp; &nbsp;
                    </div>

                    <div class="fr" v-show="foot.logitemcount"><label v-tr="i18n_page"></label>&nbsp;&nbsp;</div>
                    <div class="fr" v-show="foot.logitemcount">
                        <label>&nbsp;{{ foot.current_page }}</label
                        >&nbsp;
                    </div>
                    <div class="fr" v-show="foot.logitemcount"><label v-tr="i18n_the"></label>&nbsp;</div>
                    <div class="fr" v-show="foot.logitemcount"><label v-tr="i18n_listNum"></label>&nbsp;&nbsp;</div>
                    <div class="fr" v-show="foot.logitemcount">
                        <label>&nbsp;{{ foot.logitemcount }}</label
                        >&nbsp;
                    </div>
                    <div class="fr" v-show="foot.logitemcount"><label v-tr="i18n_total"></label>&nbsp;</div>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: 'CVFootMenu',
        props: {
            foot: {
                type: Object,
            },
        },
        data() {
            return {
                selfpage: 1,
            };
        },
        computed: {
            /*currentpage(){
        return this.$store.getters.current_page;
      },
      GetData(item){
        return this.$store.getters.GetData(item);
      }*/
        },
        methods: {
            newPage(value) {
                //value: 0:first 1:next 2:previous 3:last 4:self
                // let n = this.$store.getters.current_page;
                let n = this.foot.current_page;
                switch (value) {
                    case 0:
                        n = 1;
                        break;
                    case 1:
                        n += 1;
                        break;
                    case 2:
                        n -= 1;
                        break;
                    case 3:
                        n = this.foot.totalpages;
                        break;
                    case 4:
                        n = this.selfpage;
                        break;
                }
                //this.$store.dispatch("page_turning",n);
                this.$emit('pagechanged', n);
            },
        },
        watch: {
            foot: {
                deep: true,
                handler: function(curval) {
                    // this.selfpage = 1;
                    this.selfpage = this.foot.current_page;
                },
            },
        },
    };
</script>
