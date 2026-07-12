//گرفتن عناصر مورد نیاز
//قیمت نهایی
let priceAll = document.getElementById("priceAll");
//تعداد محصول
let input = document.getElementById("input");
//انتخاب رنگ
let selectionColor = document.getElementById("selectionColor");
//انتخاب سایز
let selectionSize = document.getElementById("selectionSize");
//نمایش ناموجود بودن محصول
const NO = document.getElementById("NO");
//دکمه اضافه کردن محصول و نمایش موجود بودن محصول
const basket = document.getElementById("basket");
//modalMain
const modalMain = document.getElementById('modalMain');
//آیکون خروج
const exit = document.getElementById('exit');
//modalProducts
const modalProducts = document.getElementById('modalProducts');

//اسم فارسی کلید های آبجکت محصولات
const productsKeyTranslate = {
    "cream-brown": "کرمی-قهوه‌ ای",
    "black-brown": "مشکی-قهوه‌ ای",
    "white-brown": "سفید-قهوه ‌ای",
};

//آبجکت محصولات
const products = {
    "cream-brown": {
        37: {min: 1, max: 5},
        38: {min: 0, max: 0},
        39: {min: 0, max: 0},
        40: {min: 0, max: 0},
        41: {min: 0, max: 0},
        42: {min: 0, max: 0},
    },
    "black-brown": {
        37: {min: 0, max: 0},
        38: {min: 0, max: 0},
        39: {min: 0, max: 0},
        40: {min: 0, max: 0},
        41: {min: 0, max: 0},
        42: {min: 0, max: 0},
    },
    "white-brown": {
        37: {min: 1, max: 2},
        38: {min: 1, max: 2},
        39: {min: 0, max: 0},
        40: {min: 0, max: 0},
        41: {min: 1, max: 3},
        42: {min: 1, max: 3},
    }
};

//وقتی صفحه لود میشه
document.addEventListener("DOMContentLoaded", function () {
    //واسه اینکه مطمئن بشیم هیچی اول کار نبوده
    selectionColor.innerHTML = "";
    selectionSize.innerHTML = "";
    //انتخاب رنگ اولیه
    for (const key in products) {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = productsKeyTranslate[key];
        selectionColor.appendChild(option);
    }
    selectionColor.value = selectionColor.options[0].value;
    //انتخاب سایز اولیه
    const firstKeySizes = products[selectionColor.options[0].value];
    for (const size in firstKeySizes) {
        const option = document.createElement("option");
        option.value = size;
        option.textContent = size;
        selectionSize.appendChild(option);
    }
    selectionSize.value = selectionSize.options[0].value;
    //تعیین تعداد و محدودیت تعداد اولیه
    const firstColorValue = selectionColor.options[0].value;
    const firstSizeValue = selectionSize.options[0].value;
    const firstDefaultValue = products[firstColorValue][firstSizeValue];
    input.min = firstDefaultValue.min;
    input.max = firstDefaultValue.max;
    input.value = firstDefaultValue.min;
    //تعیین قیمت اولیه
    priceAll.textContent = String((parseInt(input.value) * priceOne()).toLocaleString());
    //تعیین موجود بودن یا نبودن محصول
    display();
});

//وقتی رنگ تغییر میکنه
selectionColor.addEventListener("input", () => {
    selectionSize.innerHTML = "";
    const sizes = products[selectionColor.value];
    for (const size in sizes) {
        const option = document.createElement("option");
        option.value = size;
        option.textContent = size;
        selectionSize.appendChild(option);
    }
    selectionSize.value = selectionSize.options[0].value;
    getNumberLimit();
    priceAll.textContent = String((parseInt(input.value) * priceOne()).toLocaleString());
    display();
});

//وقتی سایز تغییر میکنه
selectionSize.addEventListener("input", () => {
    getNumberLimit();
    priceAll.textContent = String((parseInt(input.value) * priceOne()).toLocaleString());
    display();
});

//تابع گرفتن محدودیت تعداد
function getNumberLimit() {
    const chosenColorValue = selectionColor.options[selectionColor.selectedIndex].value;
    const chosenSizeValue = selectionSize.options[selectionSize.selectedIndex].value;
    const firstDefaultValue = products[chosenColorValue][chosenSizeValue];
    if (firstDefaultValue.min === 0) {
        input.value = 0;
    } else {
        input.value = 1;
    }
    input.min = firstDefaultValue.min;
    input.max = firstDefaultValue.max;
}

//تابع قیمت تکی
function priceOne() {
    if (parseInt(selectionSize.value) === 41 || parseInt(selectionSize.value) === 42) {
        return 220000;
    } else {
        return 200000;
    }
}

//جلوگیری از تغییر تعداد محصول با کیبورد
input.addEventListener("keydown", (e) => e.preventDefault());

