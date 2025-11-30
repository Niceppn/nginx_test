import { useEffect, useState } from "react";

// Change this if your backend runs on a different host/port
const API_BASE = import.meta.env.VITE_API_BASE || "";

function App() {
  const [message, setMessage] = useState("กำลังโหลดจาก API...");
  const [error, setError] = useState(null);
  const [age, setAge] = useState("");
  const [submittedMsg, setSubmittedMsg] = useState(null);
  const [ages, setAges] = useState([]);

  useEffect(() => {
    // fetch hello
    fetch(`${API_BASE}/api/hello`)
      .then((res) => {
        if (!res.ok) throw new Error("API error: " + res.status);
        return res.json();
      })
      .then((data) => setMessage(data.message))
      .catch((err) => setError(err.message));

    // fetch existing ages
    fetch(`${API_BASE}/api/ages`)
      .then((res) => res.json())
      .then((data) => setAges(data.data || []))
      .catch((err) => console.warn("Could not load ages:", err));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmittedMsg(null);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/age`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Server error");

      setSubmittedMsg(`บันทึกแล้ว: อายุ ${body.data.age} (id: ${body.data._id})`);
      setAge("");

      // refresh list
      const listRes = await fetch(`${API_BASE}/api/ages`);
      const listBody = await listRes.json();
      setAges(listBody.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h1>กรอกอายุของคุณ</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <input
          type="text"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="อายุ"
        />
        <button type="submit">Send</button>
        
      </form>

      {submittedMsg && <p style={{ color: "lime" }}>{submittedMsg}</p>}
      {error && <p style={{ color: "salmon" }}>{error}</p>}

      <section style={{ marginTop: "1.5rem", width: "90%", maxWidth: 600 }}>

        <h3>รายการอายุ (ล่าสุดก่อนหน้า)</h3>
        <ul>
          {ages.length === 0 && <li>ยังไม่มีข้อมูล</li>}
          {ages.map((a) => (
            <li key={a._id}>
              {new Date(a.createdAt).toLocaleString()} — อายุ: {a.age}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
