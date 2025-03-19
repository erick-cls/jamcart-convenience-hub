
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const About = () => {
  return (
    <>
      <Header />
      <div className="pt-28 pb-16 bg-gray-50">
        <div className="app-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-bold mb-8 text-center">About JAMCart</h1>
            
            <div className="bg-white p-8 rounded-xl shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="mb-6 text-gray-700">
                JAMCart's mission is to connect communities with local stores and services, making everyday conveniences more accessible to everyone. We believe in supporting local businesses while providing customers with the convenience they deserve.
              </p>
              
              <p className="text-gray-700">
                Founded in 2025, JAMCart has quickly grown to become the go-to platform for quick deliveries and services across multiple categories, from groceries to bill payments.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">Our Values</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-1">Community First</h3>
                  <p className="text-gray-600">We prioritize creating value for local communities by connecting them with businesses in their area.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-1">Reliability</h3>
                  <p className="text-gray-600">We're committed to providing consistent, dependable service that our customers can count on.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-1">Accessibility</h3>
                  <p className="text-gray-600">We strive to make essential goods and services accessible to everyone, regardless of location.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-1">Innovation</h3>
                  <p className="text-gray-600">We continuously seek new ways to improve our platform and enhance the user experience.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Join Our Network</h2>
              <p className="mb-4 text-gray-700">
                Are you a store owner? Partner with JAMCart to reach more customers and grow your business.
              </p>
              
              <button className="bg-jamcart-red hover:bg-jamcart-red/90 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                Become a Partner
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
