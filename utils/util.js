const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const greet = date => {
  const hour = date.getHours()
  let message = ''
  switch (true) {
    case hour > 5 && hour <= 9:
      message = '早上'
      break;
    case hour > 9 && hour <= 12:
      message = '上午'
      break;
    case hour > 12 && hour <= 14:
      message = '中午'
      break;
    case hour > 14 && hour <= 18:
      message = '下午'
      break;
    default:
      message = '晚上'
      break;
  }

  return `${message}好`
}

module.exports = {
  formatTime: formatTime,
  greet
}
