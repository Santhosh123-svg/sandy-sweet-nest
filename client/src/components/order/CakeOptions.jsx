const CakeOptions = () => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow space-y-4">
      <select className="w-full p-3 border rounded-xl">
        <option>Select Flavour</option>
        <option>Chocolate</option>
        <option>Vanilla</option>
        <option>Red Velvet</option>
      </select>

      <select className="w-full p-3 border rounded-xl">
        <option>Size & Weight</option>
        <option>0.5 Kg</option>
        <option>1 Kg</option>
        <option>2 Kg</option>
      </select>

      <input
        type="number"
        placeholder="Quantity"
        className="w-full p-3 border rounded-xl"
      />
    </div>
  );
};

export default CakeOptions;
