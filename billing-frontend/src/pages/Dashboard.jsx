import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import API from "../api";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setData(res.data));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Payments Summary */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-bold mb-4">Payments Summary</h2>
          <p>Daily: ₹{data.payments.daily}</p>
          <p>Weekly: ₹{data.payments.weekly}</p>
          <p>Monthly: ₹{data.payments.monthly}</p>
        </CardContent>
      </Card>

      {/* Payments Trend Chart */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-bold mb-4">Payments (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.payments.trend}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Invoices Chart */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-bold mb-4">Invoices</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={Object.entries(data.invoices).map(([k, v]) => ({ name: k, value: v }))} dataKey="value" label>
                {["#22c55e", "#eab308", "#ef4444"].map((c, i) => (
                  <Cell key={i} fill={c} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tax Rate Usage */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-bold mb-4">Tax Rate Usage</h2>
          <ul>
            {data.taxRates.map((tax) => (
              <li key={tax.id} className="flex justify-between">
                <span>{tax.name} ({tax.rate}%)</span>
                <span>{tax.products_count} products</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
