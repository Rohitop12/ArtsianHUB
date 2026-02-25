import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ProductForm = ({ initialData, onSubmit, onCancel, loading }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadingGallery, setUploadingGallery] = useState(false);
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Pottery',
        image: '',
        gallery: [],
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                title: initialData.title || '',
                description: initialData.description || '',
                price: initialData.price || '',
                category: initialData.category || 'Pottery',
                image: initialData.image || '',
                gallery: initialData.gallery || [],
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const { data } = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setForm({ ...form, image: data.imageUrl });
        } catch (error) {
            console.error(error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const uploadGalleryHandler = async (e) => {
        const files = e.target.files;
        if (files.length > 5) {
            alert('You can only upload a maximum of 5 images per product.');
            return;
        }

        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('images', file);
        });

        setUploadingGallery(true);
        try {
            const { data } = await api.post('/upload/multiple', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Append or replace? Let's just replace for simplicity to match main image behavior
            setForm({ ...form, gallery: data.imageUrls });
        } catch (error) {
            console.error(error);
            alert('Failed to upload gallery images. Please try again.');
        } finally {
            setUploadingGallery(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.image) {
            toast.error('Please select a main product image');
            return;
        }
        onSubmit({
            ...form,
            price: Number(form.price),
        });
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-stone-100 p-6 md:p-8">
            <h2 className="font-serif text-2xl font-bold text-stone-800 mb-6">
                {initialData ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                        Product Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="e.g. Hand-Woven Scarf"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                            Price (USD)
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="input-field"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                            Category
                        </label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="input-field cursor-pointer"
                        >
                            {['Pottery', 'Jewelry', 'Textiles', 'Woodwork', 'Glasswork', 'Leather'].map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="input-field resize-none"
                        placeholder="Describe your craft..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                        Product Image
                    </label>
                    <input
                        type="file"
                        onChange={uploadFileHandler}
                        className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200"
                        accept="image/*"
                    />
                    {uploading && <div className="mt-2 text-sm text-stone-500">Uploading image...</div>}
                    {form.image && (
                        <div className="mt-4 rounded-xl overflow-hidden h-32 w-32 bg-stone-100 border border-stone-200">
                            <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                        Gallery Images (Optional, up to 5 photos)
                    </label>
                    <input
                        type="file"
                        multiple
                        onChange={uploadGalleryHandler}
                        className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200"
                        accept="image/*"
                    />
                    {uploadingGallery && <div className="mt-2 text-sm text-stone-500">Uploading gallery...</div>}
                    {form.gallery && form.gallery.length > 0 && (
                        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                            {form.gallery.map((url, i) => (
                                <div key={i} className="flex-shrink-0 rounded-xl overflow-hidden h-24 w-24 bg-stone-100 border border-stone-200">
                                    <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading || uploading || uploadingGallery || !form.image}
                        className="btn-primary flex-1 flex justify-center items-center gap-2"
                    >
                        {loading ? (
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : initialData ? 'Save Changes' : 'Publish Product'}
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="btn-secondary flex-1"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
