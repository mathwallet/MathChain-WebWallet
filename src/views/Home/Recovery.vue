<template>
  <article class="basic-form">
    <div v-if="!email">
      <label>{{ $t("recover_target_address") }}</label>
      <input
        type="text"
        v-model="address"
        :placeholder="$t('webwallet_address')"
      />
      <a class="btn block-btn" @click="getEmail">{{ $t("submit") }}</a>
    </div>
    <VerifyCode
      v-else
      :propAddress="address"
      :propEmail="email"
      @submit="recovery"
    />
  </article>
</template>
<script>
import VerifyCode from "@/components/VerifyCode.vue";
export default {
  components: { VerifyCode },
  data() {
    return {
      address: "",
      email: "",
    };
  },
  methods: {
    getEmail() {
      if (!this.address) {
        return this.$toast(this.$t("enter_target_address_first"));
      }
      if (this.address == this.account.address) {
        return this.$toast(this.$t("target_address_not_current"));
      }
      this.axios
        .get(
          this.apiDomain +
            "apiPolka/getMathDIDBoundEmail?mathAddr=" +
            this.address
        )
        .then((res) => {
          if (res.data.success) {
            this.email = res.data.data.email;
          } else {
            this.email = "";
            this.$toast(res.data.message, 3000);
          }
        })
        .catch((err) => {
          console.log(err);
          this.email = "";
          this.$toast(err, 3000);
          this.$loading(0);
        });
    },
    async recovery(code) {
      if (!code) {
        return this.$toast(this.$t("enter_code_first"));
      }

      this.$loading(1);

      const randomCode = "Address recovery operation through Math Wallet";

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
          this.apiDomain + "apiPolka/mathAddressRecover",
          this.webUtil.qsStringify({
            currentAddr: this.account.address,
            code: code,
            targetAddr: this.address,
            message: randomCode,
            sign: signRes.mathSign,
          })
        )
        .then((result) => {
          this.$loading(0);
          if (result.data.success) {
            this.$toast(this.$t("recovery_success"));
          } else {
            this.$toast(result.data.message, 3000);
          }
          setTimeout(() => {
            this.email = "";
            this.address = "";
          }, 2000);
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
