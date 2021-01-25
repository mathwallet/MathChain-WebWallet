<template>
  <article class="basic-form">
    <div v-if="backupEmail">
      <label>{{ $t("DID") }}</label>
      <p class="input">{{ backupEmail }}</p>
    </div>
    <VerifyCode v-else @submit="backup" />
  </article>
</template>
<script>
import VerifyCode from "@/components/VerifyCode.vue";
export default {
  components: { VerifyCode },
  created() {
    this.getBackupEmail();
  },
  methods: {
    async backup(code, email) {
      if (!email || !this.webUtil.formatEmail(email)) {
        return this.$toast(this.$t("enter_email_first"));
      }
      if (!code) {
        return this.$toast(this.$t("enter_code_first"));
      }

      this.$loading(1);

      const randomCode = "Address backup operation through Math Wallet";

      const signRes = await this.user
        .signMessage(this.account, randomCode)
        .catch((err) => {
          console.log("signMessage err:", err);
          this.$toast(err.message, 3000);
        });

      if (!signRes || !signRes.mathSign) {
        this.$loading(0);
        return this.$toast(this.$t("sign_error"));
      }

      this.axios
        .post(
          this.apiDomain + "apiPolka/mathDIDEmailBind?v=1.0",
          this.webUtil.qsStringify({
            email: email,
            code: code,
            mathAddr: this.account.address,
            message: randomCode,
            sign: signRes.mathSign,
          })
        )
        .then((result) => {
          this.$loading(0);
          if (result.data.success) {
            this.$toast(this.$t("DID_success"));
            this.setBackupEmail(result.data.data.email);
          } else {
            this.$toast(result.data.message, 3000);
          }
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
