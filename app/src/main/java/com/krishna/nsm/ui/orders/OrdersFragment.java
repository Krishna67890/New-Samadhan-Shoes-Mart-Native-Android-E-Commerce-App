package com.krishna.nsm.ui.orders;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.LinearLayoutManager;
import com.krishna.nsm.OrderManager;
import com.krishna.nsm.R;
import com.krishna.nsm.adapter.OrderAdapter;
import com.krishna.nsm.databinding.FragmentOrdersBinding;
import com.krishna.nsm.model.Order;
import java.util.List;

public class OrdersFragment extends Fragment {

    private FragmentOrdersBinding binding;
    private OrderManager orderManager;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentOrdersBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        orderManager = OrderManager.getInstance(requireContext());
        setupOrdersList();

        binding.btnStartShopping.setOnClickListener(v -> 
            Navigation.findNavController(v).navigate(R.id.nav_home)
        );

        return root;
    }

    private void setupOrdersList() {
        List<Order> orders = orderManager.getOrders();
        if (orders.isEmpty()) {
            binding.emptyOrdersView.setVisibility(View.VISIBLE);
            binding.ordersRecycler.setVisibility(View.GONE);
        } else {
            binding.emptyOrdersView.setVisibility(View.GONE);
            binding.ordersRecycler.setVisibility(View.VISIBLE);
            binding.ordersRecycler.setLayoutManager(new LinearLayoutManager(getContext()));
            binding.ordersRecycler.setAdapter(new OrderAdapter(orders));
        }
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
