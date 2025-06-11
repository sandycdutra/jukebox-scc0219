// frontend/src/hooks/useCart.js
import { useState, useEffect, useCallback } from 'react'; // Importa hooks essenciais do React
import { getInitialProductStock } from '../utils/initialStock'; // Importa a função para obter o estoque inicial padrão dos produtos

// Chaves usadas para armazenar dados no localStorage do navegador.
// Essas chaves garantem que os dados do carrinho e do estoque persistam entre as sessões.
const CART_STORAGE_KEY = 'jukebox_cart';
const STOCK_STORAGE_KEY = 'jukebox_product_stock';

/**
 * Hook personalizado para gerenciar o estado do carrinho de compras e o estoque simulado.
 * Ele simula as funcionalidades de um backend para estas operações no frontend.
 */
export function useCart() {
    // 1. Estado do Carrinho (cartItems)
    // Inicializa o estado 'cartItems' (itens no carrinho)
    // A função passada para useState é executada APENAS na primeira renderização,
    // tentando carregar dados do localStorage.
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCartItems = localStorage.getItem(CART_STORAGE_KEY);
            // Se houver itens no localStorage, parseia o JSON de volta para um array.
            // Caso contrário, retorna um array vazio.
            return storedCartItems ? JSON.parse(storedCartItems) : [];
        } catch (error) {
            // Em caso de erro (ex: JSON inválido no localStorage), loga o erro e retorna um array vazio.
            console.error(error);
            return [];
        }
    });

    // 2. Estado do Estoque Simulado (mockStock)
    // Inicializa o estado 'mockStock' (o inventário de produtos simulado).
    // Também tenta carregar do localStorage primeiro.
    const [mockStock, setMockStock] = useState(() => {
        try {
            const storedStock = localStorage.getItem(STOCK_STORAGE_KEY);
            // Tenta parsear o valor do localStorage. Se for null/undefined, 'parsedStock' será null.
            const parsedStock = storedStock ? JSON.parse(storedStock) : null;

            // Se o estoque armazenado for um objeto válido (não null, não array), usa-o.
            // Isso evita que o estoque seja resetado se já houver dados válidos de uma sessão anterior.
            if (parsedStock && typeof parsedStock === 'object' && !Array.isArray(parsedStock)) {
                return parsedStock;
            }
            // Se o localStorage não tem estoque válido, ou se é a primeira vez que o app roda,
            // inicializa o estoque com os valores padrão (5 unidades por produto) de getInitialProductStock().
            console.log("Initializing/Resetting stock in localStorage to initial values.");
            return getInitialProductStock(); // Define o estoque inicial padrão para todos os produtos.
        } catch (error) {
            // Em caso de erro ao carregar/inicializar, loga o erro e usa os valores padrão.
            console.error("Error loading or initializing stock from localStorage, using default values:", error);
            return getInitialProductStock(); // Garante que o app sempre tenha um estoque inicial.
        }
    });

    // Efeito para Salvar o Carrinho no localStorage
    // Este useEffect é executado toda vez que 'cartItems' muda.
    useEffect(() => {
        try {
            // Converte o array 'cartItems' para uma string JSON e salva no localStorage.
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        } catch (error) {
            console.error("Error saving cart items to localStorage:", error);
        }
    }, [cartItems]); // Dependência: só executa se 'cartItems' mudar.

    // Efeito para Salvar o Estoque Simulado no localStorage
    // Este useEffect é executado toda vez que 'mockStock' muda.
    useEffect(() => {
        try {
            // Converte o objeto 'mockStock' para uma string JSON e salva no localStorage.
            localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(mockStock));
        } catch (error) {
            console.error("Error saving stock to localStorage:", error);
        }
    }, [mockStock]); // Dependência: só executa se 'mockStock' mudar.

    /**
     * Retorna a quantidade de estoque atual de um produto específico.
     * @param {string} productId - O ID do produto.
     * @returns {number} A quantidade de estoque ou 0 se não encontrado.
     */
    // Usa useCallback para memoizar a função, garantindo que ela só mude se 'mockStock' mudar.
    // Isso evita loops de renderização em componentes que a usam como dependência em useEffect.
    const getStock = useCallback((productId) => {
        return mockStock[productId] || 0;
    }, [mockStock]); // Dependência: só muda se 'mockStock' mudar.

    /**
     * Atualiza a quantidade de estoque simulado de um produto.
     * @param {string} productId - O ID do produto.
     * @param {number} newStock - A nova quantidade de estoque.
     */
    // Usa useCallback para memoizar a função.
    const updateProductStock = useCallback((productId, newStock) => {
        setMockStock(prevStock => ({
            ...prevStock, // Copia o estado anterior do estoque
            [productId]: newStock // Atualiza o estoque do produto específico
        }));
        console.log(`Product stock ${productId} updated to: ${newStock}`);
    }, []); // Dependência vazia: esta função é estável e não precisa ser recriada a cada render.

    /**
     * Adiciona um produto ao carrinho ou atualiza sua quantidade.
     * Inclui validação de estoque ANTES de adicionar/atualizar no carrinho.
     * IMPORTANTE: O ESTOQUE SIMULADO SÓ É DIMINUÍDO NA FINALIZAÇÃO DA COMPRA (no Checkout).
     * @param {object} product - O objeto do produto a ser adicionado.
     * @param {number} quantityToAdd - A quantidade a ser adicionada.
     */
    const addToCart = useCallback((product, quantityToAdd) => {
        // Usa a forma funcional de setState para garantir que estamos trabalhando com o estado mais recente.
        setCartItems((prevItems) => {
            console.log(`\n--- [addToCart] Call for Product ID: ${product.id} ---`);
            const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
            const currentStockFromSystem = getStock(product.id); // Obtém o estoque atual do sistema simulado.
            const currentCartQuantity = existingItemIndex > -1 ? prevItems[existingItemIndex].quantity : 0;
            const requestedTotalQuantity = currentCartQuantity + quantityToAdd;

            console.log(`   Qty in Cart: ${currentCartQuantity}`);
            console.log(`   Qty to Add: ${quantityToAdd}`);
            console.log(`   Current Stock (System): ${currentStockFromSystem}`);
            console.log(`   Total Qty Requested: ${requestedTotalQuantity}`);

            // Validação 1: Produto esgotado?
            if (currentStockFromSystem === 0) {
                alert(`Sorry, product "${product.title}" is out of stock!`);
                console.log(`   [addToCart] VALIDATION: Product out of stock.`);
                return prevItems; // Não altera o carrinho.
            }

            // Validação 2: Quantidade a adicionar é válida?
            if (quantityToAdd <= 0) {
                alert("The quantity to add must be greater than zero.");
                console.log(`   [addToCart] VALIDATION: Qty to add <= 0.`);
                return prevItems; // Não altera o carrinho.
            }

            // Validação 3: Há estoque suficiente para a quantidade total solicitada?
            if (requestedTotalQuantity > currentStockFromSystem) {
                alert(`There is not enough stock to add ${quantityToAdd} units of "${product.title}". Available stock: ${currentStockFromSystem - currentCartQuantity}`);
                console.log(`   [addToCart] VALIDATION FAILED: Total Qty Requested (${requestedTotalQuantity}) > Current Physical Stock (${currentStockFromSystem}).`);
                return prevItems; // Não altera o carrinho.
            }
            console.log(`   [addToCart] VALIDATION SUCCESSFUL: Total Qty Requested (${requestedTotalQuantity}) <= Current Physical Stock (${currentStockFromSystem}).`);

            // Se todas as validações passarem:
            if (existingItemIndex > -1) {
                // Se o item já está no carrinho, atualiza sua quantidade.
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity = requestedTotalQuantity;
                return updatedItems;
            } else {
                // Se o item não está no carrinho, adiciona como um novo item.
                return [...prevItems, { ...product, quantity: quantityToAdd }];
            }
        });
    }, [getStock, setCartItems]); // Dependências: getStock (memoizado), setCartItems (estável).

    /**
     * Remove um item do carrinho.
     * IMPORTANTE: Esta função APENAS REMOVE DO CARRINHO, NÃO DEVOLVE ESTOQUE.
     * O estoque só é deduzido na finalização da compra, e só é devolvido
     * se houver um cancelamento de pedido ou uma lógica de "reserva" explícita.
     * @param {string} productId - O ID do produto a ser removido.
     */
    const removeFromCart = useCallback((productId) => {
        setCartItems((prevItems) => {
            // Retorna um novo array de itens do carrinho, excluindo o produto com o ID especificado.
            return prevItems.filter(item => item.id !== productId);
        });
    }, [setCartItems]); // Dependência: apenas setCartItems (estável).

    /**
     * Atualiza a quantidade de um produto específico no carrinho.
     * Inclui validação para garantir que a nova quantidade não exceda o estoque disponível.
     * @param {string} productId - O ID do produto.
     * @param {number} newQuantity - A nova quantidade desejada para o item no carrinho.
     */
    const updateQuantity = useCallback((productId, newQuantity) => {
        setCartItems((prevItems) => {
            console.log(`\n--- [updateQuantity] Call for Product ID: ${productId} ---`);
            const updatedItems = prevItems.map(item => {
                if (item.id === productId) {
                    const oldQuantity = item.quantity;
                    const currentStockFromSystem = getStock(productId); // Obtém o estoque atual.

                    console.log(`   Old Qty: ${oldQuantity}`);
                    console.log(`   New Qty (requested): ${newQuantity}`);
                    console.log(`   Current Stock (System): ${currentStockFromSystem}`);
                    
                    // Validação 1: Nova quantidade é 0 ou menos? Remove o item.
                    if (newQuantity <= 0) {
                        console.log(`   [updateQuantity] VALIDATION: New Qty <= 0. Removing item.`);
                        return { ...item, quantity: 0 }; // Marca para ser filtrado (removido) depois.
                    }
                    
                    // Validação 2: Nova quantidade excede o estoque disponível?
                    if (newQuantity > currentStockFromSystem) {
                        alert(`There is not enough stock for ${newQuantity} units. Available stock: ${currentStockFromSystem}.`);
                        console.log(`   [updateQuantity] VALIDATION FAILED: New Qty (${newQuantity}) > Current Physical Stock (${currentStockFromSystem}).`);
                        return { ...item, quantity: oldQuantity }; // Mantém a quantidade antiga se inválida.
                    }
                    // Validação bem-sucedida.
                    console.log(`   [updateQuantity] VALIDATION SUCCESSFUL: New Qty (${newQuantity}) <= Current Physical Stock (${currentStockFromSystem}).`);
                    
                    return { ...item, quantity: newQuantity }; // Atualiza a quantidade do item.
                }
                return item; // Retorna o item inalterado se não for o que está sendo atualizado.
            }).filter(item => item.quantity > 0); // Filtra e remove itens que foram marcados com quantity <= 0.

            return updatedItems;
        });
    }, [getStock, setCartItems]); // Dependências: getStock (memoizado), setCartItems (estável).

    /**
     * Calcula o subtotal total do carrinho.
     * @returns {number} O valor total de todos os itens no carrinho (preço * quantidade).
     */
    const getCartSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    /**
     * Calcula a quantidade total de itens (contando todas as unidades) no carrinho.
     * @returns {number} A soma das quantidades de todos os itens no carrinho.
     */
    const getTotalItemsInCart = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    /**
     * Reseta o estoque simulado de todos os produtos para seus valores iniciais (definidos em initialStock.js).
     * Útil para testes e demonstrações de desenvolvimento.
     */
    const resetAllStock = useCallback(() => {
        setMockStock(getInitialProductStock()); // Chama a função utilitária para obter os valores iniciais e atualiza o estado.
        alert('Simulated stock reset to initial values!');
        console.log('Stock reset:', getInitialProductStock()); // Loga o novo estado do estoque.
    }, []); // Dependência vazia: esta função é estável.

    // Retorna um objeto com todas as funções e estados que o hook expõe para uso em outros componentes.
    return {
        cartItems,          // Itens no carrinho.
        addToCart,          // Função para adicionar/atualizar itens no carrinho.
        removeFromCart,     // Função para remover itens do carrinho.
        updateQuantity,     // Função para atualizar a quantidade de um item no carrinho.
        getCartSubtotal,    // Função para obter o subtotal do carrinho.
        getTotalItemsInCart, // Função para obter o total de unidades no carrinho.
        getStock,           // Função para obter o estoque atual de um produto.
        updateProductStock, // Função para atualizar o estoque de um produto.
        resetAllStock,      // Função para resetar todo o estoque para o estado inicial.
        setCartItems        // Função para setar/limpar o carrinho (usada no Checkout para limpar).
    };
}
