
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryCard from "@/components/ui/CategoryCard";
import { Store, ShoppingBag, Pill, Wrench, ShoppingCart, CreditCard, Droplet, Smartphone } from "lucide-react";

// Mock categories data
const categories = [
  {
    id: "minimart",
    name: "Mini Mart",
    description: "Snacks, drinks, and everyday essentials",
    icon: <Store className="h-6 w-6" />,
    color: "bg-blue-500",
    storeCount: 24
  },
  {
    id: "restaurant",
    name: "Restaurants",
    description: "Local and international cuisine",
    icon: <ShoppingBag className="h-6 w-6" />,
    color: "bg-red-500",
    storeCount: 42
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    description: "Medications and health products",
    icon: <Pill className="h-6 w-6" />,
    color: "bg-green-500",
    storeCount: 16
  },
  {
    id: "hardware",
    name: "Hardware",
    description: "Tools and home improvement items",
    icon: <Wrench className="h-6 w-6" />,
    color: "bg-yellow-500",
    storeCount: 8
  },
  {
    id: "supermarket",
    name: "Supermarket",
    description: "Groceries and household items",
    icon: <ShoppingCart className="h-6 w-6" />,
    color: "bg-purple-500",
    storeCount: 12
  },
  {
    id: "billpay",
    name: "Bill Payment",
    description: "Pay utility bills and services",
    icon: <CreditCard className="h-6 w-6" />,
    color: "bg-indigo-500",
    storeCount: 5
  },
  {
    id: "water",
    name: "Water Services",
    description: "Water delivery and filtration",
    icon: <Droplet className="h-6 w-6" />,
    color: "bg-cyan-500",
    storeCount: 7
  },
  {
    id: "electronics",
    name: "Electronics",
    description: "Phones, accessories and appliances",
    icon: <Smartphone className="h-6 w-6" />,
    color: "bg-orange-500",
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
                  id={category.id}
                  name={category.name}
                  description={category.description}
                  icon={category.icon}
                  color={category.color}
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
