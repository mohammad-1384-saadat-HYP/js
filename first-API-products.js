//عنصر نگه دارنده صفحه اصلی
const productsBox = document.getElementById('productsBox');
//عنصر نگه دارنده محصولات
const productsContainer = document.getElementById('productsContainer');
//عنصر نگه دارنده تعداد صفحات محصولات
const numberPage = document.getElementById('numberPage');
//آدرس api
const api = 'http://192.168.100.208/saha03/shoesesf/api';
//آیکون های تغییر صفحه
const left = document.getElementById('previousPage');
const right = document.getElementById('nextPage');
//متغیری برای ذخیره تعداد محصولات موجود
let totalProducts;
//متغیری برای ذخیره صفحه فعلی
let currentPage;
//آرایه فیلتر
let filterArray = [];
//عنصر نگه دارنده فیلتر ها
const groupingContainer = document.getElementById('groupingContainer');
//عنصر کنگوری filter
const filterContainerCategory = document.getElementById('filterContainerCategory');
//عنصر نگه دارنده منوی بالای سایت در عرض 1024px به پایین
const upperMenu = document.getElementById('upperMenu');
//عنصر نگه دارنده منوی پایین سایت در عرض 1024px به پایین
const downMenu = document.getElementById('downMenu');
//عنصر نگه دارنده فیلتر ها
const productsBoxGrouping = document.getElementById('productsBoxGrouping');
//عنصر نگه دارنده صفحه هر محصول
const chosenProduct = document.getElementById('chosenProduct');
//متغیری برای ذخیره id محصول منتخب
let chosenProductId;
//متغیری برای تعداد فعلی محصول منتخب
let currentNumber;
//متغیری برای مودال محصول منتخب
const chosenProductModal = document.getElementById('chosenProductModal');
chosenProductModal.classList.add('displayNone');

//محصولات
const products = {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZF9zaCI6MzcsInRpbWUiOjE3MzA2MTA1MTUsInVzZXJfdHlwZSI6LTJ9.7IefNXwfOEe4jgw5IOhcNVaPS6bKKYCHMcvAoTCKBbU",
    "class_name": "product",
    "function_name": "get_main",
    "filters": [filterArray],
    "count_per_page": 6,
    "page": '',
    "search": "",
    "get_count": 1,
    "status": -1,
    "active": 1,
    "exist_product": 1,
    "is_dashboard": 0
}

//کتگوری
const category = {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZF9zaCI6MzcsInRpbWUiOjE3MzA2MTA1MTUsInVzZXJfdHlwZSI6LTJ9.7IefNXwfOEe4jgw5IOhcNVaPS6bKKYCHMcvAoTCKBbU",
    "class_name": "product",
    "function_name": "main"
}

//محصول منتخب
const theProduct = {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZF9zaCI6MzcsInRpbWUiOjE3MzA2MTA1MTUsInVzZXJfdHlwZSI6LTJ9.7IefNXwfOEe4jgw5IOhcNVaPS6bKKYCHMcvAoTCKBbU",
    "class_name": "product",
    "function_name": "get_by_id",
    "id": ''
}

//اجرای کد های لازم هنگام لود شدن
document.addEventListener('DOMContentLoaded', () => {
    chosenProduct.classList.add('displayNone');
    menusInDifferentWidths();
    upperMenu.addEventListener('click', upperMenuFun);
    downMenu.addEventListener('click', downMenuFun);
    fetchCategoryFunction(api, category);
    currentPage = 1;
    products.page = currentPage;
    fetchProductsFunction(api, products);
});

//تابعی برای استایل دهی های مناسب در عرض های مختلف
function menusInDifferentWidths() {
    if (window.innerWidth > 1023) {
        upperMenu.classList.add('displayNone');
        downMenu.classList.add('displayNone');
        productsBoxGrouping.classList.remove('displayNone');
    } else {
        upperMenu.classList.remove('displayNone');
        downMenu.classList.remove('displayNone');
        productsBoxGrouping.classList.add('displayNone');
    }
}

//تابعی برای انجام عملیات های منو بالای سایت
function upperMenuFun(e) {
    e.target.closest('#search') && searchFun();
    e.target.closest('#upperMenuTitle') && upperMenuTitleFun();
    e.target.closest('#upperMenuIcon') && upperMenuIconFun();
}

//تابع مخصوص upperMenuSearch
function searchFun() {
}

//تابع مخصوص upperMenuTitle
function upperMenuTitleFun() {
}

//تابع مخصوص upperMenuIcon
function upperMenuIconFun() {
}

//تابعی برای انجام عملیات های منو پایین سایت
function downMenuFun(e) {
    e.target.closest('#profile') && DownProfileFun();
    e.target.closest('#filters') && downMenuFiltersFun();
    e.target.closest('#home') && downMenuHomeFun();
}

//تابع مخصوص menuDownProfile
function DownProfileFun() {
}

//تابع مخصوص menuDownFilters
function downMenuFiltersFun() {
    if (productsBoxGrouping.classList.contains('displayNone')) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        document.body.classList.add('noScroll');
        productsBoxGrouping.classList.remove('displayNone');
        productsBoxGrouping.removeEventListener('click', exitGroupingContainer);
        productsBoxGrouping.addEventListener('click', exitGroupingContainer);
    }
}

//تابع مخصوص menuDownHome
function downMenuHomeFun() {
}

