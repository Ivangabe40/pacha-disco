import { useState, useEffect } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "pacha_reminders";

function getReminders() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveReminders(reminders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
}

export function useEventReminder(event) {
  const [reminded, setReminded] = useState(false);

  useEffect(() => {
    if (!event?.id) return;
    const reminders = getReminders();
    setReminded(!!reminders[event.id]);
  }, [event?.id]);

  const toggle = () => {
    if (!event?.id) return;
    const reminders = getReminders();

    if (reminded) {
      delete reminders[event.id];
      saveReminders(reminders);
      setReminded(false);
      toast("Recordatorio eliminado", { description: `Ya no recibirás avisos de "${event.title}".` });
    } else {
      reminders[event.id] = {
        eventId: event.id,
        title: event.title,
        date: event.date,
        status: event.status,
        savedAt: new Date().toISOString(),
      };
      saveReminders(reminders);
      setReminded(true);
      toast.success("¡Recordatorio activado!", {
        description: `Te avisaremos cuando se acerque "${event.title}".`,
      });
    }
  };

  return { reminded, toggle };
}

// Llama esto una vez al iniciar la app para chequear eventos próximos
export function checkEventReminders(events) {
  if (!events?.length) return;
  const reminders = getReminders();
  const now = new Date();

  Object.values(reminders).forEach((reminder) => {
    const saved = events.find((e) => e.id === reminder.eventId);
    if (!saved) return;

    const eventDate = new Date(saved.date);
    const daysUntil = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));

    // Aviso si el estado cambió
    if (saved.status !== reminder.status) {
      const statusLabels = { agotado: "¡Entradas agotadas!", cancelado: "Evento cancelado", activo: "Evento activo" };
      toast.warning(`Actualización: ${saved.title}`, {
        description: statusLabels[saved.status] || `Estado: ${saved.status}`,
        duration: 8000,
      });
      // Actualizar el estado guardado
      reminders[reminder.eventId].status = saved.status;
      saveReminders(reminders);
    }

    // Aviso si faltan 3 días o menos
    if (daysUntil >= 0 && daysUntil <= 3) {
      const lastNotified = reminder.lastNotified ? new Date(reminder.lastNotified) : null;
      const alreadyNotifiedToday = lastNotified && lastNotified.toDateString() === now.toDateString();

      if (!alreadyNotifiedToday) {
        toast.info(
          daysUntil === 0 ? `¡Hoy es ${saved.title}!` : `Faltan ${daysUntil} día${daysUntil !== 1 ? "s" : ""} para ${saved.title}`,
          { description: "¡No te olvides de tu entrada!", duration: 8000 }
        );
        reminders[reminder.eventId].lastNotified = now.toISOString();
        saveReminders(reminders);
      }
    }
  });
}