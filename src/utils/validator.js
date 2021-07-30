// 验证手机号码
export const phone = (phone) => {
  const str = (/^1[3456789]\d{9}$/.test(phone))
  return str
}

// 是否为数字
export const isFourNum = (num) => {
  const str = /^\d{4}$/.test(num)
  return str
}

// 字节格式化
export const bytesToSize = (bytes) => {
  if (bytes === 0) return '0B'
  const k = 1024
  const sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
}
