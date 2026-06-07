import React from "react";

function Profile() {

  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  const income =
    localStorage.getItem("income") || 0;

  const expense =
    localStorage.getItem("expense") || 0;

  const savings =
    Number(income) - Number(expense);

  return (

    <div className="min-h-screen bg-slate-100 p-10">

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-4xl font-bold mb-8">
          👤 My Profile
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-indigo-100 p-5 rounded-xl">
            <h2 className="font-bold text-lg">
              Name
            </h2>
            <p>{name}</p>
          </div>

          <div className="bg-green-100 p-5 rounded-xl">
            <h2 className="font-bold text-lg">
              Email
            </h2>
            <p>{email}</p>
          </div>

          <div className="bg-blue-100 p-5 rounded-xl">
            <h2 className="font-bold text-lg">
              Total Income
            </h2>
            <p>₹{income}</p>
          </div>

          <div className="bg-red-100 p-5 rounded-xl">
            <h2 className="font-bold text-lg">
              Total Expense
            </h2>
            <p>₹{expense}</p>
          </div>

          <div className="bg-yellow-100 p-5 rounded-xl">
            <h2 className="font-bold text-lg">
              Savings
            </h2>
            <p>₹{savings}</p>
          </div>

        </div>

      </div>

    </div>

  );

}

export default Profile;