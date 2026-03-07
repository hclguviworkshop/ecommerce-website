import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('userInfo')) || null,
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data.data));
            set({ user: data.data, loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Login failed',
                loading: false
            });
            throw error;
        }
    },

    register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
            const { data } = await axios.post('/api/auth/register', { name, email, password });
            localStorage.setItem('userInfo', JSON.stringify(data.data));
            set({ user: data.data, loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Registration failed',
                loading: false
            });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('userInfo');
        set({ user: null });
    },
}));

export default useAuthStore;
