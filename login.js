const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const formDom = document.querySelector('#form');

const api = 'https://vue3-course-api.hexschool.io/admin/signin';

const loginHandler = (event) => {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;
  const data = { username, password };

  axios.post(api, data).then((res) => {
    const data = res.data;
    if (data.success) {
      const { token, expired } = data;
      document.cookie = `hexToken=${token};expires=${new Date(
        expired,
      )} ;path=/`;
      window.location = 'products.html';
    } else {
      window.location = 'login.html';
    }
  });
};

formDom.addEventListener('submit', loginHandler);
