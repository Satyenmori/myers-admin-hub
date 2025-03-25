import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line as RechartsLine } from "recharts";
import { Users, Building, ClipboardList, CheckCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const Dashboard: React.FC = () => {
  const { mode } = useTheme();

  const data = [
    { name: 'Jan', users: 40, dispensaries: 24, requests: 30 },
    { name: 'Feb', users: 30, dispensaries: 13, requests: 22 },
    { name: 'Mar', users: 20, dispensaries: 98, requests: 25 },
    { name: 'Apr', users: 27, dispensaries: 39, requests: 20 },
    { name: 'May', users: 18, dispensaries: 48, requests: 27 },
    { name: 'Jun', users: 23, dispensaries: 38, requests: 35 },
    { name: 'Jul', users: 40, dispensaries: 24, requests: 30 },
    { name: 'Aug', users: 30, dispensaries: 13, requests: 22 },
    { name: 'Sep', users: 20, dispensaries: 98, requests: 25 },
    { name: 'Oct', users: 27, dispensaries: 39, requests: 20 },
    { name: 'Nov', users: 18, dispensaries: 48, requests: 27 },
    { name: 'Dec', users: 23, dispensaries: 38, requests: 35 },
  ];

  const cardData = [
    { title: "Total Users", value: 120, icon: Users },
    { title: "Active Dispensaries", value: 35, icon: Building },
    { title: "Open Requests", value: 50, icon: ClipboardList },
    { title: "Resolved Requests", value: 80, icon: CheckCircle },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cardData.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {React.createElement(card.icon, { className: "h-4 w-4 text-gray-500 dark:text-gray-400" })}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
            <CardDescription>Overview of users, dispensaries, and service requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" barSize={20} fill="#8884d8" />
                <Bar dataKey="dispensaries" barSize={20} fill="#82ca9d" />
                <Bar dataKey="requests" barSize={20} fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly trend of new user registrations.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <RechartsLine type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
