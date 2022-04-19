<template lang="">
  <div class="login">
    <div class="logo">
      <div class="name">
        Ro<br />
        Play
      </div>
      <span class="material-icons-round gap"> close </span>
      <div class="neteast">
        <img src="../../images/netease_music_icon.png" alt="" />
      </div>
    </div>

    <!-- 验证码 -->
    <div class="form">
      <form class="phone" v-if="logMode === 'phone'">
        <input
          type="tel"
          name="phone"
          id="phone"
          autocomplete="off"
          placeholder="请输入手机号"
        />
        <div class="captcha">
          <input
            type="number"
            name="captcha"
            id=""
            autocomplete="off"
            placeholder="请输入验证码"
          />
          <span
            class="send-sms primary"
            :class="isSending ? 'container-primary' : 'primary'"
            @click="sendSms"
            >发送验证码</span
          >
        </div>
      </form>

      <!-- 密码登陆 -->
      <form class="password-form" v-if="logMode === 'password'">
        <input
          type="text"
          name="account"
          id="account"
          autocomplete="off"
          placeholder="请输入手机号或邮箱"
        />
        <input
          type="password"
          name="password"
          id="password"
          autocomplete="off"
          placeholder="请输入密码"
        />
      </form>

      <!-- 二维码登陆 -->
      <div class="qrcode" v-if="logMode === 'qr'">
        <div class="qrcode-container block" v-loading="qr.pic === null">
          <img :src="qr.pic" alt="" />
          <!-- 提示浮层 -->
          <div
            class="qrcode-tip"
            :class="{ click: qr.tip.text === '二维码已过期' }"
            v-if="qr.tip.text !== null"
            @click="refreshQrCode"
          >
            <span class="material-icons-round icon font-size-48">
              {{ qr.tip.icon }}
            </span>
            {{ qr.tip.text }}
          </div>
        </div>
        <div class="qrcode-text">使用手机扫描二维码登陆</div>
      </div>

      <div class="login-button primary" v-if="logMode !== 'user'">
        <span class="material-icons-round icon"> login </span>
        登陆
      </div>
      <div class="reg-button block" v-if="logMode !== 'user'">创建账户</div>

      <!-- 搜索用户名 -->
      <form class="search-user" v-if="logMode === 'user'">
        <input
          type="text"
          name="search-user"
          id="search-user"
          autocomplete="off"
          placeholder="请输入用户名"
          v-model="search.user"
        />
        <div class="search-user-result">
          <div
            class="search-user-item block"
            v-for="(user, index) in search.userList"
            :key="index"
            @click="
              search.selectUserIndex === index
                ? (search.selectUserIndex = -1)
                : (search.selectUserIndex = index)
            "
            :class="{ primary: search.selectUserIndex === index }"
          >
            <div class="avatar">
              <img :src="`${user.avatarUrl}?param=48y48`" alt="" />
            </div>
            <span class="name text-truncate">{{ user.nickname }}</span>
            <span class="material-icons-round icon">
              {{ search.selectUserIndex === index ? "close" : "check" }}
            </span>
          </div>
        </div>

        <div
          class="login-button primary"
          :class="{ unable: search.selectUserIndex === -1 }"
          @click="getUserPlaylistFn"
        >
          确定
        </div>
      </form>
    </div>

    <!-- 登陆模式切换 -->
    <ul class="login-mode">
      <li
        class="item block"
        :class="{ active: logMode === 'phone' }"
        @click="logMode = 'phone'"
      >
        <div class="inner">
          <span class="material-icons-round icon">textsms </span>验证码登陆
        </div>
      </li>
      <li
        class="item block"
        :class="{ active: logMode === 'password' }"
        @click="logMode = 'password'"
      >
        <div class="inner">
          <span class="material-icons-round icon"> password </span>密码登陆
        </div>
      </li>
      <li
        class="item block"
        :class="{ active: logMode === 'qr' }"
        @click="logMode = 'qr'"
      >
        <div class="inner">
          <span class="material-icons-round icon"> qr_code </span>二维码登陆
        </div>
      </li>
      <li
        class="item block"
        :class="{ active: logMode === 'user' }"
        @click="logMode = 'user'"
      >
        <div class="inner">
          <span class="material-icons-round icon"> person </span>搜索用户名
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { reactive, toRefs, watch } from "vue";
import md5 from "crypto-js/md5";
import {
  loginQrCodeKey,
  loginQrCodeCreate,
  loginQrCodeCheck,
  loginWithPhone,
  sendCaptcha,
  verifyCaptcha,
  loginWithEmail,
} from "../../apis/login";
import { search } from "../../apis/others";
import { useStore } from "../../store";
import { getUserInfo } from "../../utils/common";