//تابعی برای خروج از groupingContainer
function exitGroupingContainer(e) {
    if (e.target.classList.contains('exit') || e.target.classList.contains('check')) {
        productsBoxGrouping.classList.add('displayNone');
        document.body.classList.remove('noScroll');
    }
}

// تابع درخواست و نمایش دسته بندی محصولات و در صورت لزوم نمایش خطا
async function fetchCategoryFunction(api, category) {
    //تعیین نوع دسته بندی محصولات
    const groupingType = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    }

    try {
        const res = await fetch(api, groupingType);
        if (!res.ok) {
            if (res.status === 404) {
                throw new Error('not found');
            } else if (res.status === 500) {
                throw new Error('server error');
            } else {
                throw new Error('network response was not ok');
            }
        }
        const item = await res.json();
        showGroupingFilter(item.filter);
        filterContainerCategory.addEventListener('click', (e) => {
            currentPage = 1;
            products.page = currentPage;
            if (window.innerWidth > 1023) {
                if (e.target.closest('.titleHolder1')) {
                    secondCategory(e);
                    URLChangeMain();
                } else if (e.target.closest('.titleHolder2')) {
                    thirdCategory(e);
                    URLChangeMain();
                } else if (e.target.closest('.productTitle3')) {
                    finalCategory(e);
                    URLChangeMain();
                }
                fetchProductsFunction(api, products);
            } else {
                const exit = document.getElementById('exit');
                if (e.target.closest('.titleHolder1')) {
                    secondCategory(e);
                    URLChangeMain();
                } else if (e.target.closest('.titleHolder2')) {
                    thirdCategory(e);
                    URLChangeMain();
                } else if (e.target.closest('.productTitle3')) {
                    finalCategory(e);
                    URLChangeMain();
                }
                exit.addEventListener('click', e => {
                    if (e.target.classList.contains('check')) {
                        fetchProductsFunction(api, products);
                    } else if (e.target.classList.contains('exit')) {
                        filterArray.length = 0;
                        betterCategorySecondLevel();
                    }
                });
            }
        });
    } catch (error) {
        console.log('error', error);
    }
}

//تابع نمایش کتگوری محصولات
function showGroupingFilter(item) {
    filterContainerCategory.innerHTML = item.map(x => {
        return `
            <div>
                <div class="titleHolder1" data-id="${x.id}">
                    <i class="fa-solid fa-caret-right"></i>
                    <i class="fa-solid fa-caret-down displayNone"></i>
                    <div class="productTitle1">${x.title_main}</div>
                </div>
                <div class="category1 displayNone">
                    ${x.list.map(x => {
            return `
                            <div>
                                <div class="titleHolder2" data-id="${x.id}">
                                    <i class="fa-solid fa-caret-right"></i>
                                    <i class="fa-solid fa-caret-down displayNone"></i>
                                    <div class="productTitle2">${x.title_main}</div>
                                </div>
                                <div class="category2 displayNone">
                                    ${x.list.map(x => {
                return `<div class="productTitle3" data-id="${x.id}">${x.title_main}</div>`
            }).join('')}
                                </div>
                            </div>
                        `
        }).join('')}
                </div>
            </div>
        `
    }).join('');
}

//نمایش محصولات مربوط به filter
//دسته بندی اولیه
const filterContainerTitle = document.getElementById('filterContainerTitle');

//تابع مربوط به نمایش محصولات اولیه
function firstCategory() {
    const rightIcon = filterContainerTitle.querySelector('.fa-caret-right');
    const downIcon = filterContainerTitle.querySelector('.fa-caret-down');
    if (filterContainerCategory.classList.contains('displayNone')) {
        filterContainerCategory.classList.remove('displayNone');
        rightIcon.classList.add('displayNone');
        downIcon.classList.remove('displayNone');
    } else {
        filterContainerCategory.classList.add('displayNone');
        rightIcon.classList.remove('displayNone');
        downIcon.classList.add('displayNone');
    }
}

filterContainerTitle.addEventListener('click', firstCategory);

//تابع مربوط به نمایش محصولات ثانویه
function secondCategory(e) {
    const parent = e.target.closest('.titleHolder1');
    const rightIcon = parent.querySelector('.fa-caret-right');
    const downIcon = parent.querySelector('.fa-caret-down');
    const category1 = parent.nextElementSibling;
    if (category1.classList.contains('displayNone')) {
        filterArray.length = 0;
        filterArray.push(parseInt(parent.dataset.id));
        betterCategorySecondLevel();
        rightIcon.classList.add('displayNone');
        downIcon.classList.remove('displayNone');
        parent.classList.add('activeCategory');
        category1.classList.remove('displayNone');
    } else {
        filterArray.length = 0;
        betterCategorySecondLevel();
    }
}

//تابع مربوط به نمایش محصولات ثالثه
function thirdCategory(e) {
    const parent = e.target.closest('.titleHolder2');
    const rightIcon = parent.querySelector('.fa-caret-right');
    const downIcon = parent.querySelector('.fa-caret-down');
    const category2 = parent.nextElementSibling;
    if (category2.classList.contains('displayNone')) {
        let start = 1;
        let replace = parseInt(parent.dataset.id);
        filterArray.splice(start, filterArray.length - start, replace);
        betterCategoryFirstLevel();
        rightIcon.classList.add('displayNone');
        downIcon.classList.remove('displayNone');
        parent.classList.add('activeCategory');
        category2.classList.remove('displayNone');
    } else {
        let start = 1;
        filterArray.splice(start, filterArray.length - start);
        betterCategoryFirstLevel();
    }
}

