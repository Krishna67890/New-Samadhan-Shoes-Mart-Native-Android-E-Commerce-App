package com.krishna.nsm.ui.checkout;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import java.util.Locale;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;
import com.krishna.nsm.CartManager;
import com.krishna.nsm.Constants;
import com.krishna.nsm.R;
import com.krishna.nsm.databinding.FragmentCheckoutBinding;
import com.krishna.nsm.model.CartItem;
import java.net.URLEncoder;
import java.util.List;

public class CheckoutFragment extends Fragment {

    private FragmentCheckoutBinding binding;
    private CartManager cartManager;
    private FusedLocationProviderClient fusedLocationClient;
    private com.krishna.nsm.ThemeManager themeManager;
    private String mapLink = "";
    private final ActivityResultLauncher<String[]> locationPermissionLauncher =
            registerForActivityResult(new ActivityResultContracts.RequestMultiplePermissions(), permissions -> {
                boolean hasFineLocation = Boolean.TRUE.equals(permissions.get(Manifest.permission.ACCESS_FINE_LOCATION));
                boolean hasCoarseLocation = Boolean.TRUE.equals(permissions.get(Manifest.permission.ACCESS_COARSE_LOCATION));
                if (hasFineLocation || hasCoarseLocation) {
                    loadLastLocation();
                } else if (isAdded()) {
                    Toast.makeText(requireContext(), "Location access is optional. Enter your address manually.", Toast.LENGTH_LONG).show();
                }
            });

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentCheckoutBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        themeManager = new com.krishna.nsm.ThemeManager(requireContext());
        cartManager = CartManager.getInstance(requireContext());
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(requireActivity());
        double total = cartManager.getCartTotal();

        binding.tvItemsTotal.setText("₹" + total);
        binding.tvGrandTotal.setText("₹" + total);

        binding.btnPlaceOrder.setOnClickListener(v -> placeOrderOnWhatsApp());
        
        // Use current location button
        binding.btnUseLocation.setOnClickListener(v -> fetchLocation());

        applyBranding();
        fetchLocation();

