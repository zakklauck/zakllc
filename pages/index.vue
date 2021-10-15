<template>
  <div class="home h-screen w-screen fixed">
    <div class="absolute bottom-0 left-0 pb-8 lg:pb-12 px-8 lg:px-28 w-full">
      <div 
        class="border-b border-black lg:px-6 py-8 times-body formatted-strong" 
        v-html="renderRichText(data.intro_text)"
      ></div>

      <div class="flex flex-col lg:flex-row justify-start lg:px-6 pt-8 lg:py-8">
        <div class="flex flex-col lg:flex-row mb-8 lg:mb-0">
          <p class="times-body mr-8">{{ data.links_pretext }}</p>
          <div class="flex">
            <a
              v-for="(link, index) in data.links" 
              :key="index"
              :href="link.link.url"
              class="venus-body lg:hover:opacity-50 transition-opacity duration-300 mr-8"
            >{{ link.link_text}}</a>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row">
          <p class="times-body mr-8">(current studio time & location)</p>
          <div class="flex">
            <p class="time venus-body mr-8">{{ time }}</p>
            <p class="venus-body">Brooklyn, NY</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import utils from '@/mixins/utils.js'
import { format } from 'date-fns'

export default {
  mixins: [utils],
  data () {
    return {
      time: null
    }
  },
  computed: {
    ...mapState({
      data: state => state.siteData.homePage.data
    })
  },
  mounted () {
    this.time = format(new Date(), 'hh:mm:ss')

    setInterval(() => {
      this.time = format(new Date(), 'hh:mm:ss')
    }, 1000)
  }
}
</script>

<style scoped>
  .time {
    width: 67px;
  }
</style>
