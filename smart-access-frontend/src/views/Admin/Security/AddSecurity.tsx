import React, { JSX, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type SecurityRole = "Guard" | "Supervisor" | "Admin";

type SecurityForm = {
    fullName: string;
    email: string;
    phone: string;
    role: SecurityRole;
    enabled: boolean;
    notes: string;
};

type Errors = Partial<Record<keyof SecurityForm, string>>;

const initialForm: SecurityForm = {
    fullName: "",
    email: "",
    phone: "",
    role: "Guard",
    enabled: true,
    notes: "",
};

function validate(form: SecurityForm): Errors {
    const errors: Errors = {};
    if (!form.fullName.trim()) errors.fullName = "Full name is required";
    if (!form.email.trim()) {
        errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = "Enter a valid email";
    }
    if (!form.phone.trim()) {
        errors.phone = "Phone is required";
    } else if (!/^[+\d][\d\-()\s]{6,}$/.test(form.phone)) {
        errors.phone = "Enter a valid phone";
    }
    if (!form.role) errors.role = "Role is required";
    if (form.notes.length > 500) errors.notes = "Notes must be under 500 characters";
    return errors;
}

export default function AddSecurity(): JSX.Element {
    const navigate = useNavigate();
    const [form, setForm] = useState<SecurityForm>(initialForm);
    const [errors, setErrors] = useState<Errors>({});
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [serverSuccess, setServerSuccess] = useState<string | null>(null);

    const isValid = useMemo(() => Object.keys(validate(form)).length === 0, [form]);

    function onChange<K extends keyof SecurityForm>(key: K, value: SecurityForm[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
        setServerError(null);
        setServerSuccess(null);
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const v = validate(form);
        setErrors(v);
        setServerError(null);
        setServerSuccess(null);
        if (Object.keys(v).length > 0) return;

        setSubmitting(true);
        try {
            // Replace URL with your real endpoint
            const res = await fetch("/api/admin/security", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || `Request failed with ${res.status}`);
            }

            setServerSuccess("Security profile created");
            // Navigate after a brief delay to let user see success
            setTimeout(() => navigate("/admin-dashboard/security"), 500);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Unexpected error";
            setServerError(message);
        } finally {
            setSubmitting(false);
        }
    }

    function onReset() {
        setForm(initialForm);
        setErrors({});
        setServerError(null);
        setServerSuccess(null);
    }

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <header style={styles.header}>
                    <h1 style={styles.title}>Add Security</h1>
                    <p style={styles.subtitle}>Create a new security profile</p>
                </header>

                {serverError && (
                    <div role="alert" style={{ ...styles.alert, ...styles.alertError }}>
                        {serverError}
                    </div>
                )}
                {serverSuccess && (
                    <div role="status" style={{ ...styles.alert, ...styles.alertSuccess }}>
                        {serverSuccess}
                    </div>
                )}

                <form onSubmit={onSubmit} noValidate>
                    <div style={styles.grid}>
                        <Field label="Full Name" error={errors.fullName} required>
                            <input
                                type="text"
                                value={form.fullName}
                                onChange={(e) => onChange("fullName", e.target.value)}
                                placeholder="Jane Doe"
                                style={inputStyle(errors.fullName)}
                                autoComplete="name"
                            />
                        </Field>

                        <Field label="Email" error={errors.email} required>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => onChange("email", e.target.value)}
                                placeholder="jane.doe@example.com"
                                style={inputStyle(errors.email)}
                                autoComplete="email"
                            />
                        </Field>

                        <Field label="Phone" error={errors.phone} required>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) => onChange("phone", e.target.value)}
                                placeholder="+1 (555) 123-4567"
                                style={inputStyle(errors.phone)}
                                autoComplete="tel"
                            />
                        </Field>

                        <Field label="Role" error={errors.role} required>
                            <select
                                value={form.role}
                                onChange={(e) => onChange("role", e.target.value as SecurityRole)}
                                style={inputStyle(errors.role)}
                            >
                                <option value="Guard">Guard</option>
                                <option value="Supervisor">Supervisor</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </Field>

                        <Field label="Enabled">
                            <label style={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    checked={form.enabled}
                                    onChange={(e) => onChange("enabled", e.target.checked)}
                                />
                                <span style={{ marginLeft: 8 }}>Active account</span>
                            </label>
                        </Field>

                        <Field label="Notes" error={errors.notes}>
                            <textarea
                                value={form.notes}
                                onChange={(e) => onChange("notes", e.target.value)}
                                placeholder="Optional notes…"
                                rows={4}
                                style={inputStyle(errors.notes)}
                                maxLength={500}
                            />
                            <div style={styles.helperText}>{form.notes.length}/500</div>
                        </Field>
                    </div>

                    <div style={styles.footer}>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            style={{ ...styles.button, ...styles.ghost }}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button type="button" onClick={onReset} style={{ ...styles.button, ...styles.secondary }} disabled={submitting}>
                            Reset
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !isValid}
                            style={{ ...styles.button, ...styles.primary, ...(submitting || !isValid ? styles.disabled : {}) }}
                        >
                            {submitting ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Field(props: {
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    const { label, error, required, children } = props;
    return (
        <div style={styles.field}>
            <label style={styles.label}>
                {label} {required && <span style={{ color: "#d00" }}>*</span>}
            </label>
            {children}
            {error && <div style={styles.error}>{error}</div>}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        padding: "24px",
        display: "flex",
        justifyContent: "center",
    },
    card: {
        width: "100%",
        maxWidth: 900,
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 24,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    },
    header: { marginBottom: 16 },
    title: { margin: 0, fontSize: 22 },
    subtitle: { margin: "6px 0 0 0", color: "#6b7280" },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: 16,
    },
    field: {
        gridColumn: "span 12",
    },
    label: {
        display: "block",
        fontWeight: 600,
        marginBottom: 6,
    },
    error: {
        color: "#b91c1c",
        fontSize: 12,
        marginTop: 6,
    },
    helperText: {
        color: "#6b7280",
        fontSize: 12,
        marginTop: 6,
    },
    checkbox: {
        display: "inline-flex",
        alignItems: "center",
        padding: "8px 0",
    },
    footer: {
        marginTop: 24,
        display: "flex",
        justifyContent: "flex-end",
        gap: 12,
    },
    button: {
        appearance: "none",
        border: "1px solid #d1d5db",
        background: "#fff",
        color: "#111827",
        padding: "8px 14px",
        borderRadius: 8,
        cursor: "pointer",
        fontWeight: 600,
    },
    primary: {
        background: "#2563eb",
        borderColor: "#2563eb",
        color: "white",
    },
    secondary: {
        background: "#f3f4f6",
    },
    ghost: {
        background: "transparent",
    },
    disabled: {
        opacity: 0.6,
        cursor: "not-allowed",
    },
    alert: {
        padding: "10px 12px",
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 14,
    },
    alertError: {
        background: "#fef2f2",
        color: "#991b1b",
        border: "1px solid #fecaca",
    },
    alertSuccess: {
        background: "#ecfdf5",
        color: "#065f46",
        border: "1px solid #a7f3d0",
    },
};

function inputStyle(error?: string): React.CSSProperties {
    return {
        width: "100%",
        padding: "10px 12px",
        borderRadius: 8,
        border: `1px solid ${error ? "#fca5a5" : "#d1d5db"}`,
        outline: "none",
        background: "#fff",
        fontSize: 14,
    };
}