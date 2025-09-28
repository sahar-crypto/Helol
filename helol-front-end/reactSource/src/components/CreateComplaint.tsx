import React, { useState, useRef } from "react";
import "../css/CreateComplaint.css";
import ChatBox from "../components/ChatBox";

// Normalize Arabic-Indic and Eastern Arabic-Indic digits to ASCII digits
function normalizeDigits(input = "") {
  return input
    .replace(/[\u0660-\u0669]/g, (c) => String(c.charCodeAt(0) - 0x0660))
    .replace(/[\u06f0-\u06f9]/g, (c) => String(c.charCodeAt(0) - 0x06f0));
}

function CreateComplaint() {
  const [name, setName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const chatRef = useRef<HTMLDivElement | null>(null);

  // Keep nationalId digits-only, normalize Arabic digits, enforce max length
  const handleNationalIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    v = normalizeDigits(v); // convert Arabic digits -> ASCII
    v = v.replace(/\D/g, ""); // remove anything that's not 0-9
    if (v.length > 14) v = v.slice(0, 14); // enforce max 14
    setNationalId(v);
    if (error) setError("");
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const cleaned = (nationalId || "").trim();

  // exact 14 digits required
  if (cleaned.length < 14) {
    setError("الرقم القومي يجب أن يكون 14 رقمًا بالضبط");
    setSubmitted(false);
    return;
  }
  if (cleaned.length > 14) {
    setError("الرقم القومي يجب ألا يزيد عن 14 رقمًا");
    setSubmitted(false);
    return;
  }
  if (!/^\d{14}$/.test(cleaned)) {
    setError("الرقم القومي يجب أن يحتوي على أرقام فقط");
    setSubmitted(false);
    return;
  }

  // ✅ passed validation
  setError("");

  try {
    // 1. Call API
    const res = await fetch(
      `http://localhost:8000/assets/get-user-by-national-id/?full_name=${encodeURIComponent(
        name
      )}&national_id=${encodeURIComponent(cleaned)}`
    );

    if (!res.ok) {
      throw new Error("فشل في الحصول على بيانات المستخدم");
    }

    // define a type for your API response
    //type UserResponse = {
    //  id: number;
    //  full_name: string;
    //  national_id: string;
    //};

    const json = await res.json();

    if (!json.success || !json.data || !json.data.id) {
      throw new Error("لم يتم العثور على المستخدم");
    }

    setUserId(json.data.id);

    setSubmitted(true);

    // scroll after chat renders
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("حدث خطأ أثناء الاتصال بالخادم");
    }
  }
};

  return (
    <div className="create-complain-container">
      <div className="container">
        <img src="/egypt-map.png" alt="Egypt Map" className="egymap" />

        <h2 className="page-title">تقديم شكوى</h2>

        <div className="form-box">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="الاسم بالكامل"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="الرقم القومي"
              value={nationalId}
              onChange={handleNationalIdChange}
              maxLength={14}
              inputMode="numeric"
              pattern="\d{14}"
              title="الرقم القومي يجب أن يتكون من 14 رقمًا"
              required
            />
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="button-container">
              <button type="submit">إبدأ</button>
            </div>
          </form>
        </div>
      </div>

      {submitted && userId !== null && (
        <div ref={chatRef}>
          <ChatBox userId={userId} />
        </div>
      )}
    </div>
  );
}

export default CreateComplaint;
