const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const loginBtn = document.querySelector('#login');
const productsListDom = document.querySelector('#productList');

const host = 'https://vue3-course-api.hexschool.io';
const apiPath = 'marlonguo';

// const apiConfig = {
//   username: '',
//   password: '',
// };

const api = {
  checkLogin: host + '/api/user/check',
  getProducts: `${host}/api/${apiPath}/admin/products`,
  deleteProduct: `${host}/api/${apiPath}/admin/product`,
};

const App = {
  data: {
    products: [],
  },

  getData() {
    axios.get(api.getProducts).then((res) => {
      console.log(res);
      const { success, products } = res.data;
      if (success) {
        this.data.products = products;
        this.render();
      }
    });
  },

  deleteProduct(id) {
    console.log(`${api.deleteProduct}/${id}`);
    axios.delete(`${api.deleteProduct}/${id}`).then((res) => {
      console.log(res);
      if (res.data.success) {
        const index = this.data.products.findIndex((item) => item.id === id);
        this.data.products.splice(index, 1);
        this.render();
      }
    });
  },

  render() {
    // let template = '';
    // this.data.products.forEach((item) => {
    //   template += `
    //   <tr>
    //     <td>${item.title}</td>
    //     <td width="120">${item.origin_price}</td>
    //     <td width="120">${item.price}</td>
    //     <td width="150">${item.is_enabled}</td>
    //     <td width="120">${item.title} 刪除</td>
    //   </tr>
    //   `;
    // });
    const template1 = this.data.products
      .map(
        (item) => `
      <tr>
        <td>${item.title}</td>
        <td width="120">${item.origin_price}</td>
        <td width="120">${item.price}</td>
        <td width="150">${item.is_enabled}</td>
        <td width="120"><button type='button' data-action="delete" data-id="${item.id}">刪除</button></td>
      </tr>
    `,
      )
      .join('');
    productsListDom.innerHTML = template1;
  },

  init() {
    // 取token Cookie
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1',
    );
    console.log(token);
    axios.defaults.headers.common['Authorization'] = token;
    axios.post(api.checkLogin).then((res) => {
      console.log(res);
    });
  },
  login() {
    const username = usernameInput.value;
    const password = passwordInput.value;
    const data = { username, password };
    const api = `${host}/admin/signin`;
    axios.post(api, data).then((res) => {
      console.log(res);
      const data = res.data;
      if (data.success) {
        const { token, expired } = data;
        console.log(token, expired);
        document.cookie = `hexToken=${token};expires=${new Date(
          expired,
        )} ;path=/`;
      }
    });
  },
};

const loginHandler = () => {
  App.login();
};

const deleteHandler = (e) => {
  const action = e.target.dataset.action;
  if (action === 'delete') {
    const id = e.target.dataset.id;
    console.log(id);
    App.deleteProduct(id);
  }
};

loginBtn.addEventListener('click', loginHandler);
productsListDom.addEventListener('click', deleteHandler);

App.init();
App.getData();
