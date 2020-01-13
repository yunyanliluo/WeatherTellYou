//logs.js
const app = getApp()
const util = require('../../utils/util.js')
const api = require('../../utils/api.js')
const imgCofig = require('../../utils/img-cofig.js')

Page({
  data: {
    backgroundImg: 'calm',
    userInfo: {},
    time: util.greet(new Date()),
    address:'定位中...',
    weatherNow: {
      tmp: '',        //温度
      cond_txt: '',   //实况天气
      cond_code: 999, //实况天气
      wind_dir: '',   //风向
      wind_sc: '',    //风力
      hum: '',        //湿度
      pres: '',       //大气压强
      pcpn: '',       //降水量
      loc: ''         //更新时间
    },
    hourlyWeather: [[],[]],
    dailyWeather: [],
    lifestyle: []
  },
  onLoad: function (option) {
    // 获取用户
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: app.globalData.userInfo
        })
      }
    })

    if (option.city) {
      let city = JSON.parse(option.city)
      this.setData({
        address: city.name
      })
      this.getWeather(city)
      return
    }

    this.getLocation()
  },

  onPullDownRefresh() {
    let pages = getCurrentPages()
    let page = pages[pages.length-1]
    let option = page.options
    if (option.city) {
      let city = JSON.parse(option.city)
      this.setData({
        address: city.name
      })
      this.getWeather(city)
      return
    }

    this.getLocation()
    wx.stopPullDownRefresh()
  },

  getLocation() {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        // 获取地理位置
        api.getLocation(res)
        .then(res => {
          that.setData({
            address: res.address
          })
        })
        .catch(err => {
          that.setData({
            address: '定位失败，请手动选择'
          })
        })

        that.getWeather(res)
      }
    })
  },

  getWeather(data) {
    let that = this
    // 获取实时天气
    api.getWeatherNow(data)
    .then(res => {
      that.setWeatherNow(res.data.HeWeather6[0])
      that.setBackgroundImg(that.data.weatherNow.cond_code)
    })

    // 获取未来24小时
    api.getWeatherHourly(data)
    .then(res => {
      that.setWeatherHourly(res.data.HeWeather6[0].hourly)
    })

    // 获取近3天
    api.getWeatherDaily(data)
    .then(res => {
      that.setWeatherDaily(res.data.HeWeather6[0].daily_forecast)
    })

    // 生活指数
    api.getWeatherLifestyle(data)
    .then(res => {
      that.setLifestyle(res.data.HeWeather6[0].lifestyle)
    })
  },

  setBackgroundImg(code) {
    let list = imgCofig.bgImgList
    let obj = {}
    obj = list.find(item => {
      return item.codes.includes(parseInt(code))
    })
    this.setData({
      backgroundImg: "bg" 
    })
  },

  setWeatherNow(data) {
    this.setData({
      weatherNow: {
        tmp: data.now.tmp,
        cond_txt: data.now.cond_txt,
        cond_code: data.now.cond_code,
        wind_dir: data.now.wind_dir,
        wind_sc: data.now.wind_sc,
        hum: data.now.hum,
        pres: data.now.pres,
        pcpn: data.now.pcpn,
        loc: data.update.loc.substring(11, 16)
      }
    })
  },

  setWeatherHourly(data) {
    data.map(item => {
      item.time = item.time.substring(11, 16)
    })
    this.setData({
      hourlyWeather: [data.slice(0,4),data.slice(4)]
    })
  },

  setWeatherDaily(data) {
    data = data.slice(0,3)
    data.map(item => {
      item.date = item.date.split('-').slice(1).join('/')
    })
    this.setData({
      dailyWeather: data
    })
  },

  setLifestyle(data) {
    data.forEach(item => {
      item.typeTxt = imgCofig.lifestyleImgList[item.type].txt
    })
    this.setData({
      lifestyle: data
    })
  }
})
