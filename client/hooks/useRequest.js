import { useState } from 'react'
import axios from 'axios'

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null)
  const doRequest = async (props = {}) => {
    try {
      const { data } = await axios[method](url, { ...body, ...props })
      setErrors(null)
      if (onSuccess) {
        onSuccess(data)
      }
      return data
    } catch (error) {
      setErrors(<div className="alert alert-danger">
        <h4>Opoops...</h4>
        <ul className="my-0">
          {error.response.data.errors.map((error, index) => (<li key={index} >{error.message}</li>))}
        </ul>
      </div>)
    }
  }

  return [doRequest, errors]
}

export default useRequest
