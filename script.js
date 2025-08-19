const App = {
  config: { basePrice: 2599, shipping: { insideDhaka: 70, outsideDhaka: 120 }, maxQuantity: 10 },
  quantities: { black: 1, white: 1 },
  shipping: 120, // default outside Dhaka
  selectedProduct: 'black',
  isSubmitting: false,

  init() {
    this.bindEvents();
    this.selectProduct('black');
    this.setupBackToTop();
  },

  bindEvents() {
    document.getElementById('order-form').addEventListener('submit', e => {
      e.preventDefault();
      if (this.validateForm()) {
        this.updateTotals();
        e.target.submit();
      }
    });

    // প্রোডাক্ট সিলেকশন
    document.querySelector('.form-container').addEventListener('click', e => {
      const product = e.target.closest('.product');
      if (product) {
        let color = 'black';
        if (product.id.includes('white')) color = 'white';
        this.selectProduct(color);
      }
    });

    // quantity বোতাম
    document.querySelectorAll('.quantity button').forEach(btn => {
      btn.addEventListener('click', () => {
        let color = 'black';
        if (btn.id.includes('white')) color = 'white';
        const delta = btn.id.includes('minus') ? -1 : 1;
        this.changeQty(color, delta);
      });
      btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });

    document.querySelectorAll('input[name="shipping"]').forEach(input => {
      input.addEventListener('change', () => this.updateShipping(parseInt(input.value)));
    });

    this.updateButtonsState();
  },

  setupBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
      backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  selectProduct(color) {
    this.selectedProduct = color;

    // radios
    document.getElementById('radio-black').checked = color === 'black';
    document.getElementById('radio-white').checked = color === 'white';

    // qty box
    document.getElementById('qty-black-box').style.display = color === 'black' ? 'flex' : 'none';
    document.getElementById('qty-white-box').style.display = color === 'white' ? 'flex' : 'none';

    // product div
    document.getElementById('product-black').classList.toggle('selected', color === 'black');
    document.getElementById('product-white').classList.toggle('selected', color === 'white');

    document.getElementById('product-black').setAttribute('aria-checked', color === 'black');
    document.getElementById('product-white').setAttribute('aria-checked', color === 'white');

    this.updateTotals();
    this.updateButtonsState();
  },

  changeQty(color, delta) {
    if (color !== this.selectedProduct || this.isSubmitting) return;
    const newQty = this.quantities[color] + delta;
    if (newQty < 1 || newQty > this.config.maxQuantity) {
      const message = newQty < 1 ? 'পরিমাণ ১ এর কম হতে পারে না' : `পরিমাণ ${this.config.maxQuantity} এর বেশি হতে পারে না`;
      const errEl = document.getElementById('qty-error');
      errEl.style.display = 'block';
      errEl.innerText = message;
      setTimeout(() => { errEl.style.display = 'none'; }, 3000);
      return;
    }
    this.quantities[color] = newQty;
    document.getElementById(`qty-${color}`).value = newQty;
    this.updateTotals();
    this.updateButtonsState();
  },

  updateShipping(amount) {
    this.shipping = amount;
    this.updateTotals();
  },

  updateTotals() {
    const subtotal = this.config.basePrice * this.quantities[this.selectedProduct];
    const total = subtotal + this.shipping;
    document.getElementById('subtotal').innerText = `৳${subtotal.toLocaleString('bn-BD')}`;
    document.getElementById('total').innerText = `৳${total.toLocaleString('bn-BD')}`;
    document.getElementById('hiddenSubtotal').value = subtotal;
    document.getElementById('hiddenTotal').value = total;

    // hidden product নাম
    let productName = 'Nokia 3210 (Black)';
    if (this.selectedProduct === 'white') productName = 'Nokia 3210 (White)';
    document.getElementById('hiddenProduct').value = productName;

    document.getElementById('hiddenQuantity').value = this.quantities[this.selectedProduct];
  },

  updateButtonsState() {
    const color = this.selectedProduct;
    document.getElementById(`btn-minus-${color}`).disabled = this.quantities[color] <= 1;
  },

  validateForm() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();

    const nameRegex = /^[A-Za-z\s\u0980-\u09FF]+$/;
    const phoneRegex = /^01[3-9][0-9]{8}$/;
    let valid = true;

    document.querySelectorAll('.error').forEach(e => e.style.display = 'none');

    if (!nameRegex.test(name) || name.length === 0) {
      document.getElementById('name-error').style.display = 'block';
      valid = false;
    }
    if (!phoneRegex.test(phone)) {
      document.getElementById('phone-error').style.display = 'block';
      valid = false;
    }
    if (address === '') {
      document.getElementById('address-error').style.display = 'block';
      valid = false;
    }

    return valid;
  },
};

window.onload = () => App.init();