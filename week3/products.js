import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.1.4/vue.esm-browser.js';

const host = 'https://vue3-course-api.hexschool.io';
const apiPath = 'marlonguo';

const api = {
  checkLogin: host + '/api/user/check',
  getProducts: `${host}/api/${apiPath}/admin/products`,
  product: `${host}/api/${apiPath}/admin/product`,
};

let delProductModal = null;
let productModal = null;

const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {},
    };
  },
  methods: {
    openModal(type, product) {
      this.tempProduct = { ...product };
      switch (type) {
        case 'delete':
          delProductModal.show();
          break;
        case 'edit':
        case 'new':
          productModal.show();
        default:
          break;
      }
    },

    remoteDataRequest(product) {
      const id = product.id;
      const payload = { data: product };
      const apiUrl = `${api.product}/${id ? id : ''}`;
      console.log(apiUrl);
      const method = id ? 'put' : 'post';
      axios[method](apiUrl, payload)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            switch (method) {
              case 'put':
                const index = this.products.findIndex((item) => item.id === id);
                this.products[index] = { ...product };
                break;
              case 'post':
                this.products.unshift({ ...product });
                break;
              default:
                break;
            }
          } else {
            alert(res.data.message);
          }
          this.tempProduct = {};
          productModal.hide();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteProduct(product) {
      axios
        .delete(`${api.product}/${product.id}`)
        .then((res) => {
          if (res.data.success) {
            const index = this.products.findIndex(
              (item) => item.id === product.id,
            );
            this.products.splice(index, 1);
          } else {
            alert(res.data.message);
          }
          delProductModal.hide();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    delProductModal = new bootstrap.Modal(this.$refs.delProductModal);
    productModal = new bootstrap.Modal(this.$refs.productModal);
  },
  created() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1',
    );
    if (!token) {
      alert('請重新登入');
      window.location = './login.html';
    }
    axios.defaults.headers.common['Authorization'] = token;
    axios.get(api.getProducts).then((res) => {
      const { success, products } = res.data;
      if (success) {
        this.products = products;
      }
    });
  },
});

app.mount('#app');
