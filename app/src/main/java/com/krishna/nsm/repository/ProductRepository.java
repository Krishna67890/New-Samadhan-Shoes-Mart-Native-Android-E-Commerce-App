package com.krishna.nsm.repository;

import android.content.Context;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;
import com.krishna.nsm.data.local.dao.WishlistDao;
import com.krishna.nsm.data.local.database.AppDatabase;
import com.krishna.nsm.data.local.entity.WishlistItem;
import com.krishna.nsm.model.Product;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MediatorLiveData;
import androidx.lifecycle.Transformations;

public class ProductRepository {

    private static final String FILE_NAME = "products.json";
    private static final String CATALOG_VERSION_FILE = "products_catalog_version";
    private static final int CATALOG_VERSION = 6;

    private static volatile ProductRepository INSTANCE;
    private final Context context;
    private final Gson gson = new Gson();
    private final Type listType =
            new TypeToken<List<Product>>() {}.getType();

    private List<Product> products = Collections.synchronizedList(new ArrayList<>());
    private final WishlistDao wishlistDao;

    public interface OnProductsLoadedListener {
        void onProductsLoaded(List<Product> products);
    }

    public static ProductRepository getInstance(Context context) {
        if (INSTANCE == null) {
            synchronized (ProductRepository.class) {
                if (INSTANCE == null) {
                    INSTANCE = new ProductRepository(context);
                }
            }
        }
        return INSTANCE;
    }

    public boolean isLoaded() {
        return products != null && !products.isEmpty();
    }

    public void addOnProductsLoadedListener(OnProductsLoadedListener listener) {
        if (listener != null) {
            listener.onProductsLoaded(getAllProducts());
        }
    }

    public ProductRepository(Context context) {
        this.context = context.getApplicationContext();
        WishlistDao dao = null;
        try {
            dao = AppDatabase.getDatabase(this.context).wishlistDao();
        } catch (Throwable t) {
            t.printStackTrace();
        }
        this.wishlistDao = dao;
        
        List<Product> loaded = loadProducts();
        if (loaded != null && !loaded.isEmpty()) {
            this.products.clear();
            this.products.addAll(loaded);
        }
    }

    public synchronized void refreshProductsFromAssets() {
        List<Product> loaded = loadProductsFromAssets();
        if (loaded != null && !loaded.isEmpty()) {
            if (products == null) products = Collections.synchronizedList(new ArrayList<>());
            products.clear();
            products.addAll(loaded);
            saveAll();
        }
    }

    private synchronized List<Product> loadProducts() {
        try {
            File file = new File(context.getFilesDir(), FILE_NAME);
            int savedVersion = getSavedCatalogVersion();

            if (!file.exists() || savedVersion < CATALOG_VERSION) {
                List<Product> bundledProducts = loadProductsFromAssets();

                if (!bundledProducts.isEmpty()) {
                    products = bundledProducts;
                    saveAll();
                    saveCatalogVersion(CATALOG_VERSION);
                    return new ArrayList<>(bundledProducts);
                }
            }

            if (file.exists()) {
                try (FileInputStream input = context.openFileInput(FILE_NAME)) {
                    String json = readStream(input);
                    List<Product> loaded = parseProducts(json);

                    if (loaded != null && !loaded.isEmpty()) {
                        return loaded;
                    }
                } catch (IOException | JsonSyntaxException e) {
                    e.printStackTrace();
                }
            }
        } catch (Throwable t) {
            t.printStackTrace();
        }

        return loadProductsFromAssets();
    }

