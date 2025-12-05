export const getUserInfoApi = () => {
  return new Promise((resolve, reject) => {
    resolve({
      data: {
        id: 1,
        name: 'admin',
        email: 'admin@example.com',
        phone: '12345678901',
        role: 'admin',
        date: '2021-01-01',
        nickName: 'admin',
        avatar: 'https://example.com/avatar.png',
        roleList: ['admin'],
      },
      token: 'do-sso-token',
      msg: 'success',
    });
    reject({
      data: null,
      msg: 'error',
    });
  });
};
