import React, { useEffect, useMemo, useState } from "react";

type Role = {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    permissions: string[];
};

type RoleForm = {
    id?: string;
    name: string;
    description?: string;
    permissionsText: string; // comma-separated
    isActive: boolean;
};

const seedRoles: Role[] = [
    {
        id: "1",
        name: "Administrator",
        description: "Full access to the system",
        isActive: true,
        permissions: ["users.read", "users.write", "roles.manage", "audit.read"],
    },
    {
        id: "2",
        name: "Security Analyst",
        description: "Monitor and review security events",
        isActive: true,
        permissions: ["audit.read", "alerts.read"],
    },
    {
        id: "3",
        name: "ReadOnly",
        description: "Read-only access",
        isActive: false,
        permissions: ["users.read", "roles.read", "audit.read"],
    },
];

export default function ViewSecurity() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState<RoleForm>({
        name: "",
        description: "",
        permissionsText: "",
        isActive: true,
    });
    const [error, setError] = useState<string | null>(null);

    // Simulate initial fetch
    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setTimeout(() => {
            if (mounted) {
                setRoles(seedRoles);
                setLoading(false);
            }
        }, 400);
        return () => {
            mounted = false;
        };
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return roles;
        return roles.filter((r) => {
            const p = r.permissions.join(",").toLowerCase();
            return (
                r.name.toLowerCase().includes(q) ||
                (r.description || "").toLowerCase().includes(q) ||
                p.includes(q)
            );
        });
    }, [roles, query]);

    function openCreate() {
        setError(null);
        setForm({
            name: "",
            description: "",
            permissionsText: "",
            isActive: true,
        });
        setIsOpen(true);
    }

    function openEdit(role: Role) {
        setError(null);
        setForm({
            id: role.id,
            name: role.name,
            description: role.description,
            permissionsText: role.permissions.join(", "),
            isActive: role.isActive,
        });
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    function saveRole(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const name = form.name.trim();
        if (!name) {
            setError("Name is required.");
            return;
        }
        const permissions = form.permissionsText
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

        if (form.id) {
            // update
            setRoles((prev) =>
                prev.map((r) =>
                    r.id === form.id
                        ? {
                                ...r,
                                name,
                                description: form.description?.trim(),
                                permissions,
                                isActive: form.isActive,
                            }
                        : r
                )
            );
        } else {
            // create
            const newRole: Role = {
                id: cryptoRandomId(),
                name,
                description: form.description?.trim(),
                permissions,
                isActive: form.isActive,
            };
            setRoles((prev) => [newRole, ...prev]);
        }
        setIsOpen(false);
    }

    function deleteRole(id: string) {
        if (!confirm("Delete this role?")) return;
        setRoles((prev) => prev.filter((r) => r.id !== id));
    }

    function toggleActive(id: string) {
        setRoles((prev) =>
            prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
        );
    }

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div>
                    <h1 style={styles.title}>Security</h1>
                    <p style={styles.subtitle}>Manage roles and permissions</p>
                </div>
                <button onClick={openCreate} style={styles.primaryBtn}>
                    + Add Role
                </button>
            </header>

            <section style={styles.toolbar}>
                <input
                    type="search"
                    placeholder="Search roles or permissions..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={styles.search}
                />
            </section>

            {loading ? (
                <div style={styles.empty}>Loading...</div>
            ) : filtered.length === 0 ? (
                <div style={styles.empty}>No roles found.</div>
            ) : (
                <div style={styles.tableWrap}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Role</th>
                                <th style={styles.th}>Permissions</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th} />
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((r) => (
                                <tr key={r.id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <div style={{ fontWeight: 600 }}>{r.name}</div>
                                        <div style={{ color: "#666", fontSize: 12 }}>
                                            {r.description || "—"}
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.chips}>
                                            {r.permissions.map((p) => (
                                                <span key={p} style={styles.chip}>
                                                    {p}
                                                </span>
                                            ))}
                                            {r.permissions.length === 0 && <span>—</span>}
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        <button
                                            onClick={() => toggleActive(r.id)}
                                            style={{
                                                ...styles.pill,
                                                background: r.isActive ? "#e8f5e9" : "#fdecea",
                                                color: r.isActive ? "#1b5e20" : "#b71c1c",
                                            }}
                                            title="Toggle active"
                                        >
                                            {r.isActive ? "Active" : "Inactive"}
                                        </button>
                                    </td>
                                    <td style={{ ...styles.td, textAlign: "right" }}>
                                        <button onClick={() => openEdit(r)} style={styles.ghostBtn}>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteRole(r.id)}
                                            style={styles.dangerBtn}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isOpen && (
                <div style={styles.modalBackdrop} onClick={closeModal}>
                    <div
                        style={styles.modal}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <h2 style={{ margin: 0, marginBottom: 8 }}>
                            {form.id ? "Edit Role" : "Add Role"}
                        </h2>
                        <p style={{ marginTop: 0, color: "#666" }}>
                            Define role metadata and permissions.
                        </p>

                        <form onSubmit={saveRole}>
                            <div style={styles.formRow}>
                                <label style={styles.label}>Name</label>
                                <input
                                    style={styles.input}
                                    value={form.name}
                                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                    placeholder="e.g., Auditor"
                                    autoFocus
                                    required
                                />
                            </div>
                            <div style={styles.formRow}>
                                <label style={styles.label}>Description</label>
                                <input
                                    style={styles.input}
                                    value={form.description || ""}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, description: e.target.value }))
                                    }
                                    placeholder="Short description"
                                />
                            </div>
                            <div style={styles.formRow}>
                                <label style={styles.label}>Permissions</label>
                                <textarea
                                    style={{ ...styles.input, minHeight: 70, resize: "vertical" }}
                                    value={form.permissionsText}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, permissionsText: e.target.value }))
                                    }
                                    placeholder="Comma-separated, e.g., users.read, audit.read"
                                />
                                <small style={{ color: "#666" }}>
                                    Tip: Press comma to separate permissions.
                                </small>
                            </div>
                            <div style={styles.formRow}>
                                <label style={styles.label}>Active</label>
                                <input
                                    type="checkbox"
                                    checked={form.isActive}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, isActive: e.target.checked }))
                                    }
                                />
                            </div>

                            {error && <div style={styles.errorBox}>{error}</div>}

                            <div style={styles.modalActions}>
                                <button type="button" onClick={closeModal} style={styles.ghostBtn}>
                                    Cancel
                                </button>
                                <button type="submit" style={styles.primaryBtn}>
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Replace with your real ID generator or backend-generated IDs
function cryptoRandomId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return (crypto as any).randomUUID();
    }
    return Math.random().toString(36).slice(2);
}

