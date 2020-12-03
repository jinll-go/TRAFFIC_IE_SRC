<template>
  <div class="waiting" id="waitDiv" v-show="show">
    <img src="static/images/waiting.gif" />
    <label v-tr="i18n_loadingTip">Loading...</label>
    <iframe style="width:0px;height:0px;" ref="loading_bkg_ifrm"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
    };
  },
  mounted() {
    var e = this.$el;
    var x = e.offsetLeft;
    var y = e.offsetTop;
    while ((e = e.offsetParent)) {
      x += e.offsetLeft;
      y += e.offsetTop;
    }

    $(this.$refs.loading_bkg_ifrm).css({
      position: "absolute",
      left: x - 1 + "px",
      top: y - 1 + "px",
      width: "302px",
      height: "72px",
      border: "none",
    });
  },
};
</script>
