package com.krishna.nsm.ui.gallery;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.krishna.nsm.R;
import com.krishna.nsm.databinding.FragmentGalleryBinding;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class GalleryFragment extends Fragment {

    private FragmentGalleryBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentGalleryBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        setupGallery();

        // Animate title and subtitle
        binding.galleryTitle.setAlpha(0f);
        binding.galleryTitle.setTranslationY(-30f);
        binding.galleryTitle.animate()
                .alpha(1f)
                .translationY(0f)
                .setDuration(800)
                .setInterpolator(new android.view.animation.DecelerateInterpolator())
                .start();

        return root;
    }

    private void setupGallery() {
        List<String> images = new ArrayList<>();
        // Important assets
        images.add("Front-Banner.jpg");
        images.add("Samadhan-Truck.jpg");
        images.add("Satkar 1.jpg");
        images.add("Satkar 2.jpg");
        images.add("Satkar 3.jpg");
        images.add("Satkar 4.jpg");
        images.add("Satkar-5.jpg");
        images.add("Satkar-6.jpg");
        images.add("Family 1.jpg");
        images.add("Family 2.jpg");
        images.add("Family 3.jpg");
        images.add("Family 4.jpg");
        images.add("Family 5.jpg");
        images.add("Family 6.jpg");
        images.add("Police Family 1.jpg");
        images.add("Main-Shoe.png");
        
        // Product highlights - Sampling from the large pool
        images.add("IMG-20260928-WA0006.jpg");
        images.add("IMG-20260928-WA0010.jpg");
        images.add("IMG-20260928-WA0018.jpg");
        images.add("IMG-20260928-WA0030.jpg");
        images.add("IMG-20260928-WA0040.jpg");
        images.add("IMG-20260928-WA0050.jpg");
        images.add("IMG-20260928-WA0070.jpg");
        images.add("IMG-20260928-WA0100.jpg");
        images.add("IMG-20260928-WA0120.jpg");
        images.add("IMG-20260928-WA0150.jpg");
        images.add("IMG-20260928-WA0180.jpg");
        images.add("IMG-20260928-WA0200.jpg");
        images.add("IMG-20260928-WA0230.jpg");
        images.add("IMG-20260928-WA0250.jpg");
        images.add("IMG-20260928-WA0270.jpg");
        images.add("IMG-20260928-WA0300.jpg");
        images.add("IMG-20260928-WA0320.jpg");
        images.add("IMG-20260928-WA0350.jpg");
        images.add("IMG-20260928-WA0353.jpg");

        androidx.recyclerview.widget.StaggeredGridLayoutManager layoutManager = 
                new androidx.recyclerview.widget.StaggeredGridLayoutManager(2, androidx.recyclerview.widget.StaggeredGridLayoutManager.VERTICAL);
        binding.galleryRecycler.setLayoutManager(layoutManager);
        binding.galleryRecycler.setAdapter(new GalleryAdapter(images));
    }

    private static class GalleryAdapter extends RecyclerView.Adapter<GalleryAdapter.ViewHolder> {
        private final List<String> images;

        public GalleryAdapter(List<String> images) {
            this.images = images;
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_gallery, parent, false);
            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            String imageName = images.get(position);
            
            // GSAP-style entry animation
            holder.itemView.setAlpha(0f);
            holder.itemView.setTranslationY(100f);
            holder.itemView.animate()
                    .alpha(1f)
                    .translationY(0f)
                    .setDuration(800)
                    .setStartDelay(100L + (position % 4) * 100L)
                    .setInterpolator(new android.view.animation.OvershootInterpolator(1.2f))
                    .start();

            try {
                InputStream is = holder.imageView.getContext().getAssets().open(imageName);
                Bitmap bitmap = BitmapFactory.decodeStream(is);
                holder.imageView.setImageBitmap(bitmap);
            } catch (IOException e) {
                holder.imageView.setImageResource(R.drawable.ic_launcher_background);
            }
        }

        @Override
        public int getItemCount() {
            return images.size();
        }

        static class ViewHolder extends RecyclerView.ViewHolder {
            ImageView imageView;
            public ViewHolder(@NonNull View itemView) {
                super(itemView);
                imageView = itemView.findViewById(R.id.gallery_image);
            }
        }
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
