export default function ActionBar({ onAdd, onClear, count }) {
  return (
    <div className="action-bar">
      <button
        type="button"
        className="btn btn--export"
        disabled
        title="Θα ενεργοποιηθεί στο επόμενο βήμα εξαγωγής"
      >
        Εξαγωγή CSV
      </button>
      <div className="action-bar__secondary">
        <button type="button" className="btn btn--primary" onClick={onAdd}>
          + Προσθήκη παράδοσης
        </button>
        {count > 0 && (
          <button type="button" className="btn btn--secondary" onClick={onClear}>
            Καθαρισμός φόρμας
          </button>
        )}
      </div>
    </div>
  );
}