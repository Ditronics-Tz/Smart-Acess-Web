import React, { useEffect, useMemo, useState } from "react";

type Permission =
    | "read"
    | "write"
    | "delete"
    | "manage_users"
    | "manage_roles"
    | string;

interface Role {
    id: string;
    name: string;
    permissions: Permission[];
}

interface User {
    id: string;
    name: string;
    email: string;
    roleId: string;
    twoFactorEnabled: boolean;
    lastActiveAt: string; // ISO string
}

/**
 * Fake in-memory API to simulate network requests.
 * Replace with real HTTP calls as needed.
 */
const fakeApi = (() => {
    let roles: Role[] = [
        { id: "r-admin", name: "Admin", permissions: ["read", "write", "delete", "manage_users", "manage_roles"] },
        { id: "r-manager", name: "Manager", permissions: ["read", "write"] },
        { id: "r-viewer", name: "Viewer", permissions: ["read"] },
    ];
    let users: User[] = [
        { id: "u-1", name: "Alice Johnson", email: "alice@example.com", roleId: "r-admin", twoFactorEnabled: true, lastActiveAt: new Date(Date.now() - 3600_000).toISOString() },
        { id: "u-2", name: "Bob Smith", email: "bob@example.com", roleId: "r-manager", twoFactorEnabled: false, lastActiveAt: new Date(Date.now() - 86_400_000 * 2).toISOString() },
        { id: "u-3", name: "Carol Lee", email: "carol@example.com", roleId: "r-viewer", twoFactorEnabled: false, lastActiveAt: new Date(Date.now() - 86_400_000 * 7).toISOString() },
    ];

    const delay = <T,>(data: T, ms = 300): Promise<T> =>
        new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), ms));

    return {
        getUsers: async () => delay(users),
        getRoles: async () => delay(roles),
        updateUserRole: async (userId: string, roleId: string) => {
            users = users.map((u) => (u.id === userId ? { ...u, roleId } : u));
            return delay(users.find((u) => u.id === userId)!);
        },
        toggle2FA: async (userId: string, enabled: boolean) => {
            users = users.map((u) => (u.id === userId ? { ...u, twoFactorEnabled: enabled } : u));
            return delay(users.find((u) => u.id === userId)!);
        },
        resetPassword: async (userId: string) => {
            // no-op, just pretend we sent an email
            return delay({ success: true, userId });
        },
        addPermissionToRole: async (roleId: string, permission: Permission) => {
            roles = roles.map((r) =>
                r.id === roleId && !r.permissions.includes(permission)
                    ? { ...r, permissions: [...r.permissions, permission] }
                    : r
            );
            return delay(roles.find((r) => r.id === roleId)!);
        },
        removePermissionFromRole: async (roleId: string, permission: Permission) => {
            roles = roles.map((r) =>
                r.id === roleId ? { ...r, permissions: r.permissions.filter((p) => p !== permission) } : r
            );
            return delay(roles.find((r) => r.id === roleId)!);
        },
        createRole: async (name: string) => {
            const id = `r-${Math.random().toString(36).slice(2, 8)}`;
            const role: Role = { id, name, permissions: [] };
            roles = [...roles, role];
            return delay(role);
        },
        deleteRole: async (roleId: string) => {
            roles = roles.filter((r) => r.id !== roleId);
            // reassign users with deleted role to viewer (or first role)
            const fallbackRoleId = roles[0]?.id ?? "r-viewer";
            users = users.map((u) => (u.roleId === roleId ? { ...u, roleId: fallbackRoleId } : u));
            return delay({ success: true });
        },
    };
})();

