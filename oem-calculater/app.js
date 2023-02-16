// Storage Controller
const StorageController = (function(){


    return {
        storeProduct: function(product){
            let products;

            if(localStorage.getItem('products')===null){
                products = [];
                products.push(product);
            }else{
                products = JSON.parse(localStorage.getItem("products"));
                products.push(product);
            }
            localStorage.setItem('products', JSON.stringify(products));
        },

        getProducts: function(){
            let products;

            if(localStorage.getItem('products')==null){
                products=[];
            }else{
                products = JSON.parse(localStorage.getItem("products"));
            }
            return products;
        },
        updateProduct: function(product){
            let products = JSON.parse(localStorage.getItem("products"));

            products.forEach((prd, index) =>{
                if(product.id == prd.id){
                    products.splice(index, 1, product);
                }
            });

            localStorage.setItem("products", JSON.stringify(products));
        },
        deleteProduct: function(id){
            let products = JSON.parse(localStorage.getItem("products"));

            products.forEach((prd, index) =>{
                if(id == prd.id){
                    products.splice(index, 1);
                }
            });

            localStorage.setItem("products", JSON.stringify(products));
        }
    }



})();





// Product Controller
const ProductController = (function(){


    // private
    const Product = function(id, name, price){
        this.id = id;
        this.name = name;
        this.price = price;
    }

    const data = {
        products : StorageController.getProducts(),
        selectedProduct:null,
        totalPrice:0
    }


    // public 
    return {
        getProducts: function(){
            return data.products;
        },
        getData: function(){
            return data
        },
        setCurrentProduct: function(product){
            data.selectedProduct = product;
        },
        getCurrrentProduct: function(){
            return data.selectedProduct;
        },
        addProduct: function(name, price){
            let id;


            if(data.products.length > 0){
                id = data.products[data.products.length -1].id + 1;
            }else{
                id = 0;
            }

            const newProduct = new Product(id, name, parseFloat(price));
            data.products.push(newProduct);
            return newProduct;
        },
        updateProduct: function(name, price){
            let product;

            data.products.forEach(item =>{
                if(item.id == data.selectedProduct.id){
                    item.name = name;
                    item.price = parseFloat(price);
                    product = item;
                }
            });


            return product;
        },
        deleteProduct: function(product){
            
            data.products.forEach((prd, index) =>{
                if(prd.id == product.id){
                    data.products.splice(index, 1);
                }
            })
        },
        getTotal: function(){
            let total = 0;

            data.products.forEach(item =>{
                total += item.price;
            });

            data.totalPrice = total;
            return data.totalPrice;
        },
        getProductById: function(id){
            let product = null;


            data.products.forEach(prd => {
                if(prd.id == id) {
                    product = prd;
                }
            })

            return product;
        }
    }



})();


// UI Controller
const UIController = (function(){

    const Selectors = {
        productList: "#item-list",
        productListItems: "#item-list tr",
        addButton: "#addBtn",
        saveButton: "#updateBtn",
        deleteButton: "#deleteBtn",
        cancelButton: "#cancelBtn",
        productName: "#productName",
        productPrice: "#productPrice",
        productCard: "#productCard",
        totalTL: "#total-tl",
        totalDolar: "#total-dolar"
    }


    return {
        // ürün listesini ekrana yazdırıyor // prints product list
        createProductList: function(products){
            let html = "";

            products.forEach(prd => {
                html += `
                <tr>
                    <td>${prd.id + 1} </td>
                    <td>${prd.name}</td>
                    <td>${prd.price} $</td>
                    <td class="text-right">
                            <i class="fas fa-edit edit-product"></i>
                    </td>
                </tr>


                `;
            });


            document.querySelector(Selectors.productList).innerHTML = html;
        },
        getSelectors: function(){
            return Selectors;
        },
        addProduct: function(prd){
            // ürün listesine ürün ekliyor // adds product to product list

            document.querySelector(Selectors.productCard).style.display = "block";
            var item = `
                <tr>
                    <td>${prd.id + 1} </td>
                    <td>${prd.name}</td>
                    <td>${prd.price} $</td>
                    <td class="text-right">
                        <i class="fas fa-edit edit-product"></i>
                    </td>
                </tr>

            `;


            document.querySelector(Selectors.productList).innerHTML += item;
        },
        updateProduct: function(prd){

            let updatedItem = null;

            let items = document.querySelectorAll(Selectors.productListItems);

            items.forEach(item =>{
                if(item.classList.contains('bg-warning')){
                    item.children[1].textContent = prd.name;
                    item.children[2].textContent = prd.price + ' $';
                    updatedItem = item;
                }
            });


            return updatedItem;
        },
        deleteProduct: function(){
            let items = document.querySelectorAll(Selectors.productListItems);

            items.forEach(item=>{
                if(item.classList.contains("bg-warning")){
                    item.remove();
                }
            });
        },
        clearInputs: function(){
            document.querySelector(Selectors.productName).value = "";
            document.querySelector(Selectors.productPrice).value = "";
        },
        clearWarnings: function(){
            const items = document.querySelectorAll(Selectors.productListItems);

            items.forEach(item=>{
                if(item.classList.contains("bg-warning")){
                    item.classList.remove("bg-warning");
                }
            })
        },
        hideCard: function(){
            document.querySelector(Selectors.productCard).style.display = "none";
        },
        showTotal: function(total){
            document.querySelector(Selectors.totalDolar).textContent = total;
            document.querySelector(Selectors.totalTL).textContent = total * 18;
        },
        addProductToForm: function(){
            const selectedProduct = ProductController.getCurrrentProduct();

            document.querySelector(Selectors.productName).value = selectedProduct.name;
            document.querySelector(Selectors.productPrice).value = selectedProduct.price;
        },
        addingState: function(item){

            UIController.clearWarnings();
            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display = "inline";
            document.querySelector(Selectors.saveButton).style.display = "none";
            document.querySelector(Selectors.deleteButton).style.display = "none";
            document.querySelector(Selectors.cancelButton).style.display = "none";
        },
        editState: function(tr){

            this.clearWarnings();


            tr.classList.add('bg-warning');



            document.querySelector(Selectors.addButton).style.display = "none";
            document.querySelector(Selectors.saveButton).style.display = "inline";
            document.querySelector(Selectors.deleteButton).style.display = "inline";
            document.querySelector(Selectors.cancelButton).style.display = "inline";
        }
    }



})();




