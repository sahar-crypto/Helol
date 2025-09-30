import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

// البيانات الرئيسية (بالعربي)
const allComplaintsData = [
  { id: 1, category: 'مياه', city: 'القاهرة', status: 'مفتوحة', month: 'يناير' },
  { id: 2, category: 'غاز', city: 'الإسكندرية', status: 'تم الحل', month: 'يناير' },
  { id: 3, category: 'كهرباء', city: 'الجيزة', status: 'مفتوحة', month: 'فبراير' },
  { id: 4, category: 'مياه', city: 'القاهرة', status: 'مفتوحة', month: 'فبراير' },
  { id: 5, category: 'انترنت', city: 'الأقصر', status: 'مفتوحة', month: 'فبراير' },
  { id: 6, category: 'مرور', city: 'أسوان', status: 'جاري العمل عليها', month: 'مارس' },
  { id: 7, category: 'أخرى', city: 'المنصورة', status: 'تم الحل', month: 'مارس' },
  { id: 8, category: 'مياه', city: 'الإسكندرية', status: 'تم الحل', month: 'مارس' },
  { id: 9, category: 'غاز', city: 'القاهرة', status: 'مغلقة', month: 'إبريل' },
  { id: 10, category: 'كهرباء', city: 'الجيزة', status: 'تم الحل', month: 'إبريل' },
  { id: 11, category: 'مياه', city: 'الأقصر', status: 'جاري العمل عليها', month: 'إبريل' },
  { id: 12, category: 'انترنت', city: 'الإسكندرية', status: 'مفتوحة', month: 'مايو' },
  { id: 13, category: 'مرور', city: 'القاهرة', status: 'تم الحل', month: 'مايو' },
  { id: 14, category: 'أخرى', city: 'الجيزة', status: 'مغلقة', month: 'مايو' },
  { id: 15, category: 'مياه', city: 'أسوان', status: 'مفتوحة', month: 'مايو' },
];

