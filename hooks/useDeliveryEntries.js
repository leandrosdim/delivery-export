import { useState, useCallback } from "react";
import { createEmptyDelivery } from "../src/lib/deliverySchema";

export default function useDeliveryEntries() {
  const [entries, setEntries] = useState(() => [createEmptyDelivery()]);

  const addEntry = useCallback(() => {
    setEntries((prev) => [...prev, createEmptyDelivery()]);
  }, []);

  const removeEntry = useCallback((index) => {
    setEntries((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const updateEntry = useCallback((index, fieldKey, value) => {
    setEntries((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [fieldKey]: value } : entry
      )
    );
  }, []);

  const resetEntry = useCallback((index) => {
    setEntries((prev) =>
      prev.map((entry, i) => (i === index ? createEmptyDelivery() : entry))
    );
  }, []);

  const clearAll = useCallback(() => {
    setEntries([createEmptyDelivery()]);
  }, []);

  return {
    entries,
    addEntry,
    removeEntry,
    updateEntry,
    resetEntry,
    clearAll,
    count: entries.length,
  };
}