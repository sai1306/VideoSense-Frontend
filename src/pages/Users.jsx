import { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "reader",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/api/users");
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
    };

    const handleCreate = () => {
        setEditingUser(null);
        setFormData({ email: "", password: "", role: "reader" });
        setIsModalOpen(true);
        setError("");
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({ email: user.email, password: "", role: user.role });
        setIsModalOpen(true);
        setError("");
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await api.delete(`/api/users/${id}`);
                setUsers(users.filter((user) => user._id !== id));
            } catch (err) {
                console.error("Failed to delete user", err);
                alert("Failed to delete user");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                // Update
                const payload = { ...formData };
                if (!payload.password) delete payload.password; // Don't send empty password

                const res = await api.put(`/api/users/${editingUser._id}`, payload);
                setUsers(users.map((u) => (u._id === res.data._id ? res.data : u)));
            } else {
                // Create
                const res = await api.post("/api/users", formData);
                setUsers([...users, res.data]);
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error("Failed to save user", err);
            setError(err.response?.data?.message || "Failed to save user");
        }
    };

    return (
        <div className="min-h-screen bg-base-200">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <button style={{color:"white", backgroundColor:"#422ad5"}} className="p-2 btn btn-primary" onClick={handleCreate}>
                        Add User
                    </button>
                </div>

                <div className="overflow-x-auto bg-base-100 rounded-lg shadow-xl">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge ${user.role === 'admin' ? 'badge-primary' : user.role === 'editor' ? 'badge-secondary' : 'badge-ghost'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="flex gap-2">
                                        <button
                                            style={{color:"white", backgroundColor:"#422ad5"}}
                                            className="p-2 btn btn-sm btn-ghost"
                                            onClick={() => handleEdit(user)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            style={{color:"white", backgroundColor:"#f43098"}}
                                            className="p-2 btn btn-sm btn-error btn-outline"
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg mb-4">
                                {editingUser ? "Edit User" : "Add User"}
                            </h3>

                            {error && <div className="alert alert-error mb-4"><span>{error}</span></div>}

                            <form onSubmit={handleSubmit}>
                                <div className="form-control w-full mb-4">
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        className="p-2 input input-bordered w-full"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-control w-full mb-4">
                                    <label className="label">
                                        <span className="label-text">Role</span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="reader">Reader</option>
                                        <option value="editor">Editor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="form-control w-full mb-6">
                                    <label className="label">
                                        <span className="label-text">Password {editingUser && "(Leave blank to keep current)"}</span>
                                    </label>
                                    <input
                                        type="password"
                                        className="p-2 input input-bordered w-full"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required={!editingUser}
                                    />
                                </div>

                                <div className="modal-action">
                                    <button
                                        style={{color:"white", backgroundColor:"#f43098"}}
                                        type="button"
                                        className="p-2 btn btn-ghost"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" style={{color:"white", backgroundColor:"#422ad5"}} className="p-2 btn btn-primary">
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
