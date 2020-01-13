const app = getApp()
const api = require('../../utils/api.js')
const city = require('../../utils/city.js')

Page({
  data: {
  	cityList: [],
    suggestion: [],
    city: '',
    showCity: true
  },
  onLoad: function () {

  	this.setData({
  		cityList: city.city
  	})
  },

  chooseCity(event) {
    let data = event.currentTarget.dataset.loc
  	let city = {
  		longitude: data.location.lng,
  		latitude: data.location.lat,
      name: data.fullname ? data.fullname : data.title
  	}
    city = JSON.stringify(city)
  	wx.navigateTo({
      url: '../weather/weather?city='+city
    });
  },

  goWeather() {
    wx.navigateTo({
      url: '../weather/weather'
    })
  },

  getSuggestion(e) {
    if (!e.detail.value) {
      wx.showToast({
        title: '请输入查询地址',
        icon: 'none',
        duration: 2000
      })
      return
    }
    api.getSuggestion(e.detail.value)
    .then(res => {
      this.setData({
        city: res.data[0] ? res.data[0].city : '无匹配地址',
        suggestion: res.data,
        showCity: false
      })
    })
  },

  // 根据城市名获取纬度
  getcity() {
    api.geocoder(this.data.city)
    .then(res => {
      let city = {
        longitude: res.result.location.lng,
        latitude: res.result.location.lat,
        name: this.data.city
      }
      city = JSON.stringify(city)
      wx.navigateTo({
        url: '../weather/weather?city='+city
      });
    })
  }
})
