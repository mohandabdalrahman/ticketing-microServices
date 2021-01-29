import { useState } from 'react'
import useRequest from '../../hooks/useRequest'
import Router from 'next/router'
const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [doRequest, errors] = useRequest({ url: '/api/users/signup', method: 'post', body: { email, password }, onSuccess: () => Router.push('/') })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await doRequest()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email:</label>
        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      { errors}
      <button type="submit" className="btn btn-primary">Sign Up</button>
    </form>
  )
}

export default SignUp
