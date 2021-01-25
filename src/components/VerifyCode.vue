<template>
  <form>
    <label>{{ $t("email") }}</label>
    <p v-if="propEmail" class="input">{{ propEmail }}</p>
    <input
      v-else
      type="email"
      v-model="email"
      :placeholder="$t('your_email')"
    />
    <label>{{ $t("verification_code") }}</label>
    <label v-if="!timer" class="setBtn" @click="getCodeByAliCaptcha()">{{
      $t("get_verification_code")
    }}</label>
    <label v-else class="setBtn">{{
      $t("verify_code_send_again_timeout").replace("%d", sendTimeout)
    }}</label>
    <input type="text" v-model="code" :placeholder="$t('verification_code')" />
    <a class="btn block-btn" @click="submit">{{ $t("submit") }}</a>
  </form>
</template>
<script>
export default {
  props: ["propAddress", "propEmail"],
  data() {
    return {
      email: "",
      code: "",
      timer: null,
      sendTimeout: 59,
    };
  },
  methods: {
    submit() {
      this.$emit("submit", this.code, this.email);
    },
    getCodeByAliCaptcha() {
      let params = {};
      if (this.propAddress) {
        params = { address: this.propAddress };
      } else {
        if (!this.email || !this.webUtil.formatEmail(this.email)) {
          return this.$toast(this.$t("enter_email_first"));
        }
        params = { email: this.email };
      }

      let AliCaptchaCallbackFunc = (result) => {
        if (
          result &&
          result.data &&
          result.getCaptchaData(result.data).humanCheckMode &&
          !result.ticket
        ) {
          var captcha = result.getCaptchaData(result.data);
          params.humanCheckMode = captcha.humanCheckMode;
          params.humanCheckParams = captcha.humanCheckParams;

          this.$loading(1);

          this.axios
            .post(
              this.apiDomain + "apiPolka/getMathDIDEmailCode?v=1.0",
              this.webUtil.qsStringify(params)
            )
            .then((res) => {
              this.$loading(0);
              if (res.data.success) {
                this.sendTimeout = 59;

                if (this.timer) {
                  clearInterval(this.timer);
                }
                this.timer = setInterval(() => {
                  if (this.sendTimeout > 0) {
                    this.sendTimeout--;
                  } else {
                    clearInterval(this.timer);
                    this.timer = null;
                  }
                }, 1000);
              } else {
                this.$toast(res.data.message);
              }
            })
            .catch((err) => {
              console.log(err);
              this.$toast(err, 3000);
              this.$loading(0);
            });
        }
      };
      let AliCaptcha = this.$AliCaptcha(AliCaptchaCallbackFunc);
      AliCaptcha.initAliCaptcha(this.lang == "cn" ? "cn" : "en");
    },
  },
};
</script>
