import Modal from "./Modal";
import Button from "./Button";
import Alert from "./Alert";

export default function ConfirmDialog({
  title = "Are you sure?",
  body,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  loading = false,
  error,
  onConfirm,
  onClose,
}) {
  return (
    <Modal title={title} onClose={onClose} width="max-w-sm">
      <div className="space-y-4">
        <Alert>{error}</Alert>
        {body && <p className="text-sm leading-relaxed text-ink-600">{body}</p>}
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button type="button" variant={danger ? "danger" : "primary"} loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
