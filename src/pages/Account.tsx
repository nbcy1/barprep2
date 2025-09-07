import { useEffect, useState } from 'react'
import { Auth } from 'aws-amplify'

export default function Account() {
  const [email, setEmail] = useState<string | null>(null)
  const [subStatus, setSubStatus] = useState<string>('Free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const user = await Auth.currentAuthenticatedUser()
        setEmail(user?.attributes?.email || user?.username || 'Unknown')
        // TODO: fetch subscription status from backend/Stripe
        setSubStatus('Active') // placeholder
      } catch (err) {
        console.error('Not signed in', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleSignOut = async () => {
    try {
      await Auth.signOut()
      window.location.href = '/' // redirect to home
    } catch (err) {
      console.error('Sign out failed', err)
    }
  }

  if (loading) return <div className="page">Loading account…</div>

  return (
    <div className="page">
      <h2>Account</h2>
      <div className="card">
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Subscription:</strong> {subStatus}</p>
        <button className="btn" onClick={handleSignOut}>Sign Out</button>
      </div>
    </div>
  )
}
