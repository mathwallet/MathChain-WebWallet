import ToastComponent from './Toast.vue'

const Toast = {};

// 注册Toast
Toast.install = function (Vue) {
    // 生成一个Vue的子类,引入先前写好的vue
    const ToastConstructor = Vue.extend(ToastComponent)
    // 生成一个该子类的实例
    const instance = new ToastConstructor();

    // 将这个实例挂载在我创建的div上
    // 并将此div加入全局挂载点内部
    instance.$mount(document.createElement('div'))
    document.body.appendChild(instance.$el)

    // 通过Vue的原型注册一个方法
    // 让所有实例共享这个方法
    // 其中的duration是持续时间
    Vue.prototype.$toast = ( toastInfo, duration = 2000 ) => {
        return new Promise( resolve => {
            instance.info = toastInfo;
            instance.toastShow = true;

            setTimeout(() => {
                instance.toastShow = false;
                resolve();
            }, duration);

            instance.close = ()=>{
                instance.toastShow = false;
                resolve();
            }
        })

    }

}

export default Toast
