<template>
  <div :class="{ 'open': open }" class="home h-full w-full fixed py-8 lg:py-12 px-8 lg:px-28">
    <div class="relative top-0 left-0 w-full h-full flex flex-col justify-end">
      <div
        ref="top"
        class="top lg:px-6 py-8 times-body formatted-strong" 
        v-html="renderRichText(data.intro_text)"
      ></div>

      <div ref="zWrapper" class="z-wrapper h-full w-full relative overflow-hidden" :style="{ height: open ? `calc(100% - ${topHeight + bottomHeight}px)` : '0px' }">
        <div 
          v-if="data.images"
          class="carousel absolute top-0 left-0 w-full h-full p-12"
        >
          <div ref="carouselEl" class="swiper-container w-full h-full overflow-hidden">
            <div class="swiper-wrapper">
              <div 
                v-for="(image, index) in data.images" 
                :key="index" 
                class="swiper-slide w-full h-full"
              >
                <img class="object-contain object-center w-full h-full" :src="image.image.url" :alt="image.image.alt">
              </div>
            </div>
          </div>
        </div>

        <div class="w-full h-full pointer-events-none relative z-10">
          <ZIcon />
        </div>
      </div>

      <div ref="bottom" class="flex flex-col lg:flex-row justify-between lg:px-6 pt-8 lg:py-8">
        <div class="flex flex-col lg:flex-row">
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
              <p class="venus-body">{{ data.city_text }}</p>
            </div>
          </div>
        </div>

        <div v-if="data.images" :class="{ 'opacity-0 pointer-events-none': !open }" class="hidden lg:flex transition-opacity duration-300">
          <button @click.prevent="prev()" class="venus-body pr-5 lg:hover:opacity-50 transition-opacity duration-300">Prev</button>
          <button @click.prevent="next()" class="venus-body lg:hover:opacity-50 transition-opacity duration-300">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import utils from '@/mixins/utils.js'
import ZIcon from '@/components/ZIcon'
import moment from 'moment-timezone'
import Swiper from 'swiper/swiper-bundle.js'
import 'swiper/swiper-bundle.css'

export default {
  components: { ZIcon },
  mixins: [utils],
  data () {
    return {
      time: null,
      open: false,
      topHeight: 0,
      bottomHeight: 0,
      animating: false,
      carousel: null
    }
  },
  computed: {
    ...mapState({
      data: state => state.siteData.homePage.data,
      isMobile: state => state.isMobile
    })
  },
  methods: {
    setIsMobile () {
      if (process.client) {
        window.matchMedia('(max-width: 1024px)').matches
        ? this.$store.dispatch('setIsMobile', true)
        : this.$store.dispatch('setIsMobile', false)
      }
    },
    prev () {
      this.carousel.slidePrev()
    },
    next () {
      this.carousel.slideNext()
    }
  },
  created () {
    this.setIsMobile()
  },
  mounted () {
    this.topHeight = this.$refs.top.clientHeight + 2 // + 2 to account for border
    this.bottomHeight = this.$refs.bottom.clientHeight

    this.time = moment().tz(this.data.timezone).format('hh:mm:ss')

    setInterval(() => {
      this.time = moment().tz(this.data.timezone).format('hh:mm:ss')
    }, 1000)

    if (this.isMobile) {
      document.addEventListener('touchstart', handleTouchStart, false);        
      document.addEventListener('touchmove', handleTouchMove, false);
      const self = this

      var xDown = null;                                                        
      var yDown = null;

      function getTouches(evt) {
        return evt.touches ||             // browser API
              evt.originalEvent.touches; // jQuery
      }                                                     
                                                                              
      function handleTouchStart(evt) {
          const firstTouch = getTouches(evt)[0];                                      
          xDown = firstTouch.clientX;                                      
          yDown = firstTouch.clientY;                                      
      };                                                
                                                                              
      function handleTouchMove(evt) {
          if ( ! xDown || ! yDown ) {
              return;
          }
                                           
          var yUp = evt.touches[0].clientY;

          var yDiff = yDown - yUp;
                                                                              
          if ( yDiff > 0 && !self.animating) {
              /* down swipe */
              self.open = true
              self.animating = true

              setTimeout(() => {
                self.animating = false
              }, 1500)
          } else if (yDiff < 0 && !self.animating) { 
              /* up swipe */
              self.open = false
              self.animating = true

              setTimeout(() => {
                self.animating = false
              }, 1500)
          } 
          /* reset values */
          xDown = null;
          yDown = null;                                             
      };
    } else {
      document.addEventListener('wheel', e => {
        if (e.deltaY > 0 && !this.animating) {
          this.open = true
          this.animating = true

          setTimeout(() => {
            this.animating = false
          }, 1500)
        } else if (e.deltaY < 0 && !this.animating) {
          this.open = false
          this.animating = true

          setTimeout(() => {
            this.animating = false
          }, 1500)
        }
      })
    }

    if (this.data.images) {
      const self = this
      this.carousel = new Swiper(this.$refs.carouselEl, {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 0,
        initialSlide: 0,
        speed: 300,
        allowTouchMove: self.isMobile,
        init: true
      })
    }

    window.addEventListener('resize', () => {
      this.topHeight = this.$refs.top.clientHeight + 2 // + 2 to account for border
      this.bottomHeight = this.$refs.bottom.clientHeight
    })
  }
}
</script>

<style scoped>
  .time {
    width: 67px;
  }

  .z-wrapper {
    transition: height;
    transition-timing-function: cubic-bezier(.5,0,.1,1);
    transition-duration: .8s;
  }

  .carousel {
    /* z-index: -1; */
  }

  .z-wrapper::v-deep .z-icon {
    width: 100%;
    height: 100%;
    display: block;
  }

  .z-wrapper::v-deep .z-icon path {
    transition: stroke-width;
    transition-timing-function: cubic-bezier(.5,0,.1,1);
    transition-duration: .8s;
  }

  .top {
    border-bottom: 2px solid black;
    transition: border;
    transition-duration: .8s;
  }

  .home.open .z-wrapper::v-deep .z-icon path {
    stroke-width: 0.5;
  }

  .home.open .top {
    border-bottom: 2px solid transparent;
  }
</style>
