package com.krishna.nsm.ui.wishlist;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import com.krishna.nsm.model.Product;
import com.krishna.nsm.repository.ProductRepository;
import java.util.List;

public class WishlistViewModel extends AndroidViewModel {
    private final ProductRepository repository;
    private final LiveData<List<Product>> watchlistProducts;

    public WishlistViewModel(@NonNull Application application) {
        super(application);
        repository = new ProductRepository(application);
        watchlistProducts = repository.getWatchlistProducts();
    }

    public LiveData<List<Product>> getWatchlistProducts() {
        return watchlistProducts;
    }

    public void toggleWatchlist(String productId) {
        repository.toggleWatchlist(productId);
    }
}
