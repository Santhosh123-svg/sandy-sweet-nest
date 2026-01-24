const QuantitySelector = ({ quantity, setQuantity }) => {
  return (
    <div className="flex items-center gap-4 mt-3">
      <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>-</button>
      <span className="font-bold">{quantity}</span>
      <button onClick={() => setQuantity(quantity + 1)}>+</button>
    </div>
  );
};

export default QuantitySelector;