//تغییر قیمت نهایی با تغییر تعداد محصول
input.addEventListener("input", () => {
    priceAll.textContent = String((parseInt(input.value) * priceOne()).toLocaleString());
});

//تابع موجود بودن یا نبودن محصول
function display() {
    if (input.value === String(0)) {
        basket.style.display = "none";
        NO.style.display = 'inline';
    } else {
        basket.style.display = "inline";
        NO.style.display = 'none';
    }
}

//بارگزاری داده ها از local storage یا ایجاد یه آرایه خالی
let list = JSON.parse(localStorage.getItem('list')) || [];

//تابع ذخیره لیست درون localStorage
function set() {
    localStorage.setItem('list', JSON.stringify(list));
}

//ایجاد آبجکتی برای ذخیره ویژگی های هر محصول
const skills = {
    ImgSrc: '',
    ImgAlt: '',
    Name: '',
    Color: '',
    Size: '',
    Price: '',
    PriceOne: '',
    Number: '',
    NumberLimit: ''
}

//افزودن رویداد کلیک به basket
basket.addEventListener('click', () => {
    //اطلاعات مربوط به تصویر محصول انتخاب شده
    const imgSrc = document.querySelector('#picture > img').src;
    const imgAlt = document.querySelector('#picture> img').alt;
    //نام محصول انتخاب شده
    const name = document.getElementById('titleShoes').textContent;
    //رنگ انتخاب شده
    const color = document.getElementById('selectionColor').value;
    //سایز انتخاب شده
    const size = document.getElementById('selectionSize').value;
    //قیمت نهایی محصول
    const price = document.getElementById('priceAll').textContent;
    //تعداد نهایی محصول
    const number = document.getElementById('input').value;
    //محدودیت تعداد محصول
    const numberLimit = document.getElementById('input').max;

    skills.ImgSrc = imgSrc;
    skills.ImgAlt = imgAlt;
    skills.Name = name;
    skills.Color = productsKeyTranslate[color];
    skills.Size = size;
    skills.Price = price;
    skills.PriceOne = parseInt(price.replaceAll(',', '')) / parseInt(number);
    skills.Number = number;
    skills.NumberLimit = numberLimit;

    //بارگزاری داده ها از local storage یا ایجاد یه آرایه خالی
    list = JSON.parse(localStorage.getItem('list')) || [];

    //اضافه کردن آبجکت با تغییرات به localStorage
    list.push(skills);
    set();
    render(skills);

    //نمایش مودال
    modalMain.style.display = 'flex';
});

//متغیر جمع قیمت نهایی تمامی محصولات
let holyPrice = 0;

