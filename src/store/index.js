import Vue from 'vue'
import Vuex from 'vuex'
import i18n from '../assets/js/i18n'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lang: i18n.locale,
    isLoading: true,
    EVMAddress:sessionStorage.getItem('EVMAddress')?sessionStorage.getItem('EVMAddress'):'',
    account: sessionStorage.getItem('account')?JSON.parse(sessionStorage.getItem('account')):null,
    balanceList: sessionStorage.getItem('balanceList')?JSON.parse(sessionStorage.getItem('balanceList')):null,
    legalList: sessionStorage.getItem('legalList')?JSON.parse(sessionStorage.getItem('legalList')):[{
      'name': '人民币',
      'alias': 'CNY',
      'symbol': '￥',
      'point': '2',
      'rmb': '1'
    }],
    legalCoin: sessionStorage.getItem('legalCoin')?JSON.parse(sessionStorage.getItem('legalCoin')):null,
    tokenPrice: 0,
    backupEmail:sessionStorage.getItem('backupEmail')?sessionStorage.getItem('backupEmail'):'',
  },
  getters: {
    lang(state) {
      return state.lang
    },
    isLoading(state) {
      return state.isLoading
    },
    EVMAddress(state) {
      return state.EVMAddress
    },
    account(state) {
      return state.account
    },
    balanceList(state) {
      return state.balanceList;
    },
    legalList(state) {
      return state.legalList;
    },
    legalCoin(state) {
      return state.legalCoin;
    },
    tokenPrice(state) {
      return state.tokenPrice;
    },
    backupEmail(state) {
      return state.backupEmail;
    },
  },
  mutations: {
    setLang(state, val) {
      i18n.setUserLanguage(val)
      state.lang = val;
    },
    setLoading(state, val) {
      state.isLoading = val;
    },
    setEVMAddress(state, val) {
      state.EVMAddress = val;
      sessionStorage.setItem('EVMAddress', val)
    },
    setAccount(state, val) {
      state.account = val;
      sessionStorage.setItem('account', JSON.stringify(val))
    },
    logout(state) {
      state.account = '';
      state.EVMAddress = '';
      sessionStorage.clear();
    },
    setBalanceList(state, val) {
      state.balanceList = val;
      sessionStorage.setItem( 'balanceList', JSON.stringify(val) );
    },
    setLegalList( state, list ) {
      sessionStorage.setItem( 'legalList', JSON.stringify( list ) );
      state.legalList = list
    },
    setLegalCoin( state, coin ) {
      sessionStorage.setItem( 'legalCoin', JSON.stringify( coin ) );
      state.legalCoin = coin;
    },
    setTokenPrice( state, price ) {
      state.tokenPrice = price;
    },
    setBackupEmail( state, email ) {
      sessionStorage.setItem( 'backupEmail', email );
      state.backupEmail = email;
    },
  },
  actions: {
    setLang(context, val) {
      context.commit('setLang', val)
    },
    setLoading(context, val) {
      context.commit('setLoading', val)
    },
    setEVMAddress(context, val) {
      context.commit('setEVMAddress', val)
    },
    setAccount(context, val) {
      context.commit('setAccount', val)
    },
    logout(context) {
      context.commit('logout')
    },
    setBalanceList(context, val) {
      context.commit('setBalanceList', val)
    },
    setLegalList(context, val) {
      context.commit('setLegalList', val)
    },
    setLegalCoin(context, val) {
      context.commit('setLegalCoin', val)
    },
    setTokenPrice(context, val) {
      context.commit('setTokenPrice', val)
    },
    setBackupEmail(context, val) {
      context.commit('setBackupEmail', val)
    },
  },
})
