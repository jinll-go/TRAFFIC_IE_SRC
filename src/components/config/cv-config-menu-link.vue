<template>
    <div class="main_right_mid2 r_bg">
        <cvlist>
            <div slot-scope="{ tags, loaditem }">
                <div v-for="section of tags" class="configMenu" v-show="section.children.some((el) => el.visible || true)">
                    <label>{{ section.name }}</label>
                    <ul>
                        <li
                            v-for="item of section.children"
                            v-show="item.visible || true"
                            :class="{ focus: item.focus }"
                            @click="loaditem(item.name, item.component_name)"
                        >
                            <a>{{ item.name }}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </cvlist>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { generate_compkeys } from 'common/util';
    import cvlist from 'components/config/cvlist.js';

    export default {
        name: 'CVConfigMenuLink',

        components: {
            cvlist,
        },
    };
</script>
<style>
    .configMenu label {
        font-size: 14px;
        display: block;
        background: rgba(24, 24, 24, 0.5);
        padding: 4px 10px;
    }
    .configMenu label::before {
        content: '';
        display: inline-block;
        vertical-align: middle;
        width: 2px;
        height: 14px;
        margin-right: 6px;
        background: #ffffff;
    }
    .configMenu ul {
        padding: 4px 10px;
    }
    .configMenu ul::after {
        content: '';
        display: block;
        clear: both;
    }
    .configMenu ul li {
        list-style: none;
        float: left;
    }
    .configMenu ul li a {
        color: #c9c9c9;
        transition: all 0.4s;
        display: inline-block;
        margin: 2px 6px;
    }
    .configMenu ul li a:hover {
        color: #0ed5ff;
    }
    .configMenu ul .focus a {
        color: #0ed5ff;
    }
    /* 自定义滚动条 */
    /* chrome */
    ::-webkit-scrollbar {
        width: 6px;
        border-radius: 4px;
    }
    ::-webkit-scrollbar-track {
        background: rgba(24, 24, 24, 0.5);
        /* background: rgba(87, 87, 87, 1); */
    }
    ::-webkit-scrollbar-thumb {
        background: rgba(99, 99, 99, 0.5);
    }
    ::-webkit-scrollbar-button {
        background: rgba(0, 0, 0, 0.5);
    }
    ::-webkit-scrollbar-corner {
        background-color: black;
    }
    ::-moz-scrollbar {
        width: 6px;
        border-radius: 4px;
    }
    /* ie */
    body {
        scrollbar-face-color: #414141;
        scrollbar-shadow-color: #414141;
        scrollbar-highlight-color: #414141;
        scrollbar-3dlight-color: #414141;
        scrollbar-darkshadow-color: #414141;
        scrollbar-track-color: #1f1f1f;
        scrollbar-arrow-color: #414141;
    }
    /* firefox */
    /* 改不了，考虑用插件 */
</style>