//تابع مربوط به نمایش محصولات پایانی
function finalCategory(e) {
    if (e.target.classList.contains('activeCategory')) {
        e.target.classList.remove('activeCategory');
        let index = filterArray.indexOf(parseInt(e.target.dataset.id));
        filterArray.splice(index, 1);
    } else {
        e.target.classList.add('activeCategory');
        filterArray.push(parseInt(e.target.dataset.id));
    }
}

//اولین بهینه‌سازی توابع filter
function betterCategoryFirstLevel() {
    const parent2All = document.querySelectorAll('.titleHolder2');
    const productTitle3 = document.querySelectorAll('.productTitle3');
    parent2All.forEach(x => {
        x.classList.remove('activeCategory');
        x.nextElementSibling.classList.add('displayNone');
        x.querySelector('.fa-caret-right').classList.remove('displayNone');
        x.querySelector('.fa-caret-down').classList.add('displayNone');
    });
    productTitle3.forEach(x => x.classList.remove('activeCategory'));
}

//دومین بهینه‌سازی توابع filter
function betterCategorySecondLevel() {
    const parent1All = document.querySelectorAll('.titleHolder1');
    parent1All.forEach(x => {
        x.classList.remove('activeCategory');
        x.nextElementSibling.classList.add('displayNone');
        x.querySelector('.fa-caret-right').classList.remove('displayNone');
        x.querySelector('.fa-caret-down').classList.add('displayNone');
    });
    betterCategoryFirstLevel();
}

//تابع درخواست و نمایش محصولات و در صورت لزوم نمایش خطا
async function fetchProductsFunction(api, products) {
    productsContainer.innerHTML = '';
    //تعیین نوع محصولات
    const productType = {
        method: 'POST',
        headers: {
            // 'Accept':'نوع دیتایی که بر میگردونه',
            'Content-type': 'application/json'//نوع دیتایی که میدیم
        },
        body: JSON.stringify(products)
    }
    try {
        const res = await fetch(api, productType);
        if (!res.ok) {
            if (res.status === 404) {
                throw new Error('not found');
            } else if (res.status === 500) {
                throw new Error('server error');
            } else {
                throw new Error('network response was not ok');
            }
        }
        const item = await res.json();
        totalProducts = item.count;
        showProducts(item);
        setPages(item);
    } catch (error) {
        console.log('error', error);
    }
}

//تابع نمایش محصولات
function showProducts(item) {
    productsContainer.className = '';
    if (item.count === 0) {
        if (window.innerWidth <= 1023) {
            productsContainer.classList.add('nothing0-1024');
        } else {
            productsContainer.classList.add('nothing0');
        }
        productsContainer.innerHTML = `
        <div id="nothing">
            <div id="nothingFirst">
                <i class="fa-solid fa-circle-xmark"></i>
            </div>
            <div id="nothingLast">
                <h2>.محصولی یافت نشد</h2>
            </div>
        </div>
        `;
    } else {
        betterShowProducts(item);
    }
}

//تابعی برای بهینه کردن showProducts
function betterShowProducts(item) {
    productsContainer.innerHTML = item.product.map((x, index) => {
        return `
            <div id="product${index}" class="main" data-id="${x.id}">
                <a class="link">
                    <div class="imgContainer">
                        <img src="${JSON.parse(x.main_images)[0].img}" alt="${x.title ? x.title : 'بدون عنوان'}">
                    </div>
                </a>
                <div class="descriptionContainer">
                    <a class="titleContainer">
                        <span>${x.title ? x.title : 'بدون عنوان'}</span>
                    </a>
                    <div class="productPrices">
                        <div class="priceAll">
                            <div class="priceAllCurrency">تومان</div>
                            <div class="priceAllPrice">${x.price_all ? x.price_all.toLocaleString() : 'بدون قیمت'}</div>
                        </div>
                        <div class="priceDiscount">
                            <div class="discountHolder">${x.discount !== 0 ? `${x.discount}%` : ``}</div>
                        </div>
                        <div class="price">
                            <div class="priceCurrency">${x.discount !== 0 ? `تومان` : ``}</div>
                            <div class="pricePrice">${x.discount !== 0 ? `${x.price.toLocaleString()}` : ``}</div>
                        </div>
                    </div>
                </div>
            </div>
            `
    }).join('');
}

//تابعی برای بدست آوردن تعداد کل محصولات
function getTotalPages() {
    const count = !isNaN(totalProducts) ? totalProducts : 0;
    const countPerPage = parseInt(products.count_per_page);
    return Math.ceil(count / countPerPage);
}

//تابع تعیین تعداد صفحات و نمایش آنها
function setPages(item) {
    const totalPages = getTotalPages();
    const page = document.getElementById('page');
    numberPage.innerHTML = '';
    if (item.count === 0 || totalPages === 1) {
        page.classList.add('displayNone');
    } else {
        page.classList.remove('displayNone');
        let Array = [];
        const firstPage = 1;
        Array.push(firstPage);
        if (currentPage - 1 > 2) {
            Array.push('...');
        }
        if (currentPage - 1 > 1) {
            Array.push(currentPage - 1);
        }
        if (currentPage !== firstPage && currentPage !== totalPages) {
            Array.push(currentPage);
        }
        if (currentPage + 1 < totalPages) {
            Array.push(currentPage + 1);
        }
        if (currentPage + 1 < totalPages - 1) {
            Array.push('...');
        }
        if (totalPages !== firstPage) {
            Array.push(totalPages);
        }
        numberPage.innerHTML = Array.map(x => `<div class="pageNumber" data-id="${x}">${x}</div>`).join('');
        const pages = document.querySelectorAll('.pageNumber');
        activePage(pages);
        whichPage(pages);
        buttonsStyle();
    }
}

