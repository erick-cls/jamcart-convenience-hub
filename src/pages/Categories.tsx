
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryCard from "@/components/ui/CategoryCard";

// Mock categories data
const categories = [
  {
    id: "minimart",
    name: "Mini Mart",
    description: "Snacks, drinks, and everyday essentials",
    imageUrl: "/placeholder.svg",
    storeCount: 24
  },
  {
    id: "restaurant",
    name: "Restaurants",
    description: "Local and international cuisine",
    imageUrl: "/placeholder.svg",
    storeCount: 42
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    description: "Medications and health products",
    imageUrl: "/placeholder.svg",
    storeCount: 16
  },
  {
    id: "hardware",
    name: "Hardware",
    description: "Tools and home improvement items",
    imageUrl: "/placeholder.svg",
    storeCount: 8
  },
  {
    id: "supermarket",
    name: "Supermarket",
    description: "Groceries and household items",
    imageUrl: "/placeholder.svg",
    storeCount: 12
  },
  {
    id: "billpay",
    name: "Bill Payment",
    description: "Pay utility bills and services",
    imageUrl: "/placeholder.svg",
    storeCount: 5
  },
  {
    id: "water",
    name: "Water Services",
    description: "Water delivery and filtration",
    imageUrl: "/placeholder.svg",
    storeCount: 7
  },
  {
    id: "electronics",
    name: "Electronics",
    description: "Phones, accessories and appliances",
    imageUrl: "/placeholder.svg",
    storeCount: 14
  }
];

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <>
      <Header />
      <div className="pt-28 pb-16 bg-gray-50">
        <div className="app-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-3">All Categories</h1>
            <p className="text-gray-600 mb-8">Browse all available service categories</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  name={category.name}
                  description={category.description}
                  image={category.imageUrl}
                  storeCount={category.storeCount}
                  onClick={() => handleCategoryClick(category.id)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Categories;
