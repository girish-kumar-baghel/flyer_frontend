export default function FailedPage() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Payment Failed ❌</h1>
      <p>Something went wrong with your payment. Please try again.</p>

      <a href="/" style={{ marginTop: 20, display: "inline-block" }}>
        Go Back Home
      </a>
    </div>
  )
}
