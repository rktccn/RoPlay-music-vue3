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
    <div class="form phone">
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

      <div class="login-button primary">
        <span class="material-icons-round icon"> login </span>
        登陆
      </div>

      <div class="reg-button block">创建账户</div>
    </div>

    <ul class="login-mode">
      <li class="item block" :class="{ active: logMode === 'phone' }">
        <div class="inner">
          <span class="material-icons-round icon">textsms </span>验证码登陆
        </div>
      </li>
      <li class="item block">
        <div class="inner">
          <span class="material-icons-round icon"> password </span>密码登陆
        </div>
      </li>
      <li class="item block">
        <div class="inner">
          <span class="material-icons-round icon"> qr_code </span>二维码登陆
        </div>
      </li>
      <li class="item block">
        <div class="inner">
          <span class="material-icons-round icon"> person </span>搜索用户名
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { reactive, toRefs } from "vue";
export default {
  name: "Login",
  setup() {
    const data = reactive({
      logMode: "phone", // phone, password, qr
      isSending: false, // 是否正在发送验证码
    });

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

    return { ...toRefs(data), sendSms };
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
      background-color: var(--primary-container-color);
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

  > * {
    margin-bottom: 16px;
  }

  input {
    height: 36px;
    border-radius: 50px;
    padding: 12px 18px;
    transition: box-shadow $transition-time-default;

    &:focus {
      box-shadow: 0 0 0 2px var(--main-color);
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
    background-color: var(--primary-container-color);
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
        background-color: var(--primary-container-color);
      }
    }
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
