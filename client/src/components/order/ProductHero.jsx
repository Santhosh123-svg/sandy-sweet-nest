import { motion } from "framer-motion";

const ProductHero = ({ image, name }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center mb-6"
    >
      <img
        src={image}
        alt={name}
        className="mx-auto w-60 h-60 object-cover rounded-3xl shadow-xl"
      />
      <h2 className="mt-4 text-2xl font-extrabold">{name}</h2>
    </motion.div>
  );
};

export default ProductHero;
