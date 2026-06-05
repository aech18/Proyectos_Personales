export function HistorySection({ id, title, content }) {
  return (
    <section id={id} className="history-section">
      <h2>{title}</h2>
      <p>{content}</p>
    </section>
  );
}