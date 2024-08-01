import { useState } from "react"

const useLocalStorage = (key:string, initialValue:Object) => {

  const [state, setState] = useState(() => {
    try {
      const value = window.localStorage.getItem(key)
      return value ? JSON.parse(value) : initialValue
    } catch (error) {
      console.log(error)
    }
  })
  const setValue = (value:Function) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
      setState(value)
    } catch (error) {
      console.log(error)
    }
  }
  return [state, setValue]
}

// Proper TypeScript :)

export default useLocalStorage

export function getLocalStorage(key:string) {
  const value = window.localStorage.getItem(key)
  return value ? JSON.parse(value) : ""
}