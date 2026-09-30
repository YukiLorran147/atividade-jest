let clientes=[]
let pets=[]
let produtos=[]
let carrinho=[]


function criarCliente(){

let nome=clienteNome.value
let email=clienteEmail.value
let vip=clienteVip.checked

if(nome==""){
alert("Nome inválido")
return
}

if(!email.includes("@")){
alert("Email inválido")
return
}

clientes.push({nome,email,vip})

renderClientes()

}

function renderClientes(){

listaClientes.innerHTML=""

clientes.forEach(c=>{
let li=document.createElement("li")
li.innerText=c.nome+" - "+c.email
listaClientes.appendChild(li)
})

}


function cadastrarPet(){

let nome=petNome.value
let tipo=petTipo.value
let idade=parseInt(petIdade.value)

if(nome==""){
alert("Pet precisa de nome")
return
}

if(tipo==""){
alert("Pet precisa de tipo")
return
}

if(isNaN(idade) || idade<0){
alert("Idade inválida")
return
}

pets.push({nome,tipo,idade})

renderPets()

}

function renderPets(){

listaPets.innerHTML=""

pets.forEach(p=>{
let li=document.createElement("li")
li.innerText=p.nome+" ("+p.tipo+")"
listaPets.appendChild(li)
})

}


function criarProduto(){

let nome=produtoNome.value
let preco=parseFloat(produtoPreco.value)

if(isNaN(preco) || preco<=0){
alert("Preço inválido")
return
}

produtos.push({nome,preco})

renderProdutos()

}

function renderProdutos(){

listaProdutos.innerHTML=""
produtoSelect.innerHTML=""

produtos.forEach((p,i)=>{

let li=document.createElement("li")
li.innerText=p.nome+" - R$ "+p.preco
listaProdutos.appendChild(li)

let op=document.createElement("option")
op.value=i
op.innerText=p.nome
produtoSelect.appendChild(op)

})

}


function adicionarCarrinho(){

let p=produtos[produtoSelect.value]

if(!p || p.preco<=0){
alert("Produto inválido")
return
}

carrinho.push(p)

renderCarrinho()

}

function removerCarrinho(){

carrinho.shift()

renderCarrinho()

}

function renderCarrinho(){

listaCarrinho.innerHTML=""

carrinho.forEach(p=>{

let li=document.createElement("li")
li.innerText=p.nome+" - "+p.preco
listaCarrinho.appendChild(li)

})

calcularTotal()

}

function calcularTotal(){

let total=0

carrinho.forEach(p=>{

total+=p.preco

})

let clienteAtual=clientes[clientes.length-1]

if(clienteAtual && clienteAtual.vip){
total*=0.85
}else if(total>100){
total*=0.9
}

total=total.toFixed(2)

document.getElementById("total").innerText=total

return total

}


function finalizarCompra(){

alert("Compra finalizada: "+calcularTotal())

carrinho=[]

renderCarrinho()

}



let slideIndex = 0

function nextSlide(){
slideIndex++
updateSlide()
}

function prevSlide(){
slideIndex--
updateSlide()
}

function updateSlide(){

const slides = document.querySelector(".slides")
const total = document.querySelectorAll(".slide").length

if(slideIndex >= total) slideIndex = 0
if(slideIndex < 0) slideIndex = total - 1

slides.style.transform = "translateX(-" + slideIndex * 100 + "%)"

}

setInterval(nextSlide,4000)

