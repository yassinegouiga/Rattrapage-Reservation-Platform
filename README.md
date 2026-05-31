# Plateforme de Gestion des Rattrapages 🎓

**Encadré par :** Pr. Aatila & Pr. Jarir  
**Réalisé par :** Yassine Gouiga, Karimane Mouhcine, Id Omar Oussama  
**Département :** Computer Science Department, FSSM - Université Cadi Ayyad  

---

## 1. Description du Projet
Ce projet consiste à développer une plateforme de réservation et de gestion des séances de rattrapage destinée aux professeurs et à l'administration de l'Université Cadi Ayyad. Il repose sur une architecture moderne séparant l'API (Backend) de l'interface utilisateur (Frontend).

---

## 2. Fonctionnalités de l'Application

### A. Architecture Backend (Spring Boot 3 / Java 17)
- **Modélisation de la Base de Données (MySQL) :** Création des entités JPA (`User`, `Role`, `Salle`, `Reservation`) avec les relations appropriées (One-to-Many, Many-to-Many).
- **Sécurité et Authentification :** Intégration complète de **Spring Security** avec la génération et la vérification de **Tokens JWT** (JSON Web Tokens). La clé secrète est persistante pour éviter les déconnexions intempestives lors du redémarrage du serveur.
- **Gestion des Rôles :** Mise en place d'une vérification stricte via `@PreAuthorize("hasRole('ADMIN')")`.
- **Création d'une API RESTful complète :**
  - Endpoints d'authentification (`/api/auth/login`, etc.).
  - Endpoints CRUD pour les utilisateurs (`/api/users`).
  - Endpoints CRUD pour les salles (`/api/rooms`) avec la gestion de la disponibilité en temps réel (`estDisponible`).
  - Endpoints de consultation et d'annulation des réservations (`/api/reservations`).
- **Initialisation Automatique :** Mise en place d'un `DatabaseSeeder` qui génère automatiquement les rôles de base et un compte administrateur initial (`admin@uca.ac.ma`) au premier lancement.

### B. Interface Frontend (React / Vite.js / TailwindCSS)
- **Structure et Outils :** Projet initialisé via Vite.js pour de meilleures performances. Configuration de **Tailwind CSS** pour un design sur-mesure et réactif.
- **Système d'Authentification :** 
  - Page de connexion fonctionnelle avec Axios.
  - Sauvegarde du JWT dans le `localStorage`.
  - Gestion des routes privées (`ProtectedRoute`) qui bloquent l'accès aux utilisateurs non authentifiés.
  - Déconnexion automatique et nettoyage de la session si le token est corrompu.
- **Développement de l'Espace Administrateur (100% Fonctionnel) :**
  - **Menu de Navigation (Sidebar) :** Intégration d'un menu latéral dynamique avec `lucide-react` (icônes).
  - **Tableau de Bord :** Page affichant des statistiques globales (nombre de professeurs, salles, réservations).
  - **Gestion des Professeurs :** Tableau listant les utilisateurs, avec un formulaire (Modal) pour créer de nouveaux professeurs ou administrateurs.
  - **Gestion des Salles :** Affichage sous forme de cartes avec la possibilité de créer des salles, et un bouton pour "Désactiver/Réactiver" une salle (lorsqu'elle est en travaux par exemple).
  - **Supervision :** Tableau listant toutes les réservations avec option d'annulation forcée par l'admin.
- **Espace Enseignant (100% Fonctionnel) :**
  - **Tableau de Bord :** Aperçu des réservations à venir.
  - **Recherche et Réservation :** Recherche de salles par date et horaires avec vérification de disponibilité en temps réel, puis soumission de réservation.
  - **Mes Réservations :** Historique des séances avec possibilité d'annuler les séances futures.

---

## 3. Instructions pour lancer l'application en local

### Prérequis (Base de données)
Avant de lancer le Backend, assurez-vous d'avoir démarré votre serveur MySQL (via XAMPP, WAMP, ou Docker) et de créer la base de données :
```sql
CREATE DATABASE rattrapage_db;
```
*(Le nom de la base de données doit correspondre à celui configuré dans `application.properties`)*

### Démarrage du Backend
```bash
cd backend
# Lance le serveur Spring Boot (Tourne sur le port 8082)
./mvnw spring-boot:run
```
### Démarrage du Frontend
```bash
cd frontend
# Lance le serveur de développement Vite (Tourne sur le port 5173)
npm run dev
```

### Identifiants de Test
- **Compte Administrateur par défaut :** 
  - Email : `admin@uca.ac.ma`
  - Mot de passe : `password123`
