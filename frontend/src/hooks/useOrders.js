import { useEffect, useState } from 'react'
import { createOrder, deleteOrder, getOrders } from '../api/orders'

export const useOrders = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadOrders = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getOrders()
        if (isMounted) setOrders(data)
      } catch (err) {
        if (isMounted) setError(err.response?.data?.detail || 'Failed to load orders.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadOrders()

    return () => {
      isMounted = false
    }
  }, [])

  const refetch = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getOrders()
      setOrders(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load orders.')
    } finally {
      setIsLoading(false)
    }
  }

  const addOrder = async (orderData) => {
    const newOrder = await createOrder(orderData)
    setOrders((prev) => [...prev, newOrder])
    return newOrder
  }

  const removeOrder = async (orderId) => {
    await deleteOrder(orderId)
    setOrders((prev) => prev.filter((o) => o.id !== orderId))
  }

  return { orders, isLoading, error, addOrder, removeOrder, refetch }
}