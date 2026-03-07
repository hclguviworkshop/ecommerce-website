import { create } from 'zustand';
import axios from 'axios';

const useCartStore = create((set, get) => ({
    cart: null,
    loading: false,
    error: null,

    fetchCart: async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) return;

        set({ loading: true, error: null });
        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };
            const { data } = await axios.get('/api/cart', config);
            set({ cart: data.data, loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch cart',
                loading: false
            });
        }
    },

    addToCart: async (productId, quantity) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };
            await axios.post('/api/cart', { product_id: productId, quantity }, config);
            // Refresh cart after adding
            get().fetchCart();
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to add item' });
        }
    },

    removeFromCart: async (cartItemId) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };
            await axios.delete(`/api/cart/${cartItemId}`, config);
            get().fetchCart();
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to remove item' });
        }
    },

    updateQuantity: async (cartItemId, quantity) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };
            await axios.put(`/api/cart/${cartItemId}`, { quantity }, config);
            get().fetchCart();
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to update quantity' });
        }
    }
}));

export default useCartStore;