//تابعی برای تعیین اینکه صفحه فعلی کدومه
function activePage(pages) {
    pages.forEach(x => {
        x.classList.remove('activePage');
        if (parseInt(x.dataset.id) === currentPage) {
            x.classList.add('activePage');
        }
    })
}

//تابعی برای افزودن رویداد های لازم به شماره هر صفحه
function whichPage(pages) {
    pages.forEach(x => {
        x.addEventListener('click', e => {
            chosenPage(e);
            URLChangeMain();
        });
    });
}

//تابعی برای تغییر صفحه فعلی بر اساس شماره صفحه مورد نظر کاربر
function chosenPage(e) {
    if (e.target.dataset.id !== '...' && !e.target.classList.contains('activePage')) {
        currentPage = parseInt(e.target.dataset.id);
        products.page = currentPage;
        fetchProductsFunction(api, products);
    }
}

//تابعی برای استایل دهی به دکمه های صفحه قبل و بعد و افزودن رویداد های لازم به آنها
function buttonsStyle() {
    const firstPage = 1;
    const totalPages = getTotalPages();
    left.classList.remove('displayNone');
    right.classList.remove('displayNone');
    betterButtonsStyle();
    if (currentPage === firstPage) {
        left.classList.add('inactive');
        left.disabled = true;
        right.addEventListener('click', rightButtonsClick);
    } else if (currentPage === totalPages) {
        right.classList.add('inactive');
        right.disabled = true;
        left.addEventListener('click', leftButtonsClick);
    } else {
        left.addEventListener('click', leftButtonsClick);
        right.addEventListener('click', rightButtonsClick);
    }
}

//تابعی برای بهینه تر کردن تابع buttonsStyle
function betterButtonsStyle() {
    left.classList.remove('inactive');
    right.classList.remove('inactive');
    left.disabled = false;
    right.disabled = false;
    left.removeEventListener('click', leftButtonsClick);
    right.removeEventListener('click', rightButtonsClick);
}

//تابعی برای افزودن به دکمه left پس از رویداد کلیک
function leftButtonsClick() {
    if (currentPage - 1 >= 1) {
        --currentPage;
        products.page = currentPage;
        fetchProductsFunction(api, products);
        URLChangeMain();
    }
}

//تابعی برای افزودن به دکمه right پس از رویداد کلیک
function rightButtonsClick() {
    const totalPages = getTotalPages();
    if (currentPage + 1 <= totalPages) {
        ++currentPage;
        products.page = currentPage;
        fetchProductsFunction(api, products);
        URLChangeMain();
    }
}

//زمانی که کاربر روی محصول منتخب کلیک میکنه
productsContainer.addEventListener('click', e => {
    if (e.target.closest('.link') || e.target.closest('.titleContainer')) {
        const theChosenProduct = e.target.closest('.main');
        chosenProductId = theChosenProduct.dataset.id;
        theProduct.id = chosenProductId;
        productsBox.classList.add('displayNone');
        chosenProduct.classList.remove('displayNone');
        fetchChosenProductFunction(api, theProduct);
    }
});

//تابع درخواست و نمایش محصول منتخب
async function fetchChosenProductFunction(api, theProduct) {
    //تعیین نوع محصول منتخب
    const theProductType = {
        method: 'POST',
        headers: {
            // 'Accept':'نوع دیتایی که بر میگردونه',
            'Content-type': 'application/json'//نوع دیتایی که میدیم
        },
        body: JSON.stringify(theProduct)
    }
    try {
        const res = await fetch(api, theProductType);
        if (!res.ok) {
            if (res.status === 404) {
                throw new Error('not found');
            } else if (res.status === 500) {
                throw new Error('server error');
            } else {
                throw new Error('network response was not ok');
            }
        }
        const item = await res.json();
        showTheChosenProduct(item);
    } catch (error) {
        console.log('error', error);
    }
}

//تابعی برای نمایش محصول منتخب در chosenProduct
function showTheChosenProduct(item) {
    chosenProduct.innerHTML = `
        <div id="product">
            <div id="details">
                <h3 id="productName">${item.val.title}</h3>
                <div id="productSeller">
                    <i class="fa-solid fa-user-tie"></i>
                    <div>${item.val.supplier_title}</div>
                    <i class="fa-solid fa-user-tie"></i>
                </div>
                <div id="productPrice">
                    <div id="afterDiscount"></div>
                    ${isDiscount(item)}
                </div>
                <div id="productAppearance">
                    <div id="appearance1">
                        <select id="appearanceSelect1" class="appearances"></select>
                        <label for="appearanceSelect1">: سایز</label>
                    </div>
                    <div id="appearance2">
                        <select id="appearanceSelect2" class="appearances"></select>
                        <label for="appearanceSelect2">: رنگ</label>
                    </div>
                </div>
                <div id="productActions">
                    <div>
                        <button id="basket">
                            افزودن به سبد خرید
                            <i class="fa-solid fa-cart-plus"></i>
                        </button>
                    </div>
                    <div>
                        <button id="decreaseProduct">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                        <div id="numberProduct"></div>
                        <button id="increaseProduct">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div id="productDetails">
                    <div>جزئیات محصول</div>
                    <ul id="detailsList"></ul>
                </div>
                <div id="productDescription">
                    <div>توضیحات محصول</div>
                    <div id="descriptionTitle"></div>
                </div>
            </div>
            <div id="pictures"></div>
        </div>
        <div id="related"></div>
        <div id="mostSold"></div>
    `;
    afterDom(item);
}