// المكون الرئيسي
const App = () => {
  const [filteredComplaints, setFilteredComplaints] = useState(allComplaintsData);
  const [categoryFilter, setCategoryFilter] = useState('الكل');
  const [cityFilter, setCityFilter] = useState('الكل');
  const [statusFilter, setStatusFilter] = useState('الكل');

  const allCategories = [...new Set(allComplaintsData.map(c => c.category))];

  // بيانات الأعمدة (الفئات)
  const getChartData = (data, key) => {
    const counts = data.reduce((acc, curr) => {
      acc[curr[key]] = (acc[curr[key]] || 0) + 1;
      return acc;
    }, {});
    return allCategories.map(name => ({ name, complaints: counts[name] || 0 }));
  };

  // بيانات الدائرة (الحالات)
  const getPieData = (data, key) => {
    const counts = data.reduce((acc, curr) => {
      acc[curr[key]] = (acc[curr[key]] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(name => {
      let color;
      switch (name) {
        case 'مفتوحة': color = '#3b82f6'; break;
        case 'جاري العمل عليها': color = '#8b5cf6'; break;
        case 'تم الحل': color = '#22c55e'; break;
        case 'مغلقة': color = '#ef4444'; break;
        default: color = '#6b7280';
      }
      return { name, value: counts[name], color };
    });
  };

  // بيانات المدن
  const getCityData = (data) => {
    const counts = data.reduce((acc, curr) => {
      acc[curr.city] = (acc[curr.city] || 0) + 1;
      return acc;
    }, {});
    const cityList = Object.keys(counts).map(name => ({ name, complaints: counts[name] }));
    return cityList.sort((a, b) => b.complaints - a.complaints);
  };

  // بيانات الاتجاه (الأشهر)
  const getTrendData = (data) => {
    const months = ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو'];
    const counts = data.reduce((acc, curr) => {
      acc[curr.month] = (acc[curr.month] || 0) + 1;
      return acc;
    }, {});
    return months.map(month => ({ name: month, complaints: counts[month] || 0 }));
  };

  useEffect(() => {
    let newFilteredComplaints = allComplaintsData;

    if (categoryFilter !== 'الكل') {
      newFilteredComplaints = newFilteredComplaints.filter(c => c.category === categoryFilter);
    }
    if (cityFilter !== 'الكل') {
      newFilteredComplaints = newFilteredComplaints.filter(c => c.city === cityFilter);
    }
    if (statusFilter !== 'الكل') {
      newFilteredComplaints = newFilteredComplaints.filter(c => c.status === statusFilter);
    }

    setFilteredComplaints(newFilteredComplaints);
  }, [categoryFilter, cityFilter, statusFilter]);

  const categoryData = getChartData(filteredComplaints, 'category');
  const statusData = getPieData(filteredComplaints, 'status');
  const trendData = getTrendData(filteredComplaints);
  const cityData = getCityData(filteredComplaints);

  const totalComplaints = filteredComplaints.length;
  const openComplaints = filteredComplaints.filter(c => c.status === 'مفتوحة').length;
  const resolvedComplaints = filteredComplaints.filter(c => c.status === 'تم الحل').length;

  return (
    <div className="min-h-screen bg-gray-100 font-tajawal text-gray-800 p-4 sm:p-8 flex flex-col lg:flex-row" dir="rtl">
      {/* المحتوى الرئيسي */}
      <div className="flex-1 lg:pl-8">
        {/* العنوان */}
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-3xl font-bold">لوحة متابعة الشكاوى</h1>
    
        </div>

        {/* البطاقات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-sm font-semibold text-gray-500">إجمالي الشكاوى</h2>
            <p className="text-3xl font-bold mt-2">{totalComplaints}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-sm font-semibold text-gray-500">الشكاوى المفتوحة</h2>
            <p className="text-3xl font-bold mt-2">{openComplaints}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-sm font-semibold text-gray-500">الشكاوى المحلولة</h2>
            <p className="text-3xl font-bold mt-2">{resolvedComplaints}</p>
          </div>
        </div>

        {/* الرسوم البيانية */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* حسب الفئة */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">عدد الشكاوى حسب الفئة</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="complaints" fill="#3b82f6" barSize={40} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* حسب الحالة */}
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">عدد الشكاوى حسب الحالة</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                  {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
           <Legend 
  layout="vertical" 
  align="right" 
  verticalAlign="middle"
  iconType="square"
  iconSize={14}   // size of the little box
  wrapperStyle={{
    paddingLeft: "20px",  // space between text and chart
    lineHeight: "30px"    // space between lines
  }}
  formatter={(value) => <span style={{ marginLeft: "3px" }}> { value}</span>}
/>

              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* الاتجاه */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">الاتجاه الشهري للشكاوى</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide={true} />
                <Tooltip />
                <Line type="monotone" dataKey="complaints" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* حسب المدينة */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">الشكاوى حسب المدينة</h2>
            <div className="space-y-4">
              {cityData.map((city, index) => (
                <div key={index}>
                  <p className="text-sm font-medium mb-1">{city.name}</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(city.complaints / Math.max(...cityData.map(c => c.complaints))) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* الفلاتر */}
      <div className="w-full lg:w-80 mt-8 lg:mt-0 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold mb-4">الفلاتر</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الفئة</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="الكل">الكل</option>
              <option value="مياه">مياه</option>
              <option value="غاز">غاز</option>
              <option value="كهرباء">كهرباء</option>
              <option value="انترنت">انترنت</option>
              <option value="مرور">مرور</option>
              <option value="أخرى">أخرى</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المدينة</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
              <option value="الكل">الكل</option>
              <option value="القاهرة">القاهرة</option>
              <option value="الإسكندرية">الإسكندرية</option>
              <option value="الجيزة">الجيزة</option>
              <option value="الأقصر">الأقصر</option>
              <option value="أسوان">أسوان</option>
              <option value="المنصورة">المنصورة</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="الكل">الكل</option>
              <option value="مفتوحة">مفتوحة</option>
              <option value="جاري العمل عليها">جاري العمل عليها</option>
              <option value="تم الحل">تم الحل</option>
              <option value="مغلقة">مغلقة</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
