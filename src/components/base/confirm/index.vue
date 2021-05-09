<template>
  <teleport to="body">
    <transition name="confirm-fade">
      <div class="confirm" v-show="visible">
        <div class="confirm-wrapper">
          <div class="confirm-content">
            <p class="text">{{ text }}</p>
            <div class="operate">
              <div
                class="operate-btn left"
                @click="confirm"
              >
                {{ confirmBtnText }}
              </div>
              <div
                class="operate-btn"
                @click="cancel"
              >
                {{ cancelBtnText }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Confirm',
  props: {
    text: {
      type: String,
      default: ''
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    }
  },
  emits: ['confirm', 'cancel'],
  setup (props, { emit }) {
    const visible = ref(false)

    function show (): void {
      visible.value = true
    }

    function hide (): void {
      visible.value = false
    }

    function confirm (): void {
      hide()
      emit('confirm')
    }

    function cancel (): void {
      hide()
      emit('cancel')
    }

    return {
      visible,

      show,
      hide,
      confirm,
      cancel
    }
  }
})
</script>

<style scoped lang="less">
.confirm {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 998;
  background-color: @color-background-d;

  &.confirm-fade-enter-active {
    animation: confirm-fadein 0.3s;

    .confirm-content {
      animation: confirm-zoom-in 0.3s;
    }
  }

  &.confirm-fade-leave-active {
    animation: confirm-fadeout 0.3s;

    .confirm-content {
      animation: confirm-zoom-out 0.3s;
    }
  }

  .confirm-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 999;
    transform: translate(-50%, -50%);

    .confirm-content {
      width: 270px;
      background: @color-highlight-background;
      border-radius: 13px;

      .text {
        padding: 19px 15px;
        color: @color-text-l;
        font-size: @font-size-large;
        line-height: 22px;
        text-align: center;
      }

      .operate {
        display: flex;
        align-items: center;
        font-size: @font-size-large;
        text-align: center;

        .operate-btn {
          flex: 1;
          padding: 10px 0;
          color: @color-text-l;
          line-height: 22px;
          border-top: 1px solid @color-background-d;

          &.left {
            color: @color-text;
            border-right: 1px solid @color-background-d;
          }
        }
      }
    }
  }
}

@keyframes confirm-fadein {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes confirm-fadeout {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes confirm-zoom-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes confirm-zoom-out {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}
</style>
