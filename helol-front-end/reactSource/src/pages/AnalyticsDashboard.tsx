import React, { useState, useEffect } from "react";
import "../css/AnalyticsDashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
// ✅ Complaint type definition
interface Complaint {
  id: number;
  category: string;
  city: string;
  status: string;
  month: string;
}

// ✅ Chart data interfaces
interface ChartData {
  name: string;
  complaints: number;
}

interface PieData {
  name: string;
  value: number;
  color: string;
}

// ✅ Main dataset
const allComplaintsData: Complaint[] = [
  { id: 1, category: "مياه", city: "القاهرة", status: "مفتوحة", month: "يناير" },
  { id: 2, category: "غاز", city: "الإسكندرية", status: "تم الحل", month: "يناير" },
  { id: 3, category: "كهرباء", city: "الجيزة", status: "مفتوحة", month: "فبراير" },
  { id: 4, category: "مياه", city: "القاهرة", status: "مفتوحة", month: "فبراير" },
  { id: 5, category: "انترنت", city: "الأقصر", status: "مفتوحة", month: "فبراير" },
  { id: 6, category: "مرور", city: "أسوان", status: "جاري العمل عليها", month: "مارس" },
  { id: 7, category: "أخرى", city: "المنصورة", status: "تم الحل", month: "مارس" },
  { id: 8, category: "مياه", city: "الإسكندرية", status: "تم الحل", month: "مارس" },
  { id: 9, category: "غاز", city: "القاهرة", status: "مغلقة", month: "إبريل" },
  { id: 10, category: "كهرباء", city: "الجيزة", status: "تم الحل", month: "إبريل" },
  { id: 11, category: "مياه", city: "الأقصر", status: "جاري العمل عليها", month: "إبريل" },
  { id: 12, category: "انترنت", city: "الإسكندرية", status: "مفتوحة", month: "مايو" },
  { id: 13, category: "مرور", city: "القاهرة", status: "تم الحل", month: "مايو" },
  { id: 14, category: "أخرى", city: "الجيزة", status: "مغلقة", month: "مايو" },
  { id: 15, category: "مياه", city: "أسوان", status: "مفتوحة", month: "مايو" },
];

