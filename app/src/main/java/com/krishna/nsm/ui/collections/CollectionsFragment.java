package com.krishna.nsm.ui.collections;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;
import com.krishna.nsm.R;
import com.krishna.nsm.databinding.FragmentCollectionsBinding;

public class CollectionsFragment extends Fragment {

    private FragmentCollectionsBinding binding;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentCollectionsBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Header animation
        binding.collectionsHeader.setAlpha(0f);
        binding.collectionsHeader.setTranslationY(-50f);
        binding.collectionsHeader.animate()
                .alpha(1f)
                .translationY(0f)
                .setDuration(800)
                .setInterpolator(new android.view.animation.DecelerateInterpolator())
                .start();

        // Entry animations for collection cards
        animateCard(binding.cardMen, 0);
        animateCard(binding.cardWomen, 1);
        animateCard(binding.cardSneakers, 2);
        animateCard(binding.cardFormal, 3);
        animateCard(binding.cardWomenSneakers, 4);
        animateCard(binding.cardFormalKids, 5);
        animateCard(binding.cardPublicKids, 6);
        animateCard(binding.cardKids, 7);

        binding.cardMen.setOnClickListener(v -> navigateToCategory("Men"));
        binding.cardWomen.setOnClickListener(v -> navigateToCategory("Women"));
        binding.cardSneakers.setOnClickListener(v -> navigateToCategory("Sneakers"));
        binding.cardFormal.setOnClickListener(v -> navigateToCategory("Formal"));
        binding.cardKids.setOnClickListener(v -> navigateToCategory("Kids"));
        binding.cardWomenSneakers.setOnClickListener(v -> navigateToCategory("Women Sneakers"));
        binding.cardFormalKids.setOnClickListener(v -> navigateToCategory("Formal Kids"));
        binding.cardPublicKids.setOnClickListener(v -> navigateToCategory("Public Kids"));
    }

    private void animateCard(View view, int index) {
        if (view == null) return;
        view.setAlpha(0f);
        view.setTranslationX(-100f);
        view.animate()
                .alpha(1f)
                .translationX(0f)
                .setDuration(600)
                .setStartDelay(index * 100L)
                .setInterpolator(new android.view.animation.DecelerateInterpolator())
                .start();
    }

    private void navigateToCategory(String category) {
        Bundle bundle = new Bundle();
        bundle.putString("category", category);
        Navigation.findNavController(requireView()).navigate(R.id.nav_categories, bundle);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
