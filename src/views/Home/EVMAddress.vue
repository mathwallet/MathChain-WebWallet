<template>
  <article>
    <div v-if="EVMAddress" class="basic-form">
      <label>{{ $t("EVM_address") }}</label>
      <label class="setBtn" @click="copyAction(EVMAddress)">{{
        $t("copy_address")
      }}</label>
      <p class="input">{{ EVMAddress }}</p>
    </div>
    <a v-else class="btn block-btn" @click="createEVMAddress">{{
      $t("create_EVM_address")
    }}</a>
  </article>
</template>
<script>
export default {
  created() {
    this.getEVMAddress();
  },
  methods: {
    async createEVMAddress() {
      this.$loading(1);

      // get random string
      const strRes = await this.axios
        .post(
          this.apiDomain + "apiPolka/generateRandomStr?v=1.0",
          this.webUtil.qsStringify({
            mathAddr: this.account.address,
          })
        )
        .catch((err) => {
          this.$toast(err, 3000);
          this.$loading(0);
        });

      let randomCode =
        strRes && strRes.data.data.code ? strRes.data.data.code : "";

      const signRes = await this.user
        .signMessage(this.account, randomCode)
        .catch((err) => {
          console.log("signMessage err:", err);
          this.$toast(err.message, 3000);
        });

      if (
        !signRes ||
        !signRes.mathSign ||
        !signRes.ethAddr ||
        !signRes.ethSign
      ) {
        this.$loading(0);
        return this.$toast(this.$t("create_address_error"));
      }


      // 绑定
      this.axios
        .post(
          this.apiDomain + "apiPolka/verifyAndBindEVMAddress?v=1.0",
          this.webUtil.qsStringify({
            mathAddr: this.account.address,
            mathSign: signRes.mathSign,
            ethAddr: signRes.ethAddr,
            ethSign: signRes.ethSign,
            code: randomCode,
          })
        )
        .then((result) => {
          if(result.data.success){
            this.setEVMAddress(signRes.ethAddr)
          }else{
            this.$toast(this.$t("create_address_error"));
          }
          this.$loading(0);
        })
        .catch((err) => {
          console.log(err);
          this.$toast(err, 3000);
          this.$loading(0);
        });
    },
  },
};
</script>
