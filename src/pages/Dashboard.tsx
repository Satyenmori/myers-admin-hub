
import React from "react";
import { useAuth } from "@/context/AuthContext";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";
import { Dispensary, User } from "@/lib/types";
import { 
  Building, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Line, 
  ListTodo, 
  TrendingUp, 
  Users 
} from "lucide-react";
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Legend, 
  Line as RechartsLine, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  positive?: boolean;
}> = ({ title, value, icon, change, positive }) => {
  return (
    <div className="glass-card p-5 rounded-xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      {change && (
        <div className="flex items-center text-xs">
          <span className={positive ? "text-green-500" : "text-red-500"}>
            {positive ? "+" : ""}{change}
          </span>
          <span className="text-muted-foreground ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [users] = useLocalStorage<User[]>(LOCAL_STORAGE_KEYS.USERS, []);
  const [dispensaries] = useLocalStorage<Dispensary[]>(LOCAL_STORAGE_KEYS.DISPENSARIES, []);

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  
  const allServiceRequests = dispensaries.flatMap(d => d.serviceRequests);
  const pendingRequests = allServiceRequests.filter(sr => sr.status === "pending").length;
  const resolvedRequests = allServiceRequests.filter(sr => sr.status === "resolved").length;

  // Generate chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().substring(0, 10);
  });

  const requestsChartData = last7Days.map(date => {
    const reqCount = allServiceRequests.filter(
      req => req.createdAt.substring(0, 10) === date
    ).length;
    
    return {
      date: date.substring(5),
      requests: reqCount
    };
  });

  const requestsByStatusData = [
    { name: "Pending", value: pendingRequests },
    { name: "In Progress", value: allServiceRequests.filter(sr => sr.status === "in-progress").length },
    { name: "Resolved", value: resolvedRequests }
  ];

  const dispensaryStatusData = [
    { name: "Open", value: dispensaries.filter(d => d.status === "open").length },
    { name: "Under Maintenance", value: dispensaries.filter(d => d.status === "under-maintenance").length },
    { name: "Closed", value: dispensaries.filter(d => d.status === "closed").length }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name}
          </p>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground mr-2">
            {new Date().toLocaleDateString(undefined, { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<Users className="h-6 w-6" />}
          change="12%"
          positive={true}
        />
        <StatCard
          title="Active Users"
          value={activeUsers}
          icon={<CheckCircle2 className="h-6 w-6" />}
          change="8%"
          positive={true}
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests}
          icon={<Clock className="h-6 w-6" />}
          change="5%"
          positive={false}
        />
        <StatCard
          title="Resolved Requests"
          value={resolvedRequests}
          icon={<ListTodo className="h-6 w-6" />}
          change="18%"
          positive={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5 rounded-xl">
          <h3 className="text-lg font-medium mb-4">Service Requests (Last 7 days)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={requestsChartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007bff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#007bff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#777" 
                  tick={{ fill: '#777', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#777" 
                  tick={{ fill: '#777', fontSize: 12 }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="#007bff"
                  fillOpacity={1}
                  fill="url(#colorRequests)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl">
          <h3 className="text-lg font-medium mb-4">Service Requests by Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={requestsByStatusData}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#777" 
                  tick={{ fill: '#777', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#777" 
                  tick={{ fill: '#777', fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="value" fill="#28a745" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card p-5 rounded-xl">
        <h3 className="text-lg font-medium mb-4">Dispensary Status Overview</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dispensaryStatusData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 50, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                type="number" 
                stroke="#777" 
                tick={{ fill: '#777', fontSize: 12 }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#777" 
                tick={{ fill: '#777', fontSize: 12 }}
              />
              <Tooltip />
              <Bar dataKey="value" fill="#007bff" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
