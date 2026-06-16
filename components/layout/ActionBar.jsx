export default function ActionBar({ onAdd, onClear, onExport, count }) {
  return (
    <div className="action-bar" role="toolbar" aria-label="Ενέργειες">
      <button
        type="button"
        className="btn btn--export"
        onClick={onExport}
        aria-label="Εξαγωγή αρχείου CSV"
      >
        ⬇ Εξαγωγή CSV
      </button>
      <div className="action-bar__secondary">
        <button type="button" className="btn btn--primary" onClick={onAdd} aria-label="Προσθήκη νέας παράδοσης">
          + Προσθήκη παράδοσης
        </button>
        {count > 0 && (
          <button type="button" className="btn btn--secondary" onClick={onClear} aria-label="Καθαρισμός όλων των παραδόσεων">
            Καθαρισμός φόρμας
          </button>
        )}
      </div>
    </div>
  );
}