export default {
  name: "Login",
  setup() {
    const data = reactive({
      logMode: "phone", // phone, password, qr, user
      isSending: false, // 是否正在发送验证码
      // 二维码登陆
      qr: {
        pic: null, // 二维码图片
        tip: {
          icon: null, // 提示图标
          text: null, // 提示文字
        },
        key: "", // 二维码key
      },
      // 搜索登陆
      search: {
        userList: [], // 搜索用户列表
        user: "", // 搜索用户名
        selectUserIndex: -1, // 选中的用户索引
      },
    });
    const store = useStore();

    // 判断是否为邮箱
    const isEmail = (str) => {
      const reg =
        /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      return reg.test(str);
    };

    // 判断是否为手机号
    const isPhone = (str) => {
      const reg = /^1[3-9]\d{9}$/;
      return reg.test(str);
    };

    // 发送验证码并倒计时
    const sendSms = () => {
      if (data.isSending) return;
      const phone = document.getElementById("phone").value;
      if (!isPhone(phone)) {
        alert("请输入正确的手机号");
        return;
      }
      // 发送验证码

      // 倒计时
      let time = 61;
      data.isSending = true;
      const timer = setInterval(() => {
        time--;
        document.getElementsByClassName("send-sms")[0].innerText =
          "重新发送(" + time + "s)";
        if (time === 0) {
          clearInterval(timer);
          data.isSending = false;
          document.getElementsByClassName("send-sms")[0].innerText =
            "发送验证码";
        }
      }, 1000);

      // 发送成功
    };

    // 验证码登陆
    const phoneLogin = () => {
      const phone = document.getElementById("phone").value;
      const captcha = document.getElementById("captcha").value;
      if (!isPhone(phone)) {
        alert("请输入正确的手机号");
        return;
      }
      if (!captcha) {
        alert("请输入验证码");
        return;
      }

      // 验证验证码
      verifyCaptcha({ phone, captcha }).then((res) => {
        if (res.code === 200) {
          // 验证成功
          loginWithPhone(phone).then((res) => {
            if (res.code === 200) {
              // 登陆成功
              window.location.href = "/";
            } else {
              alert(res.msg);
            }
          });
        } else {
          alert(res.msg);
        }
      });
    };

    // 发送验证码
    const sendCaptchaFn = () => {
      const phone = document.getElementById("phone").value;
      if (!isPhone(phone)) {
        alert("请输入正确的手机号");
        return;
      }
      sendCaptcha({ phone }).then((res) => {
        if (res.code === 200) {
          // 发送成功
        } else {
          alert(res.msg);
        }
      });
    };

    // 密码登陆
    // 判断输入的账户类型，使用不同的接口登陆
    const passwordLogin = () => {
      const phone = document.getElementById("phone").value;
      let password = document.getElementById("password").value;
      if (!isPhone(phone)) {
        alert("请输入正确的手机号");
        return;
      }
      if (!password) {
        alert("请输入密码");
        return;
      }

      password = md5(password).toString();
      if (data.logMode === "phone") {
        // 手机号登陆
        loginWithPhone({ phone, md5_password: password }).then((res) => {
          if (res.code === 200) {
            // 登陆成功
            window.location.href = "/";
          } else {
            alert(res.msg);
          }
        });
      } else if (data.logMode === "email") {
        // 邮箱登陆
        loginWithEmail({ email, md5_password: password }).then((res) => {
          if (res.code === 200) {
            // 登陆成功
            window.location.href = "/";
          } else {
            alert(res.msg);
          }
        });
      }
    };

    // 生成登陆二维码
    const createQrCode = () => {
      if (data.logMode !== "qr") return;
      if (!data.qr.pic || data.qr.tip.text !== "二维码已过期")
        data.qr.pic = null;
      loginQrCodeKey().then((res) => {
        data.qr.key = res.data.unikey;
        console.log(data.qr.key);
        loginQrCodeCreate({ key: res.data.unikey, qrimg: true }).then(
          (res2) => {
            data.qr.pic = res2.data.qrimg;
          }
        );
      });
    };

    // 检测二维码扫描状态
    const checkQrCode = () => {
      if (data.logMode !== "qr") return;
      return loginQrCodeCheck(data.qr.key).then((res) => {
        // 根据返回值修改tip
        console.log(res);
        if (res.code === 801) {
          data.qr.tip = {
            icon: null,
            text: null,
          };
        }
        if (res.code === 802) {
          data.qr.tip = {
            icon: "check",
            text: "请在手机上确认",
          };
        }

        if (res.code === 800) {
          data.qr.tip = {
            icon: "warning_amber",
            text: "二维码已过期",
          };
          return;
        }

        if (res.code === 803) {
          data.qr.tip = {
            icon: "check",
            text: "登陆成功",
          };
          return;
        }

        // 循环检测
        setTimeout(() => {
          checkQrCode();
        }, 1000);
      });
    };

    // 当二维码过期时刷新二维码
    const refreshQrCode = () => {
      if (data.logMode !== "qr") return;
      if (data.qr.tip.text !== "二维码已过期") return;
      checkQrCode();
      createQrCode();
    };

    // 搜索用户
    const searchUser = () => {
      if (data.search.user === "") return;
      search({
        keywords: data.search.user,
        limit: 10,
        type: "用户",
      }).then((res) => {
        if (res.code === 200) {
          console.log(res);
          data.search.userList = res.result.userprofiles;
        }
      });
    };

    // 获取用户歌单
    const getUserPlaylistFn = () => {
      if (data.search.selectUserIndex === -1) return;

      console.log(data.search.userList[data.search.selectUserIndex]);

      store.setUserInfo({
        logMode: "name",
        userInfo: data.search.userList[data.search.selectUserIndex],
      });
    };

    watch(
      () => data.logMode,
      async (val) => {
        if (val === "qr") {
          await checkQrCode();
          createQrCode();
        }
      }
    );

    watch(
      () => data.search.user,
      (val) => {
        if (val === "") {
          data.search.userList = [];
          data.search.selectUserIndex = -1;
        } else {
          searchUser();
        }
      }
    );

    return { ...toRefs(data), sendSms, getUserPlaylistFn, refreshQrCode };
  },
};
</script>
<style lang="scss" scoped>
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 36px;
  .name {
    font-size: 2.75rem;
    font-weight: bolder;
  }

  .gap {
    font-size: 3.25rem;
    font-weight: bolder;
    margin: 0 32px;
  }

  .neteast {
    @include calc-width(1);

    img {
      width: 100%;
    }
  }
}

