const fs = require('fs');
let txt = fs.readFileSync('src/pages_sub/result/result.vue', 'utf8');
const replacement = `function showRewardedVideoAd(adUnitId = '') {
  return new Promise((resolve, reject) => {
    if (typeof wx !== 'undefined' && wx.createRewardedVideoAd && adUnitId) {
      const rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId });
      rewardedVideoAd.onError((err) => {
        uni.showToast({ title: '广告加载失败，为您放行', icon: 'none' });
        resolve(true);
      });
      rewardedVideoAd.onClose((res) => {
        if (res && res.isEnded) {
          resolve(true);
        } else {
          uni.showToast({ title: '需观看完毕才能解锁哦', icon: 'none' });
          resolve(false);
        }
      });
      rewardedVideoAd.show().catch(() => {
        rewardedVideoAd.load().then(() => rewardedVideoAd.show()).catch(err => {
          resolve(true);
        });
      });
    } else {
      uni.showLoading({ title: '模拟观看广告中...' });
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({ title: '模拟广告播放完毕', icon: 'success' });
        resolve(true);
      }, 2000);
    }
  });
}`;
txt = txt.replace(/function showRewardedVideoAd[\s\S]*?\}\s*\}\);\s*\}/, replacement);
fs.writeFileSync('src/pages_sub/result/result.vue', txt, 'utf8');