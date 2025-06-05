// frontend/mockdata/users.js
const mockUsers = [
    {
        id: 'user-123',
        email: 'john@email.com',
        password: 'password123', 
        name: 'John Doe',
        phone: '1112345-6789',
        cep: {
            street: 'Rua Principal',
            city: 'São Paulo',
            state: 'SP',
            zip_code: '12345-678',
        },
        favorite_products: ['prod-001', 'prod-005'], // IDs de produtos favoritos
    },
    {
        id: 'user-456',
        email: 'jane@email.com',
        password: 'password123',
        name: 'Jane Smith',
        phone: '2198765-4321',
        cep: {
            street: 'Rua Secundária',
            city: 'Rio de Janeiro',
            state: 'RJ',
            zip_code: '21000-000',
        },
        favorite_products: ['prod-002'],
    },
];

export default mockUsers;