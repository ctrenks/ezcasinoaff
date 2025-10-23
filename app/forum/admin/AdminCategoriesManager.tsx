"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminCategoriesManager() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/forum/admin/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");

      const data = await response.json();
      setCategories(data.categories);
    } catch (error: any) {
      toast.error(error.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/forum/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create category");
      }

      toast.success("Category created successfully!");
      setFormData({ name: "", description: "", icon: "" });
      setShowForm(false);
      fetchCategories();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/forum/admin/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete category");
      }

      toast.success("Category deleted successfully!");
      fetchCategories();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/forum/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update category");
      }

      toast.success("Category updated!");
      fetchCategories();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update category");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Category Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Forum Categories</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          {showForm ? "Cancel" : "+ Add Category"}
        </button>
      </div>

      {/* Add Category Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Create New Category
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g. General Discussion"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                placeholder="Brief description of this category"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon (emoji)
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="💬"
                disabled={isSubmitting}
                maxLength={2}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Category"}
            </button>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No categories yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-purple-600 hover:underline mt-2"
            >
              Create the first category
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {categories.map((category) => (
              <div key={category.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {category.icon && (
                      <span className="text-2xl">{category.icon}</span>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-gray-600 text-sm mt-1">
                          {category.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{category._count.topics} topics</span>
                        <span>•</span>
                        <span>Order: {category.displayOrder}</span>
                        <span>•</span>
                        <span
                          className={
                            category.isActive
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        toggleActive(category.id, category.isActive)
                      }
                      className="text-sm text-purple-600 hover:underline"
                    >
                      {category.isActive ? "Deactivate" : "Activate"}
                    </button>
                    {category._count.topics === 0 && (
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
