import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.1.4/vue.esm-browser.js';

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/admin/signin',
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    login() {
      axios.post(this.apiUrl, this.user).then((res) => {
        console.log(res);
        const data = res.data;
        if (data.success) {
          const { token, expired } = data;
          console.log(token, expired);
          document.cookie = `hexToken=${token};expires=${new Date(
            expired,
          )} ;path=/`;
          window.location = 'products.html';
        } else {
          window.location = 'login.html';
        }
      });
    },
  },
});

app.mount('#app');
