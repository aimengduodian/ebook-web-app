<template>
  <div class="q-pa-md">
    <q-infinite-scroll @load="onLoad" :offset="scrollOffset">
      <div v-for="(item, index) in items" :key="index"
           @click="switch_go(item.id)">
        <q-item>
          <q-item-section>
            <div class="text-h6">{{ item.name }}</div>
            <div class="text-subtitle2">薪酬：￥ {{ item.price }}</div>
            <div class="text-subtitle2">类型：{{ type[item.type] }}</div>
          </q-item-section>
          <q-item-section top thumbnail class="q-ml-none">
            <img style="object-fit: cover; height: 100%"
                 :src="picShow(item)" alt="">
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
      <q-btn fab icon="add" color="primary" @click="addCoach"/>
    </q-page-scroller>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import config from '../../../common/config'

  export default {
    name: 'coach',
    data () {
      return {
        reRequestTime: config.reRequestBaseInterval,
        reRequestInterval: config.reRequestAddInterval,
        loadAllData: false,
        scrollOffset: 250,
        type: ['辅导', '讲座'],
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
      addCoach () {
        // goto 发布界面
        this.$router.push({ name: 'coach_add' })
      },
      switch_go (id) {
        this.$router.push({ name: 'coach_view', query: { id: id } })
      },
      splitMth (str) {
        const strs = str.split(',')
        return strs[0]
      },
      async subAdvice () {
        this.scrollOffset = -Math.abs(this.scrollOffset)
        await this.$axios.post('/tutoring/tutorings', this.params).then((res) => {
          this.lastPage = res.data.page.pageInfo.lastPage
          res.data.page.pageInfo.list.forEach(item => {
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
      }
    },
    computed: {
      ...mapGetters('auth', ['getFlag', 'getSearchParamsMsg']),
      picShow: function () {
        return function (item) {
          const nowDate = Date.now()
          const isFresh = nowDate < item.startTime
          const isOrdered = item.orderUser !== null
          let picPath = ''
          picPath = 'coach/waiting.png'
          if (Number(this.getFlag) === 1) {
            if (isOrdered && isFresh) {
              picPath = 'coach/doing.png'
            }
            if (isOrdered && !isFresh) {
              picPath = 'coach/slice.png'
            }
            if (!isOrdered && !isFresh) {
              picPath = 'coach/overdue.png'
            }
          }
          return picPath
        }
      }
    },
    watch: {
      getSearchParamsMsg (val) {
        if (this.$route.name === 'coach') {
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
