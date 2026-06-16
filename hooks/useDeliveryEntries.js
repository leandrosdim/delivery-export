import { useState, useCallback } from "react";
import { createEmptyDelivery } from "../src/lib/deliverySchema";

let nextId = 1;
function createEntry() {
  return { ...createEmptyDelivery(), _id: String(nextId++) };
}

export default function useDeliveryEntries() {
  const [entries, setEntries] = useState(() => [createEntry()]);

  const addEntry = useCallback(() => {
    const newEntry = createEntry();
    setEntries((prev) => [newEntry, ...prev]);
    return newEntry._id;
  }, []);

  const removeEntry = useCallback((id) => {
    setEntries((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((entry) => entry._id !== id);
    });
  }, []);

  const updateEntry = useCallback((id, fieldKey, value) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry._id === id ? { ...entry, [fieldKey]: value } : entry
      )
    );
  }, []);

  const resetEntry = useCallback((id) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry._id === id ? { ...createEntry(), _id: entry._id } : entry
      )
    );
  }, []);

  const clearAll = useCallback(() => {
    const fresh = createEntry();
    setEntries([fresh]);
    return fresh._id;
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