<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
  // 监听更新消息
  window.electronAPI.onUpdateMessage((event, message) => {
    console.log(message);
  });

  // 监听更新可用
  window.electronAPI.onUpdateAvailable((event, version) => {
    console.log(`新版本 ${version} 可用，正在下载...`);
  });

  // 监听下载进度
  window.electronAPI.onDownloadProgress((event, progress) => {
    console.log(`${progress.percent}%`);
  });

  // 监听更新下载完成
  window.electronAPI.onUpdateDownloaded((event, version) => {
    console.log(`版本 ${version} 已下载完成，可以安装`);
  });

</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
