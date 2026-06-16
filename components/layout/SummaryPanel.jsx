export default function SummaryPanel({ count }) {
  return (
    <aside className="summary-panel" aria-label="Περίληψη">
      <div className="summary-panel__count">
        <span className="summary-panel__number">{count}</span>
        <span className="summary-panel__label">
          {count === 1 ? "παράδοση" : "παραδόσεις"}
        </span>
      </div>
      <div className="summary-panel__steps">
        <h3 className="summary-panel__heading">Πώς λειτουργεί;</h3>
        <ol className="summary-panel__list">
          <li>Συμπληρώστε τα στοιχεία κάθε παράδοσης</li>
          <li>Προσθέστε όσες παραδόσεις χρειάζεστε</li>
          <li>Πατήστε «Εξαγωγή CSV»</li>
          <li>Ανεβάστε το αρχείο στο ERP</li>
        </ol>
      </div>
      <p className="summary-panel__note">
        Όλα τα πεδία με (*) είναι υποχρεωτικά.
      </p>
    </aside>
  );
}