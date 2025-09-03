import React, { useState } from "react";
import Card from "../components/Card";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { PlusIcon, EditIcon, TrashIcon, UserIcon } from "lucide-react";

const Users = () => {
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const users = [
    {
      id: 1,
      name: "Marie Dupont",
      email: "marie.dupont@example.com",
      role: "Administrateur",
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Jean Martin",
      email: "jean.martin@example.com",
      role: "Utilisateur",
      status: "active",
      createdAt: "2024-01-20",
    },
    {
      id: 3,
      name: "Sophie Bernard",
      email: "sophie.bernard@example.com",
      role: "Modérateur",
      status: "inactive",
      createdAt: "2024-01-25",
    },
    {
      id: 4,
      name: "Pierre Dubois",
      email: "pierre.dubois@example.com",
      role: "Utilisateur",
      status: "active",
      createdAt: "2024-02-01",
    },
    {
      id: 5,
      name: "Claire Moreau",
      email: "claire.moreau@example.com",
      role: "Utilisateur",
      status: "active",
      createdAt: "2024-02-05",
    },
  ];

  const columns = [
    {
      key: "name",
      title: "Nom",
      render: (value, row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <UserIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      title: "Rôle",
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            value === "Administrateur"
              ? "bg-purple-100 text-purple-800"
              : value === "Modérateur"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "status",
      title: "Statut",
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            value === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value === "active" ? "Actif" : "Inactif"}
        </span>
      ),
    },
    {
      key: "createdAt",
      title: "Date d'inscription",
      render: (value) => new Date(value).toLocaleDateString("fr-FR"),
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditUser(row);
              setShowModal(true);
            }}
          >
            <EditIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => console.log("Delete user", row.id)}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleAddUser = () => {
    setEditUser(null);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-gray-600 mt-2">
            Gérez les comptes utilisateurs et leurs permissions
          </p>
        </div>
        <Button onClick={handleAddUser}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Nouvel utilisateur
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-sm text-gray-600">Total utilisateurs</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <UserIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.status === "active").length}
              </p>
              <p className="text-sm text-gray-600">Utilisateurs actifs</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <UserIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.role === "Administrateur").length}
              </p>
              <p className="text-sm text-gray-600">Administrateurs</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          data={users}
          itemsPerPage={5}
          onRowClick={(user) => console.log("Row clicked:", user)}
        />
      </Card>

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet
            </label>
            <input
              type="text"
              defaultValue={editUser?.name || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Entrez le nom complet..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              defaultValue={editUser?.email || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle
            </label>
            <select
              defaultValue={editUser?.role || "Utilisateur"}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Utilisateur">Utilisateur</option>
              <option value="Modérateur">Modérateur</option>
              <option value="Administrateur">Administrateur</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              defaultValue={editUser?.status || "active"}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <div className="flex space-x-3 pt-4">
            <Button className="flex-1">
              {editUser ? "Mettre à jour" : "Créer"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
