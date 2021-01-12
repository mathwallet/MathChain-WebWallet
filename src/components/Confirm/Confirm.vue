<template>
<section class="confirm-mask"  v-show="confirmShow" @click.self="close">
  <transition name="confirmbox">
    <div class="confirm">
     <p class="content"> {{ info }}</p>
     <ul class="flex-btn">
       <li @click="yes" class="yes" v-if="confirmBtn">{{confirmBtn}}</li>
       <li @click="close" v-if="closeBtn">{{closeBtn}}</li>
     </ul>
    </div>
  </transition>
</section>

</template>
<script>
export default {
  data() {
    return {
      confirmShow: false,
      info: '',
      confirmBtn:'',
      closeBtn:'',
    };
  },
  methods:{
    yes(){
      this.confirmShow=false;
    },
    close(){
      this.confirmShow=false;
    }
  }
};
</script>
<style scoped>
.confirm-mask{
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  background: rgba(0,0,0,.4);
  z-index: 999998;
  user-select: none;
  cursor: pointer;
}
.confirm {
  position: fixed;
  z-index: 999999;
  top: 50%;
  left: 50%;
  overflow: hidden;
  width: 300px;
  transform: translate3d(-50%,-50%,0);
  text-align: center;
  color: #000;
  border-radius: 12px;
  background:#fff;
}
.confirm .content{
  padding: 26px 15px 20px;
  font-size: 16px;
}
.flex-btn{
  display: flex;
  height: 44px;
  line-height: 44px;
  justify-content: center;
  border-top:1px solid var(--pale-grey)
}
.flex-btn li{
  flex: 1;
  cursor: pointer;
}
.yes{
  color: var(--blueColor);
  border-right:1px solid var(--pale-grey)
}
.flex-btn li:last-child{
  border-right:none;
}
.confirmbox-enter-active,
.confirmbox-leave-active {
  transition: 0.3s linear;
}

.confirmbox-enter {
  opacity: 0;
}

.confirmbox-leave-to {
  opacity: 0;
}
</style>