//تابعی برای چیزایی که نیاز دارن بعد از ساخته شدن dom اجرا بشن
function afterDom(item) {
    const appearanceSelect1 = document.getElementById('appearanceSelect1');
    const appearanceSelect2 = document.getElementById('appearanceSelect2');
    const detailsList = document.getElementById('detailsList');
    const descriptionTitle = document.getElementById('descriptionTitle');
    const pictures = document.getElementById('pictures');
    const related = document.getElementById('related');
    const mostSold = document.getElementById('mostSold');
    appearanceSelect2.innerHTML = productColor(item);
    appearanceSelect1.innerHTML = productSize(item, appearanceSelect2);
    productNumber(item, appearanceSelect2, appearanceSelect1);
    appearanceSelect2.addEventListener('input', () => {
        appearanceSelect1.innerHTML = productSize(item, appearanceSelect2);
        productNumber(item, appearanceSelect2, appearanceSelect1);
    });
    appearanceSelect1.addEventListener('input', () => productNumber(item, appearanceSelect2, appearanceSelect1));
    detailsList.innerHTML = productDetails(item);
    descriptionTitle.innerHTML = item.val.description ? item.val.description.replace(/\n/g, '<br>') : '';
    showImg(item, pictures);
    showRelated(item, related);
    showMostSold(item, mostSold);
}

//تابعی برای تایید وجود یا عدم وجود تخفیف محصول منتخب
const isDiscount = item => {
    if (item.val.discount !== 0) {
        return `
            <div id="beforeDiscount">
                ${item.val.price.toLocaleString()}    تومان
            </div>
        `;
    }
    return '';
}

//تابعی برای رنگ های محصول منتخب
function productColor(item) {
    const colors = JSON.parse(item.val.colors);
    return colors.map((x, index) => {
        const colorsArray = [];
        let colorsCode = {
            color1: x.color,
            color2: x.color2
        }
        item.colors.forEach(y => {
            y.id === colorsCode.color1 && colorsArray.push(y.title_main);
            if (isValid(colorsCode.color2) && y.id === colorsCode.color2) {
                colorsArray.push(y.title_main);
            }
        });
        const finalColor = colorsArray.join(' ');
        return `<option value="${index}">${finalColor}</option>`;
    }).join('');
}

//تابعی برای سایز های مربوط به رنگ های محصول منتخب
function productSize(item, appearanceSelect2) {
    const colors = JSON.parse(item.val.colors);
    let sizesCode = [];
    const allSizes = item.sizes.sub;
    const colorValue = appearanceSelect2.value;
    colors.forEach((x, index) => {
        if (Number(colorValue) === index) {
            x.sizes.forEach(y => sizesCode.push(y.size));
        }
    });
    return allSizes.filter(z => sizesCode.includes(z.id)).map(z => `<option value="${z.id}">${Number(z.title_main)}</option>`).join('');
}

//تابعی برای تعداد محصول منتخب متناسب با رنگ و سایز انتخابی
function productNumber(item, appearanceSelect2, appearanceSelect1) {
    const colors = JSON.parse(item.val.colors);
    const productCount = document.querySelector('#productActions > div:last-child');
    productCount.classList.remove('noProduct');
    const numberProduct = document.getElementById('numberProduct');
    const colorValue = appearanceSelect2.value;
    const sizeValue = appearanceSelect1.value;
    let count;
    colors[Number(colorValue)].sizes.forEach(x => {
        if (x.size === Number(sizeValue)) {
            count = Number(x.count);
        }
    });
    if (count > 0) {
        currentNumber = 1;
        const min = 1;
        const max = count;
        numberProduct.textContent = String(currentNumber);
        productNumberStyle(item, min, max, numberProduct);
    } else {
        productCount.classList.add('noProduct');
        productCount.innerHTML = `<div>!محصول موجود نمی باشد</div>`;
    }
}

//تابعی برای استایل دهی به دکمه های تغییر تعداد محصول منتخب
function productNumberStyle(item, min, max, numberProduct) {
    const decreaseProduct = document.getElementById('decreaseProduct');
    const increaseProduct = document.getElementById('increaseProduct');
    changePricesWithNumber(item);
    resetStyles(decreaseProduct, increaseProduct);
    if (min === max) {
        decreaseProduct.disabled = true;
        decreaseProduct.classList.add('inactive');
        increaseProduct.disabled = true;
        increaseProduct.classList.add('inactive');
    } else if (currentNumber === min) {
        decreaseProduct.disabled = true;
        decreaseProduct.classList.add('inactive');
        increaseProduct.onclick = () => increaseNumber(item, min, max, numberProduct);
    } else if (currentNumber === max) {
        increaseProduct.disabled = true;
        increaseProduct.classList.add('inactive');
        decreaseProduct.onclick = () => decreaseNumber(item, min, max, numberProduct);
    } else {
        decreaseProduct.onclick = () => decreaseNumber(item, min, max, numberProduct);
        increaseProduct.onclick = () => increaseNumber(item, min, max, numberProduct);
    }
}

//تابعی برای بهینه تر کردن تابع productNumberStyle
function resetStyles(decreaseProduct, increaseProduct) {
    decreaseProduct.disabled = false;
    increaseProduct.disabled = false;
    decreaseProduct.classList.remove('inactive');
    increaseProduct.classList.remove('inactive');
    decreaseProduct.onclick = null;
    increaseProduct.onclick = null;
}

