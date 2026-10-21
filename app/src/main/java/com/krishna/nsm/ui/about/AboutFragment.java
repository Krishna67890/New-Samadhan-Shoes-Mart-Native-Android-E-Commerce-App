package com.krishna.nsm.ui.about;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import android.animation.AnimatorInflater;
import android.animation.AnimatorSet;
import com.krishna.nsm.R;
import com.krishna.nsm.databinding.FragmentAboutBinding;

public class AboutFragment extends Fragment {

    private FragmentAboutBinding binding;
    private boolean isFrontVisible = true;
    private com.krishna.nsm.ThemeManager themeManager;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentAboutBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        themeManager = new com.krishna.nsm.ThemeManager(requireContext());
        
        setupFlipCard();
        setupTimeline();
        setupListeners();
        applyBranding();
    }

    private void applyBranding() {
        if (themeManager.isRgbBrandingEnabled()) {
            int brandColor = themeManager.getBrandColor();
            android.content.res.ColorStateList colorStateList = android.content.res.ColorStateList.valueOf(brandColor);
            
            binding.btnGoogleMaps.setBackgroundTintList(colorStateList);
            binding.btnCallNow.setStrokeColor(colorStateList);
            binding.btnCallNow.setTextColor(brandColor);
            // binding.tvAboutHeader.setTextColor(brandColor);
        }
    }

    private void setupFlipCard() {
        // Inflate flip card into a container if you have one, or use it directly
        // For simplicity, let's assume we replace the history section or add it at top
        View flipCard = getLayoutInflater().inflate(R.layout.layout_flip_card, binding.timelineContainer, false);
        binding.timelineContainer.addView(flipCard, 0);

        View cardFront = flipCard.findViewById(R.id.card_front);
        View cardBack = flipCard.findViewById(R.id.card_back);

        float scale = getContext().getResources().getDisplayMetrics().density;
        cardFront.setCameraDistance(8000 * scale);
        cardBack.setCameraDistance(8000 * scale);

        AnimatorSet frontOut = (AnimatorSet) AnimatorInflater.loadAnimator(getContext(), R.animator.flip_front_out);
        AnimatorSet backIn = (AnimatorSet) AnimatorInflater.loadAnimator(getContext(), R.animator.flip_back_in);
        AnimatorSet backOut = (AnimatorSet) AnimatorInflater.loadAnimator(getContext(), R.animator.flip_back_out);
        AnimatorSet frontIn = (AnimatorSet) AnimatorInflater.loadAnimator(getContext(), R.animator.flip_front_in);

        flipCard.setOnClickListener(v -> {
            if (isFrontVisible) {
                frontOut.setTarget(cardFront);
                backIn.setTarget(cardBack);
                frontOut.start();
                backIn.start();
                isFrontVisible = false;
            } else {
                backOut.setTarget(cardBack);
                frontIn.setTarget(cardFront);
                backOut.start();
                frontIn.start();
                isFrontVisible = true;
            }
        });

        // Customize content
        ((android.widget.TextView) flipCard.findViewById(R.id.tv_front_title)).setText("Our Legacy");
        ((android.widget.TextView) flipCard.findViewById(R.id.tv_back_title)).setText("New Samadhan Shoe Mart");
        ((android.widget.TextView) flipCard.findViewById(R.id.tv_back_content)).setText(R.string.about_history_detail);
    }

    private void setupTimeline() {
        int[] years = {R.string.milestone_1_year, R.string.milestone_2_year, R.string.milestone_3_year, 
                       R.string.milestone_4_year, R.string.milestone_5_year, R.string.milestone_6_year};
        int[] titles = {R.string.milestone_1_title, R.string.milestone_2_title, R.string.milestone_3_title,
                        R.string.milestone_4_title, R.string.milestone_5_title, R.string.milestone_6_title};
        int[] descs = {R.string.milestone_1_desc, R.string.milestone_2_desc, R.string.milestone_3_desc,
                       R.string.milestone_4_desc, R.string.milestone_5_desc, R.string.milestone_6_desc};

        LayoutInflater inflater = LayoutInflater.from(getContext());
        for (int i = 0; i < years.length; i++) {
            View milestoneView = inflater.inflate(R.layout.item_timeline, binding.timelineContainer, false);
            ((android.widget.TextView) milestoneView.findViewById(R.id.tv_year)).setText(getString(years[i]));
            ((android.widget.TextView) milestoneView.findViewById(R.id.tv_milestone_title)).setText(getString(titles[i]));
            ((android.widget.TextView) milestoneView.findViewById(R.id.tv_milestone_desc)).setText(getString(descs[i]));
            binding.timelineContainer.addView(milestoneView);
        }
    }

    private void setupListeners() {
        // Showroom Actions
        if (binding.btnGoogleMaps != null) {
            binding.btnGoogleMaps.setOnClickListener(v -> openUrl(getString(R.string.store_maps_url)));
        }
        if (binding.btnCallNow != null) {
            binding.btnCallNow.setOnClickListener(v -> {
                try {
                    Intent intent = new Intent(Intent.ACTION_DIAL);
                    intent.setData(Uri.parse("tel:8888644021"));
                    startActivity(intent);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }

        // Developer & Website Actions
        if (binding.btnVisitWebsite != null) {
            binding.btnVisitWebsite.setOnClickListener(v -> openUrl(getString(R.string.url_shop_website)));
        }
        if (binding.btnDevInsta != null) {
            binding.btnDevInsta.setOnClickListener(v -> openUrl(getString(R.string.url_dev_instagram)));
        }
        if (binding.btnDevGithub != null) {
            binding.btnDevGithub.setOnClickListener(v -> openUrl(getString(R.string.about_github_url)));
        }
        if (binding.btnDevSupport != null) {
            binding.btnDevSupport.setOnClickListener(v -> openUrl(getString(R.string.url_dev_support_wa)));
        }
    }

    private void openUrl(String url) {
        try {
            if (url == null || url.trim().isEmpty() || !isAdded()) return;
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setData(Uri.parse(url));
            startActivity(intent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