.login {
  @include calc-width(6);
  margin: 0 auto;
}
.login-mode {
  display: flex;
  justify-content: space-between;
  cursor: pointer;

  .item {
    position: relative;
    @include calc-width(1.4);
    transition: all $transition-time-default;

    .inner {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      transform: translate(-50%, -50%);

      display: flex;
      flex-direction: column;

      text-align: center;
      font-size: 16px;
      font-weight: bolder;

      .icon {
        font-size: 5.25rem;
        margin-bottom: 0.5rem;
      }
    }

    &::before {
      content: "";
      display: block;
      padding-top: 100%;
    }

    &:hover {
      background-color: var(--main-color);
      color: var(--background-color-primary);
    }

    &:active {
      background-color: var(--background-color-primary-container);
      color: var(--text-color-primary-container);
    }

    &.active {
      background-color: var(--main-color);
      color: #fff;
    }
  }
}

.form {
  display: flex;
  flex-direction: column;
  width: 60%;
  margin: 0 auto;
  margin-top: 36px;

  form {
    > * {
      margin-bottom: 16px;
    }

    input {
      height: 36px;
      width: 100%;
      border-radius: 50px;
      padding: 12px 18px;
      transition: box-shadow $transition-time-default;

      &:focus {
        box-shadow: 0 0 0 2px var(--main-color);
      }
    }
  }
}

