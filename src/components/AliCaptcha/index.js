import AliComponent from "./AliCaptcha.vue";

const AliCaptcha = {};

AliCaptcha.install = function(Vue) {
  const AliConstructor = Vue.extend(AliComponent);
  const instance = new AliConstructor();

  instance.$mount(document.createElement("div"));
  document.body.appendChild(instance.$el);

  /**
   * @param {callback}
   */
  Vue.prototype.$AliCaptcha = (callback) => {

    instance.AliCaptchaCallback = callback

    return instance;
  };
};

export default AliCaptcha;
