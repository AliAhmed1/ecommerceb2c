"use client";
import { useState, useTransition } from "react";
import { checkoutAction } from "@/app/actions/Order";
import { AddressSchema } from "@/utilities/input-validator";
import type { Address } from "@/reducers/order/order.type";

const initialAddress: Address = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

export const CheckoutForm: React.FC = () => {
  const [address, setAddress] = useState<Address>(initialAddress);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = AddressSchema.safeParse(address);
    if (!result.success) {
      const errors: Error[] = JSON.parse(result.error.message);
      setError(errors[0].message);
      return;
    }
    startTransition(async () => {
      const res = await checkoutAction(address);
      if (res) setError(res);
    });
  };

  const fields: { name: keyof Address; label: string }[] = [
    { name: "fullName", label: "Full Name" },
    { name: "phone", label: "Phone" },
    { name: "line1", label: "Address Line 1" },
    { name: "line2", label: "Address Line 2 (optional)" },
    { name: "city", label: "City" },
    { name: "state", label: "State" },
    { name: "postalCode", label: "Postal Code" },
    { name: "country", label: "Country" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded shadow border text-gray-700"
    >
      {fields.map(({ name, label }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          <input
            name={name}
            value={address[name] ?? ""}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2"
            required={name !== "line2"}
          />
        </div>
      ))}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer disabled:opacity-60"
      >
        {isPending ? "Placing Order..." : "Place Order"}
      </button>
    </form>
  );
};
