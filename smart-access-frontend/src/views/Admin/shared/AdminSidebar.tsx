import React from "react";
import { NavLink } from "react-router-dom";

type AdminSidebarProps = {
    collapsed?: boolean;
};

const sidebarStyle: React.CSSProperties = {
    width: 240,
    minWidth: 200,
    maxWidth: 280,
    height: "100vh",
    background: "#0f1724",
    color: "#e6eef8",
    padding: "1rem 0.5rem",
    boxSizing: "border-box",
};

const collapsedStyle: React.CSSProperties = {
    width: 64,
    minWidth: 64,
    padding: "1rem 0.25rem",
};

const brandStyle: React.CSSProperties = {
    fontWeight: 700,
    fontSize: 18,
    padding: "0.5rem 0.75rem",
    marginBottom: 12,
};

const navStyle: React.CSSProperties = {
    listStyle: "none",
    padding: 0,
    margin: 0,
};

const itemStyle: React.CSSProperties = {
    marginBottom: 6,
};

const linkBaseStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    textDecoration: "none",
    color: "inherit",
    padding: "10px 12px",
    borderRadius: 6,
};

const activeLinkStyle: React.CSSProperties = {
    background: "#1f2937",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.03)",
};

const iconStyle: React.CSSProperties = {
    width: 20,
    height: 20,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
};

const labelStyle: React.CSSProperties = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
};

const links = [
    { to: "/admin", label: "Dashboard", icon: "🏠" },
    { to: "/admin/users", label: "Users", icon: "👥" },
    { to: "/admin/reports", label: "Reports", icon: "📊" },
    { to: "/admin/settings", label: "Settings", icon: "⚙️" },
    { to: "/logout", label: "Logout", icon: "↩️" },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed = false }) => {
    const mergedSidebarStyle = collapsed
        ? { ...sidebarStyle, ...collapsedStyle }
        : sidebarStyle;

    return (
        <aside style={mergedSidebarStyle} aria-label="Admin sidebar">
            <div style={brandStyle}>
                {!collapsed ? "Admin Panel" : "AP"}
            </div>

            <nav>
                <ul style={navStyle}>
                    {links.map((link) => (
                        <li key={link.to} style={itemStyle}>
                            <NavLink
                                to={link.to}
                                end={link.to === "/admin"}
                                style={({ isActive }) => ({
                                    ...linkBaseStyle,
                                    ...(isActive ? activeLinkStyle : {}),
                                    paddingLeft: collapsed ? 10 : 12,
                                    paddingRight: collapsed ? 10 : 12,
                                })}
                            >
                                <span style={iconStyle} aria-hidden>
                                    {link.icon}
                                </span>
                                {!collapsed && <span style={labelStyle}>{link.label}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default AdminSidebar;