.login-button,
.reg-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
  margin-top: 32px;
  height: 36px;
  border-radius: 50px;
  transition: all $transition-time-default;
  cursor: pointer;

  .icon {
    margin-right: 8px;
  }

  &:active {
    background-color: var(--background-color-primary-container);
    color: var(--text-color-primary-container);
  }
}

.reg-button {
  margin-top: 16px;
  margin-bottom: 36px;
}

.phone {
  .captcha {
    position: relative;
    display: flex;
    align-items: center;

    input {
      width: 100%;
    }

    .send-sms {
      position: absolute;
      right: 0;
      width: 35%;
      text-align: center;
      height: 36px;
      border-radius: 0 50px 50px 0;
      font-size: 14px;
      line-height: 36px;
      cursor: pointer;
      transition: background-color $transition-time-default;

      &:active {
        background-color: var(--background-color-primary-container);
        color: var(--text-color-primary-container);
      }
    }
  }
}

.qrcode {
  .qrcode-container {
    position: relative;
    width: 256px;
    height: 256px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;

    img {
      width: 100%;
    }

    .qrcode-tip {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: var(--background-color-primary);
      font-size: 24px;
      font-weight: bolder;

      .icon {
        font-weight: bolder;
        margin-bottom: 12px;
        cursor: auto;
      }

      &.click {
        cursor: pointer;
      }
    }
  }

  .qrcode-text {
    font-size: 1.5rem;
    font-weight: bolder;
    margin-top: 16px;
    text-align: center;
  }
}

.search-user {
  .search-user-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-height: 260px;
    overflow-x: scroll;
    margin-top: 16px;

    .search-user-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 4px 0;
      border-bottom: 1px solid var(--border-color);
      cursor: pointer;

      &:active {
        background-color: var(--background-color-primary-container);
        color: var(--text-color-primary-container);
      }

      .avatar {
        width: 48px;
        height: 48px;
        border-radius: $border-radius-default;
        overflow: hidden;
        img {
          width: 100%;
        }
      }

      .name {
        flex: 1 1 0;
        font-size: 1.25rem;
        font-weight: bolder;
        margin-left: 16px;
      }

      .icon {
        flex-basis: 1;
        font-weight: bolder;
      }
    }
  }

  .login-button {
    margin-top: 8px;
    margin-bottom: 24px;
  }
}

@media screen and(max-width:$lg) {
  .login {
    @include calc-width(9);
  }

  .logo {
    .neteast {
      @include calc-width(2);
    }
  }

  .login-mode {
    .item {
      @include calc-width(2.1);

      .inner {
        font-size: 12px;
        .icon {
          font-size: 3.25rem;
        }
      }
    }
  }

  .form {
    width: 70%;
  }
}

@media screen and(max-width:$md) {
  .login {
    @include calc-width(9);
  }

  .logo {
    .neteast {
      @include calc-width(2);
    }
  }

  .login-mode {
    .item {
      @include calc-width(2.1);

      .inner {
        font-size: 12px;
        .icon {
          font-size: 3.75rem;
        }
      }
    }
  }

  .form {
    width: 70%;
  }
}

@media screen and(max-width:$sm) {
  .login {
    @include calc-width(5);
  }

  .logo {
    .name {
      font-size: 2.75rem;
    }

    .gap {
      margin: 0 12px;
    }

    .neteast {
      @include calc-width(1.5);
    }
  }

  .login-mode {
    .item {
      @include calc-width(1.15);

      .inner {
        font-size: 12px;
        .icon {
          font-size: 1.75rem;
        }
      }
    }
  }

  .form {
    width: 100%;
  }
}
</style>
