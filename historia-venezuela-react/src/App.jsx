import { Header } from './components/Header';
import { HistorySection } from './components/HistorySection';
import { Footer } from './components/Footer';
import { HISTORY_PERIODS } from './data/history';
import './App.css';

export function App() {
  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        {HISTORY_PERIODS.map((period) => (
          <HistorySection 
            key={period.id}
            id={period.id}
            title={period.title}
            content={period.content}
          />
        ))}
      </main>

      <Footer />
    </div>
  );
}