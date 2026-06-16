export default function PageHeader() {
  return (
    <header className="page-header">
      <div className="page-header__top">
        <h1 className="page-header__title">Delivery Export</h1>
        <span className="page-header__badge">ERP CSV Export</span>
      </div>
      <p className="page-header__subtitle">
        Συμπληρώστε εύκολα τα στοιχεία παράδοσης και εξάγετε αρχείο για το ERP.
      </p>
      <p className="page-header__reassurance">
        Δεν χρειάζεται Excel. Συμπληρώστε τη φόρμα και δημιουργήστε αρχείο CSV.
      </p>
    </header>
  );
}