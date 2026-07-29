export type AuditEvent =
  | "PATIENT_SCAN_DRUG"
  | "PATIENT_SCAN_PRESCRIPTION"
  | "PATIENT_CREATE_ORDER"
  | "PATIENT_DELETE_ORDER"
  | "PATIENT_DEACTIVATE_ACCOUNT";

export const auditLog = (event: AuditEvent, meta: Record<string, unknown>) => {
  // Lightweight structured log; replace with Winston/Sentry later
  try {
    console.log(
      JSON.stringify({
        type: "AUDIT",
        timestamp: new Date().toISOString(),
        event,
        ...meta,
      })
    );
  } catch {
    // ignore logging failures
  }
};
