import request from '@/utils/request';

// 获取角色权限
export const getRoles = query => {
  return request({
      url: 'api/user/index',
      method: 'post',
      data: query
  })
}

// 退出登录
export const logout = query => {
  return request({
      url: 'api/user/logout',
      method: 'post',
      data: query
  })
}

// 登录注册
export const userLogin = query => {
    return request({
        url: 'api/user/login',
        method: 'post',
        data: query
    });
};

// 获取验证码
export const vcode = query => {
  return request({
      url: 'api/user/sms_code',
      method: 'post',
      data: query
  });
};

// 注册
export const register = query => {
  return request({
      url: 'api/user/register',
      method: 'post',
      data: query
  });
};

