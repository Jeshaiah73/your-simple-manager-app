// pages/api/resources.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const url = `${process.env.API_URL}/resources`;
      console.log("Fetching:", url);

      const dataRes = await fetch(url);

      if (!dataRes.ok) {
        // kalau bukan status 200-299, kita kirim balik error HTML biar kelihatan
        const text = await dataRes.text();
        return res.status(dataRes.status).json({
          error: `Fetch failed with status ${dataRes.status}`,
          body: text,
        });
      }

      const data = await dataRes.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error("Fetch error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "POST" || req.method === "PATCH") {
    const { id, title, description, link, timeToFinish, priority } = req.body;
    let url = `${process.env.API_URL}/resources`;

    if (!title || !description || !link || !timeToFinish || !priority) {
      return res.status(422).send("Data are missing!");
    }

    if (req.method === "PATCH") {
      url += `/${id}`;
    }

    try {
      const axiosRes = await axios[req.method.toLowerCase()](url, req.body);
      return res.send(axiosRes.data);
    } catch (error) {
      console.error("Axios error:", error.message);
      return res.status(422).send("Data cannot be stored!");
    }
  }

  // default kalau method lain dipanggil
  return res.status(405).json({ error: "Method not allowed" });
}
