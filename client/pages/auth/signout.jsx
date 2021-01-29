import { useEffect } from 'react';
import useRequest from '../../hooks/useRequest'
import Router from 'next/router'

export default () => {
  const [doRequest,] = useRequest({ url: '/api/users/signout', method: 'post', onSuccess: () => Router.push('/') })

  const signOut = async () => {
    await doRequest()
  }
  useEffect(() => {
    signOut()
  }, [])
  return <div>Signing you out...</div>
}