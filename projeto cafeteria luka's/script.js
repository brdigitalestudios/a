

// ===============================
// 🔐 REGISTRO
// ===============================
function registrar() {
    const nome = document.getElementById("nome")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const senha = document.getElementById("senha")?.value;

    if (!nome || !email || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const existe = usuarios.some(user => user.email === email);

    if (existe) {
        alert("Email já cadastrado!");
        return;
    }

    usuarios.push({
        nome,
        email,
        senha
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Conta criada com sucesso!");
    window.location.href = "login.html";
}


// ===============================
// 🔑 LOGIN
// ===============================
function login() {
    const email = document.getElementById("emailLogin")?.value.trim();
    const senha = document.getElementById("senhaLogin")?.value;

    if (!email || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuario = usuarios.find(
        user => user.email === email && user.senha === senha
    );

    if (usuario) {
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        alert("Login realizado com sucesso!");
        window.location.href = "index.html";
    } else {
        alert("Email ou senha incorretos!");
    }
}


// ===============================
// 👤 VERIFICAR SE ESTÁ LOGADO
// ===============================
function verificarLogin() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuario) {
        alert("Você precisa estar logado!");
        window.location.href = "login.html";
        return false;
    }

    return true;
}


// ===============================
// 🛒 FINALIZAR PEDIDO
// ===============================
function finalizarPedido() {

    if (!verificarLogin()) return;

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const novoPedido = {
        cliente: usuario.nome,
        email: usuario.email,
        data: new Date().toLocaleString(),
        itens: carrinho
    };

    pedidos.push(novoPedido);

    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    localStorage.removeItem("carrinho");

    alert("Pedido enviado com sucesso!");
    window.location.href = "index.html";
}


// ===============================
// 🔐 LOGIN ADMIN (ÁREA DE PEDIDOS)
// ===============================
function verificarSenhaAdmin() {
    const senha = document.getElementById("senhaAdmin")?.value;

    const senhaCorreta = "admin123"; // você pode mudar

    if (senha === senhaCorreta) {
        document.getElementById("loginAdmin").style.display = "none";
        document.getElementById("areaPedidos").style.display = "block";
        mostrarPedidos();
    } else {
        alert("Senha incorreta!");
    }
}


// ===============================
// 📦 MOSTRAR PEDIDOS (ADMIN)
// ===============================
function mostrarPedidos() {

    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    let lista = document.getElementById("lista-pedidos");

    if (!lista) return;

    lista.innerHTML = "";

    if (pedidos.length === 0) {
        lista.innerHTML = "<p>Nenhum pedido encontrado.</p>";
        return;
    }

    pedidos.forEach((pedido, index) => {

        let total = 0;

        lista.innerHTML += `
            <div class="pedido-box">
                <h3>Pedido ${index + 1}</h3>
                <p><strong>Cliente:</strong> ${pedido.cliente}</p>
                <p><strong>Email:</strong> ${pedido.email}</p>
                <p><strong>Data:</strong> ${pedido.data}</p>
        `;

        pedido.itens.forEach(item => {
            lista.innerHTML += `
                <p>${item.nome} - R$ ${item.preco.toFixed(2)}</p>
            `;
            total += item.preco;
        });

        lista.innerHTML += `
                <strong>Total: R$ ${total.toFixed(2)}</strong>
                <hr>
            </div>
        `;
    });
}


// ===============================
// 🚪 LOGOUT
// ===============================
function logout() {
    localStorage.removeItem("usuarioLogado");
    alert("Você saiu da conta!");
    window.location.href = "login.html";
}

onAuthStateChanged(auth, (user) => {

    const areaUsuario = document.getElementById("area-usuario");

    if (user) {

        const nome = user.email.split("@")[0];

        areaUsuario.innerHTML = `
            <div class="perfil-box" onclick="toggleMenu()">
                <img src="https://i.imgur.com/6VBx3io.png">
                <span>${nome}</span>
            </div>

            <div class="dropdown-menu" id="dropdown">
                <a href="meus-pedidos.html">📦 Meus Pedidos</a>
                <button onclick="logout()">🚪 Sair</button>
            </div>
        `;

    } else {

        areaUsuario.innerHTML = `
            <a href="login.html" class="btn-login">ENTRAR / REGISTRAR</a>
        `;
    }

});

// Toggle menu
window.toggleMenu = function() {
    const menu = document.getElementById("dropdown");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
};

// Logout
window.logout = async () => {
    await signOut(auth);
    window.location.href = "index.html";
};

// ===============================
// 🛒 SISTEMA DE CARRINHO (GLOBAL)
// ===============================

// Usamos window. para que o HTML consiga "enxergar" a função
window.addCarrinho = function(nome, preco) {
    // 1. Pega o carrinho ou cria um novo
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    // 2. Adiciona o item
    carrinho.push({ 
        nome: nome, 
        preco: preco,
        id: Date.now() // Cria um ID único para cada item
    });

    // 3. Salva no navegador
    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    // 4. Atualiza o número no ícone do carrinho lá no topo
    atualizarContador();

    // 5. Alerta de sucesso (opcional)
    alert("☕ " + nome + " adicionado ao seu pedido!");
};

// Função para atualizar o número (0) que fica no ícone do carrinho
window.atualizarContador = function() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const campoContador = document.getElementById("cart-count");
    
    if (campoContador) {
        campoContador.innerText = carrinho.length;
    }
};

// Quando a página terminar de carregar, ele atualiza o contador
window.addEventListener('DOMContentLoaded', atualizarContador);

// ===============================
// 🛒 EXIBIR ITENS NO CARRINHO
// ===============================
window.mostrarCarrinho = function() {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    let lista = document.getElementById("lista-carrinho");
    let totalElemento = document.getElementById("total");

    if (!lista) return; // Evita erro se não estiver na página de carrinho

    lista.innerHTML = "";
    let total = 0;

    if (carrinho.length === 0) {
        lista.innerHTML = "<p>Seu carrinho está vazio.</p>";
        totalElemento.innerText = "Total: R$ 0,00";
        return;
    }

    carrinho.forEach((item, index) => {
        total += item.preco;
        lista.innerHTML += `
            <div class="produto-carrinho">
                <p><strong>${item.nome}</strong> - R$ ${item.preco.toFixed(2)}</p>
                <button onclick="removerDoCarrinho(${index})">Remover</button>
            </div>
        `;
    });

    totalElemento.innerText = `Total: R$ ${total.toFixed(2)}`;
};

// ===============================
// ❌ REMOVER ITEM DO CARRINHO
// ===============================
window.removerDoCarrinho = function(index) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho.splice(index, 1); // Remove o item pelo índice
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    
    mostrarCarrinho(); // Atualiza a lista na tela
    atualizarContador(); // Atualiza o número no ícone lá no topo
};