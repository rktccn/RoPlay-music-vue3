// @params {String} title
// @params {String} message
// createTextModal(title,message)

import textModal from "./textModal.vue";
import {createApp} from "vue";

const createTextModal = (title, message) => {
  // 创建一个挂载容器
  const parentNode = document.createElement("div");

  // 卸载组件
  const unmount = () => {
    textModalInstance.unmount();
    document.body.removeChild(parentNode);
  };

  const textModalInstance = createApp(textModal, {
    title,
    message,
    onClose: () => {
      unmount();
    },
  });
  // 挂载组件
  document.body.appendChild(parentNode);
  textModalInstance.mount(parentNode);
};

export default createTextModal;