        return root;
    }

    private void applyBranding() {
        if (themeManager.isRgbBrandingEnabled()) {
            int brandColor = themeManager.getBrandColor();
            android.content.res.ColorStateList colorStateList = android.content.res.ColorStateList.valueOf(brandColor);
            
            binding.btnPlaceOrder.setBackgroundTintList(colorStateList);
            binding.btnUseLocation.setIconTint(colorStateList);
            binding.btnUseLocation.setTextColor(brandColor);
            binding.tvGrandTotal.setTextColor(brandColor);
        }
    }

    private void fetchLocation() {
        if (!hasLocationPermission()) {
            locationPermissionLauncher.launch(new String[]{
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION
            });
            return;
        }
        loadLastLocation();
    }

    private boolean hasLocationPermission() {
        return ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_FINE_LOCATION)
                        == PackageManager.PERMISSION_GRANTED
                || ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_COARSE_LOCATION)
                        == PackageManager.PERMISSION_GRANTED;
    }

    private void loadLastLocation() {
        try {
            if (getContext() == null) return;
            
            // Priority 1: Get Current Location (Modern API)
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
                com.google.android.gms.tasks.Task<Location> currentLocationTask = fusedLocationClient.getCurrentLocation(
                        com.google.android.gms.location.Priority.PRIORITY_HIGH_ACCURACY, null);
                
                currentLocationTask.addOnSuccessListener(location -> {
                    if (location != null) {
                        updateAddressFromLocation(location);
                    } else {
                        // Fallback to Last Location
                        tryLastLocation();
                    }
                });
            } else {
                tryLastLocation();
            }
        } catch (SecurityException e) {
            if (isAdded()) {
                Toast.makeText(requireContext(), "Location access is unavailable. Enter your address manually.", Toast.LENGTH_LONG).show();
            }
        }
    }

    private void tryLastLocation() {
        try {
            fusedLocationClient.getLastLocation().addOnSuccessListener(requireActivity(), location -> {
                if (location != null) {
                    updateAddressFromLocation(location);
                } else if (isAdded()) {
                    Toast.makeText(requireContext(), "No recent location found. Enter your address manually.", Toast.LENGTH_LONG).show();
                }
            }).addOnFailureListener(error -> {
                if (isAdded()) {
                    Toast.makeText(requireContext(), "Could not read location. Enter your address manually.", Toast.LENGTH_LONG).show();
                }
            });
        } catch (SecurityException ignored) {}
    }

    private void updateAddressFromLocation(Location location) {
        if (binding == null || !isAdded()) return;
        
        new Thread(() -> {
            if (!isAdded() || getContext() == null) return;
            try {
                Geocoder geocoder = new Geocoder(requireContext(), Locale.getDefault());
                List<Address> addresses = geocoder.getFromLocation(location.getLatitude(), location.getLongitude(), 1);
                if (addresses != null && !addresses.isEmpty()) {
                    Address addr = addresses.get(0);
                    String fullAddress = addr.getAddressLine(0);
                    String locality = addr.getLocality();
                    String postalCode = addr.getPostalCode();
                    
                    String newMapLink = "https://www.google.com/maps/search/?api=1&query=" + location.getLatitude() + "," + location.getLongitude();
                    
                    if (getActivity() != null) {
                        getActivity().runOnUiThread(() -> {
                            if (binding != null) {
                                binding.etAddress.setText(fullAddress != null ? fullAddress : "");
                                if (locality != null) binding.etCity.setText(locality);
                                if (postalCode != null) binding.etPincode.setText(postalCode);
                                mapLink = newMapLink;
                            }
                        });
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    private boolean validateCheckoutForm(String name, String phone, String address, String city, String pincode) {
        binding.tilName.setError(null);
        binding.tilPhone.setError(null);
        binding.tilAddress.setError(null);
        binding.tilCity.setError(null);
        binding.tilPincode.setError(null);

        View firstInvalidField = null;
        if (name.isEmpty()) {
            binding.tilName.setError("Enter your full name");
            firstInvalidField = binding.etName;
        }
        String phoneDigits = phone.replaceAll("[^0-9]", "");
        if (phoneDigits.length() == 12 && phoneDigits.startsWith("91")) phoneDigits = phoneDigits.substring(2);
        if (phoneDigits.length() == 11 && phoneDigits.startsWith("0")) phoneDigits = phoneDigits.substring(1);
        if (!phoneDigits.matches("[6-9][0-9]{9}")) {
            binding.tilPhone.setError("Enter a valid 10-digit mobile number");
            if (firstInvalidField == null) firstInvalidField = binding.etPhone;
        }
        if (address.isEmpty()) {
            binding.tilAddress.setError("Enter your delivery address");
            if (firstInvalidField == null) firstInvalidField = binding.etAddress;
        }
        if (city.isEmpty()) {
            binding.tilCity.setError("Enter your city");
            if (firstInvalidField == null) firstInvalidField = binding.etCity;
        }
        if (!pincode.matches("[0-9]{6}")) {
            binding.tilPincode.setError("Enter a valid 6-digit PIN code");
            if (firstInvalidField == null) firstInvalidField = binding.etPincode;
        }
        if (firstInvalidField != null) {
            firstInvalidField.requestFocus();
            return false;
        }
        return true;
    }

    private void placeOrderOnWhatsApp() {
        String name = binding.etName.getText().toString().trim();
        String phone = binding.etPhone.getText().toString().trim();
        String address = binding.etAddress.getText().toString().trim();
        String city = binding.etCity.getText().toString().trim();
        String pincode = binding.etPincode.getText().toString().trim();

        if (!validateCheckoutForm(name, phone, address, city, pincode)) return;

        // Ensure mapLink is updated if user manually entered address but we have lat/long (though usually user clicks button)
        // If mapLink is still empty, we will try to geocode the manually entered address.
        if (mapLink.isEmpty()) {
            try {
                Geocoder geocoder = new Geocoder(requireContext(), Locale.getDefault());
                List<Address> addresses = geocoder.getFromLocationName(address + ", " + city + " " + pincode, 1);
                if (addresses != null && !addresses.isEmpty()) {
                    Address addr = addresses.get(0);
                    mapLink = "https://www.google.com/maps/search/?api=1&query=" + addr.getLatitude() + "," + addr.getLongitude();
                }
            } catch (Exception ignored) {}
        }

        List<CartItem> items = cartManager.getCartItems();
        if (items.isEmpty()) {
            Toast.makeText(getContext(), "Your cart is empty.", Toast.LENGTH_SHORT).show();
            Navigation.findNavController(requireView()).navigate(R.id.nav_cart);
            return;
        }

        StringBuilder sb = new StringBuilder();
        sb.append("*New Samadhan Shoes - New Order*\n\n");
        sb.append("*Customer Details:*\n");
        sb.append("Name: ").append(name).append("\n");
        sb.append("Phone: ").append(phone).append("\n");
        sb.append("Address: ").append(address).append(", ").append(city).append(" - ").append(pincode).append("\n");
        if (!mapLink.isEmpty()) {
            sb.append("Map Location: ").append(mapLink).append("\n");
        }
        sb.append("\n");

        sb.append("*Order Summary:*\n");
        for (CartItem item : items) {
            sb.append("- ").append(item.getProduct().getName())
                    .append(" (Size: ").append(item.getSelectedSize()).append(")")
                    .append(" x ").append(item.getQuantity())
                    .append(" = ₹").append(item.getTotalPrice()).append("\n");
        }

        sb.append("\n*Total Amount: ₹").append(cartManager.getCartTotal()).append("*\n\n");
        sb.append("Please confirm this order.");

        try {
            String url = "https://api.whatsapp.com/send?phone=" + Constants.WHATSAPP_NUMBER +
                    "&text=" + URLEncoder.encode(sb.toString(), "UTF-8");
            
            // Save to Order History
            String orderId = String.valueOf(System.currentTimeMillis()).substring(7);
            java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("dd MMM yyyy, hh:mm a", java.util.Locale.getDefault());
            String currentDate = sdf.format(new java.util.Date());
            
            com.krishna.nsm.model.Order order = new com.krishna.nsm.model.Order(
                    orderId, currentDate, new java.util.ArrayList<>(items), cartManager.getCartTotal(), 
                    "Enquiry Sent", address + ", " + city + " - " + pincode, name
            );
            com.krishna.nsm.OrderManager.getInstance(requireContext()).addOrder(order);

            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setData(Uri.parse(url));
            startActivity(intent);
            
            // Clear cart after placing order
            cartManager.clearCart();
            Navigation.findNavController(requireView()).navigate(R.id.nav_orders);
            Toast.makeText(getContext(), "Order enquiry sent via WhatsApp!", Toast.LENGTH_LONG).show();
            
        } catch (Exception e) {
            Toast.makeText(getContext(), "WhatsApp not installed", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
