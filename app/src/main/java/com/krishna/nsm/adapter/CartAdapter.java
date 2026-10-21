package com.krishna.nsm.adapter;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DiffUtil;
import androidx.recyclerview.widget.RecyclerView;
import com.krishna.nsm.R;
import com.krishna.nsm.model.CartItem;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class CartAdapter extends RecyclerView.Adapter<CartAdapter.CartViewHolder> {

    private List<CartItem> cartItems;
    private final OnCartItemChangeListener listener;

    public interface OnCartItemChangeListener {
        void onQuantityChanged(int position, int newQuantity);
        void onRemoveItem(int position);
    }

    public CartAdapter(List<CartItem> cartItems, OnCartItemChangeListener listener) {
        this.cartItems = new ArrayList<>(cartItems);
        this.listener = listener;
    }

    public void updateItems(List<CartItem> newItems) {
        DiffUtil.DiffResult diffResult = DiffUtil.calculateDiff(new CartDiffCallback(this.cartItems, newItems));
        this.cartItems.clear();
        this.cartItems.addAll(newItems);
        diffResult.dispatchUpdatesTo(this);
    }

    private static class CartDiffCallback extends DiffUtil.Callback {
        private final List<CartItem> oldList;
        private final List<CartItem> newList;

        public CartDiffCallback(List<CartItem> oldList, List<CartItem> newList) {
            this.oldList = oldList;
            this.newList = newList;
        }

        @Override
        public int getOldListSize() {
            return oldList.size();
        }

        @Override
        public int getNewListSize() {
            return newList.size();
        }

        @Override
        public boolean areItemsTheSame(int oldItemPosition, int newItemPosition) {
            CartItem oldItem = oldList.get(oldItemPosition);
            CartItem newItem = newList.get(newItemPosition);
            return oldItem.getProduct().getId().equals(newItem.getProduct().getId()) &&
                    oldItem.getSelectedSize().equals(newItem.getSelectedSize());
        }

        @Override
        public boolean areContentsTheSame(int oldItemPosition, int newItemPosition) {
            CartItem oldItem = oldList.get(oldItemPosition);
            CartItem newItem = newList.get(newItemPosition);
            return oldItem.getQuantity() == newItem.getQuantity() &&
                    oldItem.getTotalPrice() == newItem.getTotalPrice();
        }
    }

    @NonNull
    @Override
    public CartViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_cart, parent, false);
        return new CartViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull CartViewHolder holder, int position) {
        CartItem item = cartItems.get(position);
        holder.bind(item, position, listener);
    }

    @Override
    public int getItemCount() {
        return cartItems.size();
    }

    static class CartViewHolder extends RecyclerView.ViewHolder {
        ImageView itemImage;
        TextView itemName, itemSize, itemPrice, itemQuantity;
        ImageButton btnPlus, btnMinus, btnRemove;

        public CartViewHolder(@NonNull View itemView) {
            super(itemView);
            itemImage = itemView.findViewById(R.id.cart_item_image);
            itemName = itemView.findViewById(R.id.cart_item_name);
            itemSize = itemView.findViewById(R.id.cart_item_size);
            itemPrice = itemView.findViewById(R.id.cart_item_price);
            itemQuantity = itemView.findViewById(R.id.cart_item_quantity);
            btnPlus = itemView.findViewById(R.id.btn_plus);
            btnMinus = itemView.findViewById(R.id.btn_minus);
            btnRemove = itemView.findViewById(R.id.btn_remove);
        }

        public void bind(CartItem item, int position, OnCartItemChangeListener listener) {
            itemName.setText(item.getProduct().getName());
            itemSize.setText("Size: " + item.getSelectedSize());
            itemPrice.setText("₹" + item.getTotalPrice());
            itemQuantity.setText(String.valueOf(item.getQuantity()));

            if (item.getProduct().getImages() != null && !item.getProduct().getImages().isEmpty()) {
                try {
                    InputStream is = itemView.getContext().getAssets().open(item.getProduct().getImages().get(0));
                    Bitmap bitmap = BitmapFactory.decodeStream(is);
                    itemImage.setImageBitmap(bitmap);
                } catch (IOException e) {
                    itemImage.setImageResource(R.drawable.ic_launcher_background);
                }
            }

            btnPlus.setOnClickListener(v -> listener.onQuantityChanged(position, item.getQuantity() + 1));
            btnMinus.setOnClickListener(v -> {
                if (item.getQuantity() > 1) {
                    listener.onQuantityChanged(position, item.getQuantity() - 1);
                }
            });
            btnRemove.setOnClickListener(v -> listener.onRemoveItem(position));
        }
    }
}
