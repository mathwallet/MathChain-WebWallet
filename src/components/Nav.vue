<template>
  <nav>
    <a class="navbar-brand" href="https://mathwallet.org" target="_blank">
      <img
        src="@/assets/img/icons/MathWallet_Logo_Horizontal_White.png"
        height="44"
      />
    </a>
    <ul class="navbar-nav">
      <li>
        <a href="https://mathwallet.org" class="mobile">
          <img src="@/assets/img/icons/phone_blue@2x.png" height="16" />
          <span>APP</span>
        </a>
      </li>
      <li class="dropdown">
        <a href="javascript:;" @click="toggleDropdown()">
          <span>{{ $t("lang") }}</span>
          <img src="@/assets/img/icons/dropdown_white.png" width="12" />
        </a>
        <ul class="dropdown-menu" v-show="isLangShow">
          <li @click="changeLang('en')">English</li>
          <li @click="changeLang('cn')">中文</li>
          <li @click="changeLang('ko')">한국어</li>
        </ul>
      </li>
      <li class="dropdown">
        <a href="javascript:;" @click="toggleDropdown(1)">
          <span class="cUnit">{{ unit }}</span>
          <img src="@/assets/img/icons/dropdown_white.png" width="12" />
        </a>
        <ul class="dropdown-menu" v-show="isUnitShow">
          <li v-for="(item, i) in legalList" :key="i" @click="changeUnit(item)">
            {{ item.alias }}
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      isLangShow: false,
      isUnitShow: false,
    };
  },
  computed: {
    ...mapGetters({
      legalList: "legalList",
    }),
    unit() {
      return this.legalCoin ? this.legalCoin.alias : "CNY";
    },
  },
  methods: {
    ...mapActions(["setLang"]),
    toggleDropdown(type) {
      if (type) {
        this.isLangShow = false;
        this.isUnitShow = !this.isUnitShow;
      } else {
        this.isUnitShow = false;
        this.isLangShow = !this.isLangShow;
      }
    },
    changeLang(lang) {
      this.setLang(lang);
      this.isLangShow = false;
    },
    changeUnit(unit) {
      this.setLegalCoin(unit);
      this.isUnitShow = false;
    },
  },
};
</script>
<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--darkbg);
  padding: 10px 24px;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 500;
}
.navbar-brand img {
  display: block;
}
.navbar-nav {
  display: flex;
  padding: 14px 8px;
  line-height: 16px;
}
.navbar-nav .dropdown {
  display: inline-block;
  padding-left: 32px;
  position: relative;
}

.dropdown-menu {
  position: absolute;
  left: 12px;
  top: 100%;
  margin-top: 10px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  padding: 6px 0;
  z-index: 100;
}
.navbar-nav .dropdown a,
.navbar-nav .dropdown a:hover {
  color: #fff;
}
.navbar-nav .dropdown li {
  cursor: pointer;
  padding: 6px 20px;
}
.navbar-nav .mobile {
  color: #5ac8fa;
  padding-right: 24px;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}
span + img,
img + span {
  margin-left: 4px;
}
</style>
