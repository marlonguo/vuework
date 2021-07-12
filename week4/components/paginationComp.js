export default {
  template: `
    <nav aria-label="products navigation page">
      <ul class="pagination">
        <li class="page-item" :class="{disabled: pagination.has_pre}">
          <a class="page-link" @click="$emit('change-page', pagination.current_page - 1);">Previous</a>
        </li>
        <li class="page-item" v-for="item in pagination.total_pages" :key="item" :class="{active: item === pagination.current_page}">
          <a class="page-link" @click="$emit('change-page', item)">{{item}}</a>
        </li>
        <li class="page-item" :class="{disabled: pagination.has_next}">
          <a class="page-link" @click="$emit('change-page', pagination.current_page + 1)">Next</a>
        </li>
      </ul>
    </nav>`,
  props: ['pagination'],
};
