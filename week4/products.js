import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.1.4/vue.esm-browser.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/api';
const apiPath = 'marlonguo';

const api = {
  checkLogin: `${apiUrl}/user/check`,
  getProducts: `${apiUrl}/${apiPath}/admin/products`,
  product: `${apiUrl}/${apiPath}/admin/product`,
};

// let delProductModal = null;
// let productModal = null;

import paginationComp from './components/paginationComp.js';
import productModalComp from './components/productModalComp.js';
import delProductModalComp from './components/delProductModal.js';

const app = createApp({
  data() {
    return {
      products: [],
      pagination: {},
      tempProduct: {},
      currentPage: 1,
    };
  },
  methods: {
    openModal(type, product) {
      this.tempProduct = { ...product };
      switch (type) {
        case 'delete':
          // delProductModal.show();
          this.$refs.delProductModal.openModal();
          break;
        case 'edit':
        case 'new':
          // productModal.show();
          this.$refs.productModal.openModal();
        default:
          break;
      }
    },

    changePage(page) {
      this.getRemoteData(page);
      this.pagination.current_page = page;
    },

    remoteDataRequest(product) {
      const id = product.id;
      const payload = { data: product };
      const apiUrl = `${api.product}/${id ? id : ''}`;
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
            this.tempProduct = {};
            // productModal.hide();
            this.$refs.productModal.closeModal();
          } else {
            alert(res.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getRemoteData(pageNumber = 1) {
      axios
        .get(`${api.getProducts}?page=${pageNumber}`)
        .then((res) => {
          console.log(res.data);
          const { success, products, pagination, message } = res.data;
          if (success) {
            this.products = products;
            this.pagination = pagination;
          } else {
            alert(message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteProduct(product) {
      axios.delete(`${api.product}/${product.id}`).then((res) => {
        if (res.data.success) {
          const index = this.products.findIndex(
            (item) => item.id === product.id,
          );
          this.products.splice(index, 1);
          // delProductModal.hide();
          this.$refs.delProductModal.closeModal();
        } else {
          alert(res.data.message);
        }
      });
    },
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
    this.getRemoteData();
  },
});

app.component('pagination', paginationComp);
app.component('productModal', productModalComp);
app.component('delProductModal', delProductModalComp);
app.mount('#app');