    private List<Product> loadProductsFromAssets() {
        try (InputStream input = context.getAssets().open(FILE_NAME)) {
            String json = readStream(input);
            List<Product> loaded = parseProducts(json);
            return loaded != null ? loaded : new ArrayList<>();
        } catch (Throwable e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private List<Product> parseProducts(String json) {
        if (json == null || json.trim().isEmpty()) {
            return new ArrayList<>();
        }

        try {
            List<Product> loaded = gson.fromJson(json, listType);
            if (loaded != null) {
                List<String> defaultSizes = java.util.Arrays.asList("5", "6", "7", "8", "9", "10", "11", "12");
                int imgIndex = 6;
                for (Product p : loaded) {
                    if (p != null) {
                        p.setSizes(defaultSizes);
                        
                        // Ensure 4 consecutive photos of the exact same shoe model & color
                        List<String> consistentImages = new ArrayList<>();
                        for (int k = 0; k < 4; k++) {
                            int fileNum = 6 + ((imgIndex + k - 6) % 180);
                            consistentImages.add(String.format(java.util.Locale.US, "IMG-20260928-WA%04d.jpg", fileNum));
                        }
                        p.setImages(consistentImages);
                        imgIndex += 4;
                    }
                }
            }
            return loaded != null ? loaded : new ArrayList<>();
        } catch (Throwable t) {
            t.printStackTrace();
            return new ArrayList<>();
        }
    }

    private String readStream(InputStream input) throws IOException {
        StringBuilder result = new StringBuilder();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(input, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                result.append(line).append('\n');
            }
        }

        return result.toString();
    }

    private int getSavedCatalogVersion() {
        try {
            return context.getSharedPreferences(
                    "product_repository", Context.MODE_PRIVATE
            ).getInt(CATALOG_VERSION_FILE, 0);
        } catch (Throwable t) {
            return 0;
        }
    }

    private void saveCatalogVersion(int version) {
        try {
            context.getSharedPreferences(
                    "product_repository", Context.MODE_PRIVATE
            ).edit().putInt(CATALOG_VERSION_FILE, version).apply();
        } catch (Throwable ignored) {}
    }

    private synchronized void saveAll() {
        if (products == null) {
            products = Collections.synchronizedList(new ArrayList<>());
        }

        try {
            String json = gson.toJson(products, listType);

            try (FileOutputStream output =
                         context.openFileOutput(FILE_NAME, Context.MODE_PRIVATE)) {
                output.write(json.getBytes(StandardCharsets.UTF_8));
                output.flush();
            }
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }

    public synchronized void addProduct(Product product) {
        if (product == null || product.getId() == null) {
            return;
        }
        if (products == null) products = Collections.synchronizedList(new ArrayList<>());

        if (getProductById(product.getId()) != null) {
            return;
        }

        products.add(product);
        saveAll();
    }

    public synchronized void updateProduct(Product product) {
        if (product == null || product.getId() == null || products == null) {
            return;
        }

        for (int i = 0; i < products.size(); i++) {
            Product existing = products.get(i);

            if (existing != null
                    && product.getId().equals(existing.getId())) {
                products.set(i, product);
                saveAll();
                return;
            }
        }
    }

    public synchronized void deleteProduct(String id) {
        if (id == null || products == null) {
            return;
        }

        products.removeIf(product ->
                product != null && id.equals(product.getId()));

        saveAll();
    }

    public synchronized List<Product> getAllProducts() {
        if (products == null || products.isEmpty()) {
            List<Product> loaded = loadProducts();
            if (loaded != null && !loaded.isEmpty()) {
                if (products == null) products = Collections.synchronizedList(new ArrayList<>());
                products.clear();
                products.addAll(loaded);
            }
        }
        return new ArrayList<>(products != null ? products : new ArrayList<>());
    }

    public synchronized List<Product> getFilteredProducts(
            String category,
            String collection,
            String concern,
            String profession,
            String purpose) {

        List<Product> filtered = new ArrayList<>();
        if (products == null) return filtered;

        for (Product product : new ArrayList<>(products)) {
            if (product == null) {
                continue;
            }

            boolean categoryMatch =
                    matchesCategory(product, category);

            boolean collectionMatch =
                    isAll(collection)
                            || containsIgnoreCase(
                            product.getCollection(), collection);

            boolean concernMatch =
                    isAll(concern)
                            || containsAny(product.getConcerns(), concern);

            boolean professionMatch =
                    matchesProfession(product, profession);

            boolean purposeMatch =
                    isAll(purpose)
                            || containsIgnoreCase(
                            product.getPurpose(), purpose);

            if (categoryMatch && collectionMatch
                    && concernMatch && professionMatch && purposeMatch) {
                filtered.add(product);
            }
        }

        return filtered;
    }

    private boolean matchesCategory(Product product, String category) {
        if (isAll(category)) {
            return true;
        }

        return equalsIgnoreCase(product.getCategory(), category);
    }

    private boolean equalsIgnoreCase(String value, String query) {
        return value != null
                && query != null
                && value.trim().equalsIgnoreCase(query.trim());
    }

    private boolean matchesProfession(Product product, String profession) {
        if (isAll(profession)) {
            return true;
        }

        String value = product.getProfessions();

        if (value == null || value.trim().isEmpty()) {
            return false;
        }

        String[] entries = value.split(",");

        for (String entry : entries) {
            if (entry.trim().equalsIgnoreCase(profession.trim())) {
                return true;
            }
        }

        return false;
    }

    private boolean containsAny(List<String> values, String query) {
        if (values == null || query == null) {
            return false;
        }

        String trimmedQuery = query.trim();
        for (String value : values) {
            if (value != null && value.trim().equalsIgnoreCase(trimmedQuery)) {
                return true;
            }
        }

        return false;
    }

    private boolean containsIgnoreCase(String value, String query) {
        if (value == null || query == null) return false;
        return value.toLowerCase(Locale.ROOT)
                .contains(query.trim().toLowerCase(Locale.ROOT));
    }

    private boolean isAll(String value) {
        return value == null
                || value.trim().isEmpty()
                || "All".equalsIgnoreCase(value.trim());
    }

    public synchronized List<Product> getProductsByCategory(String category) {
        return getFilteredProducts(category, "All", "All", "All", "All");
    }

    public synchronized List<Product> searchProducts(String query) {
        List<Product> results = new ArrayList<>();

        if (query == null || query.trim().isEmpty()) {
            return getAllProducts();
        }

        String search = query.trim().toLowerCase(Locale.ROOT);
        if (products == null) return results;

        for (Product product : new ArrayList<>(products)) {
            if (product == null) {
                continue;
            }

            if (containsIgnoreCase(product.getName(), search)
                    || containsIgnoreCase(product.getCategory(), search)
                    || containsIgnoreCase(product.getCollection(), search)
                    || containsIgnoreCase(product.getDescription(), search)) {
                results.add(product);
            }
        }

        return results;
    }

    public synchronized Product getProductById(String id) {
        if (id == null || products == null) {
            return null;
        }

        for (Product product : new ArrayList<>(products)) {
            if (product != null && id.equals(product.getId())) {
                return product;
            }
        }

        return null;
    }

    public LiveData<List<Product>> getWatchlistProducts() {
        if (wishlistDao == null) {
            return new MediatorLiveData<>();
        }
        return Transformations.map(wishlistDao.getAllWishlistItems(), items -> {
            List<Product> productsList = new ArrayList<>();
            if (items != null) {
                for (WishlistItem item : items) {
                    if (item != null) {
                        Product p = getProductById(item.getId());
                        if (p != null) {
                            p.setInWatchlist(true);
                            productsList.add(p);
                        }
                    }
                }
            }
            return productsList;
        });
    }

    public void toggleWatchlist(String productId) {
        Product product = getProductById(productId);
        if (product != null && wishlistDao != null) {
            AppDatabase.databaseWriteExecutor.execute(() -> {
                try {
                    if (wishlistDao.isInWishlist(productId)) {
                        wishlistDao.removeFromWishlistById(productId);
                    } else {
                        WishlistItem item = new WishlistItem(
                                product.getId(),
                                product.getName(),
                                product.getPrice(),
                                product.getImages() != null && !product.getImages().isEmpty() ? product.getImages().get(0) : "",
                                System.currentTimeMillis()
                        );
                        wishlistDao.addToWishlist(item);
                    }
                } catch (Throwable t) {
                    t.printStackTrace();
                }
            });
        }
    }

    public LiveData<Boolean> isInWatchlist(String productId) {
        if (wishlistDao == null) {
            return new MediatorLiveData<>();
        }
        return wishlistDao.isInWishlistLiveData(productId);
    }

    public synchronized int getProductCount() {
        return products != null ? products.size() : 0;
    }

    public synchronized boolean isEmpty() {
        return products == null || products.isEmpty();
    }

    public synchronized Set<String> getAvailableCategories() {
        Set<String> categories = new HashSet<>();
        if (products == null) return categories;

        for (Product product : new ArrayList<>(products)) {
            if (product != null
                    && product.getCategory() != null
                    && !product.getCategory().trim().isEmpty()) {
                categories.add(product.getCategory().trim());
            }
        }

        return categories;
    }
}