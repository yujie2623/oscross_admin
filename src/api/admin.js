import request from '../utils/request';

// 新闻添加
export const add = query => {
    return request({
        url: 'api/faq/add',
        method: 'post',
        data: query
    });
};

// 编辑文章
export const edit = query => {
  return request({
      url: 'api/faq/edit',
      method: 'post',
      data: query
  });
};

//获取新闻
export const getlist = query => {
  return request({
      url: 'api/faq/getlist',
      method: 'post',
      data: query
  });
};

// 多图上传
export const imageUpload = query => {
  return request({
      url: 'api/faq/upload',
      method: 'post',
      data: query
  })
}

// 删除文章
export const deleteArticle = query => {
  return request({
      url: 'api/faq/delete',
      method: 'post',
      data: query
  })
}

// 获取用户
export const getUserlist = query => {
  return request({
      url: 'api/user/getlist',
      method: 'post',
      data: query
  })
}

// 获取留言
export const getMsglist = query => {
  return request({
      url: 'api/message/getlist',
      method: 'post',
      data: query
  })
}

// 添加
export const add_apk = query => {
  return request({
      url: 'api/explorer/add_apk',
      method: 'post',
      data: query
  })
}

// 编辑
export const edit_apk = query => {
  return request({
      url: 'api/explorer/edit_apk',
      method: 'post',
      data: query
  })
}

// 文件上传
export const upload_apk = query => {
  return request({
      url: 'api/explorer/upload_apk',
      method: 'post',
      data: query
  })
}

// 获取上传列表
export const get_apk = query => {
  return request({
      url: 'api/explorer/get_apk',
      method: 'post',
      data: query
  })
}

// 删除列表
export const deleteApk = query => {
  return request({
      url: 'api/explorer/delete_apk',
      method: 'post',
      data: query
  })
}

