const SCORE_THRESHOLD = Number(process.env.MODERATION_THRESHOLD || 0.5);

export async function moderateImage(buffer, mimetype = "image/png") {
  const form = new FormData();
  form.append("media", new Blob([buffer], { type: mimetype }), "drawing.png");
  form.append("models", "nudity-2.1,offensive");
  form.append("opt_lang", "en,fr");
  form.append("api_user", process.env.SIGHTENGINE_USER);
  form.append("api_secret", process.env.SIGHTENGINE_SECRET);

  const res = await fetch("https://api.sightengine.com/1.0/check.json", {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`Modération indisponible (${res.status})`);
  const data = await res.json();
  if (data.status !== "success") throw new Error("Réponse de modération invalide");

  const n = data.nudity ?? {};
  const o = data.offensive ?? {};
  const scores = {
    sexual_activity : n.sexual_activity ?? 0, 
    sexual_display: n.sexual_display ?? 0,
    erotica: n.erotica ?? 0,
    nazi: o.nazi ?? 0,
    confederate: o.confederate ?? 0,
    supremacist: o.supremacist ?? 0,
    terrorist: o.terrorist ?? 0, 
    middle_finger: o.middle_finger ?? 0
  };
  const worst = Math.max(...Object.values(scores));
  return { flagged : worst >= SCORE_THRESHOLD, scores}
}