const styles: Record<string, React.CSSProperties> = {
    page: { padding: 24, maxWidth: 1100, margin: "0 auto", fontFamily: "system-ui, sans-serif" },
    header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
    title: { margin: 0, fontSize: 24 },
    subtitle: { margin: 0, color: "#666" },
    toolbar: { display: "flex", gap: 12, alignItems: "center", marginBottom: 12 },
    search: {
        width: "100%",
        maxWidth: 420,
        padding: "8px 12px",
        borderRadius: 8,
        border: "1px solid #ddd",
        outline: "none",
    },
    tableWrap: { border: "1px solid #eee", borderRadius: 10, overflow: "hidden" },
    table: { width: "100%", borderCollapse: "separate", borderSpacing: 0 },
    th: { textAlign: "left", fontWeight: 600, color: "#444", background: "#fafafa", padding: "10px 12px", borderBottom: "1px solid #eee" },
    tr: { borderBottom: "1px solid #f1f1f1" },
    td: { padding: "10px 12px", verticalAlign: "top", borderBottom: "1px solid #f7f7f7" },
    chips: { display: "flex", gap: 6, flexWrap: "wrap" },
    chip: { background: "#f1f5f9", color: "#0f172a", padding: "2px 8px", borderRadius: 999, fontSize: 12 },
    pill: { border: "none", padding: "6px 10px", borderRadius: 999, fontWeight: 600, cursor: "pointer" },
    ghostBtn: { background: "transparent", border: "1px solid #ddd", padding: "8px 12px", borderRadius: 8, cursor: "pointer", marginRight: 8 },
    primaryBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "10px 14px", borderRadius: 8, cursor: "pointer" },
    dangerBtn: { background: "#ef4444", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 8, cursor: "pointer", marginLeft: 8 },
    empty: { padding: 32, textAlign: "center", color: "#666" },
    modalBackdrop: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 1000,
    },
    modal: {
        width: "100%",
        maxWidth: 560,
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    },
    formRow: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 },
    label: { fontWeight: 600, color: "#333" },
    input: { padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd", outline: "none" },
    modalActions: { display: "flex", justifyContent: "flex-end", marginTop: 12 },
    errorBox: { background: "#fdecea", color: "#b71c1c", border: "1px solid #f5c6cb", padding: "8px 10px", borderRadius: 8, marginBottom: 10 },
};