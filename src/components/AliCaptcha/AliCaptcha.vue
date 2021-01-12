<template>
  <div id="AliCaptcha" class="ali-mask" v-show="AliCaptchaShow">
    <div class="ali-dialog">
      <div id="aliSlide" class="nc-container"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      AliCaptchaShow : false,
      AliCaptchaCallback : null,
    }
  },
  methods:{
    show(){
      this.AliCaptchaShow = true;
    },
    close(){
      this.AliCaptchaShow = false;
    },
    initAliCaptcha(lang) {
      let nc_token = [
        "appkey",
        new Date().getTime(),
        Math.random(),
      ].join(":");

      let nc_option = {
        renderTo: "#aliSlide",
        appkey: "appkey",
        scene: "nc_register",
        token: nc_token,
        customWidth: 300,
        language: lang ,
        trans: {},
        is_Opt: 0,
        language: lang,
        isEnabled: true,
        timeout: 3000,
        times: 5,
        apimap: {},
        callback: (data) => {
          if (
            data.value == "pass" &&
            typeof this.AliCaptchaCallback == "function"
          ) {
            this.close();
            this.AliCaptchaCallback({
              data: data,
              getCaptchaData: (res)=>{
                return {
                  humanCheckMode: "aliSlide",
                  humanCheckParams: JSON.stringify({
                    scene: "nc_register",
                    platform: 3,
                    csessionid: res.csessionid,
                    sig: res.sig,
                    token: res.token,
                    value: res.value,
                  }),
                };
              },
            });
          }
        },
      };

      new noCaptcha(nc_option);

      this.show();
    },
  }
}
</script>