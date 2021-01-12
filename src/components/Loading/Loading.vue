<template>
  <div class="loading-box" ref="loading" v-show="loadingShow"></div>
</template>
<script>
import lottie from "lottie-web";
export default {
  data(){
    return {
      loadingShow:false,
    }
  },
  mounted() {
    lottie.loadAnimation({
        container: this.$refs.loading,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: 'static/loading.json'
      }
    );
  }
};
</script>
<style>
.loading-box {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.08);
  z-index: 1000;
}
.loading-box svg {
  width: 96px !important;
  height: 96px !important;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%) !important;
  transform: translate(-50%, -50%) !important;
}
</style>