// App Controller
const AppController = (function(ProductCtrl, UICtrl, StorageCtrl){
    
    const UISelectors = UICtrl.getSelectors();
    
    const loadEventListeners = function(){

        // add product event
        document.querySelector(UISelectors.addButton).addEventListener("click", productAddSubmit);

        // edit product
        document.querySelector(UISelectors.productList).addEventListener("click", productEditClick);

        // edit product submit
        document.querySelector(UISelectors.saveButton).addEventListener("click", editProductSubmit);

        // calcel button click
        document.querySelector(UISelectors.cancelButton).addEventListener("click", cancelUpdate);

        // delete button click
        document.querySelector(UISelectors.deleteButton).addEventListener("click", deleteProductSubmit);
    }

    const productAddSubmit = function(e){

        const productName = document.querySelector(UISelectors.productName).value;

        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if(productName !== '' && productPrice !== ''){
            // Add Product
            const newProduct = ProductCtrl.addProduct(productName, productPrice);
          
            
            // add item to list
            UICtrl.addProduct(newProduct);


            //add product to LS
            StorageCtrl.storeProduct(newProduct);



            // get total
            const total = ProductCtrl.getTotal();


            // show total
            UICtrl.showTotal(total);


            // clear inputs
            UICtrl.clearInputs();
        }




        e.preventDefault();
    }

    const productEditClick = function(e){

        if(e.target.classList.contains("edit-product")){

            
            const id = parseFloat(e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent) - 1;

            const tr = e.target.parentNode.parentNode;
            
            // get selected product
            const product = ProductCtrl.getProductById(id);
            
            // set current product
            ProductCtrl.setCurrentProduct(product);
            
            //add product to UI
            UICtrl.addProductToForm();

            UICtrl.editState(tr);
        }




        e.preventDefault();
    }

    const editProductSubmit = function(e){

        const productName = document.querySelector(UISelectors.productName).value;

        const productPrice = document.querySelector(UISelectors.productPrice).value;


        if(productName !== "" && productPrice !== ""){

            // update product
            const updatedProduct = ProductCtrl.updateProduct(productName, productPrice);

            // update ui
            let item = UICtrl.updateProduct(updatedProduct);


            // get total
            const total = ProductCtrl.getTotal();


            // show total
            UICtrl.showTotal(total);

            //update storage
            StorageCtrl.updateProduct(updatedProduct);

            UICtrl.addingState();

        }



        e.preventDefault();
    }

    const cancelUpdate = function(e){

        UICtrl.addingState();
        UICtrl.clearWarnings();


        e.preventDefault();
    }

    const deleteProductSubmit = function(e){

        // get selected product
        const selectedProduct = ProductCtrl.getCurrrentProduct();

        // delete product
        ProductCtrl.deleteProduct(selectedProduct);

        // delete ui
        UICtrl.deleteProduct();

        // get total
        const total = ProductCtrl.getTotal();


        // show total
        UICtrl.showTotal(total);

        // delete from storage
        StorageCtrl.deleteProduct(selectedProduct.id);



        UICtrl.addingState();

        if(total == 0){
            UICtrl.hideCard();
        }


        e.preventDefault();
    }


        return {
            init: function(){
                console.log("app is starting");

                UICtrl.addingState();

                const products = ProductCtrl.getProducts();


                if(products.length == 0){
                    UICtrl.hideCard();
                }else{
                    UICtrl.createProductList(products);
    
                    
                }
                
                // load event listeners
                loadEventListeners();

            }
        }




})(ProductController, UIController, StorageController);


AppController.init();