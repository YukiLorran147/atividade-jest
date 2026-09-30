const { carregarApp } = require("./setup");

let w, doc;
const $ = (id) => doc.getElementById(id);
const estado = (nome) => w.eval(nome);

beforeEach(() => {
  w = carregarApp();
  doc = w.document;
});

function cadastrarCliente(nome, email, vip = false) {
  $("clienteNome").value = nome;
  $("clienteEmail").value = email;
  $("clienteVip").checked = vip;
  w.criarCliente();
}
function cadastrarPet(nome, tipo, idade) {
  $("petNome").value = nome;
  $("petTipo").value = tipo;
  $("petIdade").value = idade;
  w.cadastrarPet();
}
function criarProduto(nome, preco) {
  $("produtoNome").value = nome;
  $("produtoPreco").value = preco;
  w.criarProduto();
}
function adicionarAoCarrinho(indice = 0) {
  $("produtoSelect").value = String(indice);
  w.adicionarCarrinho();
}

describe("Testes de Cliente", () => {
  test("1. Deve permitir criar cliente com nome válido", () => {
    cadastrarCliente("Maria", "maria@email.com");
    expect(estado("clientes")).toHaveLength(1);
    expect(estado("clientes")[0].nome).toBe("Maria");
  });

  test("2. Não deve permitir cliente com nome vazio", () => {
    cadastrarCliente("", "maria@email.com");
    expect(estado("clientes")).toHaveLength(0);
    expect(w.alert).toHaveBeenCalledWith("Nome inválido");
  });

  test("3. Deve permitir cadastrar cliente com email válido", () => {
    cadastrarCliente("Maria", "maria@email.com");
    expect(estado("clientes")[0].email).toBe("maria@email.com");
  });

  test("4. Não deve permitir email inválido", () => {
    cadastrarCliente("Maria", "email-sem-arroba");
    expect(estado("clientes")).toHaveLength(0);
    expect(w.alert).toHaveBeenCalledWith("Email inválido");
  });

  test("5. Deve permitir marcar cliente como VIP", () => {
    cadastrarCliente("Maria", "maria@email.com", true);
    expect(estado("clientes")[0].vip).toBe(true);
  });
});

describe("Testes de Pet", () => {
  test("6. Deve permitir cadastrar um pet", () => {
    cadastrarPet("Rex", "cachorro", "3");
    expect(estado("pets")).toHaveLength(1);
    expect($("listaPets").children).toHaveLength(1);
  });

  test("7. Pet deve possuir nome obrigatório", () => {
    cadastrarPet("", "cachorro", "3");
    expect(estado("pets")).toHaveLength(0);
    expect(w.alert).toHaveBeenCalledWith("Pet precisa de nome");
  });

  test("8. Pet deve possuir tipo (cachorro, gato, etc)", () => {
    cadastrarPet("Rex", "", "3");
    expect(estado("pets")).toHaveLength(0);
  });

  test("9. Pet deve possuir idade válida (número)", () => {
    cadastrarPet("Rex", "cachorro", "abc");
    expect(estado("pets")).toHaveLength(0);
  });
});

describe("Testes de Produto", () => {
  test("10. Deve permitir criar produto com nome", () => {
    criarProduto("Ração", "50");
    expect(estado("produtos")[0].nome).toBe("Ração");
  });

  test("11. Produto deve possuir preço maior que zero", () => {
    criarProduto("Ração", "0");
    expect(estado("produtos")).toHaveLength(0);
  });

  test("12. Produto não pode possuir preço negativo", () => {
    criarProduto("Ração", "-10");
    expect(estado("produtos")).toHaveLength(0);
    expect(w.alert).toHaveBeenCalledWith("Preço inválido");
  });

  test("13. Produto deve aparecer na lista de produtos cadastrados", () => {
    criarProduto("Ração", "50");
    const itens = [...$("listaProdutos").children].map((li) => li.textContent);
    expect(itens).toContain("Ração - R$ 50");
    expect($("produtoSelect").children).toHaveLength(1);
  });
});

describe("Testes de Carrinho", () => {
  beforeEach(() => {
    criarProduto("Ração", "30");
    criarProduto("Brinquedo", "20");
  });

  test("14. Deve permitir adicionar produto ao carrinho", () => {
    adicionarAoCarrinho(0);
    expect(estado("carrinho")).toHaveLength(1);
    expect(estado("carrinho")[0].nome).toBe("Ração");
  });

  test("15. Deve permitir remover produto do carrinho", () => {
    adicionarAoCarrinho(0);
    w.removerCarrinho();
    expect(estado("carrinho")).toHaveLength(0);
  });

  test("16. Carrinho deve listar todos os produtos adicionados", () => {
    adicionarAoCarrinho(0);
    adicionarAoCarrinho(1);
    expect($("listaCarrinho").children).toHaveLength(2);
  });

  test("17. Carrinho deve calcular o valor total da compra", () => {
    adicionarAoCarrinho(0);
    adicionarAoCarrinho(1);
    expect($("total").textContent).toBe("50.00");
  });
});

describe("Testes de Regras de Negócio", () => {
  test("18. Compra acima de R$100 deve aplicar desconto de 10%", () => {
    criarProduto("Cama", "200");
    adicionarAoCarrinho(0);
    expect(w.calcularTotal()).toBe("180.00");
  });

  test("19. Cliente VIP deve receber desconto de 15%", () => {
    cadastrarCliente("Maria", "maria@email.com", true);
    criarProduto("Ração", "50");
    adicionarAoCarrinho(0);
    expect(parseFloat(w.calcularTotal())).toBeCloseTo(42.5, 2);
  });

  test("20. Carrinho não deve aceitar produto com preço igual a zero", () => {
    criarProduto("Brinde", "0");
    adicionarAoCarrinho(0);
    expect(estado("carrinho")).toHaveLength(0);
  });
});

describe("Outros Testes", () => {
  test("21. Carrinho vazio deve retornar total igual a 0", () => {
    expect(parseFloat(w.calcularTotal())).toBe(0);
  });

  test("22. Ao finalizar compra o carrinho deve ser limpo", () => {
    criarProduto("Ração", "30");
    adicionarAoCarrinho(0);
    w.finalizarCompra();
    expect(estado("carrinho")).toHaveLength(0);
    expect($("listaCarrinho").children).toHaveLength(0);
  });

  test("23. O carrossel deve trocar automaticamente as imagens", () => {
    const { fn, ms } = w.__intervalos[0];
    expect(ms).toBe(4000);
    fn();
    expect(doc.querySelector(".slides").style.transform).toBe("translateX(-100%)");
    fn();
    expect(doc.querySelector(".slides").style.transform).toBe("translateX(-200%)");
    fn();
    expect(doc.querySelector(".slides").style.transform).toBe("translateX(-0%)");
  });

  test("24. Os botões Adicionar / Remover / Finalizar devem funcionar corretamente", () => {
    criarProduto("Ração", "30");
    const botoes = [...doc.querySelectorAll("button")];
    const clicar = (texto) => botoes.find((b) => b.textContent.trim() === texto).click();

    clicar("Adicionar");
    expect(estado("carrinho")).toHaveLength(1);
    clicar("Remover");
    expect(estado("carrinho")).toHaveLength(0);
    clicar("Adicionar");
    clicar("Finalizar");
    expect(estado("carrinho")).toHaveLength(0);
    expect(w.alert).toHaveBeenCalled();
  });
});
