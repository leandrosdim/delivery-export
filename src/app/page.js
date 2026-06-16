"use client";

import { useState, useCallback, useRef, useMemo } from "react";
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

const SUMMARY_FIELDS = ["imerominia", "parastatiko", "proorismos", "perioxi"];

export default function Home() {
  const { entries, addEntry, removeEntry, updateEntry, resetEntry, clearAll, count } =
    useDeliveryEntries();

  const [openEntryId, setOpenEntryId] = useState(() => entries[0]._id);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [validationMessage, setValidationMessage] = useState(null);
  const [exportedFilename, setExportedFilename] = useState(null);
  const errorRef = useRef(null);

  const allErrors = useMemo(
    () => validateDeliveries(entries, FIELDS_WITH_OPTIONS),
    [entries]
  );

  const getEntryIndex = useCallback(
    (id) => entries.findIndex((e) => e._id === id),
    [entries]
  );

  const handleFieldBlur = useCallback((entryId, fieldKey) => {
    setTouched((prev) => ({
      ...prev,
      [entryId]: {
        ...(prev[entryId] || {}),
        [fieldKey]: true,
      },
    }));
  }, []);

  const handleAddEntry = useCallback(() => {
    const newId = addEntry();
    setOpenEntryId(newId);
    setValidationMessage(null);
    setExportedFilename(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [addEntry]);

  const handleRemoveEntry = useCallback(
    (id) => {
      const index = getEntryIndex(id);
      const remaining = entries.filter((e) => e._id !== id);
      removeEntry(id);
      setTouched((prev) => {
        const next = {};
        Object.keys(prev).forEach((k) => {
          if (k === id) return;
          next[k] = prev[k];
        });
        return next;
      });
      if (openEntryId === id) {
        if (remaining.length > 0) {
          const nextEntry = remaining[Math.min(index, remaining.length - 1)];
          setOpenEntryId(nextEntry._id);
        } else {
          setOpenEntryId(null);
        }
      }
      setValidationMessage(null);
      setExportedFilename(null);
    },
    [removeEntry, openEntryId, entries, getEntryIndex]
  );

  const handleResetEntry = useCallback(
    (id) => {
      resetEntry(id);
      setTouched((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setValidationMessage(null);
      setExportedFilename(null);
    },
    [resetEntry]
  );

  const handleClearAll = useCallback(() => {
    const freshId = clearAll();
    setOpenEntryId(freshId);
    setTouched({});
    setSubmitAttempted(false);
    setValidationMessage(null);
    setExportedFilename(null);
  }, [clearAll]);

  const handleUpdateEntry = useCallback(
    (id, fieldKey, value) => {
      updateEntry(id, fieldKey, value);
      if (validationMessage?.type === "error") {
        setValidationMessage(null);
      }
    },
    [updateEntry, validationMessage]
  );

  const handleToggle = useCallback(
    (id) => {
      setOpenEntryId((prev) => (prev === id ? prev : id));
    },
    []
  );

  const handleExport = useCallback(() => {
    setSubmitAttempted(true);
    setExportedFilename(null);

    if (hasValidationErrors(allErrors)) {
      setValidationMessage({
        type: "error",
        text: "Υπάρχουν πεδία που χρειάζονται διόρθωση",
        detail: "Ελέγξτε τα πεδία με κόκκινο περίγραμμα σε κάθε παράδοση.",
      });
      const firstErrorId = entries.find((e) => allErrors[entries.indexOf(e)])
        ?._id;
      if (firstErrorId) {
        setOpenEntryId(firstErrorId);
      }
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
  }, [entries, allErrors]);

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
            {entries.map((entry) => {
              const index = getEntryIndex(entry._id);
              const isOpen = openEntryId === entry._id;
              const entryErrors = allErrors[index];
              const hasErrors = !!entryErrors && Object.keys(entryErrors).length > 0;
              return (
                <DeliveryEntryForm
                  key={entry._id}
                  entryId={entry._id}
                  index={index}
                  entry={entry}
                  fields={FIELDS_WITH_OPTIONS}
                  onUpdate={handleUpdateEntry}
                  onReset={handleResetEntry}
                  onRemove={handleRemoveEntry}
                  canRemove={count > 1}
                  submitAttempted={submitAttempted}
                  touched={touched[entry._id] || {}}
                  onFieldBlur={handleFieldBlur}
                  isOpen={isOpen}
                  onToggle={handleToggle}
                  hasErrors={hasErrors}
                />
              );
            })}
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