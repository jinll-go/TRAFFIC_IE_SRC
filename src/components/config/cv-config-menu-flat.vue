<template>
    <!-- <div class="main_right_mid2 r_bg">
        <div v-for="(item, key) of list" v-show="item.visible" :class="right_class(item.component_name)">
            <a style="cursor:pointer;" v-tr="key" @click.stop="right_main_frame(item.component_name)"></a>
        </div>
    </div>-->
    <div class="main_right_mid2 r_bg">
        <cvlist>
            <div slot-scope="{ tags, loaditem }">
                <ul v-for="section of tags">
                    <li
                        v-for="item of section.children"
                        :class="[item.focus ? 'main_right_2' : 'main_right_1']"
                        @click.stop="loaditem(item.name, item.component_name)"
                        v-tr="item.name"
                        v-show="item.visible"
                    ></li>
                </ul>
            </div>
        </cvlist>
    </div>
</template>

<script>
    import Vue from 'vue';
    import cvlist from 'components/config/cvlist.js';

    export default {
        name: 'CVConfigMenuFlat',
        components: {
            cvlist,
        },
    };
</script>
