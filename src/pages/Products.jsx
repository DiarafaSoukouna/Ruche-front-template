import React, { useState } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { PlusIcon, EditIcon, TrashIcon, PackageIcon } from 'lucide-react';

const Products = () => {
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const products = [
    {
      id: 1,
      name: 'Ordinateur Portable HP',
      price: 899,
      category: 'Informatique',
      stock: 25,
      status: 'active'
    },
    {
      id: 2,
      name: 'Smartphone Samsung Galaxy',
      price: 599,
      category: 'Téléphonie',
      stock: 12,
      status: 'active'
    },
    {
      id: 3,
      name: 'Casque Audio Sony',
      price: 149,
      category: 'Audio',
      stock: 0,
      status: 'inactive'
    },
    {
      id: 4,
      name: 'Tablette iPad',
      price: 449,
      category: 'Informatique',
      stock: 8,
      status: 'active'
    },
    {
      id: 5,
      name: 'Montre Connectée Apple',
      price: 329,
      category: 'Accessoires',
      stock: 15,
      status: 'active'
    }
  ];

  const columns = [
    {
      key: 'name',
      title: 'Produit',
      render: (value, row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <PackageIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.category}</div>
          </div>
        </div>
      )
    },
    {
      key: 'price',
      title: 'Prix',
      render: (value) => (
        <span className="font-medium text-gray-900">€{value}</span>
      )
    },
    {
      key: 'stock',
      title: 'Stock',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          value > 10 
            ? 'bg-green-100 text-green-800'
            : value > 0
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {value} en stock
        </span>
      )
    },
    {
      key: 'status',
      title: 'Statut',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'active' 
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {value === 'active' ? 'Actif' : 'Inactif'}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditProduct(row);
              setShowModal(true);
            }}
          >
            <EditIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => console.log('Delete product', row.id)}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  const handleAddProduct = () => {
    setEditProduct(null);
    setShowModal(true);
  };

  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const lowStockProducts = products.filter(p => p.stock < 10).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
          <p className="text-gray-600 mt-2">Gérez votre catalogue de produits et inventaire</p>
        </div>
        <Button onClick={handleAddProduct}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Nouveau produit
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <PackageIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              <p className="text-sm text-gray-600">Total produits</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <PackageIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{products.filter(p => p.status === 'active').length}</p>
              <p className="text-sm text-gray-600">Produits actifs</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg mr-4">
              <PackageIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{lowStockProducts}</p>
              <p className="text-sm text-gray-600">Stock faible</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <PackageIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">€{totalValue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Valeur totale</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <Table
          columns={columns}
          data={products}
          itemsPerPage={5}
          onRowClick={(product) => console.log('Row clicked:', product)}
        />
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editProduct ? 'Modifier le produit' : 'Nouveau produit'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du produit
            </label>
            <input
              type="text"
              defaultValue={editProduct?.name || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Entrez le nom du produit..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (€)
              </label>
              <input
                type="number"
                defaultValue={editProduct?.price || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock
              </label>
              <input
                type="number"
                defaultValue={editProduct?.stock || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              defaultValue={editProduct?.category || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionnez une catégorie</option>
              <option value="Informatique">Informatique</option>
              <option value="Téléphonie">Téléphonie</option>
              <option value="Audio">Audio</option>
              <option value="Accessoires">Accessoires</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              defaultValue={editProduct?.status || 'active'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <div className="flex space-x-3 pt-4">
            <Button className="flex-1">
              {editProduct ? 'Mettre à jour' : 'Créer'}
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
              Annuler
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Products;