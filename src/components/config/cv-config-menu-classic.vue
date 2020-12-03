<template>
    <div class="main_right_mid2 r_bg">
        <cvlist>
            <div slot-scope="{ tags, loaditem, expand }">
                <div v-for="section of tags"  v-show="section.children.some((el) => el.visible )">
                    <label @click="expand(section.name)"  :class="[section.visible ? 'left_menu_selected' : '']" >{{ section.name }}</label>
                    <ul :style="[section.visible ? { display: 'block' } : { display: 'none' }]">
                        <li
                            v-for="item of section.children"
                            :class="[item.focus ? 'main_right_2' : 'main_right_1']"
                            @click="loaditem(item.name, item.component_name)"
                            v-tr="item.name"
                            v-show="item.visible"
                        ></li>
                    </ul>
                </div>
            </div>
        </cvlist>
    </div>
</template>

<script>
    import Vue from 'vue';
    import cvlist from 'components/config/cvlist.js';

    export default {
        name: 'CVConfigMenuClassic',
        components: {
            cvlist,
        },
    };
</script>
<style>
    li {
        list-style: none;
    }
</style>
