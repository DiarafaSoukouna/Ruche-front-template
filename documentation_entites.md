# Documentation des Entités

## 📌 1. Personnels (personnel)

**Table des utilisateurs enregistrés.**

  ------------------------------------------------------------------------
  Champ                              Type     Taille     Description
  ---------------------------------- -------- ---------- -----------------
  N_perso                            N                   Identifiant
                                                         personnel

  Id_personnel_perso                 AN       20         Login personnel

  structure_perso                                        Direction ou
                                                         service

  titre_perso                        AN       30         Civilité du
                                                         personnel

  pass                               A                   Mot de passe

  nom_perso                          A                   Nom

  prenom_perso                       A                   Prénom

  contact_perso                      AN       30         Contact
                                                         téléphonique

  email_perso                        AN       60         Email

  ugl_perso                          AN       30         Code de l'unité
                                                         de gestion à
                                                         laquelle il
                                                         appartient

  fonction_perso                     A                   Fonction

  description_fonction_perso         A                   Description de la
                                                         fonction

  niveau_perso                       N        11         Niveau d'accès
                                                         (visiteur /
                                                         éditeur, etc.)

  region_perso                       N        11         Code de la région
                                                         (antenne)

  projet_active_perso                AN       20         Code du projet
                                                         actif

  rapport_mensuel_perso              N        2          Code du rapport
                                                         mensuel

  rapport_trimestriel_perso          N        2          Code du rapport
                                                         trimestriel

  rapport_semestriel_perso           N        2          Code du rapport
                                                         semestriel

  rapport_annuel_perso               N        2          Code du rapport
                                                         annuel

  statut                                                 Statut de
                                                         l'utilisateur
  ------------------------------------------------------------------------

## 📌 2. Plan Site (plan_site)

**Enregistrement des directions ou services.**

  Champ           Type   Taille   Description
  --------------- ------ -------- ----------------------------------------
  id_ds           N      11       Identifiant de la direction ou service
  code_ds         AN     20       Code de la direction/service
  intitule_ds     A               Intitulé de la direction/service
  niveau_ds       N      11       Ordre hiérarchique
  parent_ds       AN     20       Code parent (hiérarchie)
  code_relai_ds   A               Code utilisé par le ministère

## 📌 3. Types de Zones (type_zone)

**Enregistrement des rubriques de missions.**

  Champ            Type   Taille   Description
  ---------------- ------ -------- -----------------------------
  id_type_zone     N      11       Identifiant du type de zone
  code_type_zone   AN     20       Code du type de zone
  nom_type_zone    A               Nom du type de zone
