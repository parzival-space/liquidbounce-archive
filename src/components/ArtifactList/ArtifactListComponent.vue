<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  getBranches,
  getBuildsOfBranch, lbVersionSorter,
  type LiquidBounceBuild
} from '@/components/ArtifactList/LiquidBounceApi.ts'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps({
  onlyReleases: {
    type: Boolean,
    default: true
  }
})

const artifacts = ref([] as LiquidBounceBuild[]);

onMounted(async () => {
  const lbBranches = await getBranches();

  for (const branch of lbBranches) {
    console.log(`Fetching artifacts for branch: ${branch}`);
    artifacts.value.push(...await getBuildsOfBranch(branch, props.onlyReleases));
  }

  // sort
  artifacts.value.sort(lbVersionSorter);
});
</script>

<template>
  <ol v-if="artifacts.length !== 0" class="divide-y divide-gray-200 dark:divide-gray-700 max-w-screen-md mx-auto">
    <li v-for="artifact in artifacts.reverse()" v-bind:key="artifact.build_id" class="pb-3 pt-3 sm:pt-4 sm:pb-4">
      <div class="flex items-center space-x-4">
        <div class="flex-1 min-w-0">
          <p class="text-lg font-medium text-gray-900 truncate dark:text-white">
            {{ artifact.release ? `Release ${artifact.lb_version}` : `Build #${artifact.build_id}` }}
            <span class="text-sm font-medium text-gray-900 truncate dark:text-gray-300">
              for Minecraft {{ artifact.mc_version }}
            </span>
          </p>
          <div class="text-base text-gray-500 truncate dark:text-gray-400 flex space-x-2 mt-1">
            <!-- Minecraft Version -->
            <div class="inline-flex min-w-0">
              <span
                :title="`Minecraft ${artifact.mc_version}`"
                class="cursor-default inline-flex items-center px-2 py-0.75 text-sm font-medium text-lime-800 bg-lime-100 rounded-sm dark:bg-lime-900 dark:text-lime-300">
                <font-awesome-icon icon="fa-solid fa-gamepad" class="pe-2 text-sm" />
                {{ artifact.mc_version }}
              </span>
            </div>

            <!-- Java JRE Version -->
            <div class="inline-flex min-w-0">
              <span
                :title="`Java Runtime ${artifact.jre_version}`"
                class="cursor-default inline-flex items-center px-2 py-0.75 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-sm dark:bg-yellow-900 dark:text-yellow-300">
                <font-awesome-icon icon="fa-brands fa-java" class="pe-2 text-sm" />
                JRE {{ artifact.jre_version }}
              </span>
            </div>

            <!-- Loader -->
            <div class="inline-flex min-w-0">
              <!-- Forge -->
              <span
                :title="`${ artifact.subsystem.split('')[0].toUpperCase() + artifact.subsystem.slice(1) } Loader`"
                v-if="artifact.subsystem === 'forge'"
                class="cursor-default inline-flex items-center px-2 py-0.75 text-sm font-medium text-red-800 bg-red-100 rounded-sm dark:bg-red-900 dark:text-red-300">
                <font-awesome-icon icon="fa-solid fa-hammer" class="pe-2 text-sm" />
                {{ artifact.subsystem.split('')[0].toUpperCase() + artifact.subsystem.slice(1) }}
              </span>

              <!-- Fabric -->
              <span
                :title="`${ artifact.subsystem.split('')[0].toUpperCase() + artifact.subsystem.slice(1) } Loader`"
                v-else-if="artifact.subsystem === 'fabric'"
                class="cursor-default inline-flex items-center px-2 py-0.75 text-sm font-medium text-indigo-800 bg-indigo-100 rounded-sm dark:bg-indigo-900 dark:text-indigo-300">
                <font-awesome-icon icon="fa-solid fa-hammer" class="pe-2 text-sm" />
                {{ artifact.subsystem.split('')[0].toUpperCase() + artifact.subsystem.slice(1) }}
              </span>
            </div>

            <!-- Branch -->
            <div class="inline-flex min-w-0">
              <span
                :title="`${artifact.branch.split('')[0].toUpperCase() + artifact.branch.slice(1)} Branch`"
                class="cursor-default inline-flex items-center px-2 py-0.75 text-sm font-medium text-gray-800 bg-gray-100 rounded-sm dark:bg-gray-900 dark:text-gray-300">
                <font-awesome-icon icon="fa-solid fa-code-branch" class="pe-2 text-sm" />
                {{ artifact.branch.split("")[0].toUpperCase() + artifact.branch.slice(1) }}
              </span>
            </div>
          </div>
        </div>
        <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
          <a
            :href="artifact.url"
            target="_blank"
            class="text-white font-bold bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-2.5 me-2 mb-auto mt-auto dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            Download
          </a>
        </div>
      </div>
    </li>
  </ol>

  <!-- loading spinner -->
  <div v-else role="status" class="text-center my-80">
    <svg aria-hidden="true" class="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span class="sr-only">Loading...</span>
  </div>
</template>

<style scoped>

</style>