const AnalyticsDashboard: React.FC = () => {
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>(allComplaintsData);
  const [categoryFilter, setCategoryFilter] = useState("الكل");
  const [cityFilter, setCityFilter] = useState("الكل");
  const [statusFilter, setStatusFilter] = useState("الكل");

  const allCategories = [...new Set(allComplaintsData.map((c) => c.category))];

  // ✅ Group data by category
  const getChartData = (data: Complaint[], key: keyof Complaint): ChartData[] => {
    const counts: Record<string, number> = {};
    data.forEach((c) => {
      counts[c[key]] = (counts[c[key]] || 0) + 1;
    });
    return allCategories.map((name) => ({
      name,
      complaints: counts[name] || 0,
    }));
  };

  // ✅ Pie chart data
  const getPieData = (data: Complaint[], key: keyof Complaint): PieData[] => {
    const counts: Record<string, number> = {};
    data.forEach((c) => {
      counts[c[key]] = (counts[c[key]] || 0) + 1;
    });

    return Object.keys(counts).map((name) => {
      let color = "#6b7280";
      switch (name) {
        case "مفتوحة":
          color = "#3b82f6";
          break;
        case "جاري العمل عليها":
          color = "#8b5cf6";
          break;
        case "تم الحل":
          color = "#22c55e";
          break;
        case "مغلقة":
          color = "#ef4444";
          break;
      }
      return { name, value: counts[name], color };
    });
  };

  // ✅ Complaints by city
  const getCityData = (data: Complaint[]): ChartData[] => {
    const counts: Record<string, number> = {};
    data.forEach((c) => {
      counts[c.city] = (counts[c.city] || 0) + 1;
    });

    return Object.keys(counts)
      .map((name) => ({ name, complaints: counts[name] }))
      .sort((a, b) => b.complaints - a.complaints);
  };

  // ✅ Complaints trend by month
  const getTrendData = (data: Complaint[]): ChartData[] => {
    const months = ["يناير", "فبراير", "مارس", "إبريل", "مايو"];
    const counts: Record<string, number> = {};
    data.forEach((c) => {
      counts[c.month] = (counts[c.month] || 0) + 1;
    });

    return months.map((month) => ({
      name: month,
      complaints: counts[month] || 0,
    }));
  };

  // ✅ Filtering logic
  useEffect(() => {
    let filtered = allComplaintsData;

    if (categoryFilter !== "الكل") {
      filtered = filtered.filter((c) => c.category === categoryFilter);
    }
    if (cityFilter !== "الكل") {
      filtered = filtered.filter((c) => c.city === cityFilter);
    }
    if (statusFilter !== "الكل") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    setFilteredComplaints(filtered);
  }, [categoryFilter, cityFilter, statusFilter]);

  const categoryData = getChartData(filteredComplaints, "category");
  const statusData = getPieData(filteredComplaints, "status");
  const trendData = getTrendData(filteredComplaints);
  const cityData = getCityData(filteredComplaints);

  const totalComplaints = filteredComplaints.length;
  const openComplaints = filteredComplaints.filter((c) => c.status === "مفتوحة").length;
  const resolvedComplaints = filteredComplaints.filter((c) => c.status === "تم الحل").length;

  return (
    <div className="dashboard-container" dir="rtl">
      {/* المحتوى الرئيسي */}
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1>لوحة متابعة الشكاوى</h1>
        </div>

        {/* Cards */}
        <div className="dashboard-cards">
          <div className="card">
            <h2>إجمالي الشكاوى</h2>
            <p>{totalComplaints}</p>
          </div>
          <div className="card">
            <h2>الشكاوى المفتوحة</h2>
            <p>{openComplaints}</p>
          </div>
          <div className="card">
            <h2>الشكاوى المحلولة</h2>
            <p>{resolvedComplaints}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="dashboard-charts">
          <div className="chart-box">
            <h2>عدد الشكاوى حسب الفئة</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar dataKey="complaints" fill="#3b82f6" barSize={40} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box center">
            <h2>عدد الشكاوى حسب الحالة</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconType="square"
                  iconSize={14}
                  wrapperStyle={{ paddingLeft: "20px", lineHeight: "30px" }}
                  formatter={(value: string) => <span style={{ marginLeft: "3px" }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-charts">
          <div className="chart-box">
            <h2>الاتجاه الشهري للشكاوى</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="complaints" stroke="#3b82f6" strokeWidth={3} dot={{ fill: "#3b82f6", r: 5 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h2>الشكاوى حسب المدينة</h2>
            <div className="city-list">
              {cityData.map((city, index) => (
                <div key={index}>
                  <p>{city.name}</p>
                  <div className="city-bar">
                    <div
                      className="city-bar-fill"
                      style={{ width: `${(city.complaints / Math.max(...cityData.map((c) => c.complaints))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-filters">
        <h2>الفلاتر</h2>
        <div className="filter-group">
          <label>الفئة</label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="الكل">الكل</option>
            {allCategories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>المدينة</label>
          <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
            <option value="الكل">الكل</option>
            <option value="القاهرة">القاهرة</option>
            <option value="الإسكندرية">الإسكندرية</option>
            <option value="الجيزة">الجيزة</option>
            <option value="الأقصر">الأقصر</option>
            <option value="أسوان">أسوان</option>
            <option value="المنصورة">المنصورة</option>
          </select>
        </div>

        <div className="filter-group">
          <label>الحالة</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="الكل">الكل</option>
            <option value="مفتوحة">مفتوحة</option>
            <option value="جاري العمل عليها">جاري العمل عليها</option>
            <option value="تم الحل">تم الحل</option>
            <option value="مغلقة">مغلقة</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
