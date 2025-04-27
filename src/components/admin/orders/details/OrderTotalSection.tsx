
interface OrderTotalProps {
  total: number;
}

const OrderTotalSection = ({ total }: OrderTotalProps) => {
  return (
    <div className="flex justify-between items-center pt-2 border-t">
      <span className="font-medium">Total:</span>
      <span className="font-semibold text-jamcart-green">
        ${total.toFixed(2)}
      </span>
    </div>
  );
};

export default OrderTotalSection;
