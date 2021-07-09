const productsListDom = document.querySelector('#productList');

const host = 'https://vue3-course-api.hexschool.io';
const apiPath = 'marlonguo';

const api = {
  checkLogin: host + '/api/user/check',
  getProducts: `${host}/api/${apiPath}/admin/products`,
  product: `${host}/api/${apiPath}/admin/product`,
};

const productsHandler = (e) => {
  const action = e.target.dataset.action;
  if (action === 'delete') {
    const id = e.target.dataset.id;
    App.deleteProduct(id);
  } else if (action === 'enable') {
    const id = e.target.dataset.id;
    App.changeProductStatus(id);
  }
};

const App = {
  data: {
    products: [],
  },

  getData() {
    axios.get(api.getProducts).then((res) => {
      const { success, products } = res.data;
      if (success) {
        this.data.products = products;
        this.render();
      }
    });
  },

  deleteProduct(id) {
    axios.delete(`${api.product}/${id}`).then((res) => {
      if (res.data.success) {
        const index = this.data.products.findIndex((item) => item.id === id);
        this.data.products.splice(index, 1);
        this.render();
      }
    });
  },

  changeProductStatus(id) {
    const index = this.data.products.findIndex((item) => item.id === id);
    const product = this.data.products[index];
    const enabled = this.data.products[index].is_enabled;
    const data = { data: { ...product, is_enabled: Number(!enabled) } };
    axios.put(`${api.product}/${id}`, data).then((res) => {
      this.data.products[index].is_enabled = Number(!enabled);
      this.render();
    });
  },

  render() {
    const template1 = this.data.products
      .map(
        (item) => `
      <tr>
        <td>${item.title}</td>
        <td width="120">${item.origin_price}</td>
        <td width="120">${item.price}</td>
        <td width="150">
          <div class="form-check form-switch">
            <input type="checkbox" class="form-check-input" id="${
              item.id
            }" data-action="enable"
            data-id="${item.id}" ${item.is_enabled ? 'checked' : ''} />
            <label class="form-check-label" for="${item.id}">${
          item.is_enabled ? '啟用' : '未啟用'
        }</label>
          </div>
        </td>
        <td width="120"><button type='button' data-action="delete" data-id="${
          item.id
        }">刪除</button></td>
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

    if (!token) {
      window.location = 'login.html';
    }
    axios.defaults.headers.common['Authorization'] = token;
    // axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    this.getData();
  },
};

App.init();
productsListDom.addEventListener('click', productsHandler);
