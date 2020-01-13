// 引入SDK核心类
var QQMapWX = require('./qqmap-wx-jssdk.js');

// 实例化API核心类
var demo = new QQMapWX({
  key: 'WPTBZ-SSW66-3CTSH-E6XLG-3G3W3-KMBR6' // 必填
});

// 获取地理位置
const getLocation = function(option) {
	return new Promise(function(resolve,reject) {
		demo.reverseGeocoder({
			location: {
				latitude: option.latitude,
				longitude: option.longitude
			},
			success: res => {
				resolve(res.result)
			},
			fail: res => {
				wx.showToast({
				  title: '获取位置信息失败，请手动选择',
				  icon: 'none',
				  duration: 2000
				})
				reject(res)
			}
		})
	})
}

const getSuggestion = function(value) {
	return new Promise(function(resolve,reject) {
		demo.getSuggestion({
			keyword: value,
			success: res => {
				resolve(res)
			},
			fail: res => {
				wx.showToast({
				  title: '查询失败',
				  icon: 'none',
				  duration: 2000
				})
				reject(res)
			}
		})
	})
}

const geocoder = function(address) {
	return new Promise(function(resolve,reject) {
		demo.geocoder({
			address: address,
			success: res => {
				resolve(res)
			},
			fail: res => {
				wx.showToast({
				  title: '查询失败',
				  icon: 'none',
				  duration: 2000
				})
				reject(res)
			}
		})
	})
}


// 和风天气api
const BASE_URL = 'https://free-api.heweather.net/s6/'

const getWeather = function({ type,name },option) {
	return new Promise((resolve,reject) => {
		wx.request({
			url: BASE_URL + type,
			data: {
				location: option.longitude + ',' + option.latitude,
				key: 'd469334ef67548578d65268f148b046f'
			},
			success(res) {
				resolve(res)
			},
			fail: res => {
				wx.showToast({
				  title: `获取${name}信息失败，请稍后重试`,
				  icon: 'none',
				  duration: 2000
				})
				reject(res)
			}
		})
	})
}

const getWeatherNow = function(option) {
	return getWeather({ type: 'weather/now',name: '实时' },option)
}

const getWeatherHourly = function(option) {
	return getWeather({ type: 'weather/hourly',name: '未来24小时' },option)
}

const getWeatherDaily = function(option) {
	return getWeather({ type: 'weather/forecast',name: '近3天' },option)
}

const getWeatherLifestyle = function(option) {
	return getWeather({ type: 'weather/lifestyle',name: '生活指数' },option)
}

const getAirNow = function(option) {
	return getWeather({ type: 'air/now',name: '空气质量' },option)
}


module.exports = {
  getLocation,
  getSuggestion,
  geocoder,
  getWeatherNow,
  getWeatherHourly,
  getWeatherDaily,
  getWeatherLifestyle,
  getAirNow
}