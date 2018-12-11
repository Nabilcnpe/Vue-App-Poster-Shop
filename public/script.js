var PRICE = 9.99;

new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [],
    cart: [],
    search: 'anime',
    lastSearch: '',
    loading: false,
    price: PRICE,
  },
  methods: {
    onSubmit() {
      this.items = [];
      this.loading = true;
      this.$http
        .get('/search/'.concat(this.search))
        .then(function(res) {
          this.lastSearch = this.search;
          this.items = res.data;
          this.loading = false;
        });
      ;
    },
    addItem(index) {
      var item = this.items[index];
      var isItemInCart = false;

      this.total += PRICE;
      this.cart.some(index => {
        if (index.id === item.id) {
          isItemInCart = true;
          index.qty++;
        }
      });
      if (isItemInCart === false) {
        this.cart.push({
          id: item.id,
          title: item.title,
          qty: 1,
          price: PRICE,
        });
      };
    },
    inc(item) {
      item.qty++;
      this.total += PRICE;
    },
    dec(item) {
      item.qty--;
      this.total -= PRICE;
      if (item.qty <= 0) {
        for(var i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            this.cart.splice(i, 1);
            break;
          }
        };
      }
    },
  },
  filters: {
    currency(price) {
      return '$'.concat(price.toFixed(2));
    }
  },
  mounted() {
    this.onSubmit();
  }
});
