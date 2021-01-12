<template>
  <transition name="toastbox">
    <div class="toast" v-show="toastShow">
      {{ info }}
    </div>
  </transition>
</template>
<script>
export default {
  data() {
    return {
      toastShow: false,
      info: "",
    };
  },
};
</script>
<style scoped>
.toast {
  position: fixed;
  z-index: 2000;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  border-radius: 5px;
  color: #fff;
  background: rgb(17, 17, 17);
  line-height: 1.5;
  padding: 10px 15px;
  max-width: 80%;
}
.toastbox-enter-active,
.toastbox-leave-active {
  transition: 0.3s linear;
}

.toastbox-enter {
  opacity: 0;
}

.toastbox-leave-to {
  opacity: 0;
}
</style>