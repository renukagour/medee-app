import { useEffect, useState } from "react";

type Category = {
  _id: string;
  name: string;
};

export default function AdminEvent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    image: "",
    category: "",
  });

  useEffect(() => {
    fetch("/api/admin/category")
      .then(res => res.json())
      .then(data => setCategories(data.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      alert("Event Created");
      setForm({ title: "", description: "", date: "", location: "", image: "", category: "" });
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Create Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="border p-2 w-full" required />
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border p-2 w-full" required />
        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="border p-2 w-full" required />
        <input type="text" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="border p-2 w-full" required />
        <input type="text" placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="border p-2 w-full" />
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="border p-2 w-full" required>
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Create Event
        </button>
      </form>
    </div>
  );
}