//تابع تغییر قیمت ها با تغییر تعداد محصول
function changePricesWithNumber(item) {
    const finalPrice = item.val.price_all;
    const afterDiscount = document.getElementById('afterDiscount');
    const multiplied = (currentNumber * finalPrice).toLocaleString();
    afterDiscount.innerHTML = multiplied + ' تومان';
}

//تابع افزایش تعداد محصول منتخب
function increaseNumber(item, min, max, numberProduct) {
    if (currentNumber + 1 <= max) {
        currentNumber++;
        numberProduct.textContent = String(currentNumber);
    }
    productNumberStyle(item, min, max, numberProduct);
}

//تابع کاهش تعداد محصول منتخب
function decreaseNumber(item, min, max, numberProduct) {
    if (currentNumber - 1 >= min) {
        currentNumber--;
        numberProduct.textContent = String(currentNumber);
    }
    productNumberStyle(item, min, max, numberProduct);
}

//تابعی برای جزئیات محصول منتخب
function productDetails(item) {
    const productDetails = JSON.parse(item.val.details);
    let theAnswer = [];
    productDetails.forEach(x => {
        const selectedIds = x.id_select;
        const detailName = x.name;
        item.details.forEach(y => {
            if (y.id === x.id) {
                if (x.is_multi_select === false) {
                    y.sub.forEach(z => {
                        if (z.id === selectedIds) {
                            theAnswer.push(`<li>
                                ${detailName}
                                :
                                ${z.title_main}
                            </li>`);
                        }
                    });
                } else {
                    let answerArray = [];
                    y.sub.forEach(z => {
                        if (selectedIds.includes(z.id)) {
                            answerArray.push(z.title_main);
                        }
                    });
                    theAnswer.push(`<li>
                                ${detailName}
                                :
                                ${answerArray.join(' , ')}
                            </li>`);
                }
            }
        });
    });
    return theAnswer.join('');
}

//تابعی برای نمایش تصاویر مربوط به محصول منتخب
function showImg(item, pictures) {
    const images = JSON.parse(item.val.main_images);
    let imagesArray = [];
    images.forEach(x => {
        if (isValid(x.img)) {
            imagesArray.push(x);
        }
    });
    if (isValid(imagesArray)) {
        pictures.innerHTML = `
            <div id="mainImgHolder">
                <img id="mainImg" src="${imagesArray[0].img}" alt="${item.val.title}">
                <svg id="zoomPicture" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 xl:right-[32px] min-[1001px]:right-[15px] min-[1000px]:right-[185px] min-[768px]:right-[80px] min-[768px]:size-9">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
            </div>
            <div id="chosenProductSwiper" class="swiper">
                <div class="swiper-wrapper">
                    ${imagesArray.map(x => `<div class="swiper-slide"><img alt="${item.val.title}" src="${x.img}"></div>`).join('')}
                </div>
            </div>
        `;
    }
    const mainImg = document.getElementById('mainImg');
    const zoomPicture = document.getElementById('zoomPicture');
    zoomPicture.onclick = () => zoomImg(mainImg, imagesArray, item);
    createSwiperChosenProduct();
}

//تابعی برای بزرگنمایی تصویر محصول منخب
function zoomImg(mainImg, imagesArray, item) {
    const firstImgIndex = imagesArray.findIndex(x => x.img === mainImg.src);
    window.scrollTo({
        top: -30,
        behavior: 'smooth'
    });
    document.body.classList.add('relative');
    chosenProductModal.className = 'absolute left-1/2 -translate-x-1/2 bg-black/75 w-full h-screen z-999 lg:-top-[30px] min-[768px]:top-0';
    chosenProductModal.innerHTML = `
        <div id="modalSwiper" class="swiper left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div class="swiper-wrapper">
                ${imagesArray.map(x => `<div class="swiper-slide"><img class="rounded-4xl" alt="${item.val.title}" src="${x.img}"></div>`).join('')}
            </div>
            <i class="fa-solid fa-circle-chevron-left swiper-button-prev !text-white xl:text-5xl xl:!left-[50px] lg:text-4xl lg:!left-[35px] md:text-4xl md:!left-[25px] "></i>
            <i class="fa-solid fa-circle-chevron-right swiper-button-next !text-white xl:text-5xl xl:!right-[50px] lg:text-4xl lg:!right-[35px] md:text-4xl md:!right-[25px] "></i>
        </div>
        <i class="fa-solid fa-circle-xmark absolute top-[30px] text-white z-[10] xl:text-[2.6rem] xl:right-[35px] md:text-4xl md:right-[25px]"></i>
    `;
    createSwiperModalProduct(firstImgIndex);
    document.body.classList.add('noScroll');
    chosenProductModal.onclick = exitModal;
}

//تابعی برای کنترل swiper داخل مودال محصول منتخب
function createSwiperModalProduct(firstImgIndex) {
    const swiper = new Swiper('#modalSwiper', {
        slidesPerView: 1,
        spaceBetween: 0,
        resistance: true,
        resistanceRatio: 0.85,
        loop: true,
        navigation: {
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
        },
        initialSlide: firstImgIndex,
    });
}

//تابع خروج از مودال
function exitModal(e) {
    if (e.target.closest('.fa-circle-xmark') || e.target === chosenProductModal) {
        chosenProductModal.className = 'displayNone';
        chosenProductModal.innerHTML = '';
        document.body.classList.remove('noScroll');
    }
}