function formatRelative(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d}d ago`;
    const mo = Math.floor(d / 30);
    if (mo < 12) return `${mo}mo ago`;
    const y = Math.floor(mo / 12);
    return `${y}y ago`;
}

const chipStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 8px",
    borderRadius: 999,
    background: "#eef2ff",
    color: "#3730a3",
    fontSize: 12,
    margin: 2,
    border: "1px solid #c7d2fe",
};

const buttonStyle: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    background: "#111827",
    color: "white",
    cursor: "pointer",
};

const inputStyle: React.CSSProperties = {
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    outline: "none",
};

export default function ManageSecurity() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingUserId, setSavingUserId] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const [u, r] = await Promise.all([fakeApi.getUsers(), fakeApi.getRoles()]);
                if (!alive) return;
                setUsers(u);
                setRoles(r);
            } catch (e) {
                setError("Failed to load data.");
            } finally {
                setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, []);

    const filteredUsers = useMemo(() => {
        const q = query.toLowerCase();
        return users.filter((u) => {
            const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
            const matchRole = roleFilter === "all" || u.roleId === roleFilter;
            return matchQ && matchRole;
        });
    }, [users, query, roleFilter]);

    const roleName = (roleId: string) => roles.find((r) => r.id === roleId)?.name ?? "Unknown";

    async function handleRoleChange(userId: string, roleId: string) {
        try {
            setSavingUserId(userId);
            const updated = await fakeApi.updateUserRole(userId, roleId);
            setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
        } catch {
            setError("Failed to update role.");
        } finally {
            setSavingUserId(null);
        }
    }

    async function handleToggle2FA(userId: string, enabled: boolean) {
        try {
            setSavingUserId(userId);
            const updated = await fakeApi.toggle2FA(userId, enabled);
            setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
        } catch {
            setError("Failed to toggle 2FA.");
        } finally {
            setSavingUserId(null);
        }
    }

    async function handleResetPassword(userId: string) {
        if (!confirm("Send password reset email to this user?")) return;
        try {
            setSavingUserId(userId);
            await fakeApi.resetPassword(userId);
            alert("Password reset email sent.");
        } catch {
            setError("Failed to reset password.");
        } finally {
            setSavingUserId(null);
        }
    }

    async function handleAddPermission(roleId: string, inputEl: HTMLInputElement | null) {
        if (!inputEl) return;
        const val = inputEl.value.trim();
        if (!val) return;
        try {
            const updated = await fakeApi.addPermissionToRole(roleId, val as Permission);
            setRoles((prev) => prev.map((r) => (r.id === roleId ? updated : r)));
            inputEl.value = "";
        } catch {
            setError("Failed to add permission.");
        }
    }

    async function handleRemovePermission(roleId: string, perm: Permission) {
        try {
            const updated = await fakeApi.removePermissionFromRole(roleId, perm);
            setRoles((prev) => prev.map((r) => (r.id === roleId ? updated : r)));
        } catch {
            setError("Failed to remove permission.");
        }
    }

    async function handleCreateRole() {
        const name = prompt("New role name?");
        if (!name) return;
        try {
            const created = await fakeApi.createRole(name.trim());
            setRoles((prev) => [...prev, created]);
        } catch {
            setError("Failed to create role.");
        }
    }

    async function handleDeleteRole(roleId: string) {
        const role = roles.find((r) => r.id === roleId);
        if (!role) return;
        if (!confirm(`Delete role "${role.name}"? Users will be reassigned.`)) return;
        try {
            await fakeApi.deleteRole(roleId);
            const [u, r] = await Promise.all([fakeApi.getUsers(), fakeApi.getRoles()]);
            setUsers(u);
            setRoles(r);
        } catch {
            setError("Failed to delete role.");
        }
    }

    return (
        <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto", fontFamily: "system-ui, Segoe UI, Roboto, sans-serif" }}>
            <h1 style={{ marginBottom: 8 }}>Manage Security</h1>
            <p style={{ marginTop: 0, color: "#6b7280" }}>
                Manage users, roles, permissions, and security features like 2FA.
            </p>

            {error && (
                <div style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca", padding: 10, borderRadius: 8, marginBottom: 12 }}>
                    {error}
                </div>
            )}

            <section style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 24 }}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <input
                        style={inputStyle}
                        placeholder="Search users by name or email..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <select
                        style={inputStyle}
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all">All roles</option>
                        {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.name}
                            </option>
                        ))}
                    </select>
                    <button style={buttonStyle} onClick={handleCreateRole}>+ New Role</button>
                </div>
            </section>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
                <section>
                    <Card title="Users" loading={loading}>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ textAlign: "left", background: "#f9fafb" }}>
                                        <Th>Name</Th>
                                        <Th>Email</Th>
                                        <Th>Role</Th>
                                        <Th>2FA</Th>
                                        <Th>Last Active</Th>
                                        <Th>Actions</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((u) => (
                                        <tr key={u.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                                            <Td>
                                                <div style={{ fontWeight: 600 }}>{u.name}</div>
                                            </Td>
                                            <Td><span style={{ color: "#6b7280" }}>{u.email}</span></Td>
                                            <Td>
                                                <select
                                                    disabled={savingUserId === u.id}
                                                    style={inputStyle}
                                                    value={u.roleId}
                                                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                >
                                                    {roles.map((r) => (
                                                        <option key={r.id} value={r.id}>
                                                            {r.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </Td>
                                            <Td>
                                                <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={u.twoFactorEnabled}
                                                        disabled={savingUserId === u.id}
                                                        onChange={(e) => handleToggle2FA(u.id, e.target.checked)}
                                                    />
                                                    <span>{u.twoFactorEnabled ? "Enabled" : "Disabled"}</span>
                                                </label>
                                            </Td>
                                            <Td>{formatRelative(u.lastActiveAt)}</Td>
                                            <Td>
                                                <button
                                                    disabled={savingUserId === u.id}
                                                    style={{ ...buttonStyle, background: "#1f2937" }}
                                                    onClick={() => handleResetPassword(u.id)}
                                                >
                                                    {savingUserId === u.id ? "Working..." : "Reset Password"}
                                                </button>
                                            </Td>
                                        </tr>
                                    ))}
                                    {!loading && filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan={6} style={{ padding: 16, color: "#6b7280", textAlign: "center" }}>
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </section>

                <section>
                    <Card title="Roles & Permissions" loading={loading}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {roles.map((r) => (
                                <div key={r.id} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                        <div>
                                            <div style={{ fontWeight: 700 }}>{r.name}</div>
                                            <div style={{ fontSize: 12, color: "#6b7280" }}>{r.id}</div>
                                        </div>
                                        <button
                                            style={{ ...buttonStyle, background: "#991b1b" }}
                                            onClick={() => handleDeleteRole(r.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <div style={{ marginBottom: 8 }}>
                                        {r.permissions.length ? (
                                            r.permissions.map((p) => (
                                                <span key={p} style={chipStyle}>
                                                    {p}
                                                    <button
                                                        title="Remove permission"
                                                        onClick={() => handleRemovePermission(r.id, p)}
                                                        style={{
                                                            border: "none",
                                                            background: "transparent",
                                                            color: "#7c3aed",
                                                            cursor: "pointer",
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))
                                        ) : (
                                            <span style={{ color: "#6b7280", fontStyle: "italic" }}>No permissions</span>
                                        )}
                                    </div>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <input
                                            placeholder="Add permission (e.g. export_reports)"
                                            style={{ ...inputStyle, flex: 1 }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleAddPermission(r.id, e.currentTarget);
                                                }
                                            }}
                                        />
                                        <button
                                            style={{ ...buttonStyle, background: "#374151" }}
                                            onClick={(e) =>
                                                handleAddPermission(
                                                    r.id,
                                                    (e.currentTarget.previousSibling as HTMLInputElement) || null
                                                )
                                            }
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {!roles.length && !loading && (
                                <div style={{ color: "#6b7280" }}>No roles yet. Create one to get started.</div>
                            )}
                        </div>
                    </Card>

                    <Card title="Tips" loading={false}>
                        <ul style={{ margin: 0, paddingLeft: 18, color: "#374151" }}>
                            <li>Use strong password policy and enable 2FA for admins.</li>
                            <li>Grant least privilege by assigning minimal permissions.</li>
                            <li>Review inactive users and revoke unnecessary access.</li>
                        </ul>
                    </Card>
                </section>
            </div>
        </div>
    );
}

function Card(props: { title: string; loading?: boolean; children: React.ReactNode }) {
    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, background: "white", marginBottom: 16 }}>
            <div style={{ padding: "12px 14px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb", borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                <strong>{props.title}</strong>
            </div>
            <div style={{ padding: 14 }}>
                {props.loading ? <div style={{ color: "#6b7280" }}>Loading...</div> : props.children}
            </div>
        </div>
    );
}

function Th({ children }: { children: React.ReactNode }) {
    return <th style={{ padding: "10px 8px", fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
    return <td style={{ padding: "10px 8px", verticalAlign: "middle" }}>{children}</td>;
}