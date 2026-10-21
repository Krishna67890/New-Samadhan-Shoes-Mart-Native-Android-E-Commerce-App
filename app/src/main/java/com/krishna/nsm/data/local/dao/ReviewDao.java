package com.krishna.nsm.data.local.dao;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import com.krishna.nsm.data.local.entity.ReviewEntity;

import java.util.List;

@Dao
public interface ReviewDao {
    @Query("SELECT * FROM reviews WHERE productId = :productId ORDER BY date DESC")
    LiveData<List<ReviewEntity>> getReviewsForProduct(String productId);

    @Query("SELECT * FROM reviews ORDER BY date DESC")
    LiveData<List<ReviewEntity>> getAllReviews();

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertReview(ReviewEntity review);

    @Query("SELECT COUNT(*) FROM reviews WHERE productId = :productId")
    int getReviewCount(String productId);

    @Query("SELECT AVG(rating) FROM reviews WHERE productId = :productId")
    float getAverageRating(String productId);
}
