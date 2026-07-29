export type AuditEventType =
  | "PATIENT_SCAN_DRUG"
  | "PATIENT_SCAN_PRESCRIPTION"
  | "PATIENT_CREATE_ORDER"
  | "PATIENT_DEACTIVATE_ACCOUNT";

export const auditLog = (event: AuditEventType, payload: Record<string, any>) => {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.info("[AUDIT]", event, payload);
  }
};
