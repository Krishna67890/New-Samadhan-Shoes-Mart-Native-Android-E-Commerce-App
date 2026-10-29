package com.krishna.nsm.model;

import java.io.Serializable;
import java.util.List;

public class Product implements Serializable {
    private String id;
    private String name;
    private double price;
    private double oldPrice;
    private String category;
    private String collection;
    private List<String> images;
    private List<String> sizes;
    private List<String> concerns;
    private String professions;
    private String purpose;
    private String brand;
    private double rating;
    private int reviewCount;
    private String description;
    private boolean isNew;
    private boolean isInWatchlist;

    public Product() {}

    public static double getPriceForSize(String sizeStr) {
        if (sizeStr == null) return 1299.0;
        try {
            int size = Integer.parseInt(sizeStr.trim());
            if (size >= 5 && size <= 10) return 1299.0;
            if (size == 11 || size == 12) return 1450.0;
        } catch (Exception ignored) {}
        return 1299.0;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public double getOldPrice() { return oldPrice; }
    public void setOldPrice(double oldPrice) { this.oldPrice = oldPrice; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCollection() { return collection; }
    public void setCollection(String collection) { this.collection = collection; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public List<String> getSizes() { return sizes; }
    public void setSizes(List<String> sizes) { this.sizes = sizes; }

    public List<String> getConcerns() { return concerns; }
    public void setConcerns(List<String> concerns) { this.concerns = concerns; }

    public String getProfessions() { return professions; }
    public void setProfessions(String professions) { this.professions = professions; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public int getReviewCount() { return reviewCount; }
    public void setReviewCount(int reviewCount) { this.reviewCount = reviewCount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isNew() { return isNew; }
    public void setNew(boolean aNew) { isNew = aNew; }

    public boolean isInWatchlist() { return isInWatchlist; }
    public void setInWatchlist(boolean inWatchlist) { isInWatchlist = inWatchlist; }
}
