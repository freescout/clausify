import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/stores/theme";
import { useTheme } from "@/hooks/useTheme";

const queryClient = new QueryClient();

function ThemeTest() {
  const { theme, toggle } = useTheme();
  return (
    <div
      style={{ padding: "2rem", background: "var(--bg)", minHeight: "100vh" }}
    >
      <h1 style={{ color: "var(--fg)" }}>Clausify</h1>
      <p style={{ color: "var(--fg-secondary)" }}>Current theme: {theme}</p>
      <button
        onClick={toggle}
        style={{ marginTop: "1rem", padding: "8px 16px" }}
      >
        Toggle theme
      </button>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ThemeTest />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
