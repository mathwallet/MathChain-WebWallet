import LoadingComponent from './Loading.vue'

const Loading = {};

Loading.install = function (Vue) {
  const LoadingConstructor = Vue.extend(LoadingComponent)
  const instance = new LoadingConstructor();

  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)

  Vue.prototype.$loading = (bool) => {
    instance.loadingShow = bool;
    return instance
  }

}

export default Loading
