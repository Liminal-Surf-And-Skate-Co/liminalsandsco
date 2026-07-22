import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Package, Plus, CreditCard as Edit2, Trash2, Download } from "lucide-react";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [{ title: "Product Management | Admin" }],
  }),
  component: ProductsAdmin,
});

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
  createdAt: string;
}

function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Custom Surfboard - Shortboard",
      category: "Surfboards",
      price: 599.99,
      stock: 5,
      status: "active",
      createdAt: "2024-11-20",
    },
    {
      id: "2",
      name: "Limited Edition Drop Hoodie",
      category: "Apparel",
      price: 89.99,
      stock: 12,
      status: "active",
      createdAt: "2024-12-01",
    },
    {
      id: "3",
      name: "Custom Skateboard - Concave",
      category: "Skateboards",
      price: 349.99,
      stock: 0,
      status: "inactive",
      createdAt: "2024-10-15",
    },
  ]);

  const [newProduct, setNewProduct] = useState({ name: "", category: "", price: "", stock: "" });

  const addProduct = () => {
    if (newProduct.name && newProduct.category && newProduct.price && newProduct.stock) {
      setProducts([
        ...products,
        {
          id: `${products.length + 1}`,
          name: newProduct.name,
          category: newProduct.category,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
          status: "active",
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
      setNewProduct({ name: "", category: "", price: "", stock: "" });
      alert("Product added successfully!");
    }
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Package className="w-8 h-8" />
          Product Management
        </h1>
        <p className="text-gray-600">Manage your inventory and product listings</p>
      </div>

      {/* Add Product Form */}
      <Card className="mb-8 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Product
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product Name</label>
            <Input
              placeholder="Enter product name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <Input
              placeholder="e.g., Surfboards"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Price</label>
            <Input
              placeholder="0.00"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stock</label>
            <Input
              placeholder="0"
              type="number"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <Button onClick={addProduct} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const headers = ["Name", "Category", "Price", "Stock", "Status", "Created"];
              const rows = products.map((p) =>
                [
                  p.name,
                  p.category,
                  p.price.toString(),
                  p.stock.toString(),
                  p.status,
                  p.createdAt,
                ].join(","),
              );
              const csv = [headers.join(","), ...rows].join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "products.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </Card>

      {/* Products List */}
      <div>
        <h2 className="text-xl font-bold mb-4">Current Products</h2>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Product Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Product Images</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Created</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm italic">No images</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.category}</td>
                    <td className="px-6 py-4 text-gray-600">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.stock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.status === "active"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.createdAt}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Inventory Stats */}
      <div className="mt-8 grid grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-3xl font-bold text-blue-600">{products.length}</p>
          <p className="text-sm text-gray-600 mt-1">Total Products</p>
        </Card>
        <Card className="p-6">
          <p className="text-3xl font-bold text-green-600">
            {products.filter((p) => p.stock > 0).length}
          </p>
          <p className="text-sm text-gray-600 mt-1">In Stock</p>
        </Card>
        <Card className="p-6">
          <p className="text-3xl font-bold text-red-600">
            {products.reduce((sum, p) => sum + p.stock, 0)}
          </p>
          <p className="text-sm text-gray-600 mt-1">Total Units</p>
        </Card>
        <Card className="p-6">
          <p className="text-3xl font-bold text-purple-600">
            ${products.reduce((sum, p) => sum + p.price * p.stock, 0).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 mt-1">Inventory Value</p>
        </Card>
      </div>
    </div>
  );
}