//تابعی برای کنترل swiper محصول منتخب
function createSwiperChosenProduct() {
    const swiper = new Swiper('#chosenProductSwiper', {
        slidesPerView: 4,
        spaceBetween: 10,
        resistance: true,
        resistanceRatio: 0.85,
    });
    const swiperEl = document.querySelector('#chosenProductSwiper');
    swiperEl.onclick = chooseSlide;
}

//تابع انتخاب تصویر از اسلایدر محصول منتخب
function chooseSlide(e) {
    const img = e.target.closest('#chosenProductSwiper .swiper-slide img');
    if (isValid(img)) {
        const mainImg = document.getElementById('mainImg');
        mainImg.src = img.src;
        mainImg.alt = img.alt;
    }
}

//تابعی برای ساخت swiper محصولات مشابه
function showRelated(item, related) {
    const relatedArray = item.val.related_products;
    related.innerHTML = `
            <div id="relatedTitle">
                <i class="fa-solid fa-bag-shopping"></i>
                <div>محصولات مشابه</div>
            </div>
            <div id="likeProductSwiper" class="swiper">
                <div class="swiper-wrapper">
                    ${createRelatedSwiper(relatedArray)}
                </div>
            </div>
        `;
    createSwiperLikeProduct();
    addEventToAnyLikeProduct();
}

