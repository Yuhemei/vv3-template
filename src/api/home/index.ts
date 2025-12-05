export const getSystemConfigApi = () => {
  return new Promise((resolve, reject) => {
    resolve({
      data: {
        copyright: 'Copyright © 2025 Do',
        icon: '/images/logo/favicon.ico',
        logo: '/images/logo/logo.png',
      },
      msg: 'success',
    });
    reject({
      data: null,
      msg: 'error',
    });
  });
};
