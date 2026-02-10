import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useAuthStore = create(
    persist(
        (set) => ({
            // State
            user: null,
            isAuthenticated: false,
            token: null,
            lastLogin: null,

            // Actions
            login: (userData, token) => set({
                user: userData,
                isAuthenticated: true,
                token: token,
                lastLogin: new Date().toISOString()
            }),

            logout: () => set({
                user: null,
                isAuthenticated: false,
                token: null
            }),

            updateUser: (updatedData) => set((state) => ({
                user: state.user ? { ...state.user, ...updatedData } : null
            })),

            setToken: (token) => set({ token }),
        }),
        {   
            name: 'dev-admin-auth', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
    )
)
