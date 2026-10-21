package com.krishna.nsm.data.local.dao;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import com.krishna.nsm.data.local.entity.WishlistItem;

import java.util.List;

@Dao
public interface WishlistDao {
    @Query("SELECT * FROM wishlist ORDER BY addedTimestamp DESC")
    LiveData<List<WishlistItem>> getAllWishlistItems();

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void addToWishlist(WishlistItem item);

    @Delete
    void removeFromWishlist(WishlistItem item);

    @Query("DELETE FROM wishlist WHERE id = :productId")
    void removeFromWishlistById(String productId);

    @Query("SELECT EXISTS(SELECT 1 FROM wishlist WHERE id = :productId)")
    boolean isInWishlist(String productId);

    @Query("SELECT EXISTS(SELECT 1 FROM wishlist WHERE id = :productId)")
    LiveData<Boolean> isInWishlistLiveData(String productId);
}
