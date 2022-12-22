const qs = (element)=> document.querySelector(element)
const qsAll = (element)=>document.querySelectorAll(element)
let modalQt = 1
let modalKey = 0
cart = []

//LISTAGEM DAS PIZZAS:
pizzaJson.map((item, index)=>{  
   let pizzaItem = qs(".models .pizza-item").cloneNode(true)

   //preencher as informações em pizza-item
    pizzaItem.setAttribute("data-key", index)
    pizzaItem.querySelector(".pizza-item--img img").src = item.img
    pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price.toFixed(2)}`
    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name
    pizzaItem.querySelector(".pizza-item--desc").innerHTML =item.description

    pizzaItem.querySelector("a").addEventListener("click", (e)=>{
        e.preventDefault()
        
        let key = e.target.closest(".pizza-item").getAttribute("data-key")
        modalKey = key
        modalQt = 1

        //Informações do modal
        qs(".pizzaBig img").src = pizzaJson[key].img
        qs(".pizzaInfo h1").innerHTML = pizzaJson[key].name
        qs(".pizzaInfo--desc").innerHTML = pizzaJson[key].description
        qs(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`
        qs(".pizzaInfo--size.selected").classList.remove("selected")
        //ForEach = "para cada item...rodar essa função"
        qsAll(".pizzaInfo--size").forEach((size, sizeIndex)=>{

            if(sizeIndex === 2){
                size.classList.add("selected")
            }
            
            size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex]
        })

        qs(".pizzaInfo--qt").innerHTML = modalQt

        //MODAL
        qs(".pizzaWindowArea").style.opacity = 0
        qs(".pizzaWindowArea").style.display = "flex"
        setTimeout(()=>{
            qs(".pizzaWindowArea").style.opacity = 1,
            200
        })
    })

    qs(".pizza-area").append(pizzaItem)
})

//Eventos do MODAL

//Botões de fechar modal
function closeModal(){
    qs(".pizzaWindowArea").style.opacity = 0
    setTimeout(()=>{
        qs(".pizzaWindowArea").style.display = "none"
    },500)
}

qsAll(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach((item)=>{
    item.addEventListener("click", closeModal)
})


//Botões de adicionar quantidade
qs(".pizzaInfo--qtmenos").addEventListener("click", ()=>{
    if (modalQt > 1){
        modalQt--
        qs(".pizzaInfo--qt").innerHTML = modalQt
    }
})
qs(".pizzaInfo--qtmais").addEventListener("click", ()=>{
   modalQt++
   qs(".pizzaInfo--qt").innerHTML = modalQt
})


qsAll(".pizzaInfo--size").forEach((size,sizeIndex)=>{
    size.addEventListener("click", (e)=>{
        qs(".pizzaInfo--size.selected").classList.remove("selected")
        size.classList.add("selected")
    })
    

})

//Botao de adicionar ao carrinho
qs(".pizzaInfo--addButton").addEventListener("click", ()=>{
    let size = parseInt(qs(".pizzaInfo--size.selected").getAttribute("data-key"))
    let identifier = pizzaJson[modalKey].id+"@"+size
    let key = cart.findIndex((item)=>item.identifier == identifier)

    if(key > -1){
        cart[key].qt += modalQt
    }
    else{
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        })
    }

    closeModal()
    updateCart()
    
})


qs(".menu-openner").addEventListener("click",()=>{
    if(cart.length >= 1){
        qs("aside").style.left = "0"
    }
})

qs(".menu-closer").addEventListener("click", ()=>{
    qs("aside").style.left = "100vw"
})

function updateCart(){
    qs(".menu-openner span").innerHTML = cart.length

    if(cart.length > 0){
        qs("aside").classList.add("show")
        qs(".cart").innerHTML = ""

        let subtotal = 0
        let desconto = 0
        let total = 0

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id)

            subtotal += pizzaItem.price * cart[i].qt

            let cartItem = qs(".models .cart--item").cloneNode(true)

            let pizzaSizeName
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = "P"
                    break
                case 1:
                    pizzaSizeName = "M"
                    break
                case 2:
                    pizzaSizeName = "G"
                    break

            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            cartItem.querySelector("img").src = pizzaItem.img
            cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName
            cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt

            cartItem.querySelector(".cart--item-qtmenos").addEventListener("click", ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--
                }
                else{
                    cart.splice(i, 1)
                }
                updateCart()
            })
            cartItem.querySelector(".cart--item-qtmais").addEventListener("click",()=>{
                cart[i].qt++

                updateCart()
            })

            qs(".cart").append(cartItem)
        }

        desconto = subtotal * 0.1

        total = subtotal - desconto


        qs(".cart--totalitem.subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`
        qs(".cart--totalitem.desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`
        qs(".cart--totalitem.total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`

    }
    else{
        qs("aside").classList.remove("show")
        qs("aside").style.left = "100vw"
    }
}