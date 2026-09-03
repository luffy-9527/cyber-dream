<script>
export default {
  onLaunch: function () {
    console.log('✨ [CyberDream] 赛博解梦终端已启动...');
  },
  onShow: function () {
    console.log('✨ [CyberDream] 终端进入前台');
  },
  onHide: function () {
    console.log('✨ [CyberDream] 终端进入后台休眠');
  }
};
</script>

<style lang="scss">
@use './styles/theme.scss' as *;

/* 全局滚动条美化与重置 */
::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  color: transparent;
}

view, text, image, input, textarea, button {
  box-sizing: border-box;
}

button::after {
  border: none;
}
</style>
