# Atelier sous-marin animé

**Démo en ligne : http://84.235.237.39:8080/**

## C'est quoi ?

Une application web où l'on **dessine** un sous-marin ou une créature marine.

1. Tu dessines sur la page.
2. Ton dessin est envoyé à une **API de modération** qui vérifie qu'il n'est pas choquant (contenu explicite, symboles haineux).
3. Si le dessin est refusé, il est supprimé. S'il est accepté, il est **animé** et nage dans un aquarium partagé avec les autres visiteurs.

## Comment l'essayer ?

**Ouvre la démo en ligne** http://84.235.237.39:8080/ dans ton navigateur. Rien à installer.


## Comment ça marche ?

- Le navigateur envoie le dessin au serveur.
- Le serveur demande à Sightengine si le dessin est acceptable.
- Si **oui** : le dessin est enregistré et apparaît dans l'aquarium.
- Si **non** : le dessin est refusé et jamais enregistré.
- Si l'API de modération ne répond pas : le dessin est **refusé par prudence**.

## Pourquoi ces choix ?

| Outil | Pourquoi |
|---|---|
| **React** (avec Vite) | Permet de découper l'interface en petits morceaux (le canevas, l'aquarium) et de mettre à jour l'écran facilement. Très utilisé, donc beaucoup d'aide en ligne. |
| **Node.js + Express** | Même langage (JavaScript) pour le front et le back : un seul langage à apprendre. Express est simple, il suffit de quelques lignes pour créer l'API. |

## Pourquoi Sightengine pour la modération ?

J'ai testé deux API avant de choisir, avec le même dessin explicite fait à la main :

| API | Résultat |
|---|---|
| localmod | Dessin jugé normal (score 0,0016) : **pas détecté** |
| **Sightengine** | Dessin détecté (score 0,99) : **bloqué** |

localmod a été entraîné sur des photos et ne comprend pas bien les dessins. Sightengine reconnaît aussi les symboles haineux comme les croix gammées. Elle a un plan gratuit, et on peut lui envoyer directement le fichier.

## Est-ce que ça marche ? (tests)

**Tests automatiques** : `cd server && npm test`. Ils vérifient qu'un bon dessin est accepté, qu'un mauvais est refusé et non enregistré, et que le serveur refuse tout si la modération est en panne.

**Tests faits à la main :**

| Dessin | Résultat attendu | Résultat obtenu |
|---|---|---|
| Méduse | Accepté | Accepté (score 0,001) |
| Croquis explicite | Refusé | Refusé (score 0,99) |


## CI/CD (automatisation)

À chaque `git push`, GitHub lance automatiquement la **CI** (fichier `.github/workflows/ci.yml`) :

1. Il lance les tests du serveur.
2. Il vérifie et compile le code du front.
3. Il construit les images Docker.

**CD (déploiement automatique)** : quand la CI réussit, un second fichier (`.github/workflows/deploy.yml`) se connecte au serveur et met à jour l'application. Il utilise trois secrets GitHub : `SERVER_HOST`, `SERVER_USER` et `SERVER_SSH_KEY`.

## Limites

- Les modèles de modération sont surtout entraînés sur des photos : un dessin très simple peut passer sans être détecté.
- Les dessins sont envoyés à un service extérieur (Sightengine).
- Le plan gratuit a un quota : si on le dépasse, les dessins sont refusés.
