import { useEffect, useState } from 'react'
import { createCustomer, deleteCustomer, getCustomers } from '../api/customers'

export const useCustomers = () => {
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadCustomers = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getCustomers()
        if (isMounted) setCustomers(data)
      } catch (err) {
        if (isMounted) setError(err.response?.data?.detail || 'Failed to load customers.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadCustomers()

    return () => {
      isMounted = false
    }
  }, [])

  const refetch = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getCustomers()
      setCustomers(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load customers.')
    } finally {
      setIsLoading(false)
    }
  }

  const addCustomer = async (customerData) => {
    const newCustomer = await createCustomer(customerData)
    setCustomers((prev) => [...prev, newCustomer])
    return newCustomer
  }

  const removeCustomer = async (customerId) => {
    await deleteCustomer(customerId)
    setCustomers((prev) => prev.filter((c) => c.id !== customerId))
  }

  return { customers, isLoading, error, addCustomer, removeCustomer, refetch }
}