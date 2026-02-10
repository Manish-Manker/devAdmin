import axios from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        const { response } = error

        if (response) {
            const { status, data } = response
            const errorMessage = data?.message || 'Something went wrong'

            switch (status) {
                case 401:
                    toast.error('Unauthorized', {
                        description: 'Your session has expired. Please login again.'
                    })
                    useAuthStore.getState().logout()
                    // Optional: redirect to login
                    // window.location.href = '/login'
                    break

                case 403:
                    toast.error('Forbidden', {
                        description: "You don't have permission to perform this action."
                    })
                    break

                case 404:
                    toast.error('Not Found', {
                        description: 'The requested resource was not found.'
                    })
                    break

                case 422:
                    toast.error('Validation Error', {
                        description: errorMessage
                    })
                    break

                case 500:
                    toast.error('Server Error', {
                        description: 'Internal server error. Please try again later.'
                    })
                    break

                default:
                    toast.error('Error', {
                        description: errorMessage
                    })
            }
        } else if (error.request) {
            // The request was made but no response was received

            // toast.error('Network Error', {
            //     description: 'Unable to connect to the server. Please check your internet connection.'
            // })

            
        } else {
            // Something happened in setting up the request that triggered an Error
            toast.error('Request Error', {
                description: 'An error occurred while setting up the request.'
            })
        }

        return Promise.reject(error)
    }
)

export default api
