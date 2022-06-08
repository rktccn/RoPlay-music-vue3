import contextMenu from "./contextMenu.vue";
import { createApp } from "vue";
import { usePlayer } from "../store/player";

const ELEMENT = document.getElementsByClassName("el-main")[0];

const preventScroll = (event) => {
    event.preventDefault();
    event.stopPropagation();
}


const init = () => {
    // 阻止页面右击事件
    document.oncontextmenu = function () {
        return false;
    };

    // 禁用滚动事件
    ELEMENT.addEventListener("wheel", preventScroll);
};

const createContextMenu = (mousePosition, id) => {
    init();

    // 创建一个挂载容器
    const parentNode = document.createElement("div");

    // 卸载组件
    const unmount = () => {
        document.oncontextmenu = function () {
            return true;
        };
        contextMenuInstance.unmount();
        document.body.removeChild(parentNode);
        ELEMENT.removeEventListener("wheel", preventScroll);
    }

    const contextMenuInstance = createApp(contextMenu, {
        mousePosition,
        id,
        player: usePlayer(),
        onClose: () => {
            unmount();
        },
    });
    // 挂载组件
    document.body.appendChild(parentNode);
    contextMenuInstance.mount(parentNode);
}

export default createContextMenu;
