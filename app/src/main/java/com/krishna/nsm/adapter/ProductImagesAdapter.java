package com.krishna.nsm.adapter;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.krishna.nsm.R;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class ProductImagesAdapter extends RecyclerView.Adapter<ProductImagesAdapter.ImageViewHolder> {

    private final Context context;
    private final List<String> images;

    public ProductImagesAdapter(Context context, List<String> images) {
        this.context = context;
        this.images = images;
    }

    @NonNull
    @Override
    public ImageViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_product_image, parent, false);
        return new ImageViewHolder(view);
    }

    private static final java.util.Map<String, Bitmap> BITMAP_CACHE = new java.util.HashMap<>();

    @Override
    public void onBindViewHolder(@NonNull ImageViewHolder holder, int position) {
        String imageName = images.get(position);
        if (imageName == null || imageName.trim().isEmpty()) {
            holder.imageView.setImageResource(R.drawable.ic_launcher_background);
            return;
        }

        imageName = imageName.trim();

        // Check Cache
        if (BITMAP_CACHE.containsKey(imageName)) {
            holder.imageView.setImageBitmap(BITMAP_CACHE.get(imageName));
            return;
        }

        try {
            InputStream is;
            try {
                is = context.getAssets().open(imageName);
            } catch (IOException e) {
                // Try with products/ prefix as fallback
                is = context.getAssets().open("products/" + imageName);
            }

            Bitmap bitmap = BitmapFactory.decodeStream(is);
            if (bitmap != null) {
                BITMAP_CACHE.put(imageName, bitmap);
                holder.imageView.setImageBitmap(bitmap);
            } else {
                holder.imageView.setImageResource(R.drawable.ic_launcher_background);
            }
            is.close();
        } catch (IOException e) {
            holder.imageView.setImageResource(R.drawable.ic_launcher_background);
        }
    }

    @Override
    public int getItemCount() {
        return images != null ? images.size() : 0;
    }

    static class ImageViewHolder extends RecyclerView.ViewHolder {
        ImageView imageView;

        public ImageViewHolder(@NonNull View itemView) {
            super(itemView);
            imageView = itemView.findViewById(R.id.product_image_item);
        }
    }
}
