if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    taxed = []
    dataToSave = []

    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var vatTax = document.getElementsByClassName('btn-tax')
    for (var i = 0; i < vatTax.length; i++) {
        var tax = vatTax[i]
        tax.addEventListener('click', taxChanged)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }
    
    document.getElementsByClassName('btn-cancel')[0].addEventListener('click', orderCancelled)
    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
    document.getElementsByClassName('btn-save')[0].addEventListener('click', orderSaved)
}

function orderSaved(event) {
    alert('Your order has been successfuly saved.')

    var cartItems = document.getElementsByClassName('cart-items')[0].innerText
    const a = document.createElement("a")

    a.href = URL.createObjectURL(new Blob([cartItems]), {type : "text/plain"})
    a.setAttribute("download", "order.txt")
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    orderCancelled()
}

function orderCancelled(event) {
    var cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal(taxed)
}

function taxChanged(event) {
    var clicked = event.target
    var item = clicked.parentElement
    var title = item.getElementsByClassName('cart-item-title')[0].innerText

    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('Tax preferences will be updated.')
            taxed.push(i)
            break
        }
    }
    updateCartTotal(taxed)
}

function purchaseClicked() {
    alert('Thank you for your purchase')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal(taxed)
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal(taxed)
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal(taxed)
}

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    addItemToCart(title, price, imageSrc)
    updateCartTotal(taxed)
}

function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>
        <button class = "btn btn-tax" type="button">Apply Tax</button>
        `
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
    cartRow.getElementsByClassName('btn-tax')[0].addEventListener('click', taxChanged)
}

function updateCartTotal(taxedArr) {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var subtotal = 0
    var taxAmount = 0
    var total = 0
    var taxTotal = 0

    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))

        document.getElementsByClassName('cart-subtotal-price')[0].innerText = '$' + price
        if (taxedArr.includes(i, 0)) {
            taxAmount = price * .1
            taxAmount = Math.round(taxAmount * 100) / 100
        }

        var quantity = quantityElement.value
        taxTotal = taxTotal + (taxAmount * quantity)
        subtotal = subtotal + (price * quantity)
        taxAmount = 0
    }
    subtotal = Math.round(subtotal * 100) / 100
    document.getElementsByClassName('cart-subtotal-price')[0].innerText = '$' + subtotal
    document.getElementsByClassName('cart-tax-price')[0].innerText = '$' + taxTotal
    total = subtotal + taxTotal
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total

}