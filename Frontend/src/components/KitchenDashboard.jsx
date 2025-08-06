import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, LineChart } from "@mui/x-charts";
import {
  UsersIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const KitchenDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kitchenName, setKitchenName] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const storedKitchen = JSON.parse(localStorage.getItem("KitchenOwner"));
        if (!storedKitchen || !storedKitchen._id) {
          console.error("No kitchen ID found in localStorage!");
          setLoading(false);
          return;
        }

        setKitchenName(storedKitchen.name || "Kitchen");

        const response = await axios.get(
          `http://localhost:4000/kitchen/${storedKitchen._id}/transactions`
        );

        if (response.data.transactions) {
          setTransactions(response.data.transactions);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const planDistribution = transactions.reduce((acc, tx) => {
    acc[tx.plan] = (acc[tx.plan] || 0) + 1;
    return acc;
  }, {});

  const revenueMap = {
    gold: 60,
    silver: 55,
    basic: 50,
    starter: 45,
  };

  const totalRevenue = transactions.reduce(
    (sum, tx) => sum + (revenueMap[tx.plan] || 0),
    0
  );

  const calculateWeeklyTrend = () => {
    const weeklyMeals = [0, 0, 0, 0]; // Assuming 4 weeks in a month
    const currentDate = new Date(); // Today's date

    transactions.forEach(tx => {
      const transactionDate = new Date(tx.date);
      const weekIndex = Math.floor((currentDate - transactionDate) / (7 * 24 * 60 * 60 * 1000));
      if (weekIndex >= 0 && weekIndex < 4) {
        weeklyMeals[weekIndex] += tx.mealCount; // Assuming tx.mealCount exists
      }
    });

    return weeklyMeals;
  };

  const weeklyTrendData = calculateWeeklyTrend();

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`${kitchenName} - Transactions Report`, 20, 15);
    
    // Add total revenue to the PDF
    doc.text(`Total Revenue: ₹${totalRevenue}`, 20, 25);
    
    autoTable(doc, {
      startY: 30,
      head: [["Date", "Customer", "Plan", "Amount"]],
      body: transactions.slice(0, 20).map((tx) => [
        new Date(tx.date).toLocaleDateString(),
        tx.customerName,
        tx.plan,
        `₹${revenueMap[tx.plan] || 0}`,
      ]),
    });
    
    doc.save("transactions_report.pdf");
  };

  const downloadGSTBill = () => {
    const gstRate = 18; // Example GST rate
    const totalGST = totalRevenue * (gstRate / 100);
    const cgst = totalGST / 2; // Half of the total GST for CGST
    const sgst = totalGST / 2; // Half of the total GST for SGST
    const doc = new jsPDF();
    
    // Invoice Header
    doc.setFontSize(20);
    doc.text("GST Invoice", 20, 15);
    doc.setFontSize(12);
    doc.text(`Invoice No: ${Math.floor(Math.random() * 10000)}`, 20, 25); // Random invoice number
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 35);
    
    // Owner Information
    doc.text(`Owner: ${kitchenName}`, 20, 45);
    doc.text(`GSTIN: YOUR_GSTIN_HERE`, 20, 55); // Replace with your GSTIN
    doc.text(`Address: YOUR_ADDRESS_HERE`, 20, 65); // Replace with your address
    
    // Customer Details
    if (transactions.length > 0) {
      const customer = transactions[0].customerName; // Example: taking the first customer's name
      doc.text(`Customer: ${customer}`, 20, 75);
      doc.text(`Customer GSTIN: CUSTOMER_GSTIN_HERE`, 20, 85); // Replace with customer's GSTIN
    }

    // Total Revenue and GST
    doc.text(`Total Revenue: ₹${totalRevenue}`, 20, 95);
    doc.text(`CGST (${gstRate / 2}%): ₹${(cgst).toFixed(2)}`, 20, 105);
    doc.text(`SGST (${gstRate / 2}%): ₹${(sgst).toFixed(2)}`, 20, 115);
    doc.text(`Total Amount (Including GST): ₹${(totalRevenue + totalGST).toFixed(2)}`, 20, 125);
    
    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 20, 145);
    
    doc.save("owner_gst_invoice.pdf");
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{kitchenName} Dashboard</h1>
        </div>

        {loading ? (
          <p className="text-blue-600 text-center text-lg">Loading transactions...</p>
        ) : (
          <>
            {/* Stats Section */}
            <div className="flex justify-end mb-4">
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Download transaction PDF
              </button>
              <button
                onClick={downloadGSTBill}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 text-white rounded hover:bg-green-700"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Download GST Bill
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={<UsersIcon className="w-6 h-6" />}
                title="Total Customers"
                value={new Set(transactions.map((tx) => tx.customerEmail)).size}
                color="bg-blue-100"
              />
              <StatCard
                icon={<ChartBarIcon className="w-6 h-6" />}
                title="Meals Served"
                value={transactions.reduce((sum, tx) => sum + tx.mealCount, 0)}
                color="bg-green-100"
              />
              <StatCard
                icon={<CurrencyRupeeIcon className="w-6 h-6" />}
                title="Total Revenue"
                value={`₹${totalRevenue}`}
                color="bg-purple-100"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Plan Distribution</h3>
                <div className="h-64">
                  <BarChart
                    series={[{ data: Object.values(planDistribution) }]}
                    xAxis={[{ data: Object.keys(planDistribution), scaleType: "band" }]}
                    colors={["#3B82F6", "#10B981", "#F59E0B", "#F43F5E"]}
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Weekly Trend</h3>
                <div className="h-64">
                  <LineChart
                    series={[{ data: weeklyTrendData, label: "Meals Served", showMarkers: true }]}
                    xAxis={[{ data: ["Week 1", "Week 2", "Week 3", "Week 4"], scaleType: "point" }]}
                    colors={["#6366F1"]}
                  />
                </div>
              </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
              <div className="overflow-x-auto" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-600 border-b">
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Plan</th>
                      <th className="pb-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 15).map((tx, i) => (
                      <tr key={i} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="py-3">{new Date(tx.date).toLocaleDateString()}</td>
                        <td className="py-3 font-medium">{tx.customerName}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              tx.plan === "gold"
                                ? "bg-amber-100 text-amber-700"
                                : tx.plan === "silver"
                                ? "bg-emerald-100 text-emerald-700"
                                : tx.plan === "basic"
                                ? "bg-indigo-100 text-indigo-700"
                                : "bg-pink-100 text-pink-700"
                            }`}
                          >
                            {tx.plan}
                          </span>
                        </td>
                        <td className="py-3 font-medium">₹{revenueMap[tx.plan] || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className={`${color} p-6 rounded-xl flex items-center gap-4`}>
    <div className="p-3 bg-white rounded-lg">{icon}</div>
    <div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  </div>
);

export default KitchenDashboard;
