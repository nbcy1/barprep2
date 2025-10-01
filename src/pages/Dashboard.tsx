import React from "react"

const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Dashboard</h1>
      <p style={{ color: "#666", fontSize: "1.1rem" }}>
        Welcome to your dashboard. This area will be available for logged-in users.
      </p>
      
      <div style={{ 
        marginTop: "2rem", 
        padding: "2rem", 
        backgroundColor: "#f8f9fa", 
        borderRadius: "8px",
        textAlign: "center"
      }}>
        <p style={{ fontSize: "1.2rem", color: "#666" }}>
          Dashboard features coming soon...
        </p>
      </div>
    </div>
  )
}

export default Dashboard
