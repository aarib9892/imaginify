import React from "react";

const CreateCartButton = () => {
  const createCart = async () => {
    try {
      const response = await fetch("/api/zoho", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create cart");
      }

      console.log("Cart created successfully:", result);
      alert("Cart created successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating cart.");
    }
  };

  return (
    <button
      onClick={createCart}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Create Cart
    </button>
  );
};

export default CreateCartButton;
