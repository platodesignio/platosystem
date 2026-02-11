export default function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>
          Plato AI System
        </h1>

        <p style={styles.subtitle}>
          Optimize. Track. Control.
          <br />
          Your AI Costs.
        </p>

        <div style={styles.buttons}>
          <a href="/login" style={styles.primary}>
            Login
          </a>
          <a
            href="/register"
            style={styles.secondary}
          >
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 40
  },
  hero: {
    textAlign: "center",
    maxWidth: 600
  },
  title: {
    fontSize: 48,
    letterSpacing: 1,
    marginBottom: 20
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
    marginBottom: 40
  },
  buttons: {
    display: "flex",
    gap: 20,
    justifyContent: "center"
  },
  primary: {
    padding: "12px 24px",
    background: "#4f46e5",
    borderRadius: 8,
    textDecoration: "none",
    color: "#fff"
  },
  secondary: {
    padding: "12px 24px",
    background: "#1f1f25",
    borderRadius: 8,
    textDecoration: "none",
    color: "#fff"
  }
};

