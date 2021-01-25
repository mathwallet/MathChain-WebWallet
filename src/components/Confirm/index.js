import ConfirmComponent from "./Confirm.vue";

const Confirm = {};

Confirm.install = function(Vue) {
  const ConfirmConstructor = Vue.extend(ConfirmComponent); // 引入先前写好的vue
  const instance = new ConfirmConstructor();

  instance.$mount(document.createElement("div"));
  document.body.appendChild(instance.$el);

  /**
   *
   * @param {confirmInfo} 显示内容文案
   * @param {yesBtn} 显示确认按钮文案
   * @param {noBtn} 显示取消按钮文案
   */
  Vue.prototype.$confirm = ({
    info: confirmInfo,
    yesBtn: confirmBtn,
    noBtn: closeBtn,
  } ) => {
    return new Promise( resolve => {
      instance.info = confirmInfo;
      instance.confirmBtn = confirmBtn;
      instance.closeBtn = closeBtn;
      instance.confirmShow = true;
      instance.yes = () => {
        instance.confirmShow = false;
        resolve();
      };
    })
  };
};

export default Confirm;
