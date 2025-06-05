// frontend/mockdata/orders.js
const mockOrders = [
    {
        id: 'order-001',
        user_id: 'user-123',
        created_at: '2023-01-01T10:00:00Z',
        total_amount: 144.90,
        payment_method: 'credit_card',
        payment_status: 'completed',
        delivery_address: 'Rua Principal, 123, Bairro Central, Cidade, SP, 12345-678',
        items: [
            { product_id: 3, title: 'GUTS', artist: 'Olivia Rodrigo', quantity: 1, unit_price: 49.90 },
            { product_id: 6, title: 'UTOPIA', artist: 'Travis Scott', quantity: 1, unit_price: 59.90 },
        ],
    },
    {
        id: 'order-002',
        user_id: 'user-123',
        created_at: '2023-02-15T14:30:00Z',
        total_amount: 129.90,
        payment_method: 'pix',
        payment_status: 'completed',
        delivery_address: 'Rua Principal, 123, Bairro Central, Cidade, SP, 12345-678',
        items: [
            { product_id: 1, title: 'Midnights (The Til Dawn Edition)', artist: 'Taylor Swift', quantity: 1, unit_price: 129.90 },
        ],
    },
    {
        id: 'order-003',
        user_id: 'user-456', // Pedido para Jane
        created_at: '2023-03-20T09:15:00Z',
        total_amount: 119.90,
        payment_method: 'credit_card',
        payment_status: 'completed',
        delivery_address: 'Avenida Secundária, 456, Bairro Longe, Cidade, SP, 98765-432',
        items: [
            { product_id: 2, title: 'Renaissance', artist: 'Beyoncé', quantity: 1, unit_price: 119.90 },
        ],
    },
];

export default mockOrders;