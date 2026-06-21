import { apiClient } from './client'

export const getOrders = async () => {
  const response = await apiClient.get('/orders')
  return response.data
}

export const getOrder = async (orderId) => {
  const response = await apiClient.get(`/orders/${orderId}`)
  return response.data
}

export const createOrder = async (orderData) => {
  const response = await apiClient.post('/orders', orderData)
  return response.data
}

export const deleteOrder = async (orderId) => {
  await apiClient.delete(`/orders/${orderId}`)
}