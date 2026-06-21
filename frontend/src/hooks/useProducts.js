import { useEffect, useState } from 'react'
import { createProduct, deleteProduct, getProducts, updateProduct } from '../api/products'

export const useProducts = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadProducts = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getProducts()
        if (isMounted) setProducts(data)
      } catch (err) {
        if (isMounted) setError(err.response?.data?.detail || 'Failed to load products.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [])

  const refetch = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load products.')
    } finally {
      setIsLoading(false)
    }
  }

  const addProduct = async (productData) => {
    const newProduct = await createProduct(productData)
    setProducts((prev) => [...prev, newProduct])
    return newProduct
  }

  const editProduct = async (productId, productData) => {
    const updated = await updateProduct(productId, productData)
    setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)))
    return updated
  }

  const removeProduct = async (productId) => {
    await deleteProduct(productId)
    setProducts((prev) => prev.filter((p) => p.id !== productId))
  }

  return { products, isLoading, error, addProduct, editProduct, removeProduct, refetch }
}