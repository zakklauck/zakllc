<template>
  <div :class="{ 'open': open }" class="home h-full w-full fixed py-8 lg:py-12 px-8 lg:px-28">
    <div class="relative top-0 left-0 w-full h-full flex flex-col justify-end">
      <div
        ref="top"
        class="top lg:px-6 py-8 times-body formatted-strong" 
        v-html="renderRichText(data.intro_text)"
      ></div>

      <div ref="zWrapper" class="z-wrapper h-full w-full" :style="{ height: open ? `calc(100% - ${topHeight + bottomHeight}px)` : '0px' }">
        <ZIcon />
      </div>

      <div ref="bottom" class="flex flex-col lg:flex-row justify-start lg:px-6 pt-8 lg:py-8">
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
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import utils from '@/mixins/utils.js'
import ZIcon from '@/components/ZIcon'
import moment from 'moment-timezone'

export default {
  components: { ZIcon },
  mixins: [utils],
  data () {
    return {
      time: null,
      open: false,
      topHeight: 0,
      bottomHeight: 0,
      animating: false
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

          var xUp = evt.touches[0].clientX;                                    
          var yUp = evt.touches[0].clientY;

          var xDiff = xDown - xUp;
          var yDiff = yDown - yUp;
                                                                              
          if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
              if ( xDiff > 0 ) {
                  /* right swipe */ 
              } else {
                  /* left swipe */
              }                       
          } else {
              if ( yDiff > 0 && !self.animating) {
                  /* down swipe */ 
                  // console.log('down')
                  self.open = true
                  self.animating = true

                  setTimeout(() => {
                    self.animating = false
                  }, 1500)
              } else if (yDiff < 0 && !self.animating) { 
                  /* up swipe */
                  // console.log('up')
                  self.open = false
                  self.animating = true

                  setTimeout(() => {
                    self.animating = false
                  }, 1500)
              }                                                                 
          }
          /* reset values */
          xDown = null;
          yDown = null;                                             
      };
    } else {
      document.addEventListener('wheel', e => {
        console.log('wheeling')
        if (e.deltaY > 0 && !this.animating) {
          this.open = true
          this.animating = true

          setTimeout(() => {
            this.animating = false
            console.log('finishedd')
          }, 1500)
        } else if (e.deltaY < 0 && !this.animating) {
          this.open = false
          this.animating = true

          setTimeout(() => {
            this.animating = false
            console.log('finished')
          }, 1500)
        }
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
