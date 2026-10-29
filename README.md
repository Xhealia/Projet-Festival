Atelier sous-marin animé est une application web où chaque visiteur dessine, sur un
canevas, un sous-marin, une créature marine ou tout autre objet. Le dessin est
envoyé à un back-end Node.js qui le fait analyser par une API de modération d'images
auto-hébergée. Les dessins jugés non conformes sont rejetés ; les dessins validés
sont enregistrés puis animés (nage, ondulation) dans un aquarium partagé. Le POC
démontre la chaîne complète dessin → modération → animation, déployée avec
Docker et une CI/CD GitHub Actions.
