"use client";

import { getDeliveryFieldsWithOptions } from "../lib/deliverySchema";
import useDeliveryEntries from "../../hooks/useDeliveryEntries";
import DeliveryEntryForm from "../../components/DeliveryEntryForm";
import PageHeader from "../../components/layout/PageHeader";
import SummaryPanel from "../../components/layout/SummaryPanel";
import ActionBar from "../../components/layout/ActionBar";

const FIELDS_WITH_OPTIONS = getDeliveryFieldsWithOptions();

export default function Home() {
  const { entries, addEntry, removeEntry, updateEntry, resetEntry, clearAll, count } =
    useDeliveryEntries();

  return (
    <div className="app">
      <PageHeader />
      <main className="main-content">
        <aside className="main-sidebar">
          <SummaryPanel count={count} />
        </aside>
        <div className="main-body">
          <ActionBar onAdd={addEntry} onClear={clearAll} count={count} />
          <div className="entries-list">
            {entries.map((entry, index) => (
              <DeliveryEntryForm
                key={index}
                index={index}
                entry={entry}
                fields={FIELDS_WITH_OPTIONS}
                onUpdate={updateEntry}
                onReset={resetEntry}
                onRemove={removeEntry}
                canRemove={count > 1}
              />
            ))}
          </div>
        </div>
      </main>
      <footer className="app-footer">
        <p>
          Για απορίες σχετικά με τα στοιχεία παράδοσης, επικοινωνήστε με την εταιρεία.
        </p>
      </footer>
    </div>
  );
}