var PRICE = 9.99;
var LOAD_NUM = 10;

new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [],
    cart: [],
    results: [],
    search: 'anime',
    lastSearch: '',
    loading: false,
    price: PRICE,
  },
  methods: {
    appendItems() {
      if (this.items.length < this.results.length) {
        var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
        this.items = this.items.concat(append);
      }
    },
    onSubmit() {
      this.items = [];
      this.loading = true;
      this.$http
        .get('/search/'.concat(this.search))
        .then(function(res) {
          this.lastSearch = this.search;
          this.results = res.data;
          this.appendItems();
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

    var vueInstance = this;
    var elem = document.getElementById('product-list-bottom');
    var watcher = scrollMonitor.create(elem);
    watcher.enterViewport(function() {
      vueInstance.appendItems();
    });
  },
});
