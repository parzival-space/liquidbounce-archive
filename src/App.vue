<script setup lang="ts">
import '@/assets/main.css'
import ArtifactListComponent from '@/components/ArtifactList/ArtifactListComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'

const repoUrl = "https://github.com/parzival-space/liquidbounce-archive";
</script>

<template>
  <header>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.3/gh-fork-ribbon.min.css" />
  </header>

  <!-- GitHub Fork Ribbon -->
  <a class="github-fork-ribbon" href="https://github.com/parzival-space/liquidbounce-archive" data-ribbon="Fork me on GitHub" title="Fork me on GitHub">Fork me on GitHub</a>

  <div class="container max-w-screen-lg mx-auto mt-15">
    <img
      class="max-w-sm mx-auto mb-15"
      alt="LiquidBounce Logo"
      src="https://raw.githubusercontent.com/CCBlueX/LiquidCloud/master/LiquidBounce/liquidbounceLogo.svg"
    />

    <div class="container mt-5 mb-5 space-y-2">
      <h1 class="text-3xl text-center">LiquidBounce Archive</h1>
      <p class="text-xl whitespace-pre-line overflow-auto">
        This is a list of all public LiquidBounce build and release artifacts.
        You can download them by clicking the "Download" button below.
      </p>
      <p class="text-xl whitespace-pre-line overflow-auto">
        LiquidBounce Archive is not affiliated with LiquidBounce or CCBlueX in any way.
        No files are redistributed through this website. When you click the download button, you
        will be redirected to the official LiquidBounce website.
      </p>
    </div>

    <ArtifactListComponent />

    <FooterComponent />
  </div>
</template>

<style scoped>
.github-fork-ribbon:before { background-color: #333; }
</style>