//تابع ساخت هر محصول از localStorage
function render() {
    modalProducts.innerHTML = '';
    list.forEach((item, index) => {
        let product = document.createElement('div');
        product.className = 'product';
        modalProducts.appendChild(product);
        let modalInformation = document.createElement('div');
        modalInformation.className = 'modalInformation';
        product.appendChild(modalInformation);
        let modalInformationFirst = document.createElement('div');
        modalInformationFirst.className = 'modalInformationFirst';
        modalInformation.appendChild(modalInformationFirst);
        let informationNumber = document.createElement('div');
        informationNumber.className = 'informationNumber';
        modalInformationFirst.appendChild(informationNumber);
        let informationNumberFirst = document.createElement('div');
        informationNumberFirst.className = 'informationNumberFirst';
        informationNumberFirst.textContent = ': تعداد';
        informationNumber.appendChild(informationNumberFirst);
        let informationNumberLast = document.createElement('div');
        informationNumberLast.className = 'informationNumberLast';
        informationNumber.appendChild(informationNumberLast);
        let minus = document.createElement('i');
        minus.className = 'fa-solid fa-minus';
        minus.addEventListener('click', () => {
            minusNumber(index);
            checkLimit(index, plus);
            whichOne(index, minus, trash);
        });
        informationNumberLast.appendChild(minus);
        let trash = document.createElement('i');
        trash.className = 'fa-solid fa-trash-can';
        trash.addEventListener('click', () => {
            trashNumber(index);
        });
        informationNumberLast.appendChild(trash);
        let informationProductNumber = document.createElement('span');
        informationProductNumber.className = 'informationProductNumber';
        informationProductNumber.textContent = item.Number;
        informationNumberLast.appendChild(informationProductNumber);
        let plus = document.createElement('i');
        plus.className = 'fa-solid fa-plus';
        plus.addEventListener('click', () => {
            plusNumber(index);
            checkLimit(index, plus);
            whichOne(index, minus, trash);
        });
        informationNumberLast.appendChild(plus);
        checkLimit(index, plus);
        whichOne(index, minus, trash);
        let informationPrice = document.createElement('div');
        informationPrice.className = 'informationPrice';
        modalInformationFirst.appendChild(informationPrice);
        let informationPriceFirst = document.createElement('div');
        informationPriceFirst.className = 'informationPriceFirst';
        informationPriceFirst.textContent = ': قیمت';
        informationPrice.appendChild(informationPriceFirst);
        let informationPriceLast = document.createElement('div');
        informationPriceLast.className = 'informationPriceLast';
        informationPrice.appendChild(informationPriceLast);
        let currency = document.createElement('div');
        currency.textContent = '(تومان)';
        informationPriceLast.appendChild(currency);
        let informationProductPrice = document.createElement('div');
        informationProductPrice.className = 'informationProductPrice';
        informationProductPrice.textContent = item.Price;
        informationPriceLast.appendChild(informationProductPrice);
        let modalInformationLast = document.createElement('div');
        modalInformationLast.className = 'modalInformationLast';
        modalInformation.appendChild(modalInformationLast);
        let informationColor = document.createElement('div');
        informationColor.className = 'informationColor';
        modalInformationLast.appendChild(informationColor);
        let tittleColor = document.createElement('div');
        tittleColor.className = 'tittleColor';
        tittleColor.textContent = ': رنگ';
        informationColor.appendChild(tittleColor);
        let color = document.createElement('div');
        color.className = 'color';
        color.textContent = item.Color;
        informationColor.appendChild(color);
        let informationSize = document.createElement('div');
        informationSize.className = 'informationSize';
        modalInformationLast.appendChild(informationSize);
        let tittleSize = document.createElement('div');
        tittleSize.className = 'tittleSize';
        tittleSize.textContent = ': سایز';
        informationSize.appendChild(tittleSize);
        let size = document.createElement('div');
        size.className = hj'size';
        size.textContent = item.Size;
        informationSize.appendChild(size);
        let modalPicture = document.createElement('div');
        modalPicture.className = 'modalPicture';
        product.appendChild(modalPicture);
        let img = document.createElement('img');
        img.src = item.ImgSrc;
        img.alt = item.ImgAlt;
        modalPicture.appendChild(img);
        let productName = document.createElement('div');
        productName.className = 'productName';
        productName.textContent = item.Name;
        modalPicture.appendChild(productName);
        holyPrice += (parseInt((item.Price).replaceAll(',', ''))).toLocaleString();
        console.log(holyPrice);
    });
}

//تابع برای تشخیص بودن آیکون حذف یا کم کردن
function whichOne(index, minus, trash) {
    //بارگزاری داده ها از local storage یا ایجاد یه آرایه خالی
    list = JSON.parse(localStorage.getItem('list')) || [];
    let Number = list[index].Number;
    if (parseInt(Number) === 1) {
        minus.style.display = 'none';
        trash.style.display = 'inline-block';
    } else {
        minus.style.display = 'inline-block';
        trash.style.display = 'none';
    }
}

//تابع استایل دهی به دکمه افزایش محصول و بررسی محدودیت تعداد محصول
function checkLimit(index, plus) {
    //بارگزاری داده ها از local storage یا ایجاد یه آرایه خالی
    list = JSON.parse(localStorage.getItem('list')) || [];
    let Number = list[index].Number;
    let NumberLimit = list[index].NumberLimit;
    if (parseInt(Number) === parseInt(NumberLimit)) {
        plus.style.opacity = '0.2';
        plus.style.pointerEvents = 'none';
    } else {
        plus.style.opacity = '1';
        plus.style.pointerEvents = 'auto';
    }
}

//تابع کم کردن تعداد محصول درون سبد خرید
function minusNumber(index) {
    //بارگزاری داده ها از local storage یا ایجاد یه آرایه خالی
    list = JSON.parse(localStorage.getItem('list')) || [];
    let Number = list[index].Number;
    list[index].Number = parseInt(Number) - 1;
    let priceOne = list[index].PriceOne;
    list[index].Price = String((list[index].Number * priceOne).toLocaleString());
    set();
    render();
}

//تابع حذف محصول درون سبد خرید
function trashNumber(index) {
    list.splice(index, 1);
    set();
    render();
}

//تابع افزایش محصول درون سبد خرید
function plusNumber(index) {
    //بارگزاری داده ها از local storage یا ایجاد یه آرایه خالی
    list = JSON.parse(localStorage.getItem('list')) || [];
    let Number = list[index].Number;
    list[index].Number = parseInt(Number) + 1;
    let priceOne = list[index].PriceOne;
    list[index].Price = String((list[index].Number * priceOne).toLocaleString());
    set();
    render();
}

//بستن مودال
window.addEventListener('click', e => {
    if (e.target === modalMain || e.target === exit) {
        modalMain.style.display = 'none';
    }
});