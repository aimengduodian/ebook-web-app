<template>
  <div class="q-pa-md">
    <q-infinite-scroll @load="onLoad" :offset="scrollOffset">
      <div v-for="(item, index) in items" :key="index"
           @click="switch_go(item.id)">
        <q-item>
          <q-item-section top thumbnail class="q-ml-none">
            <img style="object-fit: cover; border-radius: 10px" :src="item.elecPic" alt="">
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ item.electronicsName }}</q-item-label>
            <q-item-label mask="YYYY-MM-DD HH:mm:ss" caption>购买时间:{{ formatElectronicsDate(item.buyDate) }}
            </q-item-label>
            <q-item-label caption>价格：￥{{ item.presentPrice }}</q-item-label>
          </q-item-section>
        </q-item>
        <hr>
      </div>
      <!--添加消息-->
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots v-if="!loadAllData" color="primary" size="40px"/>
        </div>
      </template>
      <span v-if="loadAllData" class="row justify-center q-my-md"> 已经没有更多数据 </span>
    </q-infinite-scroll>
    <!--回到顶部-->
    <q-page-scroller v-if="!getFlag" position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn fab icon="keyboard_arrow_up" color="primary"/>
    </q-page-scroller>
    <q-page-scroller v-else position="bottom-right" :scroll-offset="-150" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="addElectronics"/>
    </q-page-scroller>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { date } from 'quasar'
  import config from 'src/common/config'

  export default {
    name: 'electronics',
    data () {
      return {
        reRequestTime: config.reRequestBaseInterval,
        reRequestInterval: config.reRequestAddInterval,
        loadAllData: false,
        scrollOffset: 250,
        items: [],
        params: {
          pageSize: 15,
          pageNumber: 1
        }
      }
    },
    created () {
      this.params = this.getSearchParamsMsg
      this.params.pageNumber = 1
      this.subAdvice()
    },
    methods: {
      addElectronics () {
        // goto 发布界面
        this.$router.push({ name: 'electronics_add' })
      },
      switch_go (id) {
        this.$router.push({ name: 'electronics_view', query: { id: id } })
      },
      splitMth (str) {
        const strs = str.split(',')
        return strs[0]
      },
      async subAdvice () {
        this.scrollOffset = -Math.abs(this.scrollOffset)
        await this.$axios.post('/electronics/electronics', this.params).then((res) => {
          res.data.page.pageInfo.list.forEach(item => {
            item.elecPic = config.picUrl + this.splitMth(item.electronicsPic)
            this.items.push(item)
          })
          if (!res.data.page.pageInfo.isLastPage) {
            this.pageNumber++
          } else {
            this.loadAllData = true
            this.scrollOffset = Math.abs(this.scrollOffset)
          }
        }).catch(err => {
          if (err === undefined) {
            this.reRequestTime = this.reRequestTime + this.reRequestInterval
            setTimeout(() => {
              this.subAdvice()
            }, this.reRequestTime)
          }
        })
      },
      onLoad (index, done) {
        if (!this.loadAllData) {
          this.subAdvice()
        }
        done()
      },
      formatElectronicsDate (val) {
        return date.formatDate(val, 'YYYY-MM-DD')
      }
    },
    computed: {
      ...mapGetters('auth', [ 'getFlag', 'needVerify', 'getSearchParamsMsg'])
    },
    watch: {
      getSearchParamsMsg (val) {
        if (this.$route.name === 'electronics') {
          this.loadAllData = false
          this.items = []
          this.params = []
          this.scrollOffset = Math.abs(this.scrollOffset)
          const data = JSON.parse(JSON.stringify(val))
          Object.keys(data).forEach(key => {
            this.params[key] = data[key]
          })
          this.subAdvice()
        }
      }
    }
  }
</script>
