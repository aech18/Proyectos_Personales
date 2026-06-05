export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <p>&copy; {currentYear} Historia de Venezuela - Creado bajo directrices de código limpio.</p>
    </footer>
  );
}