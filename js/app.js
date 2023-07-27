// ПОПАПЫ ПОПАПЫ ПОПАПЫ ПОПАПЫ ПОПАПЫ ПОПАПЫ ПОПАПЫ
const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding');

let unlock = true;

const timeout = 800;

if (popupLinks.length > 0) {
    for (let index = 0; index < popupLinks.length; index++) {
        const popupLink = popupLinks[index];
        popupLink.addEventListener("click", function (e) {
            const popupName = popupLink.getAttribute('href').replace('#', '');
            const curentPopup = document.getElementById(popupName);
            popupOpen(curentPopup);
            e.preventDefault();
        });
    }
}
const popupCloseIcon = document.querySelectorAll('.close__popup');
if (popupCloseIcon.length > 0) {
    for (let index = 0; index < popupCloseIcon.length; index++) {
        const el = popupCloseIcon[index];
        el.addEventListener('click', function (e) {
            popupClose(el.closest(".popup"));
            e.preventDefault();
        });
    }
}

function popupOpen(curentPopup) {
    if (curentPopup && unlock) {
        const popupActive = document.querySelector('.popup.open');
        if (popupActive) {
            popupClose(popupActive, false);
        } else {
            bodyLock();
        }
        curentPopup.classList.add('open');
        curentPopup.addEventListener("click", function (e) {
            if (!e.target.closest('.popup__content')) {
                popupClose(e.target.closest(".popup"));
            }
        });
    }
}
function popupClose (popupActive, doUnlock = true) {
    if (unlock) {
        popupActive.classList.remove("open");
        if (doUnlock) {
            bodyUnLock();
        }
    }
}

function bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
    
    if (lockPadding.length > 0) {
        for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = lockPaddingValue;
        }
    }
    body.style.paddingRight = lockPaddingValue;
    body.classList.add('lock');

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

function bodyUnLock() {
    setTimeout(function () {
        if (lockPadding.length > 0) {
            for (let index; index < lockPadding.length; index++) {
                const el = lockPadding[index];
                el.style.paddingRight = "0px";
            }
        }
        body.style.paddingRight = "0px";
        body.classList.remove('lock');
    }, timeout);

    unlock = false;
    setTimeout(function (){
        unlock = true;
    }, timeout);
}

document.addEventListener('keydown', function (e){
    if (e.which === 27) {
        const popupActive = document.querySelector(".popup.open");
        popupClose(popupActive);
    }
});

// ТАБЫ ТАБЫ ТАБЫ ТАБЫ ТАБЫ ТАБЫ ТАБЫ ТАБЫ

let tab = function () {
    let tabNav = document.querySelectorAll(".assortment__list-item"),
        tabContent = document.querySelectorAll(".tab"),
        tabName;

    tabNav.forEach(item => {
        item.addEventListener('click', selectTabNav)
    })

    function selectTabNav(){
        tabNav.forEach(item=> {
            item.classList.remove('is-active');
        })
        this.classList.add('is-active');
        tabName = this.getAttribute('data-tab-name');
        selectTabContent(tabName);
    }

    function selectTabContent(tabName) {
        tabContent.forEach(item => {
            item.classList.contains(tabName) ? item.classList.add('is-active'): item.classList.remove('is-active');
        })
    }
};

tab();

// НеПолынйФункционал НеПолынйФункционал НеПолынйФункционал 
document.getElementById('orderBtn').addEventListener('click', function (){
    alert("Оформить реальный заказ нельзя, так как это лишь работа для портфолио.")
});

// КАУНТЕР
window.addEventListener('click', function(event) {
    let counter;

    if (event.target.dataset.action === 'plus' || event.target.dataset.action === 'minus') {
        const counterWrapper = event.target.closest('.counter');
        counter = counterWrapper.querySelector('[data-counter');
    }

    if (event.target.dataset.action === 'plus') {
        counter.innerText = ++counter.innerText;
    }
 

    if (event.target.dataset.action === 'minus') {

        if (parseInt(counter.innerText) > 1) {
            counter.innerText = --counter.innerText;
        } else if (event.target.closest('.cart__middle') && parseInt(counter.innerText) === 1) {
            event.target.closest('.cart__item').remove();

            toggleCartStatus();
            calcCartPriceAndDelivery();
        }
    }

    if (event.target.hasAttribute('data-action') && event.target.closest('.cart__middle')) {
        calcCartPriceAndDelivery();
    }
});

// добавлениеТовараВКорзину добавлениеТовараВКорзину добавлениеТовараВКорзину 
const cartWrapper = document.querySelector('.cart__middle');
window.addEventListener('click', function(event) {

    if (event.target.hasAttribute('data-cart')) {
        
        const card = event.target.closest('.productWrap');
        
        const productInfo = {
            id: card.dataset.id,
            imgSrc: card.querySelector('.productWrap__picture').getAttribute('src'),
            title: card.querySelector('.productWrap__title').innerText,
            weight: card.querySelector('._weight').innerText,
            price: card.querySelector('.productWrap__bottom-price').innerText,
            counter: card.querySelector('[data-counter]').innerText
        };

        const itemInCart = cartWrapper.querySelector(`[data-id="${productInfo.id}"]`);

        if (itemInCart) {
            const counterElement = itemInCart.querySelector('[data-counter]');
            counterElement.innerText = parseInt(counterElement.innerText) + parseInt(productInfo.counter);
        } else {
            const cartItemHTML = `
            <div class="cart__item" data-id="${productInfo.id}">
                <div class="cart__item-left">
                    <img src="${productInfo.imgSrc}" alt="${productInfo.title}" class="cart-icon">
                    <div class="cart__item-info">
                        <h3 class="cart__item-title">${productInfo.title}</h3>
                        <p class="cart__item-weight">${productInfo.weight}</p>
                        <p class="cart__item-price">${productInfo.price}</p>
                    </div>
                </div>
                <div class="counter">
                    <button class="counterMinus  counterBtn" data-action="minus">-</button>
                    <p class="counter__count" data-counter>${productInfo.counter}</p>
                    <button class="counterPlus counterBtn" data-action="plus">+</button>
                </div>
            </div>`;

            cartWrapper.insertAdjacentHTML('beforeend', cartItemHTML);

        }

        card.querySelector('[data-counter]').innerText = '1';
        
        toggleCartStatus();
        calcCartPriceAndDelivery ();
    }
});


function toggleCartStatus () {
    const cartWrapper = document.querySelector('.cart__middle');
    const cartEmptyBage = document.querySelector('[data-cart-empty]');
    const orderForm = document.querySelector('.cart__bottom');
    const cartCounterItems = document.querySelector('.cart__top-subtitle');

    cartCounterItems.innerText = cartWrapper.children.length;
    if (cartWrapper.children.length > 0) {
        cartEmptyBage.classList.add("none");
        orderForm.classList.remove("none");
    } else {
        cartEmptyBage.classList.remove("none");
        orderForm.classList.add("none");
    }
};

function calcCartPriceAndDelivery () {
    const cartItems = document.querySelectorAll('.cart__item');
    let priceTotal = 0;
    const totalPrice = document.querySelector('.total__curency');

    cartItems.forEach(function(item) {
        const emountEl = item.querySelector('[data-counter]').innerText;
        const priceEl = item.querySelector('.cart__item-price').innerText;

        priceTotal += parseInt(emountEl) * parseInt(priceEl);

    });
    
    totalPrice.innerText = priceTotal;

    const freeDelivery = document.querySelector('.delivery');
    if (priceTotal >= 599) {
        freeDelivery.classList.remove('none')
    } else {
        freeDelivery.classList.add('none')
    }
};
