import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const HowItWorks = () => {
  return (
    <>
      <Header />
      <div className="pt-28 pb-16 bg-black">
        <div className="app-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-bold mb-8 text-center text-[#fced87]">How JAMCart Works</h1>
            
            <div className="bg-white p-8 rounded-xl shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">Quick &amp; Easy Ordering</h2>
              <p className="mb-6 text-gray-700">
                JAMCart connects you to local convenience stores, supermarkets, pharmacies and more - all in one app. 
                Browse categories, select your items, and get them delivered to your doorstep in no time.
              </p>
              
              <ol className="space-y-6">
                <li className="flex">
                  <div className="bg-jamcart-red rounded-full w-8 h-8 flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold mb-1">Select a category</h3>
                    <p className="text-gray-600">Choose from restaurants, mini marts, pharmacies, bill payment services and more.</p>
                  </div>
                </li>
                
                <li className="flex">
                  <div className="bg-jamcart-red rounded-full w-8 h-8 flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold mb-1">Browse stores</h3>
                    <p className="text-gray-600">View all available stores in your selected category.</p>
                  </div>
                </li>
                
                <li className="flex">
                  <div className="bg-jamcart-red rounded-full w-8 h-8 flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold mb-1">Place your order</h3>
                    <p className="text-gray-600">Add items to your cart and proceed to checkout.</p>
                  </div>
                </li>
                
                <li className="flex">
                  <div className="bg-jamcart-red rounded-full w-8 h-8 flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">4</div>
                  <div>
                    <h3 className="font-semibold mb-1">Fast delivery</h3>
                    <p className="text-gray-600">Your order is delivered right to your doorstep in under an hour.</p>
                  </div>
                </li>
              </ol>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Payment Options</h2>
              <p className="text-gray-700 mb-4">
                JAMCart offers multiple secure payment options for your convenience:
              </p>
              
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-jamcart-red rounded-full mr-3"></div>
                  <span>Credit/Debit cards</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-jamcart-red rounded-full mr-3"></div>
                  <span>Mobile money</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-jamcart-red rounded-full mr-3"></div>
                  <span>Cash on delivery</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-jamcart-red rounded-full mr-3"></div>
                  <span>Digital wallets</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HowItWorks;
