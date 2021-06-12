import productModal from './productModal.js';

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'lj787448952';

const app = Vue.createApp({
  data() {
    return {
      // 讀取效果
      loadingStatus: {
        loadingItem: '',
      },
      // 產品列表
      products: [],
      // props 傳遞到內層的暫存資料
      product: {},
      // 表單結構
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      // 購物車列表
      cart: {},
    };
  },
  methods: {
    getProducts(){
      const api = `${apiUrl}/api/${apiPath}/products`;
      axios.get(api).then((res)=>{
        this.products = res.data.products;
      }).catch((error)=>{
        console.log(error);
      });
    },
    openModal(item){
      this.loadingStatus.loadingItem = item.id;
      console.log(item);
      const api = `${apiUrl}/api/${apiPath}/product/${item.id}`;
      axios.get(api)
      .then((res)=>{
        console.log(res);
        this.product = res.data.product;
        this.loadingStatus.loadingItem = '';
        this.$refs.userProductModal.openModal();//用refs開啟userProductModal的openModal
      }).catch(error =>{
        console.log(error)
      });
    },
    //加入購物車
    addCart(id,qty = 1){
      this.loadingStatus.loadingItem = id;
      const cart = {
        product_id : id,
        qty,
      }
      const api = `${apiUrl}/api/${apiPath}/cart`;
      axios.post(api,{data: cart})
      .then((res)=>{
        this.loadingStatus.loadingItem = '';
        console.log(res);
        this.getCart();
      }).catch(res=>{
        alert("出錯了，找問題");
        console.log(res.data);
      });
    },
    //取得購物車列表
    getCart(){
      const api = `${apiUrl}/api/${apiPath}/cart`;
      axios.get(api)
      .then((res)=>{
        console.log(res);
        this.cart = res.data.data;
      }).catch(res=>{
        alert("出錯了，找問題");
        console.log(res.data);
      });
    },
    //更新購物車產品
    updateCart(item){
      this.loadingStatus.loadingItem = item.id;
      const api = `${apiUrl}/api/${apiPath}/cart/${item.id}`;
      const cart = {
        product_id : item.product.id,
        qty : item.qty,
      }
      console.log(cart,api);
      axios.put(api,{data: cart})
      .then((res)=>{
        console.log(res);
        this.loadingStatus.loadingItem = '';
        this.getCart();
      }).catch(res=>{
        alert("出錯了，找問題");
        console.log(res.data);
      });
    },
    //刪除購物車產品
    delProduct(item){
      const api = `${apiUrl}/api/${apiPath}/cart/${item.id}`;
      axios.delete(api).then(res=>{
        if(res.data.success){
          this.getCart();
        }else{
          alert(res.data.message);
        }
      }).catch(res=>{
        alert("出錯了，找問題");
        console.log(res.data);
      });
    },
    //刪除全部
    delProductAll(){
      const api = `${apiUrl}/api/${apiPath}/carts`;
      axios.delete(api).then(res=>{
        if(res.data.success){
          this.getCart();
        }else{
          alert(res.data.message);
        }
      }).catch(res=>{
        alert('出錯了，找問題');
        console.log(res.data);
      })
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '需要正確的聯絡方式'
    },
    onSubmit(){
      const api = `${apiUrl}/api/${apiPath}/order`;
      const order = this.form;

      axios.post(api,{data: order}).then(res=>{
        if(res.data.success){
          alert(res.data.message);
          this.$refs.form.resetForm();
          this.getCart();
        }else{
          alert(res.data.message);
        }
      })
    }
  },
  mounted() {
    this.getProducts();
    this.getCart(); 
  },
});

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.component('userProductModal', productModal)
app.mount('#app');