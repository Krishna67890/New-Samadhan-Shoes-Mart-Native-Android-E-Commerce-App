package com.krishna.nsm.ui.workshop;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import com.krishna.nsm.R;
import com.krishna.nsm.databinding.FragmentWorkshopBinding;
import java.io.IOException;
import java.io.InputStream;

import android.widget.LinearLayout;
import android.widget.TextView;
import com.krishna.nsm.model.Review;
import com.krishna.nsm.repository.ReviewManager;
import java.util.List;

import android.content.Intent;
import android.net.Uri;
import android.widget.ArrayAdapter;
import android.widget.Toast;
import java.util.Calendar;
import android.app.DatePickerDialog;
import com.google.android.material.textfield.TextInputEditText;
import android.widget.AutoCompleteTextView;
import android.widget.ImageView;
import java.util.ArrayList;

public class WorkshopFragment extends Fragment {

    private FragmentWorkshopBinding binding;
    
    private static class Station {
        String step, title, subtitle, desc, lead;
        String assetName;

        Station(String step, String title, String subtitle, String desc, String lead, String assetName) {
            this.step = step; this.title = title; this.subtitle = subtitle;
            this.desc = desc; this.lead = lead; this.assetName = assetName;
        }
    }

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentWorkshopBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        setupReviews();
        setupStations();
        setupAppointmentForm();

        try {
            InputStream is = requireContext().getAssets().open("Samadhan-Truck.jpg");
            Bitmap bitmap = BitmapFactory.decodeStream(is);
            binding.workshopBanner.setImageBitmap(bitmap);
            
            InputStream is2 = requireContext().getAssets().open("Satkar-5.jpg");
            Bitmap bitmap2 = BitmapFactory.decodeStream(is2);
            binding.workshopProcessImage.setImageBitmap(bitmap2);
        } catch (IOException e) {
            // Fallback to XML src
        }

        animateEntry();

