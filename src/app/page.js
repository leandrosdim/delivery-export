"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { getDeliveryFieldsWithOptions } from "../lib/deliverySchema";
import { validateDeliveries, hasValidationErrors } from "../lib/validation";
import { createCsvContent, downloadCsv, createCsvFilename } from "../lib/csvExport";
import useDeliveryEntries from "../../hooks/useDeliveryEntries";
import DeliveryEntryForm from "../../components/DeliveryEntryForm";
import PageHeader from "../../components/layout/PageHeader";
import SummaryPanel from "../../components/layout/SummaryPanel";
import ActionBar from "../../components/layout/ActionBar";

const FIELDS_WITH_OPTIONS = getDeliveryFieldsWithOptions();

export default function Home() {
  const { entries, addEntry, removeEntry, updateEntry, resetEntry, clearAll, count } =
    useDeliveryEntries();

  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [validationMessage, setValidationMessage] = useState(null);
  const [exportedFilename, setExportedFilename] = useState(null);
  const errorRef = useRef(null);
  const firstErrorCardRef = useRef(null);

  const handleFieldBlur = useCallback((entryIndex, fieldKey) => {
    setTouched((prev) => ({
      ...prev,
      [entryIndex]: {
        ...(prev[entryIndex] || {}),
        [fieldKey]: true,
      },
    }));
  }, []);

  const handleAddEntry = useCallback(() => {
    addEntry();
    setValidationMessage(null);
    setExportedFilename(null);
  }, [addEntry]);

  const handleRemoveEntry = useCallback((index) => {
    removeEntry(index);
    setTouched((prev) => {
      const next = {};
      Object.keys(prev).forEach((k) => {
        const idx = Number(k);
        if (idx < index) {
          next[k] = prev[k];
        } else if (idx > index) {
          next[String(idx - 1)] = prev[k];
        }
      });
      return next;
    });
    setValidationMessage(null);
    setExportedFilename(null);
  }, [removeEntry]);

  const handleResetEntry = useCallback((index) => {
    resetEntry(index);
    setTouched((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
    setValidationMessage(null);
    setExportedFilename(null);
  }, [resetEntry]);

  const handleClearAll = useCallback(() => {
    clearAll();
    setTouched({});
    setSubmitAttempted(false);
    setValidationMessage(null);
    setExportedFilename(null);
  }, [clearAll]);

  const handleUpdateEntry = useCallback((index, fieldKey, value) => {
    updateEntry(index, fieldKey, value);
    if (validationMessage?.type === "error") {
      setValidationMessage(null);
    }
  }, [updateEntry, validationMessage]);

  const handleExport = useCallback(() => {
    const allErrors = validateDeliveries(entries, FIELDS_WITH_OPTIONS);
    setSubmitAttempted(true);
    setExportedFilename(null);

    if (hasValidationErrors(allErrors)) {
      setValidationMessage({
        type: "error",
        text: "Υπάρχουν πεδία που χρειάζονται διόρθωση",
        detail: "Ελέγξτε τα πεδία με κόκκινο περίγραμμα σε κάθε παράδοση.",
      });
      if (errorRef.current) {
        errorRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      return;
    }

    const csvContent = createCsvContent(entries);
    const filename = createCsvFilename();
    downloadCsv(csvContent, filename);
    setValidationMessage({
      type: "success",
      text: "Το αρχείο CSV δημιουργήθηκε με επιτυχία!",
      detail: `Αρχείο: ${filename}`,
    });
    setExportedFilename(filename);
  }, [entries]);

  return (
    <div className="app">
      <PageHeader />
      <main className="main-content" role="main">
        <aside className="main-sidebar" aria-label="Πληροφορίες">
          <SummaryPanel count={count} />
        </aside>
        <div className="main-body">
          <ActionBar onAdd={handleAddEntry} onClear={handleClearAll} onExport={handleExport} count={count} />
          {validationMessage && (
            <div
              ref={errorRef}
              className={`validation-alert validation-alert--${validationMessage.type}`}
              role={validationMessage.type === "error" ? "alert" : "status"}
              aria-live="polite"
            >
              {validationMessage.text}
              {validationMessage.detail && (
                <span className="validation-alert__detail">{validationMessage.detail}</span>
              )}
            </div>
          )}
          <div className="entries-list" role="list" aria-label="Λίστα παραδόσεων">
            {entries.map((entry, index) => (
              <DeliveryEntryForm
                key={index}
                index={index}
                entry={entry}
                fields={FIELDS_WITH_OPTIONS}
                onUpdate={handleUpdateEntry}
                onReset={handleResetEntry}
                onRemove={handleRemoveEntry}
                canRemove={count > 1}
                submitAttempted={submitAttempted}
                touched={touched}
                onFieldBlur={handleFieldBlur}
              />
            ))}
          </div>
        </div>
      </main>
      <footer className="app-footer">
        <p>
          Για απορίες σχετικά με τα στοιχεία παράδοσης, επικοινωνήστε με την εταιρεία.
        </p>
        <div className="app-credit">
          <span>Υλοποίηση</span>
          <Image
            src="/Logo.jpg"
            alt="Leandros Dimitriadis Custom Software Development"
            width={140}
            height={140}
            className="credit-logo"
          />
        </div>
      </footer>
    </div>
  );
}