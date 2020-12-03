<template>
    <!-- <FixedTop3ColumnAutoSizeLayout top_height="0" right_width="0" left_width="217" left_space = "190">
        <template v-slot:leftpanel>
            <div class="m_r_bg xy_stretch">
                <CVLogSearch ref="logsearch" @search="search"></CVLogSearch>
            </div>
        </template>

        <template v-slot:centerpanel>
            <div class="xy_stretch" style="overflow: auto">
                <CVLogTable ref="logmain" :da="d"></CVLogTable>
                <div class="w100" id="mtab"></div>
                <CVFootMenu ref="footmenu" :foot="foot" @pagechanged="pagechanged"></CVFootMenu>
            </div>
        </template>
    </FixedTop3ColumnAutoSizeLayout> -->

    <div>
        <div>
            <CVLogSearch ref="logsearch" @search="search"></CVLogSearch>
        </div>

        <div>
            <CVLogTable ref="logmain" :da="d"></CVLogTable>
            <div class="w100" id="mtab"></div>
            <CVFootMenu ref="footmenu" :foot="foot" @pagechanged="pagechanged"></CVFootMenu>
        </div>
    </div>
</template>

<script>
    //import FixedTop3ColumnAutoSizeLayout from '../../layout/fixedtop-3column-layout';
    import CVLogSearch from 'components/log/cv-log-search';
    import CVLogTable from 'components/log/cv-log-showtext';
    import CVFootMenu from 'components/log/cv-log-footmenu';

    import LOGComponent from 'mixin/log';
    export default {
        name: 'CVFrameLog',
        mixins: [LOGComponent],
        components: {
            CVLogSearch,
            CVLogTable,
            CVFootMenu,
            //FixedTop3ColumnAutoSizeLayout,
        },
    };
</script>
