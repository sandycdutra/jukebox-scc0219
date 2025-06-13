// backend/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/Product'); 
const productsData = require('../frontend/src/mockdata/products.jsx').default;
dotenv.config(); 

// Conecta ao MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB para seeding!'))
    .catch(err => {
        console.error('Erro ao conectar ao MongoDB para seeding:', err);
        process.exit(1); // Sai com erro
    });

const importData = async () => {
    try {
        await Product.deleteMany({}); // Limpa todos os produtos existentes
        console.log('Dados existentes de produtos limpos.');

        // Mapeia os dados do frontend para o formato do seu modelo de backend
        const productsToInsert = productsData.map(p => ({
            id: String(p.id), // Garante que o ID é string (MongoDB aceita UUIDs como string)
            sku: p.sku || `SKU-${String(p.id).padStart(3, '0')}`, // Usa o SKU se existir, ou gera um
            name: p.title, // 'title' do mockdata é 'name' no modelo
            type: p.type,
            price: p.price,
            description: p.description,
            stock_quantity: p.stock || 5, // Usa 'stock' do mockdata ou 5 como padrão
            sold_quantity: p.sold_quantity || 0, // Usa 'sold_quantity' se existir, ou 0
            images: p.images,
            metadata: {
                artist: p.artist || p.metadata?.artist,
                release_year: p.metadata?.release_year || 2023,
                genre: p.genre || p.metadata?.genre,
                subgenre: p.subgenre || p.metadata?.subgenre,
                condition: p.metadata?.condition || 'new'
            }
        }));

        await Product.insertMany(productsToInsert); // Insere os novos produtos
        console.log('Dados de produtos importados com sucesso!');
        process.exit();
    } catch (error) {
        console.error('Erro ao importar dados:', error);
        process.exit(1);
    }
};

const deleteData = async () => {
    try {
        await Product.deleteMany({});
        console.log('Todos os produtos deletados!');
        process.exit();
    } catch (error) {
        console.error('Erro ao deletar dados:', error);
        process.exit(1);
    }
};

// Executa o script dependendo do argumento da linha de comando
if (process.argv[2] === '-d') { // node seed.js -d para deletar
    deleteData();
} else { // node seed.js (sem -d) para importar
    importData();
}