//تابعی برای ساخت هر اسلاید اسلایدر محصولات مشابه
function createRelatedSwiper(relatedArray) {
    return relatedArray.map(x => {
        const id = x.id;
        const img = JSON.parse(x.main_images)[0].img;
        const title = x.title;
        const discount = x.discount;
        const price = x.price;
        const price_all = x.price_all;
        return `
            <div class="swiper-slide">
                <div class="relatedProduct" data-id="${id}">
                    <div class="relatedImg">
                        <img src="${img}" alt="${title}">
                    </div>
                    <div class="relatedName">${title}</div>
                    <div class="relatedDetails">
                        <div class="relatedFinalPrice">${price_all.toLocaleString() + ' تومان'}</div>
                        ${discount ? `<div class="relatedDiscount"><span>${discount + '%'}</span></div>` : ''}
                        ${discount ? `<div class="relatedPrice">${price.toLocaleString() + ' تومان'}</div>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

//تابعی برای کنترل swiper محصولات مشابه
function createSwiperLikeProduct() {
    const swiper = new Swiper('#likeProductSwiper', {
        spaceBetween: 10,
        resistance: true,
        resistanceRatio: 0.85,
        breakpoints: {
            425:{
                slidesPerView:1.5,
            },
            550:{
                slidesPerView:2,
            },
            768:{
                slidesPerView:2.5,
            },
            1000:{
                slidesPerView:4,
            },
            1440:{
                slidesPerView:5,
            },
        }
    });
}

//تابع افزودن رویداد کلیک به محصول در اسلایدر محصولات مشابه
function addEventToAnyLikeProduct() {
    const relatedProducts = document.querySelectorAll('.relatedProduct');
    relatedProducts.forEach(x => {
        const id = x.dataset.id;
        x.addEventListener('click', e => {
            if (e.target.closest('.relatedImg') || e.target.closest('.relatedName')) {
                chosenProduct.innerHTML = '';
                theProduct.id = id;
                fetchChosenProductFunction(api, theProduct);
            }
        });
    });
}

//تابعی برای ساخت swiper محصولات پرفروش
function showMostSold(item, mostSold) {
    const mostSoldArray = item.val.most_sold_products;
    mostSold.innerHTML = `
            <div id="mostSoldTitle">
                <i class="fa-solid fa-bag-shopping"></i>
                <div>پرفروش ترین محصولات</div>
            </div>
            <div id="mostSoldSwiper" class="swiper">
                <div class="swiper-wrapper">
                    ${createMostSoldSwiper(mostSoldArray)}
                </div>
            </div>
        `;
    createSwiperMostSold();
    addEventToAnyMostSold();
}

//تابعی برای ساخت هر اسلاید اسلایدر محصولات پرفروش
function createMostSoldSwiper(mostSoldArray) {
    return mostSoldArray.map(x => {
        const id = x.id;
        const img = JSON.parse(x.main_images)[0].img;
        const title = x.title;
        const discount = x.discount;
        const price = x.price;
        const price_all = x.price_all;
        return `
            <div class="swiper-slide">
                <div class="mostSoldProduct" data-id="${id}">
                    <div class="mostSoldImg">
                        <img src="${img}" alt="${title}">
                    </div>
                    <div class="mostSoldName">${title}</div>
                    <div class="mostSoldDetails">
                        <div class="mostSoldFinalPrice">${price_all.toLocaleString() + ' تومان'}</div>
                        ${discount ? `<div class="mostSoldDiscount"><span>${discount + '%'}</span></div>` : ''}
                        ${discount ? `<div class="mostSoldPrice">${price.toLocaleString() + ' تومان'}</div>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

//تابعی برای کنترل swiper محصولات پرفروش
function createSwiperMostSold() {
    const swiper = new Swiper('#mostSoldSwiper', {
        spaceBetween: 10,
        resistance: true,
        resistanceRatio: 0.85,
        breakpoints: {
            425:{
                slidesPerView:1.5,
            },
            550:{
                slidesPerView:2,
            },
            768:{
                slidesPerView:2.5,
            },
            1000:{
                slidesPerView:4,
            },
            1440:{
                slidesPerView:5,
            },
        }
    });
}

//تابع افزودن رویداد کلیک به محصول در اسلایدر محصولات پرفروش
function addEventToAnyMostSold() {
    const mostSoldProducts = document.querySelectorAll('.mostSoldProduct');
    mostSoldProducts.forEach(x => {
        const id = x.dataset.id;
        x.onclick = e => {
            if (e.target.closest('.mostSoldImg') || e.target.closest('.mostSoldName')) {
                chosenProduct.innerHTML = '';
                theProduct.id = id;
                fetchChosenProductFunction(api, theProduct);
            }
        };
    });
}

//زمانی که کلا محصول وجود نداره
// function noProduct(){
//     const productSeller = document.getElementById('productSeller');
//     const productPrice = document.getElementById('productPrice');
//     const productAppearance = document.getElementById('productAppearance');
//     const productActions = document.getElementById('productActions');
//     productPrice.classList.add('displayNone');
//     productAppearance.classList.add('displayNone');
//     productActions.classList.add('displayNone');
//     const newDiv = document.createElement('div');
//     newDiv.id = 'newDiv';
//     newDiv.textContent='!محصول موجود نمی باشد';
//     productSeller.insertAdjacentElement('afterend', newDiv);
// }

//تابع تغییر url صفحه برای تغییر فیلتر ها یا شماره صفحه
function URLChangeMain() {
    const filterLv0 = filterArray[0];
    const filterLv1 = filterArray[1];
    const filterLv2 = filterArray.slice(2).join(',');
    const filters = [filterLv0, filterLv1, filterLv2];
    let myFilters = [];
    filters.forEach(x => {
        if (isValid(x)) {
            myFilters.push(x);
        }
    });
    const pathname = location.pathname;
    const page = `page:${currentPage}`;
    let hash = [];
    if (myFilters.length > 0) {
        hash.push(`${'f_' + myFilters.join(':')}`);
    }
    hash.push(page);
    const finalURL = `${pathname}${'#' + hash.join('&')}`;
    const state = {
        status: 'main',
        currentPage: currentPage,
        filters: myFilters
    };
    history.pushState(state, '', finalURL);
}

//تابع تغییر url صفحه برای انتخاب یک محصول
function URLChosenProduct() {
}

//تابعی برای دکمه های برگشت و بعدی خود مرورگر
function browsersButtons(e) {
    const state = e.state;
    if (state === null) {
        betterCategorySecondLevel();
        filterContainerCategory.className = '';
        filterContainerCategory.classList.add('displayNone');
        const rightIcon = filterContainerTitle.querySelector('.fa-caret-right');
        const downIcon = filterContainerTitle.querySelector('.fa-caret-down');
        rightIcon.classList.remove('displayNone');
        downIcon.classList.add('displayNone');
        filterArray.length = 0;
        currentPage = 1;
        products.page = currentPage;
        fetchProductsFunction(api, products);
    } else if (state.status === 'main') {
        productsBox.classList.remove('displayNone');
        chosenProduct.classList.add('displayNone');
        const rightIcon = filterContainerTitle.querySelector('.fa-caret-right');
        const downIcon = filterContainerTitle.querySelector('.fa-caret-down');
        rightIcon.classList.remove('displayNone');
        downIcon.classList.add('displayNone');
        filterContainerCategory.className = '';
        filterContainerCategory.classList.add('displayNone');
        betterCategorySecondLevel();
        filterArray.length = 0;
        if (isValid(state.filters[0])) {
            rightIcon.classList.add('displayNone');
            downIcon.classList.remove('displayNone');
            filterContainerCategory.classList.remove('displayNone');
            const titleHolder1 = filterContainerCategory.querySelector(`[data-id="${state.filters[0]}"]`);
            const right1 = titleHolder1.querySelector('.fa-caret-right');
            const down1 = titleHolder1.querySelector('.fa-caret-down');
            const category1 = titleHolder1.nextElementSibling;
            titleHolder1.classList.add('activeCategory');
            right1.classList.add('displayNone');
            down1.classList.remove('displayNone');
            category1.classList.remove('displayNone');
            filterArray.push(state.filters[0]);
        }
        if (isValid(state.filters[1])) {
            const titleHolder2 = filterContainerCategory.querySelector(`[data-id="${state.filters[1]}"]`);
            const right2 = titleHolder2.querySelector('.fa-caret-right');
            const down2 = titleHolder2.querySelector('.fa-caret-down');
            const category2 = titleHolder2.nextElementSibling;
            titleHolder2.classList.add('activeCategory');
            right2.classList.add('displayNone');
            down2.classList.remove('displayNone');
            category2.classList.remove('displayNone');
            filterArray.push(state.filters[1]);
        }
        if (isValid(state.filters[2])) {
            const lastFilters = state.filters[2].split(',').map(Number);
            lastFilters.forEach(x => {
                const filtersLastLv = filterContainerCategory.querySelectorAll(`[data-id="${x}"]`);
                filtersLastLv.forEach(x => x.classList.add('activeCategory'));
            });
            lastFilters.forEach(x => filterArray.push(x));
        }
        currentPage = state.currentPage;
        products.page = currentPage;
        fetchProductsFunction(api, products);
    } else if (state.status === 'product') {
        productsBox.classList.add('displayNone');
        chosenProduct.classList.remove('displayNone');
    }
}

window.addEventListener('popstate', browsersButtons);

//تابعی برای ساده نویسی شرط وجود داشتن کد مورد نظر
const isValid = x => x != null && x !== 'null' && x !== 'undefined' && x !== '';