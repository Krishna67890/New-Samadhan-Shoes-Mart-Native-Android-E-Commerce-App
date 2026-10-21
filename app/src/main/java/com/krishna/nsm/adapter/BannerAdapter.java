package com.krishna.nsm.adapter;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Handler;
import android.os.Looper;
import android.util.LruCache;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.krishna.nsm.R;
import java.io.InputStream;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class BannerAdapter extends RecyclerView.Adapter<BannerAdapter.BannerViewHolder> {

    private final List<String> bannerPaths;
    private final OnBannerClickListener listener;
    private final LruCache<String, Bitmap> memoryCache;
    private final ExecutorService executorService = Executors.newFixedThreadPool(2);
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    public interface OnBannerClickListener {
        void onBannerClick();
    }

    public BannerAdapter(List<String> bannerPaths, OnBannerClickListener listener) {
        this.bannerPaths = bannerPaths;
        this.listener = listener;

        final int maxMemory = (int) (Runtime.getRuntime().maxMemory() / 1024);
        final int cacheSize = Math.max(1024, maxMemory / 8);
        this.memoryCache = new LruCache<String, Bitmap>(cacheSize) {
            @Override
            protected int sizeOf(String key, Bitmap bitmap) {
                return bitmap.getByteCount() / 1024;
            }
        };
    }

    @NonNull
    @Override
    public BannerViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_banner, parent, false);
        return new BannerViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull BannerViewHolder holder, int position) {
        if (position < 0 || position >= bannerPaths.size()) return;
        String assetPath = bannerPaths.get(position);
        holder.imageView.setTag(assetPath);
        
        Bitmap cachedBitmap = memoryCache.get(assetPath);
        if (cachedBitmap != null) {
            holder.imageView.setImageBitmap(cachedBitmap);
        } else {
            holder.imageView.setImageResource(R.drawable.front_banner);
            executorService.execute(() -> {
                try (InputStream is = holder.itemView.getContext().getAssets().open(assetPath)) {
                    BitmapFactory.Options options = new BitmapFactory.Options();
                    options.inSampleSize = 2; // Memory optimization: 4x reduction in RAM
                    
                    Bitmap bitmap = BitmapFactory.decodeStream(is, null, options);
                    if (bitmap != null) {
                        memoryCache.put(assetPath, bitmap);
                        mainHandler.post(() -> {
                            if (holder.imageView.getTag() != null && holder.imageView.getTag().equals(assetPath)) {
                                holder.imageView.setImageBitmap(bitmap);
                            }
                        });
                    }
                } catch (Throwable t) {
                    t.printStackTrace();
                }
            });
        }
        
        View btnShopNow = holder.itemView.findViewById(R.id.btn_shop_now);
        if (btnShopNow != null) {
            btnShopNow.setOnClickListener(v -> {
                if (listener != null) listener.onBannerClick();
            });
        }
    }

    @Override
    public int getItemCount() {
        return bannerPaths != null ? bannerPaths.size() : 0;
    }

    static class BannerViewHolder extends RecyclerView.ViewHolder {
        ImageView imageView;

        public BannerViewHolder(@NonNull View itemView) {
            super(itemView);
            imageView = itemView.findViewById(R.id.banner_image);
        }
    }
}