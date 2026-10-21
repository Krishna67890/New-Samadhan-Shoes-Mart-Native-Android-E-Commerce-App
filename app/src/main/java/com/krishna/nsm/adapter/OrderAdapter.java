package com.krishna.nsm.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.krishna.nsm.R;
import com.krishna.nsm.model.CartItem;
import com.krishna.nsm.model.Order;
import java.util.List;

public class OrderAdapter extends RecyclerView.Adapter<OrderAdapter.OrderViewHolder> {

    private final List<Order> orders;

    public OrderAdapter(List<Order> orders) {
        this.orders = orders;
    }

    @NonNull
    @Override
    public OrderViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_order, parent, false);
        return new OrderViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull OrderViewHolder holder, int position) {
        Order order = orders.get(position);
        holder.bind(order);
    }

    @Override
    public int getItemCount() {
        return orders.size();
    }

    static class OrderViewHolder extends RecyclerView.ViewHolder {
        TextView orderId, orderStatus, orderDate, orderItemsSummary, orderTotal, orderShippingAddress;

        public OrderViewHolder(@NonNull View itemView) {
            super(itemView);
            orderId = itemView.findViewById(R.id.order_id);
            orderStatus = itemView.findViewById(R.id.order_status);
            orderDate = itemView.findViewById(R.id.order_date);
            orderItemsSummary = itemView.findViewById(R.id.order_items_summary);
            orderTotal = itemView.findViewById(R.id.order_total);
            orderShippingAddress = itemView.findViewById(R.id.order_shipping_address);
        }

        public void bind(Order order) {
            orderId.setText("Order #" + order.getOrderId());
            orderStatus.setText(order.getStatus().toUpperCase());
            orderDate.setText(order.getDate());
            orderTotal.setText("₹" + String.format("%.2f", order.getTotalAmount()));
            
            if (order.getShippingAddress() != null && !order.getShippingAddress().isEmpty()) {
                orderShippingAddress.setVisibility(View.VISIBLE);
                orderShippingAddress.setText("Shipping to: " + order.getShippingAddress());
            } else {
                orderShippingAddress.setVisibility(View.GONE);
            }

            StringBuilder summary = new StringBuilder();
            for (int i = 0; i < order.getItems().size(); i++) {
                CartItem item = order.getItems().get(i);
                summary.append(item.getProduct().getName());
                if (i < order.getItems().size() - 1) {
                    summary.append(", ");
                }
            }
            orderItemsSummary.setText(summary.toString());
        }
    }
}
