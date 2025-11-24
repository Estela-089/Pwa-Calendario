document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("listaProdutos");
    const form = document.getElementById("produtoForm");
    const submitButton = document.getElementById("submitButton");
    const mensagemStatus = document.getElementById("mensagemStatus");

    // Função para Limpar e Mostrar Status
    const mostrarStatus = (mensagem, sucesso = true) => {
        mensagemStatus.textContent = mensagem;
        mensagemStatus.style.color = sucesso ? 'green' : 'red';
        setTimeout(() => {
            mensagemStatus.textContent = '';
        }, 5000);
    };

    // 1. FUNÇÃO DE LISTAGEM DE PRODUTOS (GET)
    const carregarProdutos = async () => {
        try {
            const response = await fetch("https://fakestoreapi.com/products");
            const produtos = await response.json();

            container.innerHTML = ""; // Limpa a lista existente

            produtos.forEach((prod) => {
                const item = document.createElement("div");
                item.classList.add("produto");
                item.setAttribute("data-id", prod.id);

                item.innerHTML = `
                    <img src="${prod.image}" alt="${prod.title}">
                    <h3>${prod.title}</h3>
                    <p><strong>Preço:</strong> $${prod.price}</p>
                    <p>${prod.description.substring(0, 80)}...</p>
                    <button class="editarBtn" data-id="${prod.id}" 
                            data-title="${prod.title}" 
                            data-price="${prod.price}" 
                            data-description="${prod.description}"
                            data-image="${prod.image}"
                            data-category="${prod.category || 'sem categoria'}">Editar</button>
                `;

                container.appendChild(item);
            });

            // Adiciona evento de clique aos botões de edição
            document.querySelectorAll('.editarBtn').forEach(button => {
                button.addEventListener('click', preencherFormularioParaEdicao);
            });

        } catch (erro) {
            console.error("Erro ao carregar produtos:", erro);
            mostrarStatus("Erro ao carregar produtos. Verifique a conexão.", false);
        }
    };

    // 2. FUNÇÃO PARA PREENCHER O FORMULÁRIO (PARA EDIÇÃO)
    const preencherFormularioParaEdicao = (event) => {
        const btn = event.target;
        
        document.getElementById('produtoId').value = btn.dataset.id;
        document.getElementById('title').value = btn.dataset.title;
        document.getElementById('price').value = btn.dataset.price;
        document.getElementById('description').value = btn.dataset.description;
        document.getElementById('image').value = btn.dataset.image;
        document.getElementById('category').value = btn.dataset.category;

        submitButton.textContent = "Atualizar Produto (ID: " + btn.dataset.id + ")";
        document.querySelector('#formularioContainer h2').textContent = "Editar Produto";
        // Rola a página para o formulário
        document.getElementById('formularioContainer').scrollIntoView({ behavior: 'smooth' });
    };

    // 3. FUNÇÃO PARA ENVIAR O FORMULÁRIO (CADASTRO/ATUALIZAÇÃO)
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const id = document.getElementById('produtoId').value;
        const url = id ? `https://fakestoreapi.com/products/${id}` : 'https://fakestoreapi.com/products';
        const method = id ? 'PUT' : 'POST';

        const novoProduto = {
            title: document.getElementById('title').value,
            price: parseFloat(document.getElementById('price').value),
            description: document.getElementById('description').value,
            image: document.getElementById('image').value,
            category: document.getElementById('category').value,
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novoProduto)
            });

            const data = await response.json();
            
            if (response.ok) {
                mostrarStatus(`Produto ${id ? 'Atualizado' : 'Cadastrado'} com Sucesso! (ID: ${data.id})`, true);
                
                // Limpa o formulário e reseta para o modo Cadastro
                form.reset();
                document.getElementById('produtoId').value = '';
                submitButton.textContent = "Cadastrar Produto";
                document.querySelector('#formularioContainer h2').textContent = "Cadastrar Novo Produto";

                // A FakeStoreAPI não persiste dados. Se fosse uma API real, 
                // recarregaríamos a lista. Como é uma API fake, apenas mostramos o status.
                // carregarProdutos(); // Descomente para recarregar se a API fosse real
            } else {
                 mostrarStatus(`Erro ao ${id ? 'Atualizar' : 'Cadastrar'} produto.`, false);
            }

        } catch (error) {
            console.error(`Erro na operação ${method}:`, error);
            mostrarStatus(`Erro de rede ao ${id ? 'atualizar' : 'cadastrar'} produto.`, false);
        }
    });

    // Inicia o carregamento da lista de produtos
    carregarProdutos();
});