        return root;
    }

    private void animateEntry() {
        binding.workshopBanner.setAlpha(0f);
        binding.workshopBanner.setTranslationY(-50f);
        binding.workshopBanner.animate()
                .alpha(1f)
                .translationY(0f)
                .setDuration(800)
                .setInterpolator(new android.view.animation.DecelerateInterpolator())
                .start();

        binding.workshopTitle.setAlpha(0f);
        binding.workshopTitle.setTranslationX(-50f);
        binding.workshopTitle.animate()
                .alpha(1f)
                .translationX(0f)
                .setDuration(800)
                .setStartDelay(200)
                .setInterpolator(new android.view.animation.OvershootInterpolator())
                .start();

        binding.workshopDesc.setAlpha(0f);
        binding.workshopDesc.animate()
                .alpha(1f)
                .setDuration(1000)
                .setStartDelay(400)
                .start();

        binding.workshopProcessCard.setAlpha(0f);
        binding.workshopProcessCard.setTranslationY(100f);
        binding.workshopProcessCard.animate()
                .alpha(1f)
                .translationY(0f)
                .setDuration(800)
                .setStartDelay(600)
                .setInterpolator(new android.view.animation.DecelerateInterpolator())
                .start();
    }

    private void setupReviews() {
        ReviewManager reviewManager = ReviewManager.getInstance(requireContext());
        List<Review> reviews = reviewManager.getAllReviews();
        
        binding.workshopReviewsContainer.removeAllViews();
        LayoutInflater inflater = LayoutInflater.from(getContext());
        
        for (Review review : reviews) {
            View reviewView = inflater.inflate(R.layout.item_review, binding.workshopReviewsContainer, false);
            
            TextView tvName = reviewView.findViewById(R.id.tv_reviewer_name);
            TextView tvComment = reviewView.findViewById(R.id.tv_review_comment);
            android.widget.RatingBar rb = reviewView.findViewById(R.id.rating_bar_small);
            
            tvName.setText(review.getName());
            tvComment.setText(review.getComment());
            rb.setRating(review.getRating());
            
            binding.workshopReviewsContainer.addView(reviewView);
        }
    }

    private void setupAppointmentForm() {
        String[] services = {"Bespoke Sizing", "Leather Custom Fitting", "Goodyear Welt Resole", "Patina Restoration", "Anatomical Consultation"};
        ArrayAdapter<String> adapter = new ArrayAdapter<>(requireContext(), android.R.layout.simple_dropdown_item_1line, services);
        binding.spinnerServiceType.setAdapter(adapter);

        binding.etPreferredDate.setOnClickListener(v -> {
            Calendar calendar = Calendar.getInstance();
            new DatePickerDialog(requireContext(), (view, year, month, dayOfMonth) -> {
                binding.etPreferredDate.setText(dayOfMonth + "/" + (month + 1) + "/" + year);
            }, calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH), calendar.get(Calendar.DAY_OF_MONTH)).show();
        });

        binding.btnBookAppointment.setOnClickListener(v -> {
            String name = binding.etFullName.getText().toString();
            String phone = binding.etPhoneNumber.getText().toString();
            String date = binding.etPreferredDate.getText().toString();
            String service = binding.spinnerServiceType.getText().toString();

            if (name.isEmpty() || phone.isEmpty() || date.isEmpty() || service.isEmpty()) {
                Toast.makeText(getContext(), R.string.error_empty_fields, Toast.LENGTH_SHORT).show();
                return;
            }

            String message = getString(R.string.whatsapp_appointment_msg, name, phone, date, service);
            String url = "https://wa.me/918888644021?text=" + Uri.encode(message);
            
            Intent i = new Intent(Intent.ACTION_VIEW);
            i.setData(Uri.parse(url));
            startActivity(i);
        });
    }

    private void setupStations() {
        ArrayList<Station> stations = new ArrayList<>();
        stations.add(new Station("01", "The Anatomical Lasting Suite", "Digitized Ergonomics", "Every master silhouette starts with a solid hornbeam wood last, carved to human foot kinetics.", "Master Vitthal", "IMG-20260928-WA0012.jpg"));
        stations.add(new Station("02", "The Tuscan Leather Archive", "Grade-A Full Grain", "We store hand-curated hides from Florence. Only top-grain skins with intact epidermal layers pass.", "Master Ramesh", "IMG-20260928-WA0015.jpg"));
        stations.add(new Station("03", "The Clicking & Skiving Bench", "Artisanal Blade Work", "Patterns are hand-cut strictly parallel to the natural stretch grain of the leather.", "Artisan Anand", "IMG-20260928-WA0022.jpg"));
        stations.add(new Station("04", "The Goodyear Welt Cobbler Bay", "200+ Operations", "The gold standard of bootmaking. A sturdy leather welt is lockstitched directly through the upper.", "Master Vitthal & Guild", "IMG-20260928-WA0045.jpg"));
        stations.add(new Station("05", "Sole Compression & Heel Stacking", "80-Bar Fusion", "Outsoles are placed under 80-bar pneumatic pressure with thermo-reactive eco adhesives.", "Artisan Ganesh", "IMG-20260928-WA0062.jpg"));
        stations.add(new Station("06", "The Patina & Glazing Chamber", "Organic Carnauba", "Raw leather is hand-rubbed with natural pigments and genuine deer bone to close the leather pores.", "Patina Master Dnyanesh", "IMG-20260928-WA0088.jpg"));

        binding.stationsContainer.removeAllViews();
        LayoutInflater inflater = LayoutInflater.from(getContext());

        int delay = 600;
        for (Station s : stations) {
            View stationView = inflater.inflate(R.layout.item_workshop_station, binding.stationsContainer, false);
            
            ((TextView) stationView.findViewById(R.id.tv_station_step)).setText(getString(R.string.phase_label, s.step));
            ((TextView) stationView.findViewById(R.id.tv_station_title)).setText(s.title);
            ((TextView) stationView.findViewById(R.id.tv_station_subtitle)).setText(s.subtitle);
            ((TextView) stationView.findViewById(R.id.tv_station_desc)).setText(s.desc);
            ((TextView) stationView.findViewById(R.id.tv_station_lead)).setText(getString(R.string.supervised_by, s.lead));

            ImageView iv = stationView.findViewById(R.id.iv_station_image);
            try {
                InputStream is = requireContext().getAssets().open(s.assetName);
                Bitmap bitmap = BitmapFactory.decodeStream(is);
                iv.setImageBitmap(bitmap);
            } catch (IOException e) {
                iv.setImageResource(R.drawable.front_banner);
            }

            stationView.setAlpha(0f);
            stationView.setTranslationY(100f);
            stationView.animate()
                    .alpha(1f)
                    .translationY(0f)
                    .setDuration(800)
                    .setStartDelay(delay)
                    .setInterpolator(new android.view.animation.DecelerateInterpolator())
                    .start();
            delay += 200;

            binding.stationsContainer.addView(stationView);
        }
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
