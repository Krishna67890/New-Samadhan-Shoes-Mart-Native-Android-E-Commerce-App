import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';
import useFetch from '../hooks/useFetch';
import { ArrowLeft, Save, Upload, Loader2, Image as ImageIcon, CheckCircle, AlertCircle, PlusCircle, Sparkles } from 'lucide-react';
import { resolveImageUrl } from '../utils/urlConfig';

import localProducts from '../utils/localProducts';
import { getProductById, saveCustomProduct } from '../utils/productUtils';

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isNew = !id;
  const { loading, error, request } = useFetch();
  const formRef = useRef(null);

  const queryCategory = searchParams.get('category');

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [brand, setBrand] = useState('');
  const [stock, setStock] = useState(0);
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(queryCategory || 'Formal');
  const [targetGender, setTargetGender] = useState('Men');
  const [images, setImages] = useState([]);
  const [model3D, setModel3D] = useState('');
  const [sizes, setSizes] = useState([6, 7, 8, 9, 10]);
  const [technology, setTechnology] = useState(["Arch-Support Matrix", "Dual-Density Foam", "High-Traction Outsole"]);
  const [concerns, setConcerns] = useState(["Heel Comfort", "Flat Feet", "General Orthopedic Support"]);
  const [professions, setProfessions] = useState(["Corporate", "Medical / Healthcare", "Hospitality"]);
  const [purpose, setPurpose] = useState(["Daily Wear", "Office", "Sports"]);
  const [uploading, setUploading] = useState(false);
  const [uploadingModel, setUploadingModel] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    gsap.from(formRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  }, []);

  useEffect(() => {
    if (!isNew) {
      const fetchProduct = async () => {
        try {
          const data = await getProductById(id, request);
          if (data) {
            setName(data.name || '');
            setPrice(data.price || 0);
            setBrand(data.brand || '');
            setStock(data.stock || 0);
            setRating(data.rating || 0);
            setDescription(data.description || '');
            setCategory(data.category || 'Formal');
            setTargetGender(data.targetGender || 'Men');
            setImages(data.images || []);
            setModel3D(data.model3D || '');
            setSizes(data.sizes || [6, 7, 8, 9, 10]);
            setTechnology(data.technology || ["Arch-Support Matrix", "Dual-Density Foam", "High-Traction Outsole"]);
            setConcerns(data.concerns || ["Heel Comfort", "Flat Feet", "General Orthopedic Support"]);
            setProfessions(data.professions || ["Corporate", "Medical / Healthcare", "Hospitality"]);
            setPurpose(data.purpose || ["Daily Wear", "Office", "Sports"]);
          }
        } catch (err) {
          console.error("Error loading product data:", err);
        }
      };
      fetchProduct();
    }
  }, [id, isNew, request]);

  const uploadFileHandler = async (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 4) {
      alert("Policy Violation: You cannot upload more than 4 images.");
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return await request('/api/upload', 'POST', formData);
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages([...images, ...uploadedUrls]);
      setUploading(false);
    } catch (err) {
      console.error("Upload process failed:", err);
      setUploading(false);
      const errorMessage = err.message || "Unknown Server Error";
      alert(`MEDIA UPLOAD FAILED: ${errorMessage}. \n\nTip: For global stability, use the "External URL" input below instead of uploading files.`);
    }
  };

  const uploadModelHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingModel(true);
    try {
      const formData = new FormData();
      formData.append('image', file); // uploadRoutes uses 'image' fieldname
      const uploadedUrl = await request('/api/upload', 'POST', formData);
      setModel3D(uploadedUrl);
      setUploadingModel(false);
    } catch (err) {
      console.error("Model upload failed:", err);
      setUploadingModel(false);
      alert(`3D MODEL UPLOAD FAILED: ${err.message || "Unknown Server Error"}`);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (price < 1000 || price > 2000) {
      alert("Policy Violation: Price must be between ₹1,000 and ₹2,000.");
      return;
    }

    if (images.length === 0) {
      alert("Please upload or provide at least 1 image for the product.");
      return;
    }

    const prodId = isNew ? `prod_${Date.now()}` : id;
    const productData = {
      _id: prodId,
      id: prodId,
      name,
      price: Number(price) || 0,
      brand: brand || 'Atelier Samadhan',
      stock: Number(stock) || 10,
      rating: Number(rating) || 4.8,
      description,
      images,
      image: images[0],
      model3D,
      sizes,
      category,
      targetGender,
      technology,
      concerns,
      professions,
      purpose
    };

    // 1. Save directly into unified local storage matrix (guarantees immediate update everywhere)
    saveCustomProduct(productData);

    try {
      if (isNew) {
        await request('/api/products', 'POST', productData);
      } else {
        await request(`/api/products/${id}`, 'PUT', productData);
      }
    } catch (err) {
      console.warn("Backend cloud sync pending, saved to local client vault:", err);
    }

    setSuccess(true);
    setTimeout(() => navigate('/admin/products'), 1500);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] pt-32 pb-20 px-6 no-blur-zone">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center mb-12">
          <button
            onClick={() => navigate('/admin/products')}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#6B6B6B] hover:text-[#111] transition-colors"
          >
            <ArrowLeft size={16} /> Back to Catalog
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-[#8B0000] text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-2">
                <Sparkles size={10} /> {isNew ? 'New Entry' : 'Matrix Update'}
              </div>
            </div>
            <h1 className="text-6xl font-editorial font-black uppercase tracking-tighter text-[#111]">
              {isNew ? 'Create Masterpiece' : 'Edit Asset'}
            </h1>
          </div>
        </div>

      {success && (
         <div className="bg-green-600 text-white p-6 rounded-2xl mb-8 flex items-center shadow-xl border-4 border-white animate-in zoom-in-95">
            <CheckCircle className="w-8 h-8 mr-3" />
            <div>
               <p className="font-black uppercase tracking-widest text-lg">Update Successfull</p>
               <p className="text-xs opacity-80 font-bold uppercase tracking-tighter">The product has been updated in the catalog.</p>
            </div>
         </div>
      )}

      {error && (
         <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-8 flex items-center border border-red-200">
            <AlertCircle className="w-6 h-6 mr-2" />
            <span>{error}</span>
         </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden" ref={formRef}>
        <div className="bg-slate-950 p-10 text-white relative overflow-hidden">
          {/* Visual Clarity Fix: Removed background blurs that cause visibility issues */}
          <div className="relative z-10">
            <h2 className="text-4xl font-black flex items-center gap-3 uppercase tracking-tighter">
               <Sparkles className="text-blue-400" /> {isNew ? 'Initialize New Masterpiece' : 'Refine Vault Entry'}
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Technical Specification Node • Authorized Access Only</p>
          </div>
        </div>

        <form onSubmit={submitHandler} className="p-8 md:p-12 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Basic Info */}
            <div className="space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B0000] border-b border-[#111]/5 pb-4 flex items-center">
                 General Information
              </h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Product Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-5 bg-[#F7F5F0] border-none rounded-2xl focus:ring-2 focus:ring-[#8B0000] outline-none transition-all font-bold text-[#111]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider ml-1">Brand</label>
                    <input
                      type="text"
                      required
                      className="w-full px-5 py-4 bg-white border border-slate-300 rounded-xl focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all font-bold text-[#111]"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider ml-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 1499"
                      className="w-full px-5 py-4 bg-white border border-slate-300 rounded-xl focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all font-bold text-[#111]"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Category</label>
                    <select
                      className="w-full px-6 py-5 bg-[#F7F5F0] border-none rounded-2xl focus:ring-2 focus:ring-[#8B0000] outline-none transition-all font-bold text-[#111] appearance-none"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Formal">Formal</option>
                      <option value="Sneakers">Sneakers</option>
                      <option value="Casual">Casual</option>
                      <option value="Sports">Sports</option>
                      <option value="Boots">Boots</option>
                      <option value="Sandals">Sandals</option>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Target Gender</label>
                    <select
                      className="w-full px-6 py-5 bg-[#F7F5F0] border-none rounded-2xl focus:ring-2 focus:ring-[#8B0000] outline-none transition-all font-bold text-[#111] appearance-none"
                      value={targetGender}
                      onChange={(e) => setTargetGender(e.target.value)}
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Stock</label>
                    <input
                      type="number"
                      required
                      className="w-full px-6 py-5 bg-[#F7F5F0] border-none rounded-2xl focus:ring-2 focus:ring-[#8B0000] outline-none transition-all font-bold text-[#111]"
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Initial Rating (0-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      className="w-full px-6 py-5 bg-[#F7F5F0] border-none rounded-2xl focus:ring-2 focus:ring-[#8B0000] outline-none transition-all font-bold text-[#111]"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Description</label>
                  <textarea
                    rows="5"
                    required
                    className="w-full px-6 py-5 bg-[#F7F5F0] border-none rounded-2xl focus:ring-2 focus:ring-[#8B0000] outline-none transition-all font-bold text-[#111] resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Right Column: Images & Sizes */}
            <div className="space-y-8">
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 border-b border-[#111]/5 pb-4 flex items-center">
                 Media & Options
               </h3>

               <div className="space-y-4">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Product Images (Exactly 4 Required)</label>

                  {/* URL Input Fallback for Vercel/Cloud Stability */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="Paste Image URL here..."
                      className="flex-1 px-4 py-2 bg-[#F7F5F0] rounded-xl text-[10px] font-bold outline-none border border-slate-200 focus:border-[#8B0000]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (e.target.value && images.length < 4) {
                            setImages([...images, e.target.value]);
                            e.target.value = '';
                          } else if (images.length >= 4) {
                            alert("Already have 4 images.");
                          }
                        }
                      }}
                    />
                    <p className="text-[8px] font-bold text-slate-400 uppercase self-center italic">Press Enter to add Link</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-[#111]/5 bg-[#F7F5F0]">
                           <img src={resolveImageUrl(img)} alt="" className="w-full h-full object-cover" />
                           <button
                             type="button"
                             onClick={() => setImages(images.filter((_, i) => i !== idx))}
                             className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 shadow-lg"
                           >
                             <ArrowLeft className="w-3 h-3 rotate-45" />
                           </button>
                        </div>
                     ))}
                     {images.length < 4 && (
                       <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#8B0000] hover:bg-slate-50 transition-all group">
                          {uploading ? <Loader2 className="w-6 h-6 animate-spin text-[#8B0000]" /> : <PlusCircle className="w-6 h-6 text-slate-300 group-hover:text-[#8B0000]" />}
                          <span className="text-[8px] font-black text-slate-400 mt-2 uppercase tracking-widest">UPLOAD</span>
                          <input
                            type="file"
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={uploadFileHandler}
                          />
                       </label>
                     )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Uploaded {images.length} photo(s). (At least 1 required)
                    </p>
                  </div>
               </div>

               <div className="space-y-4 pt-6 border-t border-slate-100">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Premium 3D Model (.glb)</label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="3D Model URL (e.g. /uploads/model.glb)"
                      className="flex-1 px-6 py-4 bg-[#F7F5F0] border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-[#111] text-[10px]"
                      value={model3D}
                      onChange={(e) => setModel3D(e.target.value)}
                    />
                    <label className="px-6 py-4 bg-blue-600 text-white rounded-2xl cursor-pointer hover:bg-blue-700 transition-all flex items-center gap-2 text-[10px] font-black uppercase">
                      {uploadingModel ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload size={16} />}
                      <span>{model3D ? 'Change' : 'Upload'}</span>
                      <input type="file" className="hidden" accept=".glb,.gltf" onChange={uploadModelHandler} />
                    </label>
                  </div>
                  {model3D && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-[9px] font-black uppercase tracking-widest">
                      <CheckCircle size={12} /> Model Synced: {model3D.split('/').pop()}
                    </div>
                  )}
               </div>

               <div className="space-y-4">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Available Sizes (UK/India)</label>
                  <div className="flex flex-wrap gap-3">
                    {[5, 6, 7, 8, 9, 10, 11, 12].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                           if (sizes.includes(s)) setSizes(sizes.filter(x => x !== s));
                           else setSizes([...sizes, s].sort((a,b) => a-b));
                        }}
                        className={`w-14 h-14 rounded-xl border-2 font-black transition-all text-[11px]
                          ${sizes.includes(s) ? 'bg-[#111] border-[#111] text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-[#8B0000]'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
               </div>

               {/* ERGONOMIC & TECH FIELDS */}
               <div className="space-y-6 pt-6 border-t border-slate-100">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 flex items-center gap-2">
                     <Sparkles size={12} /> Frido Ergonomic Specs
                  </h3>

                  <div className="space-y-4">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Technology (Comma separated)</label>
                    <input
                      type="text"
                      className="w-full px-6 py-4 bg-[#F7F5F0] border-none rounded-2xl focus:ring-2 focus:ring-emerald-600 outline-none transition-all font-bold text-[#111] text-[10px]"
                      value={technology.join(', ')}
                      onChange={(e) => setTechnology(e.target.value.split(',').map(s => s.trim()))}
                      placeholder="e.g. Arch-Support Matrix, Dual-Density Foam"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Medical Concerns (Comma separated)</label>
                    <input
                      type="text"
                      className="w-full px-6 py-4 bg-[#F7F5F0] border-none rounded-2xl focus:ring-2 focus:ring-emerald-600 outline-none transition-all font-bold text-[#111] text-[10px]"
                      value={concerns.join(', ')}
                      onChange={(e) => setConcerns(e.target.value.split(',').map(s => s.trim()))}
                      placeholder="e.g. Heel Comfort, Flat Feet"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Target Professions (Comma separated)</label>
                    <input
                      type="text"
                      className="w-full px-6 py-4 bg-[#F7F5F0] border-none rounded-2xl focus:ring-2 focus:ring-emerald-600 outline-none transition-all font-bold text-[#111] text-[10px]"
                      value={professions.join(', ')}
                      onChange={(e) => setProfessions(e.target.value.split(',').map(s => s.trim()))}
                      placeholder="e.g. Healthcare, Corporate"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Primary Purpose (Comma separated)</label>
                    <input
                      type="text"
                      className="w-full px-6 py-4 bg-[#F7F5F0] border-none rounded-2xl focus:ring-2 focus:ring-emerald-600 outline-none transition-all font-bold text-[#111] text-[10px]"
                      value={purpose.join(', ')}
                      onChange={(e) => setPurpose(e.target.value.split(',').map(s => s.trim()))}
                      placeholder="e.g. Daily Wear, Office, Running"
                    />
                  </div>
               </div>
            </div>
          </div>

          <div className="pt-12 border-t border-[#111]/5">
             <button
               type="submit"
               disabled={loading}
               className="w-full bg-[#111] text-white py-6 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all hover:bg-[#8B0000] shadow-2xl flex items-center justify-center gap-4 group"
             >
               {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-5 h-5" />}
               {isNew ? 'Authorize New Product Entry' : 'Commit Matrix Updates'}
             </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
};

export default AdminProductEdit;
