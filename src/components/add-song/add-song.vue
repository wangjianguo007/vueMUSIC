<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQueryChange" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <Switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></Switches>
        <div class="list-wrapper">
          <Scroll ref="songList" v-if="currentIndex===0" class="list-scroll" :data="playHistory">
            <div class="list-inner">
              <SongList :songs="playHistory" @select="selectSong">
              </SongList>
            </div>
          </Scroll>
          <Scroll :refreshDelay="refreshDelay" ref="searchList" v-if="currentIndex===1" class="list-scroll" :data="searchHistory">
            <div class="list-inner">
              <SearchList @delete="deleteSearchHistory" @select.stop="addQuery" :searches="searchHistory"></SearchList>
            </div>
          </Scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :showSinger="showSinger" @select="selectSuggest" @listScroll="blurInput"></suggest>
      </div>
      <TopTip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </TopTip>
    </div>
  </transition>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import {searchMixin} from 'common/js/mixin'
import Switches from 'base/switches/switches'
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import {mapGetters, mapActions} from 'vuex'
import Song from 'common/js/song'
import SearchList from 'base/search-list/search-list'
import TopTip from 'base/top-tip/top-tip'

  export default {
    mixins: [searchMixin],
    components: {
      SearchBox,
      Suggest,
      Switches,
      SongList,
      Scroll,
      SearchList,
      TopTip
    },
   data() {
      return {
        showFlag: false,
        query:'',
        showSinger: false,
        currentIndex: 0,
        switches: [
          {
            name: '最近播放'
          },
          {
            name: '搜索历史'
          }
        ]
      }
    },
    computed: {
      ...mapGetters([
        'playHistory'
      ])
    },
    methods: {
      show() {
        this.showFlag = true
        setTimeout(() => {
          if (this.currentIndex === 0) {
            this.$refs.songList.refresh()
          } else {
            this.$refs.searchList.refresh()
          }
        }, 20)
      },
      hide() {
        this.showFlag = false
      },
      selectSuggest(){
        this.saveSearch()
        this.$refs.topTip.show()
      },
      switchItem(index){
        this.currentIndex=index
      },
      selectSong(song,index){
        if(index!==0){
          this.insertSong(new Song(song))
          this.$refs.topTip.show()
        }
      },
      ...mapActions([
        'insertSong'
      ])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>