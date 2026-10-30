const SCORE_THRESHOLD = Number(process.env.MODERATION_THRESHOLD || 0.5);

// Catégories de texte demandées à Sightengine
const TEXT_CATEGORIES = [
  "sexual", "insult", "discriminatory", "inappropriate", // "gros mots"
  "email", "phone_number",                               // infos personnelles
];
const PROFANITY_SET = ["sexual", "insult", "discriminatory", "inappropriate"];
const PERSONAL_SET = ["email", "phone_number"];

export async function moderateImage(buffer, mimetype = "image/png") {
  const form = new FormData();
  form.append("media", new Blob([buffer], { type: mimetype }), "drawing.png");
  form.append("models", "nudity-2.1,offensive,text-content-2.0");
  form.append("text_categories", TEXT_CATEGORIES.join(","));
  form.append("opt_lang", "fr");
  form.append("opt_countries", "fr,us,gb");
  form.append("api_user", process.env.SIGHTENGINE_USER);
  form.append("api_secret", process.env.SIGHTENGINE_SECRET);

  const res = await fetch("https://api.sightengine.com/1.0/check.json", {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const body = await res.text();
    console.error("Détail modération :", res.status, body);
    throw new Error(`Modération indisponible (${res.status})`);
  }
  const data = await res.json();
  console.log("TEXT:", JSON.stringify(data.text, null, 2));
  if (data.status !== "success") throw new Error("Réponse de modération invalide");

  const n = data.nudity ?? {};
  const o = data.offensive ?? {};
  const detected = data.text?.detected_categories ?? [];

  const scores = {
    sexual_activity: n.sexual_activity ?? 0,
    sexual_display: n.sexual_display ?? 0,
    erotica: n.erotica ?? 0,
    nazi: o.nazi ?? 0,
    confederate: o.confederate ?? 0,
    supremacist: o.supremacist ?? 0,
    terrorist: o.terrorist ?? 0,
    middle_finger: o.middle_finger ?? 0,
    text_profanity: detected.some((c) => PROFANITY_SET.includes(c)) ? 1 : 0,
    text_personal: detected.some((c) => PERSONAL_SET.includes(c)) ? 1 : 0,
  };
  const worst = Math.max(...Object.values(scores));
  return { flagged: worst >= SCORE_THRESHOLD, scores }
}