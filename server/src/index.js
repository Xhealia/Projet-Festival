import { createApp } from "./app.js";

const port = process.env.port || 3001; 
createApp().listen(port, () => console.log(`API sur port : ${port}`));
 