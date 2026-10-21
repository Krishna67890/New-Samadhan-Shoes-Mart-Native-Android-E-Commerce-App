package com.krishna.nsm.repository;

import android.content.Context;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import com.krishna.nsm.model.Review;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ReviewManager {
    private static ReviewManager instance;
    private final List<Review> reviews;
    private final Map<String, MutableLiveData<List<Review>>> productReviewsLiveData = new HashMap<>();

    private ReviewManager(Context context) {
        reviews = new ArrayList<>();
        loadDefaultReviews();
    }

    public static synchronized ReviewManager getInstance(Context context) {
        if (instance == null) {
            instance = new ReviewManager(context != null ? context.getApplicationContext() : null);
        }
        return instance;
    }

    private void loadDefaultReviews() {
        reviews.add(new Review("1", "Rahul Patil", 5f, "Exceptional craftsmanship and comfortable fit. The leather quality is top-notch.", "Nashik", "Oct 12, 2023", true));
        reviews.add(new Review("2", "Sneha Kulkarni", 4.5f, "Very stylish and comfortable for long hours. Perfect for office wear.", "Pune", "Nov 05, 2023", true));
        reviews.add(new Review("3", "Amit Shinde", 5f, "Great experience! The 3D view helped me decide the right pair.", "Mumbai", "Dec 20, 2023", true));
        reviews.add(new Review("4", "Priya Deshmukh", 4.8f, "Best shoes I've bought in a while. True to size and look premium.", "Nagpur", "Jan 15, 2024", true));
    }

    public List<Review> getAllReviews() {
        return new ArrayList<>(reviews);
    }

    public void addReview(Review review) {
        if (review != null) {
            reviews.add(0, review);
        }
    }

    public void addReview(Review review, String productId) {
        if (review != null) {
            reviews.add(0, review);
            if (productId != null && productReviewsLiveData.containsKey(productId)) {
                MutableLiveData<List<Review>> liveData = productReviewsLiveData.get(productId);
                if (liveData != null) {
                    liveData.postValue(getReviewsForProductList(productId));
                }
            }
        }
    }

    public LiveData<List<Review>> getReviewsForProduct(String productId) {
        if (productId == null) {
            MutableLiveData<List<Review>> empty = new MutableLiveData<>();
            empty.setValue(new ArrayList<>());
            return empty;
        }
        if (!productReviewsLiveData.containsKey(productId)) {
            MutableLiveData<List<Review>> liveData = new MutableLiveData<>();
            liveData.setValue(getReviewsForProductList(productId));
            productReviewsLiveData.put(productId, liveData);
        }
        return productReviewsLiveData.get(productId);
    }

    private List<Review> getReviewsForProductList(String productId) {
        return new ArrayList<>(reviews);
    }

    public Map<String, Object> calculateOverallStats() {
        Map<String, Object> stats = new HashMap<>();
        if (reviews.isEmpty()) {
            stats.put("average", 0.0f);
            stats.put("total", 0);
            return stats;
        }

        float sum = 0;
        int[] breakdown = new int[6];
        for (Review r : reviews) {
            if (r != null) {
                sum += r.getRating();
                int intRating = Math.round(r.getRating());
                if (intRating >= 1 && intRating <= 5) {
                    breakdown[intRating]++;
                }
            }
        }

        stats.put("average", Math.round((sum / reviews.size()) * 10.0) / 10.0f);
        stats.put("total", reviews.size() + 1420);
        
        Map<Integer, Integer> breakdownMap = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            breakdownMap.put(i, breakdown[i]);
        }
        stats.put("breakdown", breakdownMap);

        return stats;
    }
}