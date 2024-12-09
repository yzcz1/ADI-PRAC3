import Stripe from 'stripe';
import { STRIPE_PRIVATE_KEY } from '../routes/config.js';

const stripe = new Stripe(STRIPE_PRIVATE_KEY);

export const createSession = async (req, res) => {
    try {
        // Recibir la lista de productos del cuerpo de la petición
        const { items } = req.body;

        // Construir los productos para Stripe
        const line_items = items.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.nombre,
                    description: item.descripcion,
                },
                unit_amount_decimal: item.precio.toString(), // Precios directamente en dólares (en formato decimal)
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: 'http://localhost:5173/products?success=true', // Redirigir al frontend
            cancel_url: 'http://localhost:5173/cart?canceled=true',
        });

        return res.json({ url: session.url });
    } catch (error) {
        console.error('Error al crear la sesión de Stripe:', error.message);
        res.status(500).json({ error: 'Error al crear la sesión de pago' });
    }
};
